import { PARTY } from "@/lib/content";

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/** Lịch tháng của ngày tiệc (tuần bắt đầu thứ Hai), ngày tiệc đánh dấu bằng trái tim. */
export default function MonthCalendar() {
  const [y, m, d] = PARTY.start.split("T")[0].split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  // getUTCDay: 0 = CN → đổi về 0 = T2
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-3xl bg-paper shadow-sm ring-1 ring-sand">
      <div className="border-b-2 border-caramel/60 py-4 text-center font-display text-2xl font-bold text-cocoa">
        Tháng {m} / {y}
      </div>
      <div className="grid grid-cols-7 gap-y-2 px-4 pt-4 pb-5 text-center">
        {WEEK.map((w) => (
          <div key={w} className={`pb-1 text-xs font-semibold ${w === "CN" ? "text-caramel" : "text-ink/50"}`}>
            {w}
          </div>
        ))}
        {cells.map((day, i) =>
          day === d ? (
            <div key={i} className="relative mx-auto grid size-10 place-items-center" aria-label={`Ngày ${day} — ngày tiệc`}>
              <svg viewBox="0 0 24 24" className="absolute inset-0 size-10 animate-pulse fill-caramel drop-shadow" aria-hidden>
                <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
              </svg>
              <span className="relative -mt-0.5 text-sm font-bold text-paper">{day}</span>
            </div>
          ) : (
            <div key={i} className={`grid h-10 place-items-center text-sm ${day && i % 7 === 6 ? "text-caramel" : "text-ink/70"}`}>
              {day ?? ""}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
