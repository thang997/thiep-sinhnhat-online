"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { BABY, HERO_PHOTO, INVITE, PARTY, PHOTOS } from "@/lib/content";
import { useGuestName } from "@/lib/guest";
import { calendarUrl, formatParty, mapEmbedUrl, mapsUrl } from "@/lib/party";
import Album from "./Album";
import BlowCandle from "./BlowCandle";
import Countdown from "./Countdown";
import Decor from "./Decor";
import FloatingWishes from "./FloatingWishes";
import MonthCalendar from "./MonthCalendar";
import Reveal from "./Reveal";
import Rsvp from "./Rsvp";
import Share from "./Share";
import Wishes from "./Wishes";

// Three.js chỉ chạy phía client — tải sau để màn nội dung hiện ngay.
const Balloons = dynamic(() => import("./three/Balloons"), { ssr: false });

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6 text-center">
      <p className="font-script text-2xl text-caramel">{kicker}</p>
      <h2 className="font-display text-3xl font-bold text-cocoa">{title}</h2>
    </div>
  );
}

/** Hoa văn ngăn cách các mục trong khung. */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 text-caramel/60" aria-hidden>
      <span className="h-px w-16 bg-caramel/30" />
      <span className="text-sm">✦</span>
      <span className="h-px w-16 bg-caramel/30" />
    </div>
  );
}

export default function Invitation() {
  const d = formatParty();
  const guest = useGuestName();

  return (
    <main className="screen-enter paper-dots min-h-dvh">
      <Decor />
      <FloatingWishes />
      {/* ---------- Hero ---------- */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-10 pb-16 text-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Balloons />
        </div>

        <div className="relative">
          <p className="font-script text-4xl text-caramel">{INVITE.title}</p>
          <h1 className="font-display text-6xl leading-tight font-bold text-cocoa">bé {BABY.nickname}</h1>
          {BABY.fullName && <p className="mt-1 text-base text-ink/70">{BABY.fullName}</p>}
        </div>

        <div className="relative mt-6 w-[min(72vw,300px)] overflow-hidden rounded-t-full border-[6px] border-paper bg-sand shadow-xl">
          <Image
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            width={HERO_PHOTO.w}
            height={HERO_PHOTO.h}
            priority
            sizes="300px"
            className="aspect-[3/4] h-auto w-full object-cover object-[50%_75%]"
          />
        </div>

        <p className="relative mt-6 font-display text-2xl font-semibold text-cocoa">
          tròn <span className="text-4xl text-caramel">1</span> tuổi
        </p>

        <div className="scroll-hint absolute bottom-5 text-sm text-ink/50" aria-hidden>
          ⌄ Cuộn xuống
        </div>
      </section>

      {/* Khung "tờ thiệp": toàn bộ nội dung từ lời mời trở xuống nằm trong một tấm giấy viền đôi */}
      <div className="relative px-3 pb-24">
        <div className="frame mx-auto max-w-md">
          <div className="flex flex-col gap-14 px-5 py-12">
        {/* ---------- Lời mời ---------- */}
        <Reveal as="section" className="text-center">
          <SectionTitle kicker={INVITE.greeting} title={guest || "Bạn đến chung vui"} />
          {guest && <p className="-mt-3 mb-5 text-sm tracking-wide text-ink/60">đến dự bữa tiệc nho nhỏ</p>}
          <p className="leading-relaxed text-ink/80">{INVITE.message}</p>
        </Reveal>

        <Divider />

        {/* ---------- Thời gian ---------- */}
        <Reveal as="section" className="text-center">
          <SectionTitle kicker="Thời gian" title={`${d.time} · ${d.weekday}`} />
          <div className="mx-auto flex w-fit items-center gap-5 rounded-3xl bg-paper px-7 py-5 shadow-sm ring-1 ring-sand">
            <span className="text-sm uppercase tracking-widest text-ink/60">Tháng {d.month}</span>
            <span className="border-x border-sand px-5 font-display text-6xl font-bold text-caramel">{d.day}</span>
            <span className="text-sm uppercase tracking-widest text-ink/60">Năm {d.year}</span>
          </div>
          {PARTY.lunar && <p className="mt-3 text-sm text-ink/60 italic">({PARTY.lunar})</p>}
          <div className="mt-6">
            <MonthCalendar />
          </div>
          <div className="mt-6">
            <Countdown />
          </div>
          <a
            href={calendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-6 inline-flex items-center gap-2 rounded-full border border-cocoa/30 px-5 py-2.5 text-sm font-semibold text-cocoa hover:bg-cocoa hover:text-paper"
          >
            🗓️ Thêm vào lịch
          </a>
        </Reveal>

        <Divider />

        {/* ---------- Địa điểm ---------- */}
        <Reveal as="section" className="text-center">
          <SectionTitle kicker="Địa điểm" title={PARTY.venueName} />
          <p className="text-ink/80">📍 {PARTY.address}</p>
          {PARTY.landmark && <p className="mt-1 text-sm text-ink/55">({PARTY.landmark})</p>}
          <div className="mt-5 overflow-hidden rounded-3xl bg-sand shadow-sm ring-4 ring-paper">
            <iframe
              src={mapEmbedUrl()}
              title={`Bản đồ ${PARTY.venueName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-60 w-full border-0"
            />
          </div>
          <a
            href={mapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-5 inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-3 font-semibold text-paper shadow-md"
          >
            Chỉ đường
          </a>
        </Reveal>

        <Divider />

        {/* ---------- Album ---------- */}
        <section>
          <Reveal>
            <SectionTitle kicker="Khoảnh khắc" title={`Bé ${BABY.nickname} 1 tuổi`} />
          </Reveal>
          <Album photos={PHOTOS} />
        </section>

        <Divider />

        {/* ---------- Lời chúc ---------- */}
        <Reveal as="section">
          <SectionTitle kicker="Gửi yêu thương" title="Lời chúc từ khách mời" />
          <Wishes />
        </Reveal>

        <Divider />

        {/* ---------- Xác nhận tham dự ---------- */}
        <Reveal as="section">
          <SectionTitle kicker="Hồi âm" title="Xác nhận tham dự" />
          <Rsvp />
        </Reveal>

        <Divider />

        {/* ---------- Thổi nến ---------- */}
        <Reveal as="section">
          <SectionTitle kicker="Ước một điều ước" title="Thổi nến cùng bé" />
          <BlowCandle />
        </Reveal>

        <Divider />

        {/* ---------- Lời kết ---------- */}
        <Reveal as="section" className="text-center">
          <p className="font-display text-2xl font-semibold text-cocoa">Rất hân hạnh được đón tiếp!</p>
          <p className="mt-4 font-script text-3xl text-caramel">{INVITE.signature}</p>
          <div className="mt-8">
            <Share />
          </div>
        </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
