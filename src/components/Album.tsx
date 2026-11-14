"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/content";
import Reveal from "./Reveal";

/** Lưới ảnh 2 cột kiểu "masonry"; chạm vào ảnh để xem lớn, vuốt/nút để chuyển ảnh. */
export default function Album({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <div className="columns-2 gap-3">
        {photos.map((p, i) => (
          <Reveal key={p.src} delay={(i % 2) * 80} className="mb-3 break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full overflow-hidden rounded-2xl bg-sand shadow-sm"
              aria-label={`Xem ảnh: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                sizes="(max-width: 640px) 50vw, 300px"
                className="h-auto w-full transition-transform duration-500 hover:scale-105"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          onClick={close}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            setTouchX(null);
          }}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.w}
            height={current.h}
            sizes="100vw"
            className="screen-enter max-h-[85vh] w-auto rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" aria-label="Đóng" onClick={close} className="absolute top-4 right-4 size-10 rounded-full bg-paper/15 text-2xl text-paper">
            ×
          </button>
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={(e) => (e.stopPropagation(), step(-1))}
            className="absolute left-2 size-10 rounded-full bg-paper/15 text-2xl text-paper"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Ảnh sau"
            onClick={(e) => (e.stopPropagation(), step(1))}
            className="absolute right-2 size-10 rounded-full bg-paper/15 text-2xl text-paper"
          >
            ›
          </button>
          <p className="absolute bottom-4 text-sm text-paper/70">
            {index! + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  );
}
