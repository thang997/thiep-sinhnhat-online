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
      <div className="pointer-events-none fixed bottom-20 left-[max(1rem,calc(50%-13rem))] z-30 h-72 w-[min(72vw,300px)]" aria-hidden>
        {on &&
          bubbles.map((b) => (
            <div
              key={b.id}
              className="wish-float absolute bottom-0 left-0 max-w-full rounded-2xl rounded-bl-sm bg-paper/75 px-3.5 py-2 shadow-md ring-1 ring-sand/80 backdrop-blur-sm"
            >
              <p className="flex items-baseline gap-1.5 text-xs">
                <span className="truncate font-bold text-cocoa">⭐ {b.wish.name}</span>
                <span className="shrink-0 text-[11px] text-ink/45">· {timeAgo(b.wish.time)}</span>
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
        className={`fixed bottom-4 left-[max(1rem,calc(50%-13rem))] z-40 grid size-12 place-items-center rounded-full shadow-lg ring-4 ring-paper/70 transition-colors ${
          on ? "bg-cocoa text-paper" : "bg-paper text-cocoa/60"
        }`}
      >
        <span className="text-xl">💬</span>
      </button>
    </>
  );
}
