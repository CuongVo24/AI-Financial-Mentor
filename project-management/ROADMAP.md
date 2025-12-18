TỔNG QUAN KIẾN TRÚC HỆ THỐNG
Mô hình điều phối: The Relay Loop (Chạy tiếp sức).

Trình điều khiển: Bạn (Controller) điều khiển Script tự động hoặc Copy-Paste thủ công.

Công nghệ lõi (Tech Stack):

Frontend: React Native (Expo) - Code một lần chạy cả Android & iOS.

Backend: Node.js (Fastify/TypeScript) - Đảm bảo tốc độ và bảo mật API Key.

Database: Supabase (PostgreSQL) - Lưu trữ Cloud an toàn, hỗ trợ Real-time cho tính năng nhóm.

AI Engine: Gemini 1.5 Flash (Google AI Studio) - Xử lý ngôn ngữ tự nhiên, phân loại chi tiêu.

IDE: Antigravity - Môi trường code và test tập trung.
ROADMAP CHI TIẾT (10 TIẾNG/NGÀY)
GIAI ĐOẠN 1: THIẾT LẬP NỀN MÓNG (Tuần 1)
Mục tiêu: Có khung dự án, Database và giao diện Chatbot cơ bản.

Ngày 1-2 (Database & Repo):

Thiết lập GitHub Repo (với file .gitignore để ẩn file .env).

Dùng Tab DA thiết kế SQL Schema hoàn chỉnh.

Tạo Project trên Supabase và chạy Script SQL để tạo bảng.

Ngày 3-5 (Backend Skeleton):

Dùng Tab BE dựng server Fastify.

Thiết lập Proxy API Gemini (Ẩn API Key trên Backend).

Viết API kết nối với Database Supabase.

Ngày 6-7 (Frontend Interface):

Dùng Tab FE dựng App React Native với Expo.

Thiết kế giao diện Dashboard (Mood AI) và Chatbox UI.

GIAI ĐOẠN 2: THỰC THI TÍNH NĂNG "LẮNG NGHE" (Tuần 2-4)
Mục tiêu: App tự động bắt được thông báo MoMo và AI phân tích được dữ liệu.

Module Notification (Android): Viết Listener để bắt nội dung từ MoMo.

Module AI Parser: Gửi nội dung thông báo sang Gemini để bóc tách: Số tiền, Nội dung, Loại chi tiêu.

Module Instant Chat: Khi có giao dịch, hiện thông báo cho người dùng chọn nhanh mục đích chi tiêu.

Milestone: Cài file APK đầu tiên lên điện thoại của bạn để test giao dịch MoMo thật.

GIAI ĐOẠN 3: CỘNG ĐỒNG & CHIA TIỀN (Tuần 5-8)
Mục tiêu: Kết nối bạn bè, chia tiền và báo cáo giọng nói.

Social Features: Đăng ký/Đăng nhập bạn bè qua số điện thoại.

One-Click Split: Tự động tính toán tiền nợ và tạo Link thanh toán MoMo/VietQR.

Voice Insight: Cuối tuần AI tổng hợp dữ liệu và đọc báo cáo tài chính bằng giọng nói (TTS).

Security Audit: Kiểm tra lại các lớp mã hóa dữ liệu trước khi mời bạn bè dùng thử bản Beta.QUY TẮC GIÁM SÁT (Dành cho Bạn)
Quy tắc Handover: Khi chuyển giao giữa các Tab (DA -> BE -> FE), phải yêu cầu AI tóm tắt thông tin vào khối mã [HANDOVER_PACKET].

Bảo mật: Luôn kiểm tra xem file .env đã có trong .gitignore chưa trước khi push lên GitHub.

Clean Code: Yêu cầu các AI comment code rõ ràng theo chuẩn Coding Convention mà chúng ta đã thống nhất (PascalCase cho Table, camelCase cho Function).

Kiểm soát 0đ: Chỉ sử dụng các gói Free Tier của Google, Supabase, Vercel. Không nhập thẻ tín dụng nếu không cần thiết.