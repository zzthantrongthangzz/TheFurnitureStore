"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import {
  productCategories,
  promotionCategories,
  newsCategories,
} from "@/data/navData";

const navItems = [
  { label: "Sản phẩm", href: "/products", hasDropdown: true },
  { label: "Thiết kế - Thi công", href: "/design" },
  { label: "Khuyến mãi", href: "/promotions", hasDropdown: true },
  { label: "Tin tức", href: "/news", hasDropdown: true },
  { label: "Về 3T Home", href: "/about" },
  { label: "Cửa hàng", href: "/stores" },
];

const Navbar = () => {
  const [activeModal, setActiveModal] = useState<"none" | "login" | "register">(
    "none",
  );

  return (
    <>
      <header className="bg-[#FDFBF7] border-b border-gray-200 font-sans text-gray-800 relative z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo3t.png"
              alt="3T Home Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>

          <div className="flex-grow max-w-xl px-8">
            <div className="flex items-stretch shadow-sm">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full border border-gray-300 px-5 py-1.5 rounded-l-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white text-base"
              />
              <button className="bg-gray-800 text-white px-7 flex items-center justify-center border border-gray-800 rounded-r-md hover:bg-gray-700 transition duration-200">
                <Search size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={() => setActiveModal("login")}
              className="flex items-center space-x-2 hover:text-orange-500 transition text-left group"
            >
              <User
                className="text-gray-600 group-hover:text-orange-500"
                size={20}
              />
              <div className="flex flex-col">
                <span>Đăng nhập / Đăng ký</span>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">Tài khoản của tôi</span>
                  <ChevronDown size={14} className="text-gray-500" />
                </div>
              </div>
            </button>

            <Link
              href="/cart"
              className="flex items-center space-x-2 hover:text-orange-500 transition group"
            >
              <div className="relative">
                <ShoppingBag
                  className="text-gray-600 group-hover:text-orange-500"
                  size={24}
                />
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </div>
              <span>Giỏ hàng</span>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 flex items-center justify-center space-x-8 text-sm border-t border-gray-100">
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

              {item.hasDropdown && (
                <div className="absolute left-0 top-full w-56 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out border border-gray-100 z-50">
                  <ul className="flex flex-col py-2">
                    {(item.label === "Sản phẩm"
                      ? productCategories
                      : item.label === "Khuyến mãi"
                        ? promotionCategories
                        : item.label === "Tin tức"
                          ? newsCategories
                          : []
                    ).map((cat: any, idx: number) => (
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

                        {cat.items && (
                          <div className="absolute left-full top-0 w-48 bg-white shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 border border-gray-100">
                            <ul className="flex flex-col py-2">
                              {cat.items.map((sub: any, sIdx: number) => (
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

      <LoginForm
        isOpen={activeModal === "login"}
        onClose={() => setActiveModal("none")}
        onSwitchToRegister={() => setActiveModal("register")}
      />

      <RegisterForm
        isOpen={activeModal === "register"}
        onClose={() => setActiveModal("none")}
        onSwitchToLogin={() => setActiveModal("login")}
      />
    </>
  );
};

export default Navbar;
