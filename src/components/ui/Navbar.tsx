"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  MenuItem,
  SubItem,
} from "@/data/navData";

// Store giỏ hàng (Đã cập nhật để không dùng LocalStorage)
import { useCart } from "@/hooks/useCart";

const navItems = [
  { label: "Sản phẩm", href: "/products", hasDropdown: true },
  { label: "Thiết kế - Thi công", href: "/design" },
  { label: "Khuyến mãi", href: "/promotions", hasDropdown: true },
  { label: "Tin tức", href: "/news", hasDropdown: true },
  { label: "Về 3T Home", href: "/about" },
  { label: "Cửa hàng", href: "/cua-hang" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeModal, setActiveModal] = useState<"none" | "login" | "register">(
    "none",
  );

  // --- LOGIC GIỎ HÀNG TỪ DATABASE ---
  const cartItems = useCart((state) => state.items);
  const setCartItems = useCart((state) => state.setItems);

  // Kéo dữ liệu giỏ hàng từ DB khi user đăng nhập thành công
  useEffect(() => {
    const fetchCart = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            if (data && data.items) {
              setCartItems(data.items);
            }
          }
        } catch (error) {
          console.error("Lỗi khi tải giỏ hàng:", error);
        }
      } else {
        // Xóa giỏ hàng trên UI nếu khách chưa đăng nhập/đăng xuất
        setCartItems([]);
      }
    };

    fetchCart();
  }, [session, setCartItems]);

  const displayCartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  // --------------------------------------

  return (
    <>
      <header className="bg-[#FDFBF7] border-b border-gray-200 font-sans text-gray-800 relative z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo3t.png"
              alt="3T Home Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>

          {/* Search Bar */}
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

          {/* User Actions & Cart */}
          <div className="flex items-center space-x-6 text-sm">
            {/* THÊM NÚT ADMIN: Chỉ hiện khi đăng nhập và có role là admin */}
            {session?.user?.role === "admin" && (
              <Link 
                href="/admin/products/add" 
                className="text-orange-600 font-bold hover:underline bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200"
              >
                Trang Quản Trị
              </Link>
            )}
            {session ? (
              // NẾU ĐÃ ĐĂNG NHẬP: Hiển thị tên (Đã kéo dài độ rộng)
              <div className="relative group">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 hover:text-orange-500 transition text-left"
                >
                  <User
                    className="text-gray-600 group-hover:text-orange-500"
                    size={20}
                  />
                  <div className="flex flex-col">
                    {/* Đã tăng max-w-[250px] để tên hiển thị dài hơn */}
                    <span className="text-orange-600 font-bold line-clamp-1 max-w-[250px]">
                      Chào, {session.user?.name || "Khách hàng"}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-gray-800">
                        Tài khoản của tôi
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-gray-500 transition-transform duration-200 group-hover:rotate-180"
                      />
                    </div>
                  </div>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-4 w-48 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 z-50 rounded-lg">
                  <ul className="flex flex-col py-2">
                    <li>
                      <Link
                        href="/profile"
                        className="block px-6 py-2.5 text-gray-600 hover:text-orange-500 hover:bg-gray-50 text-sm font-medium transition"
                      >
                        Thông tin tài khoản
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-6 py-2.5 text-red-500 hover:bg-red-50 text-sm font-bold transition mt-1 border-t border-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              // NẾU CHƯA ĐĂNG NHẬP
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
            )}

            <Link
              href="/cart"
              className={`flex items-center space-x-2 transition group ${
                pathname === "/cart"
                  ? "text-orange-500"
                  : "hover:text-orange-500"
              }`}
            >
              <div className="relative">
                <ShoppingBag
                  className={`size-6 ${
                    pathname === "/cart"
                      ? "text-orange-500"
                      : "text-gray-600 group-hover:text-orange-500"
                  }`}
                />
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {displayCartCount}
                </span>
              </div>
              <span>Giỏ hàng</span>
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="container mx-auto px-4 flex items-center justify-center space-x-8 text-sm border-t border-gray-100">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.label} className="group py-4 relative">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-1 transition-all duration-200 font-medium ${
                    isActive
                      ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                      : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  <span
                    className={
                      item.label === "Khuyến mãi" && !isActive
                        ? "text-gray-700 group-hover:text-red-600"
                        : ""
                    }
                  >
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 group-hover:rotate-180 ${
                        isActive ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                  )}
                </Link>

                {/* Mega Menu Dropdown */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out border border-gray-100 z-50 rounded-b-lg">
                    <ul className="flex flex-col py-2">
                      {(item.label === "Sản phẩm"
                        ? productCategories
                        : item.label === "Khuyến mãi"
                          ? promotionCategories
                          : item.label === "Tin tức"
                            ? newsCategories
                            : []
                      ).map((cat: MenuItem, idx: number) => (
                        <li key={idx} className="relative group/item">
                          <Link
                            href={cat.href}
                            className="flex items-center justify-between px-6 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition"
                          >
                            <span className="font-medium text-sm">
                              {cat.title}
                            </span>
                            {cat.items && (
                              <ChevronRight
                                size={14}
                                className="text-gray-400"
                              />
                            )}
                          </Link>

                          {cat.items && (
                            <div className="absolute left-full top-0 w-56 bg-white shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 border border-gray-100 rounded-lg">
                              <ul className="flex flex-col py-2">
                                {cat.items.map((sub: SubItem, sIdx: number) => (
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
            );
          })}
        </div>
      </header>

      {/* Auth Modals */}
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
