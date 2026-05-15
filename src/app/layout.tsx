import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

import { NextAuthProvider } from "@/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Cửa hàng Nội thất 3T Home",
  description: "Trang web mua sắm nội thất cao cấp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Thêm suppressHydrationWarning vào html và body để chặn lỗi từ Grammarly/Extensions
    <html lang="vi" suppressHydrationWarning>
      <body
        className="flex flex-col min-h-screen bg-gray-50"
        suppressHydrationWarning
      >
        <NextAuthProvider>
          <Navbar />
          {/* <Breadcrumb /> */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
