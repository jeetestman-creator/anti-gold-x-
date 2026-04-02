const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSignupOTP, sendPasswordReset } = require('../services/emailTemplates');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Signup / Register
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone_number, country, state, city, pincode, referred_by, terms_accepted } = req.body;

    if (!terms_accepted) {
      return res.status(400).json({ error: 'You must accept the Terms & Conditions to create an account' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from('profiles').select('id').eq('email', email).single();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Since we control OTP verification, first register via Supabase Auth (but disable auto confirmation if possible, or just create raw)
    // Supabase admin creation:
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // We manually manage OTP, so we mark truthy here but their custom status is pending internally handled.
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const userId = authData.user.id;

    // Create Initial Profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: userId,
      email,
      full_name,
      phone_number,
      country,
      state,
      city,
      pincode,
      referred_by_user_id: referred_by || null,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      role: 'user',
    }]);

    if (profileError) return res.status(400).json({ error: profileError.message });

    // Generate and send OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

    await supabase.from('otp_records').insert([{ email, otp_code: otpCode, expires_at: expiresAt }]);
    await sendSignupOTP(email, full_name || email.split('@')[0], otpCode);

    res.status(200).json({ message: 'Registration successful. OTP sent to email.', email });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp_code } = req.body;
    
    const { data: record, error } = await supabase
      .from('otp_records')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp_code)
      .eq('is_used', false)
      .single();

    if (error || !record) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Mark as used
    await supabase.from('otp_records').update({ is_used: true }).eq('id', record.id);
    
    // Optionally create wallets here upon successful activation
    const { data: user } = await supabase.from('profiles').select('id').eq('email', email).single();
    if(user) {
        await supabase.from('wallets').insert([{ user_id: user.id }]);
    }

    res.status(200).json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 3. Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    // Ensure OTP flow was completed check
    const { data: profile } = await supabase.from('profiles').select('role, is_deleted').eq('id', data.user.id).single();
    if (profile?.is_deleted) return res.status(403).json({ error: 'Account is deleted.' });

    // Generate JWT token
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email, role: profile.role }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Login successful', token, user: profile });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
