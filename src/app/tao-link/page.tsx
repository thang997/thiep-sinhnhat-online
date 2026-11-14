"use client";

import { useEffect, useMemo, useState } from "react";
import { BABY } from "@/lib/content";
import { guestLink } from "@/lib/guest";

const STORAGE_KEY = "guest-names";

/**
 * Trang cho chủ tiệc: nhập danh sách khách (mỗi dòng một người) → mỗi người một link riêng,
 * mở ra thiệp ghi "Trân trọng kính mời <tên>". Danh sách lưu tạm trong trình duyệt của bạn.
 */
export default function TaoLink() {
  const [names, setNames] = useState("");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    setNames(localStorage.getItem(STORAGE_KEY) ?? "");
  }, []);

  useEffect(() => {
    if (origin) localStorage.setItem(STORAGE_KEY, names);
  }, [names, origin]);

  const links = useMemo(
    () =>
      names
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean)
        .map((n) => ({ name: n, url: origin ? guestLink(origin, n) : "" })),
    [names, origin],
  );

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const message = (l: { name: string; url: string }) =>
    `Kính mời ${l.name} đến dự tiệc sinh nhật bé ${BABY.nickname} 🎂\n${l.url}`;

  return (
    <main className="paper-dots min-h-dvh px-4 py-10">
      <div className="frame mx-auto max-w-lg px-6 py-10">
        <p className="text-center font-script text-2xl text-caramel">Dành cho bố mẹ bé {BABY.nickname}</p>
        <h1 className="text-center font-display text-3xl font-bold text-cocoa">Tạo link mời riêng</h1>
        <p className="mt-3 text-center text-sm text-ink/60">
          Mỗi dòng một khách. Mỗi người nhận một link riêng, mở ra thiệp ghi “Trân trọng kính mời …” kèm tên họ.
        </p>

        <textarea
          className="field mt-6 min-h-40"
          placeholder={"Cô Lan\nAnh Minh & chị Hoa\nGia đình chú Tuấn"}
          value={names}
          onChange={(e) => setNames(e.target.value)}
        />

        {links.length > 0 && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-cocoa">{links.length} link</p>
              <button
                type="button"
                onClick={() => copy(links.map(message).join("\n\n"), "all")}
                className="btn rounded-full bg-cocoa px-4 py-2 text-sm font-semibold text-paper"
              >
                {copied === "all" ? "✓ Đã chép tất cả" : "Chép tất cả (kèm lời mời)"}
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {links.map((l, i) => (
                <li key={`${l.name}-${i}`} className="flex items-center gap-2 rounded-2xl bg-cream px-3 py-2.5 ring-1 ring-sand">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-cocoa">{l.name}</p>
                    <p className="truncate text-xs text-ink/50">{l.url}</p>
                  </div>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="btn shrink-0 rounded-full px-3 py-1.5 text-xs text-cocoa ring-1 ring-sand">
                    Xem
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(message(l), `m${i}`)}
                    className="btn shrink-0 rounded-full bg-cocoa px-3 py-1.5 text-xs font-semibold text-paper"
                  >
                    {copied === `m${i}` ? "✓ Đã chép" : "Chép"}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
