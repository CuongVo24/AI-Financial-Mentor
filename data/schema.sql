-- SQL DDL for MoMo AI Financial Mentor
-- Designed for PostgreSQL (Supabase)

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bill_status') THEN
        CREATE TYPE bill_status AS ENUM ('PENDING', 'SETTLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friend_status') THEN
        CREATE TYPE friend_status AS ENUM ('REQUESTED', 'ACCEPTED');
    END IF;
END $$;

-- 2. AUTOMATED TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. TABLES

-- Profiles Table (Links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS Profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    momo_phone VARCHAR(20),
    currency VARCHAR(10) DEFAULT 'VND',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon_slug TEXT,
    color_code VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS Transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES Profiles(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    type transaction_type NOT NULL,
    raw_notification TEXT,
    ai_category TEXT,
    ai_note TEXT,
    is_manual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BillSplits Table
CREATE TABLE IF NOT EXISTS BillSplits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES Profiles(id) ON DELETE CASCADE,
    total_amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    status bill_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SplitDetails Table
CREATE TABLE IF NOT EXISTS SplitDetails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES BillSplits(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES Profiles(id) ON DELETE CASCADE,
    share_amount DECIMAL(15, 2) NOT NULL,
    payment_status BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Friendships Table
CREATE TABLE IF NOT EXISTS Friendships (
    user_id UUID REFERENCES Profiles(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES Profiles(id) ON DELETE CASCADE,
    status friend_status DEFAULT 'REQUESTED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id)
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON Transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON Transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_billsplits_creator_id ON BillSplits(creator_id);
CREATE INDEX IF NOT EXISTS idx_splitdetails_bill_id ON SplitDetails(bill_id);
CREATE INDEX IF NOT EXISTS idx_splitdetails_member_id ON SplitDetails(member_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON Friendships(status);

-- 5. APPLY UPDATED_AT TRIGGERS
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('Profiles', 'Categories', 'Transactions', 'BillSplits', 'SplitDetails', 'Friendships')
    LOOP
        EXECUTE format('CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t);
    END LOOP;
END $$;
-- 6. Bảo mật (RLS)
ALTER TABLE Profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE Transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE Categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE BillSplits ENABLE ROW LEVEL SECURITY;
/* 
SUMMARY: BILLSPLITS & SPLITDETAILS INTERACTION
The `BillSplits` table acts as the header/parent record for a group expense, storing the 
`total_amount` and the `creator_id`. The `SplitDetails` table acts as the line-item/child 
ledger. It maps individual users (`member_id`) to a specific `bill_id`, defining their 
calculated `share_amount` and tracking their individual `payment_status`. This 1:N 
relationship allows the application to aggregate `SplitDetails` to verify if the 
parent `BillSplits` status should move from 'PENDING' to 'SETTLED'.
*/