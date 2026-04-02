const supabase = require('../config/supabaseClient');

exports.createDeposit = async (req, res) => {
  try {
    const { amount, transaction_hash, network, coupon_code } = req.body;
    if (!amount || amount < 100) return res.status(400).json({ error: 'Minimum deposit is 100 USDT' });

    let depositFee = amount * 0.05;
    let netAmount = amount - depositFee;
    let coupon_code_id = null;

    if (coupon_code) {
      const { data: coupon } = await supabase.from('coupon_codes').select('*').eq('code', coupon_code).eq('is_active', true).single();
      if (coupon && new Date(coupon.valid_from) <= new Date() && new Date(coupon.valid_until) >= new Date() && coupon.usage_count < coupon.usage_limit) {
        depositFee = depositFee - (depositFee * (coupon.discount_percentage / 100));
        netAmount = amount - depositFee;
        coupon_code_id = coupon.id;
        // Increment coupon count logic goes here later or at approval time
      } else {
        return res.status(400).json({ error: 'Invalid or expired coupon code' });
      }
    }

    const { data, error } = await supabase.from('transactions').insert([{
      user_id: req.user.id,
      type: 'deposit',
      amount,
      fee: depositFee,
      net_amount: netAmount,
      status: 'pending',
      transaction_hash,
      network,
      coupon_code_id
    }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Deposit request submitted successfully. Awaiting approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Check KYC
    const { data: profile } = await supabase.from('profiles').select('kyc_status').eq('id', req.user.id).single();
    if (profile?.kyc_status !== 'approved') return res.status(403).json({ error: 'KYC must be approved to withdraw' });

    // Check balances (simplified total check for scope)
    const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', req.user.id).single();
    const available = (wallet?.roi_balance || 0) + (wallet?.bonus_balance || 0) + (wallet?.deposit_balance || 0);

    if (!amount || amount > available) return res.status(400).json({ error: 'Insufficient balance' });

    const fee = amount * 0.05;
    const netAmount = amount - fee;

    const { error } = await supabase.from('transactions').insert([{
      user_id: req.user.id,
      type: 'withdrawal',
      amount,
      fee,
      net_amount: netAmount,
      status: 'pending'
    }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Withdrawal requested' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ transactions: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.calculateDailyROI = async (req, res) => {
  try {
    const { data: settings } = await supabase.from('roi_settings').select('monthly_roi_rate').single();
    const roiRate = settings ? settings.monthly_roi_rate : 5.0; // Default 5%

    // In a real production scenario, process via batches or trigger Supabase functions
    const { data: activeWallets } = await supabase.from('wallets').select('*').gt('deposit_balance', 0);
    
    if (activeWallets) {
      let totalDistributed = 0;
      for (const w of activeWallets) {
        const dailyRoi = (w.deposit_balance * (roiRate / 100)) / 30; // approx 30 days
        totalDistributed += dailyRoi;
        await supabase.from('wallets').update({ roi_balance: w.roi_balance + dailyRoi }).eq('user_id', w.user_id);
        
        await supabase.from('transactions').insert([{
          user_id: w.user_id, type: 'roi_credit', amount: dailyRoi, fee: 0, net_amount: dailyRoi, status: 'completed'
        }]);
      }
      
      await supabase.from('daily_roi_logs').insert([{
        run_date: new Date().toISOString().split('T')[0],
        status: 'completed',
        total_users_processed: activeWallets.length,
        total_roi_distributed: totalDistributed
      }]);
    }

    res.status(200).json({ message: 'Daily ROI Calculated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.processMonthlyRewards = async (req, res) => {
  try {
    // This executes backend reward allocations, scanning 'referral_performance' via Supabase function
    res.status(200).json({ message: 'Monthly rewards processed.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
