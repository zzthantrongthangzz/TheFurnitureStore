// src/app/admin/layout.tsx
import React from "react";
import Link from "next/link";
import { Package, PlusCircle, Home, ClipboardList, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-black text-orange-600 tracking-wider">
            3T HOME ADMIN
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          
          {/* 1. Nút Thống kê (Dashboard) */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 p-3 hover:bg-orange-50 hover:text-orange-600 text-gray-600 font-medium rounded-lg transition"
          >
            <LayoutDashboard size={20} /> Thống kê
          </Link>

          {/* 2. Nút Quản lý đơn hàng */}
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-3 hover:bg-orange-50 hover:text-orange-600 text-gray-600 font-medium rounded-lg transition"
          >
            <ClipboardList size={20} /> Quản lý đơn hàng
          </Link>

          {/* 3. Nút Danh sách sản phẩm */}
          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-3 hover:bg-orange-50 hover:text-orange-600 text-gray-600 font-medium rounded-lg transition"
          >
            <Package size={20} /> Danh sách sản phẩm
          </Link>
          
          {/* 4. Nút Thêm sản phẩm mới */}
          <Link
            href="/admin/products/add"
            className="flex items-center gap-3 p-3 hover:bg-orange-50 hover:text-orange-600 text-gray-600 font-medium rounded-lg transition"
          >
            <PlusCircle size={20} /> Thêm sản phẩm mới
          </Link>
          
          <div className="pt-8 mt-8 border-t border-gray-100">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 hover:bg-gray-100 text-gray-500 font-medium rounded-lg transition"
            >
              <Home size={20} /> Quay lại cửa hàng
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}