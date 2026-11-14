"use client";

import { useState } from "react";
import { LIMITS, sendRsvp } from "@/lib/guestbook";

/** Form xác nhận tham dự. Kết quả chỉ lưu vào Google Sheet của chủ tiệc, không hiện công khai. */
export default function Rsvp() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // bẫy bot
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || attending === null) return;
    setStatus("sending");
    setError("");
    try {
      await sendRsvp({ name: name.trim(), attending, guests: attending ? guests : 0, note: note.trim(), website });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi không thành công");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-cream px-5 py-6 text-center ring-1 ring-sand">
        <p className="text-3xl">{attending ? "🎉" : "💛"}</p>
        <p className="mt-2 font-semibold text-cocoa">
          {attending ? `Cảm ơn ${name.trim()}! Hẹn gặp bạn tại tiệc nhé.` : `Cảm ơn ${name.trim()} đã báo, hẹn gặp bạn dịp khác nhé!`}
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-3 text-sm text-ink/50 underline">
          Gửi lại
        </button>
      </div>
    );
  }

  const choice = (value: boolean, label: string) => (
    <button
      type="button"
      onClick={() => setAttending(value)}
      aria-pressed={attending === value}
      className={`btn rounded-2xl px-3 py-3 text-sm font-semibold ring-1 transition-colors ${
        attending === value ? "bg-cocoa text-paper ring-cocoa" : "bg-cream text-cocoa ring-sand hover:ring-caramel"
      }`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        className="field"
        placeholder="Tên của bạn"
        value={name}
        maxLength={LIMITS.name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-2">
        {choice(true, "Tôi sẽ tham dự 🥳")}
        {choice(false, "Rất tiếc, tôi không đến được")}
      </div>
      {attending && (
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-2.5 ring-1 ring-sand">
          <span className="text-sm text-ink/70">Số người đi cùng (cả bạn)</span>
          <span className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Bớt"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="btn size-8 rounded-full bg-paper text-lg text-cocoa ring-1 ring-sand"
            >
              −
            </button>
            <span className="w-6 text-center font-display text-xl font-bold text-cocoa tabular-nums">{guests}</span>
            <button
              type="button"
              aria-label="Thêm"
              onClick={() => setGuests((g) => Math.min(LIMITS.guests, g + 1))}
              className="btn size-8 rounded-full bg-paper text-lg text-cocoa ring-1 ring-sand"
            >
              +
            </button>
          </span>
        </label>
      )}
      <input
        className="field"
        placeholder="Ghi chú (không bắt buộc)"
        value={note}
        maxLength={LIMITS.note}
        onChange={(e) => setNote(e.target.value)}
      />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <button
        type="submit"
        disabled={status === "sending" || attending === null}
        className="btn rounded-full bg-cocoa py-3 font-semibold text-paper shadow-md transition-opacity disabled:opacity-50"
      >
        {status === "sending" ? "Đang gửi..." : "Gửi xác nhận"}
      </button>
      {status === "error" && <p className="text-center text-sm text-red-700">{error}</p>}
    </form>
  );
}
