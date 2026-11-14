"use client";

import Image from "next/image";
import { useState } from "react";
import { BABY, INTRO_PHOTO, INVITE } from "@/lib/content";

type Props = {
  /** Gọi ngay lúc chạm — dùng để phát nhạc (trình duyệt chỉ cho phát trong lần chạm này). */
  onTap: () => void;
  /** Gọi khi animation mở thiệp xong — chuyển sang màn nội dung. */
  onDone: () => void;
};

const OPEN_MS = 1500;
const EXIT_MS = 700;

export default function Intro({ onTap, onDone }: Props) {
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    onTap();
    setTimeout(() => setExiting(true), OPEN_MS);
    setTimeout(onDone, OPEN_MS + EXIT_MS);
  };

  return (
    <main
      className={`paper-dots fixed inset-0 flex flex-col items-center justify-center gap-10 px-6 ${exiting ? "screen-exit" : ""}`}
    >
      <header className="text-center">
        <p className="font-script text-4xl text-caramel">{INVITE.title}</p>
        <h1 className="font-display text-6xl font-bold leading-tight text-cocoa">bé {BABY.nickname}</h1>
        <p className="mt-1 text-sm uppercase tracking-[0.3em] text-ink/60">tròn 1 tuổi</p>
      </header>

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Mở thiệp"
        className={`envelope cursor-pointer ${open ? "is-open" : "nudge"}`}
      >
        <span className="env-back" />
        <span className="env-card overflow-hidden shadow-md">
          <Image
            src={INTRO_PHOTO.src}
            alt={INTRO_PHOTO.alt}
            width={INTRO_PHOTO.w}
            height={INTRO_PHOTO.h}
            priority
            sizes="300px"
            className="h-full w-full rounded-md object-cover object-[50%_70%]"
          />
        </span>
        <span className="env-front" />
        <span className="env-flap" />
        <span className="env-seal grid size-16 place-items-center rounded-full bg-cocoa font-display text-3xl font-bold text-paper shadow-lg ring-4 ring-cocoa/25">
          1
        </span>
      </button>

      <p className={`text-sm text-ink/60 transition-opacity ${open ? "opacity-0" : "opacity-100"}`}>
        Chạm vào thiệp để mở 💌
      </p>
    </main>
  );
}
