TỔNG QUAN KIẾN TRÚC HỆ THỐNG (UPDATED)
Mô hình: "Money Locket" - Social Financial Network.

Công nghệ lõi (Tech Stack):
* Frontend: React Native (Expo) + **Kotlin Native Modules** (Xử lý Accessibility/SMS).
* Backend: Node.js (Fastify/TypeScript).
* AI Engine: Gemini 1.5 Flash (Phân tích ngữ nghĩa & Social Context).
* Database: Supabase (PostgreSQL + Real-time).

ROADMAP CHI TIẾT (10 TIẾNG/NGÀY)

GIAI ĐOẠN 1: THIẾT LẬP NỀN MÓNG (Tuần 1) - ✅ ĐÃ HOÀN THÀNH
* Mục tiêu: Backend Online, Database Schema chuẩn, Repo sẵn sàng.
* Kết quả: Server Fastify chạy port 3000, kết nối Gemini & Supabase thành công.

GIAI ĐOẠN 2: "THE 5-LAYER DEFENSE" - NATIVE MOBILE (Tuần 2-3)
* Mục tiêu: App Android có thể "đọc" được mọi ngóc ngách điện thoại (Accessibility, SMS, Noti).
* Module Native (Khó): Viết Bridge từ React Native sang Kotlin để chạy Accessibility Service.
* Module Screenshot: Tính năng tự động upload và xóa ảnh.
* Integration: Kết nối App với Backend API `/analyze`.
* *Milestone:* Cài file APK, App tự động nhận diện khi mở MoMo/Bank.

GIAI ĐOẠN 3: "THE BRAIN" & LOGIC XÃ HỘI (Tuần 4)
* Mục tiêu: Xử lý dữ liệu thô thành bài đăng mạng xã hội.
* AI Tuning: Dạy Gemini phân biệt Income (Private) và Outcome (Public).
* Feed UI: Xây dựng giao diện lướt Feed, xem tin bạn bè.
* Privacy Logic: Ẩn số tiền (Masked Mode) theo cài đặt người dùng.

GIAI ĐOẠN 4: GHOST SPLITTING & POLISH (Tuần 5-6)
* Mục tiêu: Tính năng chia tiền và hoàn thiện UX.
* Ghost Splitting: Tạo QR động, tích hợp Share Sheet của điện thoại.
* Data Visualization: Vẽ biểu đồ Pie Chart cho Period Recap.
* Security Audit: Kiểm tra việc xóa ảnh chụp màn hình và che OTP.