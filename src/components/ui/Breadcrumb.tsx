"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const routeDictionary: Record<string, string> = {
  // Map cho các URL tiếng Anh
  products: "Sản phẩm",
  collections: "Bộ sưu tập",
  promotions: "Khuyến mãi",
  "brand-day": "Brand Day",
  outlet: "3T Outlet - Hàng Thanh Lý",
  news: "Tin tức",
  about: "Về 3T Home",
  stores: "Cửa hàng",
  cart: "Giỏ hàng",

  // Map cho các URL tiếng Việt không dấu
  "san-pham": "Sản phẩm",
  "bo-suu-tap": "Bộ sưu tập",
  "phong-khach": "Phòng khách",
  sofa: "Sofa",
  "ban-tra": "Bàn trà",
  "phong-ngu": "Phòng ngủ",
  combo: "Combo",
  "tu-quan-ao": "Tủ quần áo",
  "giuong-ngu": "Giường ngủ",
  "tu-dau-giuong": "Tủ đầu giường",
  "ban-trang-diem": "Bàn trang điểm",
  "phong-an": "Phòng ăn",
  "ban-an": "Bàn ăn",
  "ghe-an": "Ghế ăn",
  "bo-ban-an": "Bộ bàn ăn",
  "phong-lam-viec": "Phòng làm việc",
  "tu-bep": "Tủ bếp",
  nem: "Nệm",
  "thiet-ke-thi-cong": "Thiết kế - Thi công",
  "tin-tuc": "Tin tức",
  media: "Media",
  "cua-hang": "Cửa hàng",
};

export default function Breadcrumb() {
  // Lấy đường dẫn hiện tại
  const pathname = usePathname();

  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <div className="w-full bg-white border-b border-gray-100 z-30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex text-sm text-gray-500 py-3 space-x-2 items-center overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-orange-500 transition">
            Trang chủ
          </Link>

          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;

            const label =
              routeDictionary[segment] || segment.replace(/-/g, " ");

            return (
              <React.Fragment key={href}>
                <ChevronRight size={14} className="text-gray-400 shrink-0" />
                {isLast ? (
                  <span className="text-gray-900 font-medium capitalize">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="hover:text-orange-500 transition capitalize"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
