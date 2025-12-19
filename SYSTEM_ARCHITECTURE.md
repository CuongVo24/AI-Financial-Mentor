# SYSTEM ARCHITECTURE: MONEY LOCKET (FINAL)

## 1. INPUT STRATEGY (The 5 Defense Layers)
*Target: 100% Transaction Capture Rate*
- **L1: Accessibility Service (The Spy):** Priority #1. Scans UI DOM of MoMo/Agribank for "Success" screens.
- **L2: Notification Listener (The Guard):** Priority #2. Standard push capture.
- **L3: SMS Reader (The Backup):** Priority #3. For offline/legacy users.
- **L4: Clipboard Listener (The Opportunist):** Priority #4. Detects copied transaction text.
- **L5: Smart Screenshot (The Cleaner):** Priority #5. Upload -> Analyze -> Auto-delete file.

## 2. PROCESSING CORE (The Brain)
- **Sanitization:** - INCOME (+): Auto-tag `PRIVATE`. Hidden from everyone.
  - OUTCOME (-): Eligible for Social Feed.
- **Enrichment (Gemini AI):**
  - Extract: Amount, Merchant, Time.
  - Infer: Category, Mood, Group Context.

## 3. OUTPUT & SOCIAL FLOWS (Updated)

### A. The Feed (Mạng Xã Hội)
- **Item Types:** Single Transaction, Group Bill, **Period Recap (Pie Chart)**.
- **Recap Logic:** - Aggregates `PUBLIC` & `MASKED` transactions only.
  - Shows date range (e.g., Mon-Sun).
  - Visualization: Pie Chart by Category.

### B. Ghost Splitting & Sharing (Chia Sẻ Đa Kênh)
- **Trigger:** User creates a Split Bill.
- **Mechanism:** Native System Share Sheet.
- **Channels:** Messenger, Instagram, Discord, SMS, Email, **Bluetooth**.
- **Payload:**
  - **VietQR Image:** Dynamic QR with exact amount & remark.
  - **Universal Link:** Opens App (if installed) or Web View (if not).

## 4. DATA PRIVACY & SECURITY
- **Storage:** Screenshots used for input must be DELETED after success.
- **Visibility:** Friends only see what is explicitly shared or Public.
- **Blind Spots:** Banking Passwords/OTP screens are ignored by Accessibility Service (Blacklist logic).

## 5. TECH STACK FREEZE
- **Mobile:** Expo (React Native) + NativeWind + Kotlin Modules.
- **Backend:** Fastify + Gemini 1.5 Flash.
- **Database:** Supabase.