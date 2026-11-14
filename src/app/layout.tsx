import type { Metadata, Viewport } from "next";
import { Baloo_2, Dancing_Script, Nunito } from "next/font/google";
import { BABY } from "@/lib/content";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin", "vietnamese"], variable: "--font-nunito" });
const baloo = Baloo_2({ subsets: ["latin", "vietnamese"], variable: "--font-baloo" });
const dancing = Dancing_Script({ subsets: ["latin", "vietnamese"], variable: "--font-dancing" });

const title = `Mời dự tiệc sinh nhật bé ${BABY.nickname} 🎂`;
const description = `Bé ${BABY.nickname} tròn 1 tuổi! Gia đình trân trọng kính mời bạn đến chung vui.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "vi_VN" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#f6efe6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${nunito.variable} ${baloo.variable} ${dancing.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
