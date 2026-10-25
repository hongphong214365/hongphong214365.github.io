# Báo cáo tái cấu trúc website

Cập nhật: 2026-10-25. Giữ lại tệp này làm checklist và báo cáo sau khi hoàn tất.

## Trang chủ và nội dung

- [x] Tái cấu trúc `index.html` với header, điều hướng chính, điều hướng mạng xã hội, main và footer.
- [x] Thêm skip link, thứ bậc tiêu đề, tên landmark và nhãn biểu mẫu để hỗ trợ NVDA.
- [x] Viết phần giới thiệu cá nhân về Python, tự động hóa và trải nghiệm dùng NVDA.
- [x] Thêm Reddit, Facebook, TikTok, itch.io (ghi ITG), X và GitHub theo tên `hongphong214365`.
- [x] Giữ các thẻ dự án và tải README của `hongphong214365/Du-an` vào trang.
- [x] Có trạng thái tải README dành cho trình đọc màn hình và liên kết dự phòng khi GitHub không phản hồi.
- [x] Escape nội dung README trước khi render; chỉ tạo liên kết từ URL HTTP(S).
- [x] Thêm nút sao chép cho khối mã trong README và các trang dự án, kèm phương án dự phòng khi Clipboard API không dùng được.

## Giao diện và cấu trúc tệp

- [x] Đưa kiểu dáng vào `style.css`, cải thiện bố cục, độ tương phản, focus, giao diện di động và giảm chuyển động.
- [x] Rà các trang `*.html`; chuyển các thuộc tính `style` trong `404.html` sang class CSS.
- [x] Giữ CSS và JavaScript trong tệp riêng, không thêm script hay style nội tuyến.
- [x] Thêm liên hệ qua Gmail và form có label, xác thực trường bắt buộc cùng trường honeypot.
- [x] Form mở ứng dụng email của khách với nội dung đã điền sẵn tới `hongphong0909.13@gmail.com`; không gửi dữ liệu đến endpoint bên thứ ba chưa được cấu hình.

## Commit và phát hành

- [x] Rà nội dung ba commit có sẵn chưa push: `9e2fb88`, `02ebd7c`, `83d342b`.
- [x] Hoàn thiện các mục rà soát HTML, CSS, JS và accessibility.
- [x] Tạo commit hoàn tất và push các commit đang chờ lên `origin/main`.

## Ghi chú

- Danh sách mạng xã hội: Reddit `reddit.com/user/hongphong214365`; Facebook `facebook.com/hongphong214365`; TikTok `@hongphong214365`; itch.io `itch.io/profile/hongphong214365`; X `x.com/hongphong214365`; GitHub `github.com/hongphong214365`.
- Form liên hệ cần ứng dụng email được cấu hình trên thiết bị của người gửi. Đây là cách gửi không cần tài khoản dịch vụ form hoặc endpoint riêng.
- README dùng GitHub API `https://api.github.com/repos/hongphong214365/Du-an/readme` và hiển thị trực tiếp trên trang; liên kết GitHub vẫn có sẵn làm dự phòng.
