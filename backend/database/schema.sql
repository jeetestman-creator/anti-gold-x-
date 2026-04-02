-- Supabase PostgreSQL Schema for Gold X Usdt

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone_number TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    pincode TEXT,
    referred_by_user_id UUID NULL REFERENCES profiles(id) ON DELETE SET NULL,
    role TEXT NOT NULL DEFAULT 'user',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ NULL,
    terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    terms_accepted_at TIMESTAMPTZ NULL,
    kyc_status TEXT NOT NULL DEFAULT 'pending',
    auto_withdrawal_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    auto_withdrawal_wallet_address TEXT NULL,
    cumulative_direct_referral_deposits NUMERIC(20,8) NOT NULL DEFAULT 0,
    compounding_roi_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    compounding_roi_reinvestment_percentage NUMERIC(5,2) NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount NUMERIC(20,8) NOT NULL,
    fee NUMERIC(20,8) NOT NULL DEFAULT 0,
    net_amount NUMERIC(20,8) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    transaction_hash TEXT NULL,
    network TEXT NULL,
    coupon_code_id BIGINT NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    deposit_balance NUMERIC(20,8) NOT NULL DEFAULT 0,
    roi_balance NUMERIC(20,8) NOT NULL DEFAULT 0,
    bonus_balance NUMERIC(20,8) NOT NULL DEFAULT 0,
    withdrawal_balance NUMERIC(20,8) NOT NULL DEFAULT 0,
    total_fees_paid NUMERIC(20,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- referral_structure table
CREATE TABLE IF NOT EXISTS referral_structure (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    level INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- kyc_records table
CREATE TABLE IF NOT EXISTS kyc_records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reviewed_by_admin_id UUID NULL,
    reviewed_at TIMESTAMPTZ NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- coupon_codes table
CREATE TABLE IF NOT EXISTS coupon_codes (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_percentage NUMERIC(5,2) NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    usage_limit INT NOT NULL DEFAULT 1,
    usage_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by_admin_id UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NULL REFERENCES profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    priority TEXT NOT NULL DEFAULT 'normal',
    admin_response TEXT NULL,
    responded_by_admin_id UUID NULL,
    responded_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_by_admin_id UUID NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- landing_page_content table
CREATE TABLE IF NOT EXISTS landing_page_content (
    id BIGSERIAL PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    content_json JSONB NOT NULL,
    updated_by_admin_id UUID NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- legal_policy_content table
CREATE TABLE IF NOT EXISTS legal_policy_content (
    id BIGSERIAL PRIMARY KEY,
    policy_type TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    updated_by_admin_id UUID NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- referral_performance table
CREATE TABLE IF NOT EXISTS referral_performance (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    direct_referral_count_override INT NULL,
    performance_score_override NUMERIC NULL,
    contribution_value_override NUMERIC NULL,
    last_modified_by_admin_id UUID NULL,
    last_modified_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- roi_settings table
CREATE TABLE IF NOT EXISTS roi_settings (
    id BIGSERIAL PRIMARY KEY,
    monthly_roi_rate NUMERIC(8,4) NOT NULL,
    updated_by_admin_id UUID NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- daily_roi_logs table
CREATE TABLE IF NOT EXISTS daily_roi_logs (
    id BIGSERIAL PRIMARY KEY,
    run_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    total_users_processed INT NOT NULL DEFAULT 0,
    total_roi_distributed NUMERIC(20,8) NOT NULL DEFAULT 0,
    error_message TEXT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL
);

-- admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_by_admin_id UUID NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- blockchain_api_settings table
CREATE TABLE IF NOT EXISTS blockchain_api_settings (
    id SERIAL PRIMARY KEY,
    network VARCHAR(10) NOT NULL, -- TRC20 or BEP20
    provider_name VARCHAR(255) NULL,
    api_base_url VARCHAR(500) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    confirmation_threshold INT NOT NULL DEFAULT 1,
    is_enabled BOOLEAN DEFAULT TRUE,
    updated_by_admin_id UUID NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- admin_audit_log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id BIGSERIAL PRIMARY KEY,
    action_type TEXT NOT NULL,
    admin_user_id UUID NOT NULL,
    target_user_id UUID NULL,
    field_name TEXT NULL,
    previous_value TEXT NULL,
    new_value TEXT NULL,
    correction_reason TEXT NULL,
    is_immutable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- reward_badges table
CREATE TABLE IF NOT EXISTS reward_badges (
    id BIGSERIAL PRIMARY KEY,
    badge_name TEXT NOT NULL UNIQUE,
    badge_description TEXT NULL,
    badge_icon_url TEXT NULL,
    rank_threshold_min INT NOT NULL,
    rank_threshold_max INT NOT NULL,
    bonus_amount NUMERIC(20,8) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by_admin_id UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- monthly_rewards table
CREATE TABLE IF NOT EXISTS monthly_rewards (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reward_month DATE NOT NULL,
    rank_position INT NOT NULL,
    badge_id BIGINT NULL REFERENCES reward_badges(id) ON DELETE SET NULL,
    bonus_amount NUMERIC(20,8) NOT NULL DEFAULT 0,
    bonus_credited BOOLEAN NOT NULL DEFAULT FALSE,
    credited_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id BIGINT NOT NULL REFERENCES reward_badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reward_month DATE NOT NULL
);

-- compounding_roi_logs table
CREATE TABLE IF NOT EXISTS compounding_roi_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    run_date DATE NOT NULL,
    principal_before NUMERIC(20,8) NOT NULL,
    roi_earned NUMERIC(20,8) NOT NULL,
    reinvested_amount NUMERIC(20,8) NOT NULL,
    principal_after NUMERIC(20,8) NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    error_message TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Set up Row Level Security (RLS) basics (assuming mostly service-level access, but good practice)
-- Note: Further RLS policies need to be implemented depending on precise security scopes.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Adding triggers for updated_at where suitable
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_transactions_modtime BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_wallets_modtime BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- otp_records table
CREATE TABLE IF NOT EXISTS otp_records (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
