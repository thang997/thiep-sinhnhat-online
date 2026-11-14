"use client";

import { useEffect, useRef, useState } from "react";
import { timeAgo, type Wish } from "@/lib/guestbook";
import { useWishes } from "@/lib/useWishes";

const EVERY_MS = 3000; // bao lâu bay ra một lời chúc
const LIFE_MS = 8000; // mỗi bong bóng sống bao lâu (khớp animation .wish-float)

type Bubble = { id: number; wish: Wish };

/**
 * Lời chúc bay lên sát mép trái khung thiệp, luôn ở gần đáy màn hình, mờ dần — kiểu bình luận livestream.
 * Chạy vòng lặp hết danh sách; lời chúc vừa gửi bay ra ngay. Không chặn chạm/cuộn trang.
 */
export default function FloatingWishes() {
  const { wishes, latest } = useWishes();
  const [on, setOn] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextId = useRef(0);
  const cursor = useRef(0);
  const shownLatest = useRef<Wish | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const push = (wish: Wish) => {
    const id = nextId.current++;
    setBubbles((b) => [...b, { id, wish }]);
    setTimeout(() => setBubbles((b) => b.filter((x) => x.id !== id)), LIFE_MS);
  };

  // Vòng lặp: cứ EVERY_MS lại thả lời chúc kế tiếp
  useEffect(() => {
    if (!on || reduced || wishes.length === 0) return;
    // Lời chúc vừa gửi nằm ở đầu danh sách → quay về đầu để nó bay ra ngay
    if (latest && shownLatest.current !== latest) {
      shownLatest.current = latest;
      cursor.current = 0;
    }
    const tick = () => {
      push(wishes[cursor.current % wishes.length]);
      cursor.current++;
    };
    tick();
    const id = setInterval(tick, EVERY_MS);
    return () => clearInterval(id);
  }, [on, reduced, wishes, latest]);

  if (reduced || wishes.length === 0) return null;

  return (
    <>
      {/*
        Màn rộng (≥1100px): cột lời chúc nằm NGOÀI khung thiệp, sát mép trái khung (khung rộng 28rem, giữa màn).
        Điện thoại: không có chỗ ngoài khung → bong bóng nhỏ, trong hơn, chỉ bay thấp ở đáy màn hình.
      */}
      <div
        className="wish-lane pointer-events-none fixed bottom-20 left-3 z-30 h-44 w-[min(64vw,250px)] min-[1100px]:left-auto min-[1100px]:right-[calc(50%+15rem)] min-[1100px]:h-[60vh] min-[1100px]:w-[260px]"
        aria-hidden
      >
        {on &&
          bubbles.map((b) => (
            <div
              key={b.id}
              className="wish-float absolute bottom-0 left-0 max-w-full rounded-2xl rounded-bl-sm bg-paper/60 px-3 py-1.5 shadow-md ring-1 ring-sand/70 backdrop-blur-sm min-[1100px]:right-0 min-[1100px]:left-auto min-[1100px]:rounded-bl-2xl min-[1100px]:rounded-br-sm min-[1100px]:bg-paper/85 min-[1100px]:px-3.5 min-[1100px]:py-2"
            >
              <p className="flex items-baseline justify-between gap-2 text-xs">
                <span className="truncate font-bold text-cocoa">⭐ {b.wish.name}</span>
                <span className="shrink-0 text-[11px] font-semibold text-caramel">{timeAgo(b.wish.time)}</span>
              </p>
              <p className="line-clamp-2 text-[13px] leading-snug text-ink/80">{b.wish.message}</p>
            </div>
          ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setOn((v) => !v);
          setBubbles([]);
        }}
        aria-label={on ? "Tắt lời chúc bay" : "Bật lời chúc bay"}
        className={`btn fixed bottom-4 left-4 z-40 grid size-12 place-items-center rounded-full shadow-lg ring-4 ring-paper/70 transition-colors min-[1100px]:left-[calc(50%-14rem-4.5rem)] ${
          on ? "bg-cocoa text-paper" : "bg-paper text-cocoa/60"
        }`}
      >
        <svg viewBox="0 0 24 24" className="block size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.6" />
        </svg>
      </button>
    </>
  );
}
