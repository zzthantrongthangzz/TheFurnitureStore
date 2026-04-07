import React from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { productCategories } from "@/data/navData";
import { promotionCategories, newsCategories } from "@/data/navData";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const navItems: NavItem[] = [
  { label: "Sản phẩm", href: "/products", hasDropdown: true },
  { label: "Thiết kế - Thi công", href: "/design" },
  { label: "Khuyến mãi", href: "/promotions", hasDropdown: true },
  { label: "Tin tức", href: "/news", hasDropdown: true },
  { label: "Về MOHO", href: "/about" },
  { label: "Cửa hàng", href: "/stores" },
];

const MohoNavbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 font-sans text-gray-800 relative z-50">
      {/* Logo, Thanh tìm kiếm, Người dùng, Giỏ hàng */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold flex items-center">
          3T
        </Link>

        <div className="flex-grow max-w-2xl px-8">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border border-gray-300 px-4 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button className="bg-gray-800 text-white px-4 py-2 border border-gray-800 rounded-r hover:bg-gray-700 transition">
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 cursor-pointer">
            <User className="text-gray-600" size={20} />
            <div className="flex flex-col">
              <span>Đăng nhập / Đăng ký</span>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">Tài khoản của tôi</span>
                <ChevronDown size={14} className="text-gray-500" />
              </div>
            </div>
          </div>

          <Link
            href="/cart"
            className="relative flex items-center space-x-2 hover:text-orange-500 transition"
          >
            <ShoppingBag className="text-gray-600" size={24} />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
            <span>Giỏ hàng</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 flex items-center justify-center space-x-8 text-sm">
        {navItems.map((item) => (
          <div key={item.label} className="group py-4 relative">
            <Link
              href={item.href}
              className={`flex items-center space-x-1 hover:text-orange-500 transition ${
                item.label === "Khuyến mãi" ? "font-medium text-red-600" : ""
              }`}
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <ChevronDown
                  size={14}
                  className="text-gray-400 group-hover:rotate-180 transition-transform duration-200"
                />
              )}
            </Link>

            {/* HIỂN THỊ DROPDOWN CHO TỪNG MỤC */}
            {item.hasDropdown && (
              <div className="absolute left-0 top-full w-56 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out border border-gray-100 z-50">
                <ul className="flex flex-col py-2">
                  {/* Logic render cho từng tab cụ thể */}
                  {(item.label === "Sản phẩm"
                    ? productCategories
                    : item.label === "Khuyến mãi"
                      ? promotionCategories
                      : item.label === "Tin tức"
                        ? newsCategories
                        : []
                  ).map((cat, idx) => (
                    <li key={idx} className="relative group/item">
                      <Link
                        href={cat.href}
                        className="flex items-center justify-between px-6 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition"
                      >
                        <span className="font-medium">{cat.title}</span>
                        {cat.items && (
                          <ChevronRight size={14} className="text-gray-400" />
                        )}
                      </Link>

                      {/* Cấp con (Cấp 2) */}
                      {cat.items && (
                        <div className="absolute left-full top-0 w-48 bg-white shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 border border-gray-100">
                          <ul className="flex flex-col py-2">
                            {cat.items.map((sub, sIdx) => (
                              <li key={sIdx}>
                                <Link
                                  href={sub.href}
                                  className="block px-6 py-2.5 text-gray-600 hover:text-orange-500 hover:bg-gray-50 text-sm"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
};

export default MohoNavbar;
