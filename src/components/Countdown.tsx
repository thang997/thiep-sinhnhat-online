"use client";

import { useEffect, useState } from "react";
import { PARTY } from "@/lib/content";
import { vnTime } from "@/lib/party";

/** Đếm ngược tới giờ tiệc. Qua giờ rồi thì hiện lời cảm ơn. */
export default function Countdown() {
  const target = vnTime(PARTY.start);
  // null tới khi chạy trên trình duyệt — tránh lệch giờ giữa server và client.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return <div className="h-[68px]" />;

  const left = target - now;
  if (left <= 0) {
    return <p className="font-script text-2xl text-caramel">Cảm ơn mọi người đã đến chung vui! 💛</p>;
  }

  const units = [
    { v: Math.floor(left / 86_400_000), label: "ngày" },
    { v: Math.floor(left / 3_600_000) % 24, label: "giờ" },
    { v: Math.floor(left / 60_000) % 60, label: "phút" },
    { v: Math.floor(left / 1000) % 60, label: "giây" },
  ];

  return (
    <div className="flex justify-center gap-2.5">
      {units.map((u) => (
        <div key={u.label} className="w-16 rounded-2xl bg-paper py-2.5 text-center shadow-sm ring-1 ring-sand">
          <div className="font-display text-2xl font-bold tabular-nums text-cocoa">{String(u.v).padStart(2, "0")}</div>
          <div className="text-[11px] uppercase tracking-wider text-ink/50">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
