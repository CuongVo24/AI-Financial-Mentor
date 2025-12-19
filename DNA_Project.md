# PROJECT CONTEXT: MONEY LOCKET (ULTIMATE)
*Internal Codename: MoMo AI Financial Mentor*

## 1. CORE VISION
We are building a **Social Financial Network** (similar to Locket/BeReal but for spending), powered by **Hyper-Automation**.
* **Philosophy:** "Zero-Friction Input" & "Social Accountability".
* **Key Rule:** INCOME is strictly PRIVATE. Only OUTCOME (Expenses) is shared on the Feed.

## 2. THE 5-LAYER INPUT DEFENSE (Critical Architecture)
We capture transactions using 5 fallback layers (Priority 1 -> 5):
1.  **L1: Accessibility Service (The Spy):** Scans UI DOM of "Silent Apps" (MoMo, Agribank) for success screens.
2.  **L2: Notification Listener:** Standard push capture (Techcombank, MB, Wallets).
3.  **L3: SMS Reader:** Backup for offline/legacy users.
4.  **L4: Clipboard Listener:** Detects copied transaction text.
5.  **L5: Smart Screenshot:** Upload -> Analyze -> Auto-delete file.

## 3. TECH STACK
* **Frontend:** React Native (Expo) + NativeWind + **Kotlin Native Modules** (for L1/L3).
* **Backend:** Node.js (Fastify) + TypeScript.
* **AI Engine:** Gemini 1.5 Flash (Semantic Analysis & Group Detection).
* **Database:** Supabase (PostgreSQL) + Real-time.

## 4. SOCIAL LOGIC
* **Privacy Levels:** PUBLIC (Show all) | MASKED (Hide amount: "??? đ") | PRIVATE.
* **Ghost Splitting:** AI detects group meals -> Suggests splitting -> Generates QR/Link.