"use client";

import { useEffect, useState } from "react";

/** Tham số trên link riêng cho từng khách: …/?k=Cô%20Lan */
export const GUEST_PARAM = "k";

/**
 * Tên khách lấy từ link (?k=...). "" nếu là link chung.
 * Đọc trong useEffect (không dùng useSearchParams) để trang vẫn là tĩnh hoàn toàn.
 */
export function useGuestName() {
  return plainName(useGuestRaw());
}

/** Tên khách nguyên văn từ link, giữ dấu "/" (chỗ người gửi muốn xuống dòng). */
export function useGuestRaw() {
  const [name, setName] = useState("");
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(GUEST_PARAM) ?? "";
    setName(raw.trim().slice(0, 60));
  }, []);
  return name;
}

/** Bỏ dấu "/" ngắt dòng — dùng cho câu chữ thường, form. */
export function plainName(raw: string) {
  return raw.replace(/\s*\/\s*/g, " ").trim();
}

/**
 * Các dòng hiển thị của tên: "/" là xuống dòng chủ động. Trong mỗi dòng, 2 chữ cuối được
 * dính nhau (khoảng trắng không ngắt) để không bị rơi lẻ 1 chữ xuống dòng dưới.
 */
export function guestLines(raw: string) {
  return raw
    .split("/")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/ (\S+)$/, " $1"));
}

/** Link riêng cho một khách. */
export function guestLink(origin: string, name: string) {
  const url = new URL("/", origin);
  if (name.trim()) url.searchParams.set(GUEST_PARAM, name.trim());
  return url.toString();
}
