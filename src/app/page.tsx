"use client";

import { useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import Intro from "@/components/Intro";
import Invitation from "@/components/Invitation";
import MusicToggle from "@/components/MusicToggle";
import { MUSIC } from "@/lib/content";

/**
 * Một URL, hai màn: mở thiệp → nội dung.
 * Nhạc được tạo và phát trong chính lần chạm mở thiệp (trình duyệt chặn tự phát nếu không có thao tác).
 */
export default function Page() {
  const [screen, setScreen] = useState<"intro" | "content">("intro");
  const [burst, setBurst] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const startMusic = () => {
    const a = new Audio(MUSIC.src);
    a.loop = true;
    a.volume = 0.7;
    a.addEventListener("playing", () => (setHasMusic(true), setPlaying(true)));
    a.addEventListener("pause", () => setPlaying(false));
    // Thiếu file nhạc → không hiện nút, thiệp vẫn chạy bình thường.
    a.addEventListener("error", () => setHasMusic(false));
    audio.current = a;
    a.play().catch(() => {});
  };

  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <>
      {screen === "intro" ? (
        <Intro
          onTap={() => {
            startMusic();
            setBurst(true);
          }}
          onDone={() => {
            window.scrollTo(0, 0);
            setScreen("content");
          }}
        />
      ) : (
        <Invitation />
      )}
      {burst && <Confetti />}
      {hasMusic && <MusicToggle playing={playing} onToggle={toggleMusic} title={MUSIC.title} />}
    </>
  );
}
