"use client";

import { useState } from "react";
import { BABY } from "@/lib/content";
import { LIMITS, sendWish } from "@/lib/guestbook";
import { addWish } from "@/lib/useWishes";

/** Form gửi lời chúc. Lời chúc hiển thị dạng bong bóng bay (FloatingWishes); gửi xong bay ra ngay. */
export default function Wishes() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // bẫy bot
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) return;
    setStatus("sending");
    setError("");
    try {
      await sendWish({ name: n, message: m, website });
      addWish({ name: n, message: m, time: new Date().toISOString() });
      setMessage("");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi không thành công");
      setStatus("error");
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          className="field"
          placeholder="Tên của bạn"
          value={name}
          maxLength={LIMITS.name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="relative">
          <textarea
            className="field min-h-28 resize-none pb-6"
            placeholder={`Gửi lời chúc đến bé ${BABY.nickname}...`}
            value={message}
            maxLength={LIMITS.message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <span className="absolute right-3 bottom-2.5 text-xs text-ink/40">
            {message.length}/{LIMITS.message}
          </span>
        </div>
        {/* Ô bẫy bot: người thật không thấy, bot hay tự điền */}
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
          disabled={status === "sending"}
          className="rounded-full bg-cocoa py-3 font-semibold text-paper shadow-md transition-opacity disabled:opacity-60"
        >
          {status === "sending" ? "Đang gửi..." : "Gửi lời chúc 💌"}
        </button>
        {status === "done" && <p className="text-center text-sm text-cocoa">Cảm ơn lời chúc của bạn! 💛</p>}
        {status === "error" && <p className="text-center text-sm text-red-700">{error}</p>}
      </form>
    </div>
  );
}
