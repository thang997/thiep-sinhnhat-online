"use client";

import { useEffect, useRef, useState } from "react";

/** Nghe micro: âm lượng vượt ngưỡng liên tục ~0.25s → coi là "thổi". */
export function useBlowDetector(active: boolean, onBlow: () => void) {
  const [error, setError] = useState("");
  const cb = useRef(onBlow);
  cb.current = onBlow;

  useEffect(() => {
    if (!active) return;
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;
    let raf = 0;
    let loudFrames = 0;
    let stopped = false;

    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((s) => {
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(s).connect(analyser);
        const buf = new Uint8Array(analyser.fftSize);
        const loop = () => {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (const v of buf) sum += ((v - 128) / 128) ** 2;
          const rms = Math.sqrt(sum / buf.length);
          loudFrames = rms > 0.22 ? loudFrames + 1 : 0;
          if (loudFrames > 15) {
            cb.current();
            return;
          }
          raf = requestAnimationFrame(loop);
        };
        loop();
      })
      .catch(() => setError("Không mở được micro — bạn chạm vào bánh để thổi nến nhé."));

    if (!navigator.mediaDevices) setError("Trình duyệt không hỗ trợ micro — chạm vào bánh để thổi nến nhé.");

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close().catch(() => {});
    };
  }, [active]);

  return error;
}
