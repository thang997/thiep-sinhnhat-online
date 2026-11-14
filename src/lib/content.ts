/**
 * TOÀN BỘ NỘI DUNG THIỆP Ở ĐÂY — sửa file này là đủ.
 * Các chỗ có "TODO" là thông tin tạm, cần điền thông tin thật.
 */

export const BABY = {
  /** Tên ở nhà — hiện to ở tiêu đề. */
  nickname: "Tôm",
  /** Tên thật — hiện nhỏ bên dưới (để "" nếu không muốn hiện). */
  fullName: "Đăng Dương",
};

export const PARTY = {
  /** Giờ bắt đầu / kết thúc theo giờ Việt Nam, định dạng YYYY-MM-DDTHH:mm. */
  start: "2026-11-22T11:00",
  /** Giờ kết thúc chỉ dùng cho lịch (Google Calendar), không hiện trên thiệp. */
  end: "2026-11-22T13:30",
  /** Ngày âm lịch — để "" nếu không muốn hiện. */
  lunar: "Nhằm ngày 14 tháng 10 năm Bính Ngọ",
  venueName: "Nhà hàng Phú Cường",
  address: "340 Bà Triệu, Hai Bà Trưng, Hà Nội",
  /** Gần ngã tư Bà Triệu — Đại Cồ Việt. Hiện nhỏ dưới địa chỉ (để "" nếu không cần). */
  landmark: "",
  /** Link Google Maps chính xác (nếu có). Để "" thì tự tìm theo địa chỉ. */
  mapsUrl: "",
};

export const INVITE = {
  title: "Sinh nhật",
  greeting: "Trân trọng kính mời",
  message:
    "Một năm trôi qua thật nhanh, con đã lớn lên trong tình yêu thương của cả gia đình. Bố mẹ con rất mong được đón tiếp mọi người đến chung vui ngày con tròn 1 tuổi.",
  signature: "Bố mẹ bé Tôm", // TODO
};

export type Photo = { src: string; alt: string; w: number; h: number };

const P = 1067; // cạnh ngắn
const L = 1600; // cạnh dài
const portrait = (n: string, alt: string): Photo => ({ src: `/images/be-${n}.jpg`, alt, w: P, h: L });
const landscape = (n: string, alt: string): Photo => ({ src: `/images/be-${n}.jpg`, alt, w: L, h: P });

/** Ảnh ở màn mở đầu và ảnh chính (hero). */
export const INTRO_PHOTO = portrait("03", "Bé ngồi bên bóng bay");
export const HERO_PHOTO = portrait("07", "Bé cười ôm gấu bông");

/** Album — thứ tự hiển thị. */
export const PHOTOS: Photo[] = [
  portrait("01", "Bé bên bóng bay"),
  landscape("04", "Bé ngồi giơ tay"),
  portrait("02", "Bé và gấu bông"),
  landscape("12", "Bé cười trên sofa"),
  portrait("05", "Bé chỉ tay"),
  portrait("08", "Bé ngồi ghế gỗ"),
  landscape("11", "Bé chơi với thú bông"),
  portrait("03", "Bé ngồi bên bóng bay"),
  portrait("07", "Bé ôm gấu"),
  landscape("13", "Bé đọc sách trên sofa"),
  landscape("15", "Bé bò trên sàn"),
  portrait("06", "Bé vẫy tay chào"),
  portrait("14", "Bé đọc sách"),
];

/**
 * Link Web App của Google Apps Script (dạng https://script.google.com/macros/s/.../exec).
 * Cách tạo: xem README → "Lời chúc & xác nhận tham dự". Để "" thì form vẫn hiện nhưng báo chưa kết nối.
 */
export const GUESTBOOK_API =
  "https://script.google.com/macros/s/AKfycbwso56yeV0MGzwnTtgmvrlqjIIrNDwNPN9bU0uMzp6hqWM7NsRM3rbjI_VfZXYH20el/exec";

export const MUSIC = {
  /** Đặt file mp3 vào public/music/ với đúng tên này. Thiếu file thì thiệp vẫn chạy, chỉ không có nhạc. */
  src: "/music/nang-ngoai-san.mp3",
  title: "Nắng Ngoài Sân",
};
