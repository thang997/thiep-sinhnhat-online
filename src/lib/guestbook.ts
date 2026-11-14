import { GUESTBOOK_API } from "./content";

/**
 * Lời chúc & xác nhận tham dự lưu vào Google Sheet qua Apps Script (xem apps-script/Code.gs).
 * Gửi bằng Content-Type text/plain để trình duyệt không phải gọi preflight CORS — Apps Script không hỗ trợ OPTIONS.
 */

export type Wish = { name: string; message: string; time: string };
export type RsvpInput = { name: string; attending: boolean; guests: number; note: string };

export const guestbookReady = GUESTBOOK_API.length > 0;

export const LIMITS = { name: 60, message: 500, note: 200, guests: 10 };

async function post(body: Record<string, unknown>) {
  if (!guestbookReady) throw new Error("Chưa kết nối Google Sheet");
  const res = await fetch(GUESTBOOK_API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Gửi không thành công");
  return data;
}

export async function fetchWishes(): Promise<Wish[]> {
  if (!guestbookReady) return [];
  const res = await fetch(GUESTBOOK_API, { cache: "no-store" });
  const data = await res.json();
  return Array.isArray(data?.wishes) ? data.wishes : [];
}

/** `website` là ô bẫy bot (ẩn với người thật) — có giá trị thì server bỏ qua. */
export const sendWish = (w: { name: string; message: string; website: string }) => post({ type: "wish", ...w });

export const sendRsvp = (r: RsvpInput & { website: string }) => post({ type: "rsvp", ...r });

