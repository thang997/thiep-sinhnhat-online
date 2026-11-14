"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BABY } from "@/lib/content";
import Confetti from "./Confetti";
import { useBlowDetector } from "@/lib/useBlowDetector";

const Cake = dynamic(() => import("./three/Cake"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-6xl">🎂</div>,
});

/** Bánh kem 3D: chạm vào bánh (hoặc thổi vào micro) để tắt nến → pháo giấy + lời chúc mừng. */
export default function BlowCandle() {
  const [lit, setLit] = useState(true);
  const [mic, setMic] = useState(false);
  const [burst, setBurst] = useState(0);

  const blow = () => {
    if (!lit) return;
    setLit(false);
    setMic(false);
    setBurst((b) => b + 1);
  };

  const micError = useBlowDetector(mic && lit, blow);

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={blow}
        aria-label={lit ? "Chạm để thổi nến" : "Nến đã tắt"}
        className="mx-auto block h-64 w-full max-w-xs"
      >
        <Cake lit={lit} />
      </button>

      {lit ? (
        <>
          <p className="mt-2 text-sm text-ink/60">Chạm vào bánh để thổi nến cùng bé {BABY.nickname} 🕯️</p>
          <button
            type="button"
            onClick={() => setMic((m) => !m)}
            className={`btn mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ${
              mic ? "bg-cocoa text-paper ring-cocoa" : "text-cocoa ring-cocoa/30 hover:bg-cocoa hover:text-paper"
            }`}
          >
            🎤 {mic ? "Đang nghe... thổi mạnh vào micro!" : "Thổi bằng micro"}
          </button>
          {mic && micError && <p className="mt-2 text-xs text-ink/50">{micError}</p>}
        </>
      ) : (
        <>
          <p className="mt-2 font-display text-2xl font-bold text-cocoa">🎉 Bé {BABY.nickname} tròn 1 tuổi rồi!</p>
          <p className="mt-1 text-sm text-ink/60">Cảm ơn bạn đã thổi nến cùng bé 💛</p>
          <button type="button" onClick={() => setLit(true)} className="mt-3 text-sm text-ink/50 underline">
            Thắp lại nến
          </button>
        </>
      )}

      {burst > 0 && <Confetti key={burst} />}
    </div>
  );
}
