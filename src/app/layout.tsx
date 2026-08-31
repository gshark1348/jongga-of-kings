import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/components/game-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
});

export const metadata: Metadata = {
  title: "종가의 제왕",
  description: "뉴스를 읽고 시장을 예측하는 주식 동아리 레크리에이션 게임",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><GameProvider>{children}</GameProvider></body>
    </html>
  );
}
