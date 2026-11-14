"use client";

import { useEffect, useState } from "react";

/** Tham số trên link riêng cho từng khách: …/?k=Cô%20Lan */
export const GUEST_PARAM = "k";

/**
 * Tên khách lấy từ link (?k=...). "" nếu là link chung.
 * Đọc trong useEffect (không dùng useSearchParams) để trang vẫn là tĩnh hoàn toàn.
 */
export function useGuestName() {
  const [name, setName] = useState("");
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(GUEST_PARAM) ?? "";
    setName(raw.trim().slice(0, 60));
  }, []);
  return name;
}

/** Link riêng cho một khách. */
export function guestLink(origin: string, name: string) {
  const url = new URL("/", origin);
  if (name.trim()) url.searchParams.set(GUEST_PARAM, name.trim());
  return url.toString();
}
