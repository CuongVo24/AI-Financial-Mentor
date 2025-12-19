-- ============================================================================
-- MOMO AI FINANCIAL MENTOR (MONEY LOCKET) - DATABASE SCHEMA 2.0
-- Updated: Day 3 - Social & Automation Era
-- ============================================================================

-- 1. EXTENSIONS & SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM DEFINITIONS (Định nghĩa các loại dữ liệu cố định)
DO $$ 
BEGIN
    -- Loại giao dịch: Thu hoặc Chi
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
    END IF;

    -- Trạng thái hóa đơn chia tiền
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bill_status') THEN
        CREATE TYPE bill_status AS ENUM ('PENDING', 'SETTLED');
    END IF;

    -- Trạng thái bạn bè
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friend_status') THEN
        CREATE TYPE friend_status AS ENUM ('REQUESTED', 'ACCEPTED', 'BLOCKED');
    END IF;

    -- [NEW] Cấp độ riêng tư cho Mạng xã hội
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'privacy_level') THEN
        CREATE TYPE privacy_level AS ENUM ('PUBLIC', 'MASKED', 'PRIVATE');
        -- PUBLIC: Hiện tất cả (Số tiền + Nội dung)
        -- MASKED: Che số tiền (Hiện ??? đ + Nội dung)
        -- PRIVATE: Chỉ mình tôi thấy
    END IF;
END $$;

-- 3. TRIGGER FUNCTION (Tự động cập nhật thời gian)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 4. TABLES (CÁC BẢNG DỮ LIỆU)
-- ============================================================================

-- Bảng 1: Profiles (Hồ sơ người dùng - Mở rộng cho Social)
CREATE TABLE IF NOT EXISTS Profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone_number VARCHAR(20),
    
    -- [NEW] Social Features
    bio TEXT,                               -- Giới thiệu ngắn
    financial_mood TEXT DEFAULT 'Neutral',  -- Mood do AI gán (Vd: "Rich Kid", "Broke", "Saver")
    currency VARCHAR(10) DEFAULT 'VND',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng 2: AppConfigs (Lưu cấu hình cho Accessibility Service)
