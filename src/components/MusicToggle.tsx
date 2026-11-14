"use client";

type Props = { playing: boolean; onToggle: () => void; title: string };

/** Nút đĩa nhạc cố định ở góc — quay khi đang phát. */
export default function MusicToggle({ playing, onToggle, title }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? `Tắt nhạc (${title})` : `Bật nhạc (${title})`}
      title={title}
      className="fixed right-[max(1rem,calc(50%-13rem))] bottom-4 z-40 grid size-12 place-items-center rounded-full bg-cocoa text-paper shadow-lg ring-4 ring-paper/70"
    >
      <span className={`text-xl ${playing ? "spin-slow" : ""}`}>{playing ? "💿" : "🔇"}</span>
    </button>
  );
}
