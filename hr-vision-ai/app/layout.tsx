import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HR Vision AI | 生成式 AI HR 戰略顧問",
  description:
    "15+ 年資深 HRBP 經驗 x 生成式 AI 賦能：即時 AI HR 戰略診斷，涵蓋人才、合規、文化、招聘自動化等 9 大領域。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={inter.variable}>
      <body className="font-sans antialiased bg-canvas text-ink">{children}</body>
    </html>
  );
}
