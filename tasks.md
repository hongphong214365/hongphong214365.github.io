# Tasks – Tái cấu trúc Homepage & Cải thiện Dự án

> Tạo ngày: 2026-10-25 | Tệp này là báo cáo tiến độ, **không xóa sau khi xong**.

---

## Commit 1 – Tái cấu trúc `index.html` (cấu trúc HTML thuần)

- [x] Thêm `<header>` với `<nav>` có aria-label
- [x] Thêm liên kết mạng xã hội: Reddit, Facebook, TikTok, ITG (itch.io), X — tất cả `hongphong214365`
- [x] Thêm phần "Giới thiệu" (`#about`) trong `<main>` — giới thiệu bản thân + NVDA
- [x] Giữ phần Dự án nổi bật (`#projects`) với badge + nút GitHub riêng
- [x] Thêm `<footer id="contact">` với thông tin liên hệ và form liên hệ
- [x] Form dùng Formspree (AJAX) + honeypot chống spam
- [x] Đảm bảo `<main id="main">`, skip-link, landmark đủ cho NVDA
- [x] Kéo README từ GitHub API (`hongphong214365/Du-an`) và render tại chỗ

## Commit 2 – Cập nhật `style.css` (tổng hợp, không pha HTML)

- [x] Gộp toàn bộ style dùng chung vào `style.css`
- [x] Thêm: `.site-header`, `.nav-container`, `.social-list`, `.project-card`, `.project-list`
- [x] Thêm: `.section-hero`, `.avatar`, `.hero-text`, `.hero-actions`
- [x] Thêm: `.site-footer`, `.footer-inner`, `.contact-info`, `.footer-bottom`
- [x] Thêm: styles cho project pages (`.project-page-body`, `.project-nav`, `.project-hero`, v.v.)
- [x] Thêm: `.copy-btn` cho nút sao chép code
- [x] Thêm: `.form-status`, `.form-group` cho form liên hệ
- [x] Giữ: high-contrast, prefers-reduced-motion, focus-visible, skip-link

## Commit 3 – Tách CSS khỏi `project/*.html` + thêm `main.js`

- [x] Tách toàn bộ `<style>` nội tuyến ra khỏi `project/agentsTelegram.html`
- [x] Tách toàn bộ `<style>` nội tuyến ra khỏi `project/Voice-Assistant.html`
- [x] Thêm `<link rel="stylesheet" href="/style.css">` vào cả hai
- [x] Tạo `main.js` riêng biệt với:
  - Fetch README từ `api.github.com/repos/hongphong214365/Du-an/readme`
  - Render Markdown → HTML (parser tối giản, không cần CDN)
  - Nút "Sao chép" (`copy-btn`) cho tất cả `<pre>` và `.code-block`
  - AJAX submit form liên hệ qua Formspree
- [x] Thêm `<script src="/main.js" defer>` vào tất cả trang

## Commit 4 – Kiểm tra & dọn dẹp cuối

- [ ] Kiểm tra lại tất cả `*.html` — không còn inline style thừa (trừ những gì cực kỳ cần thiết)
- [ ] Kiểm tra accessibility: skip-link đúng chỗ, aria-label đầy đủ, landmark rõ ràng
- [ ] Git commit tổng kết

---

## Ghi chú kỹ thuật

### Mạng xã hội (tất cả là `hongphong214365`)
| Nền tảng | URL |
|---|---|
| Reddit | https://www.reddit.com/user/hongphong214365 |
| Facebook | https://www.facebook.com/hongphong214365 |
| TikTok | https://www.tiktok.com/@hongphong214365 |
| ITG (itch.io) | https://itch.io/profile/hongphong214365 |
| X (Twitter) | https://x.com/hongphong214365 |
| GitHub | https://github.com/hongphong214365 |

### Form liên hệ
- Formspree endpoint: `https://formspree.io/f/xpwrwbjg` ← **cần cập nhật ID thật**
- Gmail: `hongphong0909.13@gmail.com`
- AJAX submit (không reload trang), có thông báo thành công/thất bại qua `aria-live`

### README fetch
- API: `https://api.github.com/repos/hongphong214365/Du-an/readme`
- Accept header: `application/vnd.github.v3.raw` (trả về Markdown thuần)
- Fallback: link trực tiếp đến GitHub nếu fetch thất bại

### Cấu trúc file
```
hongphong214365.github.io/
├── index.html          ← Homepage (tái cấu trúc hoàn toàn)
├── style.css           ← Toàn bộ CSS, không pha vào HTML
├── main.js             ← Toàn bộ JS, không pha vào HTML
├── tasks.md            ← Báo cáo này
├── 404.html
├── robots.txt
├── sitemap.xml
└── project/
    ├── agentsTelegram.html   ← Đã tách CSS
    └── Voice-Assistant.html  ← Đã tách CSS
```
