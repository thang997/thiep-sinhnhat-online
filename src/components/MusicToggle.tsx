"use client";

type Props = { playing: boolean; onToggle: () => void; title: string };

/**
 * Nút đĩa nhạc cố định ở góc phải — đĩa quay khi đang phát.
 * Dùng SVG thay emoji: emoji không nằm đúng tâm nên khi quay bị lắc/lệch.
 */
export default function MusicToggle({ playing, onToggle, title }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? `Tắt nhạc (${title})` : `Bật nhạc (${title})`}
      title={title}
      className="fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full bg-cocoa text-paper shadow-lg ring-4 ring-paper/70 min-[1100px]:right-[calc(50%-14rem-4.5rem)]"
    >
      {playing ? (
        <svg viewBox="0 0 24 24" className="spin-slow block size-7" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="var(--cocoa)" strokeOpacity="0.35" />
          <circle cx="12" cy="12" r="4" fill="var(--caramel)" />
          <circle cx="12" cy="12" r="1.2" fill="var(--cocoa)" />
          <path d="M5.5 8.5a7.5 7.5 0 0 1 3-3" fill="none" stroke="var(--cocoa)" strokeOpacity="0.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="block size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
          <path d="M3 3l18 18" />
        </svg>
      )}
    </button>
  );
}
