import type { Metadata } from "next";
import { Archivo, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

/**
 * Display face needs 800–900 to match the reference frames; Sora tops out
 * too light and reads as a generic product site at headline sizes.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "引力坊 GRAVITY FANG | Elite Admissions + Systems",
  description:
    "顶尖升学咨询，配上自研 Terra 规划系统。顾问判断，系统执行。北京 · 杭州。",
  openGraph: {
    title: "引力坊 GRAVITY FANG",
    description: "名校路径，精确规划。咨询 × 自研系统。",
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
    <html
      lang="zh-CN"
      className={`${archivo.variable} ${noto.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
