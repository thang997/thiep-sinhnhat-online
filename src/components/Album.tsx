"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/content";
import Reveal from "./Reveal";

const AUTOPLAY_MS = 3500;

/**
 * Album tự lướt: ảnh tự chuyển, vuốt/nút để chuyển tay, chấm chỉ vị trí.
 * Chạm vào ảnh → xem lớn (lightbox). Tạm dừng khi rê chuột vào hoặc đang xem lớn.
 */
export default function Album({ photos }: { photos: Photo[] }) {
  const n = photos.length;
  const [slide, setSlide] = useState(0);
  const [hover, setHover] = useState(false);
  const [slideTouchX, setSlideTouchX] = useState<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  const go = useCallback((d: number) => setSlide((s) => (s + d + n) % n), [n]);

  // Hẹn giờ đặt lại sau mỗi lần đổi ảnh → chuyển tay xong vẫn đủ 3.5s mới tự lướt tiếp.
  useEffect(() => {
    if (hover || index !== null || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [slide, hover, index, n, go]);

  // Đóng xem lớn → slideshow nhảy tới đúng ảnh vừa xem.
  const close = useCallback(() => {
    if (index !== null) setSlide(index);
    setIndex(null);
  }, [index]);
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
      <Reveal>
        <div
          className="relative overflow-hidden rounded-3xl bg-sand shadow-lg ring-4 ring-paper"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTouchStart={(e) => setSlideTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (slideTouchX === null) return;
            const dx = e.changedTouches[0].clientX - slideTouchX;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            setSlideTouchX(null);
          }}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Xem ảnh lớn: ${p.alt}`}
                aria-hidden={i !== slide}
                tabIndex={i === slide ? 0 : -1}
                className="relative aspect-[4/5] w-full shrink-0 overflow-hidden"
              >
                {/* Nền: chính ảnh đó làm mờ — để ảnh ngang/dọc đều hiện trọn mà không bị viền trống */}
                <Image src={p.src} alt="" fill loading="eager" sizes="200px" className="scale-110 object-cover opacity-70 blur-2xl" />
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  loading="eager"
                  sizes="(max-width: 480px) 100vw, 448px"
                  className="object-contain"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-paper/70 text-xl text-cocoa shadow"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Ảnh sau"
            onClick={() => go(1)}
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-paper/70 text-xl text-cocoa shadow"
          >
            ›
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-label={`Ảnh ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === slide ? "w-6 bg-cocoa" : "w-2 bg-caramel/40"}`}
            />
          ))}
        </div>
      </Reveal>

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
