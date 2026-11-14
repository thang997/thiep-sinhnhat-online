import { BABY, PARTY } from "./content";

/** Tách "YYYY-MM-DDTHH:mm" (giờ Việt Nam) thành các phần — không phụ thuộc múi giờ máy người xem. */
function parts(s: string) {
  const [d, t = "00:00"] = s.split("T");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi] = t.split(":").map(Number);
  return { y, mo, da, h, mi };
}

const WEEKDAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Mốc thời gian (ms) của một giờ Việt Nam (UTC+7). */
export function vnTime(s: string) {
  const { y, mo, da, h, mi } = parts(s);
  return Date.UTC(y, mo - 1, da, h - 7, mi);
}

export function formatParty() {
  const s = parts(PARTY.start);
  return {
    weekday: WEEKDAYS[new Date(Date.UTC(s.y, s.mo - 1, s.da)).getUTCDay()],
    day: pad(s.da),
    month: pad(s.mo),
    year: String(s.y),
    time: `${pad(s.h)}:${pad(s.mi)}`,
  };
}

export function mapsUrl() {
  return (
    PARTY.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${PARTY.venueName}, ${PARTY.address}`)}`
  );
}

/** Link "Thêm vào Google Calendar" — giờ địa phương kèm ctz nên đúng với mọi máy. */
export function calendarUrl() {
  const fmt = (x: string) => {
    const p = parts(x);
    return `${p.y}${pad(p.mo)}${pad(p.da)}T${pad(p.h)}${pad(p.mi)}00`;
  };
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `Tiệc thôi nôi bé ${BABY.nickname}`,
    dates: `${fmt(PARTY.start)}/${fmt(PARTY.end)}`,
    ctz: "Asia/Ho_Chi_Minh",
    location: `${PARTY.venueName}, ${PARTY.address}`,
    details: `Mời bạn đến chung vui ngày bé ${BABY.nickname} tròn 1 tuổi!`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}
