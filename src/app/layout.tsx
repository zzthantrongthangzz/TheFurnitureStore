import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar"; // Import Navbar
import Footer from "@/components/ui/Footer"; // Import Footer
import Breadcrumb from "@/components/ui/Breadcrumb";

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
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <Breadcrumb />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
