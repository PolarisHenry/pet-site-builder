import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pet Site Builder - 开启你宠物的互联网小家",
  description: "为宠物定制专属的高级静态官方网站。提供RPG卡片、动态日常、云撸猫狗互动组件，极速部署至 Cloudflare Pages。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${quicksand.variable} ${inter.variable} scroll-smooth`}>
      <body className="bg-pet-bg text-pet-fg font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
