"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ShoppingBag, Search, ChevronDown } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const navItems = [
  { label: "Sản phẩm", href: "/products", hasDropdown: true },
  { label: "Thiết kế - Thi công", href: "/design" },
  { label: "Khuyến mãi", href: "/promotions", hasDropdown: true },
  { label: "Tin tức", href: "/news", hasDropdown: true },
  { label: "Về 3T Home", href: "/about" },
  { label: "Cửa hàng", href: "/stores" },
];

const Navbar = () => {
  // Quản lý modal nào đang mở: 'none' | 'login' | 'register'
  const [activeModal, setActiveModal] = useState<"none" | "login" | "register">(
    "none",
  );

  return (
    <>
      <header className="bg-white border-b border-gray-200 font-sans text-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo3t.png"
              alt="3T Home Logo"
              className="h-25 w-auto object-contain"
            />
          </Link>

          <div className="flex-grow max-w-2xl px-8">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full border border-gray-300 px-4 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
              />
              <button className="bg-gray-800 text-white px-4 py-2 border border-gray-800 rounded-r hover:bg-gray-700 transition">
                <Search size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={() => setActiveModal("login")}
              className="flex items-center space-x-2 hover:text-orange-500 transition text-left"
            >
              <User className="text-gray-600 hover:text-orange-500" size={20} />
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
                  className="text-gray-600 group-hover:text-orange-500 transition"
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

        <div className="container mx-auto px-4 py-2 border-t border-gray-200 flex items-center justify-center space-x-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center space-x-1 hover:text-orange-500 transition"
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <ChevronDown size={14} className="text-gray-400" />
              )}
            </Link>
          ))}
        </div>
      </header>

      {/* Modal Đăng nhập */}
      <LoginForm
        isOpen={activeModal === "login"}
        onClose={() => setActiveModal("none")}
        onSwitchToRegister={() => setActiveModal("register")}
      />

      {/* Modal Đăng ký */}
      <RegisterForm
        isOpen={activeModal === "register"}
        onClose={() => setActiveModal("none")}
        onSwitchToLogin={() => setActiveModal("login")}
      />
    </>
  );
};

export default Navbar;
