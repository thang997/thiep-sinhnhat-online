# Thiệp mời thôi nôi bé Tom 🎂

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

## Deploy

Import repo vào [Vercel](https://vercel.com/new) → Framework: Next.js → Deploy. Mỗi lần `git push` lên `main`
Vercel tự build lại.
