/**
 * Lớp trang trí nền: mây và sao trôi chậm, rất mờ, nằm sau toàn bộ nội dung.
 * Cố định theo màn hình (fixed) nên cuộn tới đâu cũng có; không bắt sự kiện chạm.
 */

type Item = { kind: "cloud" | "star" | "dot"; top: string; left: string; size: number; delay: number; dur: number };

const ITEMS: Item[] = [
  { kind: "cloud", top: "8%", left: "-4%", size: 120, delay: 0, dur: 38 },
  { kind: "cloud", top: "34%", left: "78%", size: 90, delay: -12, dur: 46 },
  { kind: "cloud", top: "68%", left: "4%", size: 100, delay: -20, dur: 42 },
  { kind: "cloud", top: "86%", left: "70%", size: 80, delay: -6, dur: 50 },
  { kind: "star", top: "14%", left: "84%", size: 18, delay: 0, dur: 4 },
  { kind: "star", top: "26%", left: "10%", size: 14, delay: -1.5, dur: 5 },
  { kind: "star", top: "50%", left: "92%", size: 16, delay: -3, dur: 4.5 },
  { kind: "star", top: "58%", left: "6%", size: 12, delay: -2, dur: 3.5 },
  { kind: "star", top: "78%", left: "88%", size: 14, delay: -0.5, dur: 5.5 },
  { kind: "star", top: "92%", left: "16%", size: 16, delay: -2.5, dur: 4 },
  { kind: "dot", top: "20%", left: "46%", size: 8, delay: -1, dur: 6 },
  { kind: "dot", top: "44%", left: "20%", size: 6, delay: -3, dur: 7 },
  { kind: "dot", top: "72%", left: "60%", size: 7, delay: -2, dur: 6.5 },
];

function Cloud({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 36" width={size} height={(size * 36) / 64} aria-hidden>
      <path
        d="M16 34h34a12 12 0 0 0 1-24 16 16 0 0 0-30-2A11 11 0 0 0 16 34z"
        fill="var(--paper)"
        stroke="var(--caramel)"
        strokeOpacity="0.25"
      />
    </svg>
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M12 1.5l2.6 7.2 7.4.3-5.8 4.6 2 7.3L12 16.7 5.8 20.9l2-7.3L2 9l7.4-.3z" fill="var(--caramel)" fillOpacity="0.55" />
    </svg>
  );
}

export default function Decor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className={`absolute ${it.kind === "cloud" ? "decor-drift" : "decor-twinkle"}`}
          style={{ top: it.top, left: it.left, animationDelay: `${it.delay}s`, animationDuration: `${it.dur}s` }}
        >
          {it.kind === "cloud" && <Cloud size={it.size} />}
          {it.kind === "star" && <Star size={it.size} />}
          {it.kind === "dot" && (
            <span className="block rounded-full bg-mist/50" style={{ width: it.size, height: it.size }} />
          )}
        </span>
      ))}
    </div>
  );
}
