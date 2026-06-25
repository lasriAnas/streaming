import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "StreamVault — Watch Movies & TV Shows",
  description: "Stream thousands of movies and TV shows. Powered by IMDB ratings.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "StreamVault",
    description: "Your streaming destination — explore top-rated movies and shows.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#0e1520] text-white">
        <div className="flex flex-col min-h-screen">
          <TopBar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
