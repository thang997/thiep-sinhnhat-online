# Thiệp mời sinh nhật bé Tôm 🎂

Thiệp mời online: màn mở phong bì → nội dung (thông tin tiệc, đếm ngược, chỉ đường, album ảnh).
Next.js 16 · React 19 · Tailwind 4 · React Three Fiber.

## Chạy thử

```bash
npm install
npm run dev     # http://localhost:3000
```

## Sửa nội dung

Mọi chữ và thông tin nằm trong [`src/lib/content.ts`](src/lib/content.ts): tên bé, giờ, địa điểm,
link Google Maps, lời mời, chữ ký, danh sách ảnh.

- **Ảnh:** `public/images/be-XX.jpg` (đã nén ~1600px). Ảnh preview khi gửi Zalo/Facebook:
  `src/app/opengraph-image.jpg` (1200×630).
- **Nhạc:** chép file mp3 vào `public/music/nang-ngoai-san.mp3`. Thiếu file thì thiệp vẫn chạy, chỉ không có nhạc
  và không hiện nút đĩa nhạc.

## Link mời riêng cho từng khách

Mở `/tao-link` (vd `https://thiep-sinhnhat-online.vercel.app/tao-link`), nhập mỗi dòng một tên → mỗi người một link
dạng `/?k=Cô%20Lan`. Thiệp sẽ hiện "Kính gửi Cô Lan" ở màn mở phong bì, "Trân trọng kính mời Cô Lan" trong thiệp,
và điền sẵn tên vào form lời chúc / xác nhận. Nút "Chép" chép luôn câu mời kèm link để dán vào Zalo.

## Lời chúc & xác nhận tham dự (Google Sheet)

Không dùng DB — dữ liệu ghi vào Google Sheet của bạn qua Apps Script.

1. Tạo Google Sheet mới (tên tuỳ ý, vd "Thiệp sinh nhật Tôm").
2. Menu **Extensions (Tiện ích mở rộng) → Apps Script**. Xoá code mẫu, dán toàn bộ [`apps-script/Code.gs`](apps-script/Code.gs), bấm 💾 Lưu.
3. **Deploy (Triển khai) → New deployment (Tùy chọn triển khai mới)** → bánh răng ⚙ chọn **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy** → cấp quyền cho tài khoản Google của bạn (bấm *Advanced → Go to ... (unsafe)* nếu Google cảnh báo — đây là script của chính bạn).
4. Copy link **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`) dán vào `GUESTBOOK_API` trong `src/lib/content.ts`, rồi push.

Sheet sẽ tự có 2 tab khi có người gửi đầu tiên:
- **LoiChuc** — lời chúc (hiện công khai trên thiệp). Muốn ẩn lời chúc nào thì đổi cột **Hiện** của dòng đó thành `FALSE`.
- **XacNhan** — ai đến, mấy người, ghi chú (chỉ bạn xem được).

> Sửa `Code.gs` sau khi đã deploy thì phải **Deploy → Manage deployments → ✏ → Version: New version** thì mới có hiệu lực (link giữ nguyên).

## Deploy

Import repo vào [Vercel](https://vercel.com/new) → Framework: Next.js → Deploy. Mỗi lần `git push` lên `main`
Vercel tự build lại.
