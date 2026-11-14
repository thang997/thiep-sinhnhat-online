"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { BABY } from "@/lib/content";

/** Link chung của thiệp (bỏ ?k= tên khách) — để khách chia sẻ tiếp không mang tên mình theo. */
function publicUrl() {
  return `${window.location.origin}/`;
}

/** Nút chia sẻ thiệp (Zalo/Messenger qua menu chia sẻ của điện thoại) + mã QR để in / tải về. */
export default function Share() {
  const [qr, setQr] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showQr || qr) return;
    QRCode.toDataURL(publicUrl(), {
      width: 720,
      margin: 2,
      color: { dark: "#6b4f3a", light: "#fffaf3" },
    }).then(setQr);
  }, [showQr, qr]);

  useEffect(() => {
    if (!showQr) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowQr(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showQr]);

  const share = async () => {
    const url = publicUrl();
    const data = { title: `Sinh nhật bé ${BABY.nickname}`, text: `Mời bạn dự tiệc sinh nhật bé ${BABY.nickname} 🎂`, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // người dùng bấm huỷ → thôi
        return;
      }
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={share}
          className="btn inline-flex items-center gap-2 rounded-full bg-cocoa px-5 py-2.5 text-sm font-semibold text-paper shadow-md"
        >
          {copied ? "✓ Đã chép link" : "🔗 Chia sẻ thiệp"}
        </button>
        <button
          type="button"
          onClick={() => setShowQr(true)}
          className="btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-cocoa ring-1 ring-cocoa/30 hover:bg-cocoa hover:text-paper"
        >
          ▦ Mã QR
        </button>
      </div>

      {showQr && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mã QR thiệp mời"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-6"
          onClick={() => setShowQr(false)}
        >
          <div className="frame w-full max-w-xs p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="font-script text-2xl text-caramel">Quét để mở thiệp</p>
            <p className="font-display text-xl font-bold text-cocoa">Sinh nhật bé {BABY.nickname}</p>
            <div className="mx-auto mt-4 aspect-square w-full max-w-60 overflow-hidden rounded-2xl bg-paper">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt="Mã QR mở thiệp" className="h-full w-full" />
              ) : (
                <div className="grid h-full place-items-center text-sm text-ink/50">Đang tạo mã...</div>
              )}
            </div>
            <div className="relative mt-5 flex justify-center gap-2">
              <a
                href={qr || undefined}
                download={`thiep-thoi-noi-be-${BABY.nickname.toLowerCase()}-qr.png`}
                className="btn rounded-full bg-cocoa px-5 py-2.5 text-sm font-semibold text-paper"
              >
                Tải ảnh QR
              </a>
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="btn rounded-full px-5 py-2.5 text-sm font-semibold text-cocoa ring-1 ring-cocoa/30"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
