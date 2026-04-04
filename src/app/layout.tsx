import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/giaodienchung/Navbar"; // Import Navbar
import Footer from "@/components/giaodienchung/Footer"; // Import Footer

export const metadata: Metadata = {
  title: "Cửa hàng Nội thất MộcHouse",
  description: "Trang web mua sắm nội thất cao cấp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        {/* Phần nội dung của từng trang sẽ hiển thị ở thẻ main này */}
        <main className="flex-grow"> 
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}