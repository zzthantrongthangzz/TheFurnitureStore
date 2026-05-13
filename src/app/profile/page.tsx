"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Đã import thêm Link
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Clock,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Bảo vệ trang: Nếu chưa đăng nhập sẽ tự động đẩy về trang chủ
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar điều hướng */}
          <aside className="w-full md:w-1/4 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Tài khoản của
                  </p>
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">
                    {session.user?.name}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/profile"
                  className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-bold transition"
                >
                  <div className="flex items-center space-x-3">
                    <User size={18} />
                    <span>Thông tin cá nhân</span>
                  </div>
                  <ChevronRight size={16} />
                </Link>

                {/* Đã sửa button thành Link để trỏ về trang đơn hàng */}
                <Link
                  href="/profile/orders"
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition block"
                >
                  <div className="flex items-center space-x-3">
                    <Package size={18} />
                    <span>Đơn hàng của tôi</span>
                  </div>
                  <ChevronRight size={16} />
                </Link>

                <button className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
                  <div className="flex items-center space-x-3">
                    <MapPin size={18} />
                    <span>Sổ địa chỉ</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition mt-4"
                >
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>

            {/* Banner hỗ trợ */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <p className="text-sm font-medium opacity-80 mb-2">
                Bạn cần hỗ trợ?
              </p>
              <p className="text-lg font-bold mb-4">1900 3000</p>
              <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-bold transition">
                Liên hệ Zalo
              </button>
            </div>
          </aside>

          {/* Nội dung chính */}
          <section className="flex-grow">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  Thông tin cá nhân
                </h1>
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  <ShieldCheck size={14} />
                  <span>Đã xác thực</span>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Lưới thông tin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-500">
                      Họ và tên
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <User size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-800">
                        {session.user?.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-500">
                      Địa chỉ Email
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Mail size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-800">
                        {session.user?.email}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-500">
                      Số điện thoại
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Phone size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-800">
                        {/* Hiển thị số điện thoại từ session */}
                        {(session.user as any)?.phone || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-500">
                      Ngày tham gia
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Clock size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-800">
                        Tháng 05, 2026
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phần địa chỉ mặc định */}
                <div className="pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                      <MapPin size={20} className="text-orange-500" />
                      <span>Địa chỉ mặc định</span>
                    </h3>
                    <button className="text-sm font-bold text-orange-600 hover:underline">
                      Thiết lập ngay
                    </button>
                  </div>
                  <div className="bg-orange-50/50 border border-dashed border-orange-200 rounded-xl p-6 text-center">
                    <p className="text-gray-500 text-sm">
                      Bạn chưa thiết lập địa chỉ nhận hàng mặc định.
                    </p>
                  </div>
                </div>

                {/* Nút chỉnh sửa */}
                <div className="flex justify-end pt-4">
                  <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-orange-500 transition duration-300">
                    Cập nhật thông tin
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
