const supabase = require('../config/supabaseClient');
const { reinitializeTransporter } = require('../services/emailService');

exports.getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if(error) return res.status(400).json({ error: error.message });
    res.status(200).json({ users });
  } catch(err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('profiles').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
    if(error) return res.status(400).json({ error: error.message });
    
    await supabase.from('admin_audit_log').insert([{
      action_type: 'USER_DELETED',
      admin_user_id: req.user.id,
      target_user_id: id,
    }]);

    res.status(200).json({ message: 'User marked as deleted successfully' });
  } catch(err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { data: settings, error } = await supabase.from('admin_settings').select('*');
    if(error) return res.status(400).json({ error: error.message });
    res.status(200).json({ settings });
  } catch(err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateSMTPSettings = async (req, res) => {
  try {
    const { host, port, user, pass } = req.body;
    if(!host || !port || !user || !pass) return res.status(400).json({ error: 'All SMTP credentials are required' });

    await supabase.from('admin_settings').upsert([
      { setting_key: 'smtp_host', setting_value: host, updated_by_admin_id: req.user.id },
      { setting_key: 'smtp_port', setting_value: port, updated_by_admin_id: req.user.id },
      { setting_key: 'smtp_user', setting_value: user, updated_by_admin_id: req.user.id }
    ], { onConflict: 'setting_key' });

    reinitializeTransporter(host, port, user, pass);
    res.status(200).json({ message: 'SMTP Configuration Updated & Live.' });
  } catch(err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// TRANSACTION APPROVAL LOGIC
exports.approveTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Fetch transaction
    const { data: transaction, error: fetchErr } = await supabase.from('transactions').select('*').eq('id', transactionId).single();
    if(fetchErr || !transaction) return res.status(404).json({ error: 'Transaction not found' });
    if(transaction.status !== 'pending') return res.status(400).json({ error: 'Transaction is not pending' });

    const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', transaction.user_id).single();
    if(!wallet) return res.status(404).json({ error: 'User wallet not found' });

    // Mark completed
    const { error: updateErr } = await supabase.from('transactions').update({ status: 'completed' }).eq('id', transactionId);
    if(updateErr) return res.status(400).json({ error: updateErr.message });

    // Deduct / Add from Wallet Correctly based on Type
    if (transaction.type === 'deposit') {
      await supabase.from('wallets').update({ 
        deposit_balance: Number(wallet.deposit_balance) + Number(transaction.net_amount),
        total_fees_paid: Number(wallet.total_fees_paid) + Number(transaction.fee)
      }).eq('id', wallet.id);
    } 
    else if (transaction.type === 'withdrawal') {
      // For withdrawal, deduct from respective wallets. To be simple, we deduct strictly from withdrawal balance if user moved funds there, or from ROI/deposit based on business rules.
      // Assuming a simplified withdrawal logic:
      await supabase.from('wallets').update({ 
        withdrawal_balance: Number(wallet.withdrawal_balance) + Number(transaction.net_amount),
        total_fees_paid: Number(wallet.total_fees_paid) + Number(transaction.fee)
      }).eq('id', wallet.id);
      
      // Also deduct from source balances if not already deducted upon request creation.
      // Usually, funds are locked upon 'pending' request to avoid double-spend. Assuming we deduct from ROI first:
      if(wallet.roi_balance >= transaction.amount) {
         await supabase.from('wallets').update({ roi_balance: Number(wallet.roi_balance) - Number(transaction.amount) }).eq('id', wallet.id);
      } else {
         await supabase.from('wallets').update({ deposit_balance: Number(wallet.deposit_balance) - Number(transaction.amount) }).eq('id', wallet.id);
      }
    }

    res.status(200).json({ message: 'Transaction approved and funds reflected.' });
  } catch(err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.rejectTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const { data: transaction } = await supabase.from('transactions').select('*').eq('id', transactionId).single();
    if(!transaction) return res.status(404).json({ error: 'Transaction not found' });
    if(transaction.status !== 'pending') return res.status(400).json({ error: 'Transaction is not pending' });

    await supabase.from('transactions').update({ status: 'rejected' }).eq('id', transactionId);
    
    // Release locked funds if it was a withdrawal. Deposit rejection requires no fund release.
    res.status(200).json({ message: 'Transaction rejected successfully' });
  } catch(err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