-- Bảng này chứa "Bản đồ" UI của các ngân hàng để App tải về mà không cần update trên Store
CREATE TABLE IF NOT EXISTS AppConfigs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(50) UNIQUE NOT NULL, -- Vd: 'bank_scraping_rules'
    config_value JSONB NOT NULL,            -- Chứa JSON quy tắc quét màn hình (Anchor text, ID...)
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng 3: Categories (Danh mục chi tiêu)
CREATE TABLE IF NOT EXISTS Categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon_slug TEXT,      -- Tên icon trong thư viện (vd: "coffee", "bus")
    color_code VARCHAR(7),
    is_system_default BOOLEAN DEFAULT FALSE, -- True nếu là danh mục mặc định của App
    user_id UUID REFERENCES Profiles(id) ON DELETE CASCADE, -- Null nếu là system default
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng 4: Transactions (Sổ cái giao dịch - Trái tim của hệ thống)
CREATE TABLE IF NOT EXISTS Transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES Profiles(id) ON DELETE CASCADE,
    
    -- Dữ liệu cốt lõi
    amount DECIMAL(15, 2) NOT NULL,
    type transaction_type NOT NULL,
    category TEXT,       -- Lưu tên category (hoặc có thể link ID)
    note TEXT,
    party TEXT,          -- Tên quán hoặc người nhận tiền
    date TIMESTAMPTZ DEFAULT NOW(),
    
    -- [NEW] Automation & AI Data
    raw_notification TEXT,       -- Nội dung gốc (từ SMS/Noti)
    raw_ui_dump TEXT,            -- [Spy] Nội dung quét từ màn hình (để debug Accessibility)
    confidence_score DECIMAL(3, 2), -- Độ tin cậy của AI (0.0 - 1.0)
    input_source VARCHAR(20),    -- Nguồn: 'ACCESSIBILITY', 'NOTIFICATION', 'SMS', 'MANUAL'
    
    -- [NEW] Social & Group Features
    privacy_level privacy_level DEFAULT 'PRIVATE',
    is_group_potential BOOLEAN DEFAULT FALSE, -- AI đánh dấu nếu nghi ngờ đi nhóm
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng 5: Friendships (Đồ thị xã hội)
CREATE TABLE IF NOT EXISTS Friendships (
    user_id UUID REFERENCES Profiles(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES Profiles(id) ON DELETE CASCADE,
    status friend_status DEFAULT 'REQUESTED',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (user_id, friend_id),
    CONSTRAINT not_self_friend CHECK (user_id != friend_id)
);

-- Bảng 6: BillSplits (Quản lý hóa đơn nhóm - Ghost Splitting)
CREATE TABLE IF NOT EXISTS BillSplits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES Profiles(id) ON DELETE CASCADE,
    
    total_amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    status bill_status DEFAULT 'PENDING',
    
    qr_code_url TEXT, -- Link QR code ảnh (nếu có)
    deep_link TEXT,   -- Link để mở App trả tiền
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng 7: SplitDetails (Chi tiết ai nợ ai bao nhiêu)
CREATE TABLE IF NOT EXISTS SplitDetails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES BillSplits(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES Profiles(id) ON DELETE CASCADE, -- Người nợ
    
    share_amount DECIMAL(15, 2) NOT NULL,
    payment_status BOOLEAN DEFAULT FALSE, -- False: Chưa trả, True: Đã trả
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. INDEXES (TỐI ƯU HIỆU NĂNG)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON Transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON Transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_privacy ON Transactions(privacy_level); -- Cho Feed

CREATE INDEX IF NOT EXISTS idx_friendships_status ON Friendships(status);

CREATE INDEX IF NOT EXISTS idx_billsplits_creator_id ON BillSplits(creator_id);
CREATE INDEX IF NOT EXISTS idx_splitdetails_bill_id ON SplitDetails(bill_id);
CREATE INDEX IF NOT EXISTS idx_splitdetails_member_id ON SplitDetails(member_id);

-- ============================================================================
-- 6. APPLY TRIGGERS (TỰ ĐỘNG CẬP NHẬT updated_at)
-- ============================================================================
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('Profiles', 'AppConfigs', 'Categories', 'Transactions', 'BillSplits', 'SplitDetails', 'Friendships')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_update_timestamp ON %I;', t);
        EXECUTE format('CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t);
    END LOOP;
END $$;

-- ============================================================================
-- 7. SECURITY (ROW LEVEL SECURITY - RLS)
-- ============================================================================
-- Bật RLS cho tất cả bảng
ALTER TABLE Profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE AppConfigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE Transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE Categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE Friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE BillSplits ENABLE ROW LEVEL SECURITY;
ALTER TABLE SplitDetails ENABLE ROW LEVEL SECURITY;

-- Chính sách cơ bản (Bạn có thể tinh chỉnh sau trong Tab DA)
-- 1. Profiles: Ai cũng xem được (để tìm bạn), chỉ mình sửa được của mình.
CREATE POLICY "Public Profiles are viewable by everyone" ON Profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON Profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON Profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Transactions: Xem của mình OR xem của bạn bè (nếu Public/Masked)
CREATE POLICY "Users can see own transactions" ON Transactions FOR SELECT USING (auth.uid() = user_id);
-- (Policy xem của bạn bè sẽ phức tạp hơn, Tab DA sẽ xử lý sau để tối ưu query)

CREATE POLICY "Users can insert own transactions" ON Transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON Transactions FOR UPDATE USING (auth.uid() = user_id);

-- 3. AppConfigs: Ai cũng đọc được (để tải cấu hình), chỉ admin sửa (ở đây tạm cho read-only)
CREATE POLICY "Configs are viewable by everyone" ON AppConfigs FOR SELECT USING (true);