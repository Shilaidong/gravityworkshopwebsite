import type { Metadata } from "next";
import { Noto_Sans_SC, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "引力坊 GRAVITY FANG | 精英升学咨询",
  description:
    "引力坊教育：面向 G5、常春藤与全球顶尖硕博的升学咨询。工程与 AI 背景，精确规划，可验证结果。北京 · 杭州。",
  keywords: [
    "留学咨询",
    "G5",
    "常春藤",
    "升学规划",
    "GRAVITY FANG",
    "引力坊",
  ],
  openGraph: {
    title: "引力坊 GRAVITY FANG",
    description: "名校路径，精确规划。精英升学咨询 · 北京 · 杭州",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${sora.variable} ${noto.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
