# Thiệp mời thôi nôi online — Thiết kế

## Mục đích
Thiệp mời dự tiệc thôi nôi (sinh nhật 1 tuổi) của con trai anh Thắng. Gửi link qua Zalo/Messenger
cho họ hàng, bạn bè; người nhận mở trên điện thoại, biết **tiệc của bé nào, khi nào, ở đâu**,
và cảm nhận được không khí vui, dễ thương. Deploy lên Vercel để có domain.

## Mục tiêu / Không làm / Thất bại nếu
- **Mục tiêu:** mở nhanh trên điện thoại, màn mở thiệp ấn tượng, thông tin tiệc rõ ràng, dễ chỉ đường.
- **Không làm (bản đầu):** xác nhận tham dự (RSVP), sổ lời chúc, DB, đa ngôn ngữ, trang quản trị.
  Sẽ bổ sung sau nếu cần (RSVP dự kiến đẩy vào Google Sheet).
- **Thất bại nếu:** giật/lag trên máy Android tầm trung, chữ khó đọc, thông tin giờ/địa điểm khó tìm,
  link gửi Zalo không có ảnh preview.

## Cách xây dựng (Approaches)
- **Chọn:** Next.js 16 + React 19 + Tailwind 4 + React Three Fiber — cùng stack với `cv-online`, tạo mới
  bằng `create-next-app`, chỉ mang sang những phần dùng lại được (`transpilePackages: ["three"]`,
  component `Reveal`, nội dung tập trung trong `src/lib/content.ts`).
- **Loại:** HTML thuần/Vite (anh muốn cùng công nghệ; Next có sẵn tối ưu ảnh + OG metadata);
  template/dịch vụ thiệp có sẵn (khó tuỳ biến, không phải code của mình).
- **Luồng màn hình — chọn:** một URL duy nhất, 2 màn chuyển bằng state (màn mở đầu → màn nội dung).
  **Loại:** 2 route riêng (`/`, `/thiep`) vì mở thẳng `/thiep` sẽ mất màn mở thiệp và nhạc không phát.

## Thiết kế
### Màn 1 — Mở đầu
- Tiêu đề "Thôi nôi bé ___" + tấm thiệp/phong bì đang đóng, gợi ý "Chạm để mở thiệp".
- Chạm → thiệp mở (animation), pháo giấy bung, **nhạc bắt đầu phát** (lần chạm này là user gesture
  cần thiết để trình duyệt cho phát nhạc), chuyển mượt sang màn 2.

### Màn 2 — Nội dung (cuộn dọc, ưu tiên mobile)
1. Hero: ảnh bé + cảnh 3D nhẹ (bóng bay / bánh kem có nến số 1), "Bé ___ tròn 1 tuổi — Trân trọng kính mời".
2. Thông tin tiệc: giờ, ngày (kèm âm lịch nếu anh muốn), địa điểm; nút **Chỉ đường** (Google Maps) và
   **Thêm vào lịch** (file .ics tĩnh / link Google Calendar).
3. Vài ảnh của bé (lưới/slide nhỏ).
4. Lời mời của bố mẹ + ký tên.
- Nút 🔊 bật/tắt nhạc cố định ở góc trong suốt màn 2.
- Các khối hiện dần khi cuộn (`Reveal`).

### Nội dung & tài sản
- Toàn bộ chữ/thông tin ở `src/lib/content.ts` (tên bé, ngày giờ, địa điểm, link map, lời mời,
  danh sách ảnh, file nhạc).
- Ảnh trong `public/images/`, nhạc trong `public/music/`. Chưa có tài sản → dùng ảnh placeholder,
  nhạc tắt (không lỗi).
- Chỉ tiếng Việt.

### Hiệu năng & chia sẻ
- 3D lazy-load (dynamic import, `ssr: false`), giới hạn DPR, ít đối tượng; có fallback tĩnh nếu WebGL lỗi.
- Ảnh qua `next/image`.
- Metadata Open Graph: tiêu đề "Mời dự tiệc thôi nôi bé ___", ảnh preview 1200×630 → hiện đẹp khi gửi Zalo.

### Repo & deploy
- Thư mục `d:\thiep-sinhnhat-online`, remote `https://github.com/thang997/thiep-sinhnhat-online.git` (đang trống), nhánh `main`.
- Deploy: import repo vào Vercel (anh thao tác trên dashboard hoặc `vercel` CLI), dùng domain `*.vercel.app`
  hoặc gắn domain riêng sau.

## Để lại cho người làm quyết định
- Phong cách màu sắc/font cụ thể. **Đã chốt khi làm:** tông kem — be — nâu caramel — xám xanh theo bộ ảnh studio
  (thay cho pastel xanh — vàng ban đầu); font Baloo 2 (tiêu đề), Nunito (chữ), Dancing Script (chữ viết tay).
- Kiểu animation mở thiệp (phong bì lật nắp hay hộp quà) và hình 3D cụ thể.
- Thông tin thật (tên bé, ngày giờ, địa điểm, lời mời) — để placeholder, anh điền sau cùng ảnh/nhạc.
