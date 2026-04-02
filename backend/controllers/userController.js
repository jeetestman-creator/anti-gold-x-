const supabase = require('../config/supabaseClient');

exports.getProfile = async (req, res) => {
  try {
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', req.user.id).single();
    if (error) return res.status(404).json({ error: 'Profile not found' });
    
    const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', req.user.id).single();
    
    res.status(200).json({ profile, wallet });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone_number, auto_withdrawal_wallet_address, auto_withdrawal_enabled } = req.body;
    
    // Whitelist allowed fields to prevent arbitrary modifications
    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (auto_withdrawal_wallet_address !== undefined) updateData.auto_withdrawal_wallet_address = auto_withdrawal_wallet_address;
    if (auto_withdrawal_enabled !== undefined) updateData.auto_withdrawal_enabled = auto_withdrawal_enabled;

    const { data, error } = await supabase.from('profiles').update(updateData).eq('id', req.user.id).select().single();
    
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Profile updated successfully', profile: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const { data: wallet, error: walletError } = await supabase.from('wallets').select('*').eq('user_id', req.user.id).single();
    if (walletError && walletError.code !== 'PGRST116') { // not found error
      return res.status(400).json({ error: 'Error fetching wallet' });
    }

    const { data: latestROI } = await supabase.from('roi_settings').select('monthly_roi_rate').single();
    
    res.status(200).json({ 
      wallet: wallet || { deposit_balance: 0, roi_balance: 0, bonus_balance: 0, withdrawal_balance: 0 },
      monthly_roi_rate: latestROI ? latestROI.monthly_roi_rate : 5.0
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.toggleCompounding = async (req, res) => {
  try {
    const { compounding_roi_enabled, compounding_roi_reinvestment_percentage } = req.body;
    
    if (typeof compounding_roi_enabled !== 'boolean') {
      return res.status(400).json({ error: 'compounding_roi_enabled must be a boolean' });
    }
    
    let pct = Number(compounding_roi_reinvestment_percentage) || 100;
    if (pct < 1 || pct > 100) return res.status(400).json({ error: 'Percentage must be between 1 and 100' });

    const { error } = await supabase.from('profiles').update({
      compounding_roi_enabled,
      compounding_roi_reinvestment_percentage: pct
    }).eq('id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Compounding settings updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getReferralAnalytics = async (req, res) => {
  try {
    // simplified for brevity. You would run recursive queries securely using Supabase RPC for a robust multi-level MLM query.
    const { data, error } = await supabase.from('referral_structure').select('level, profiles!referral_structure_user_id_fkey(full_name, created_at)').eq('referrer_id', req.user.id);
    if(error) return res.status(400).json({error: error.message});
    res.status(200).json({ analytics: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
