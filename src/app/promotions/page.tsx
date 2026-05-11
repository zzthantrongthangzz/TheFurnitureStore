"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { mockProducts } from "@/data/mockProducts";
import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";

export default function PromotionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Lấy danh sách sản phẩm (chỉ lấy những cái có giảm giá)
  const promoProducts = mockProducts.filter((p) => p.discountPercent > 0);

  // Logic phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = promoProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(promoProducts.length / productsPerPage);

  const filters = ["DANH MỤC", "GIÁ SẢN PHẨM", "MÀU SẮC", "KÍCH THƯỚC"];

  return (
    <main className="bg-white min-h-screen font-sans text-gray-800 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Tiêu đề và Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Ưu Đãi</h1>
          <div className="relative min-w-[200px]">
            <select className="w-full border border-gray-200 px-4 py-2 rounded outline-none appearance-none text-sm cursor-pointer">
              <option>Sản phẩm nổi bật</option>
              <option>Giá: Thấp đến Cao</option>
              <option>Giá: Cao đến Thấp</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>
        </div>

        {/* Bộ lọc (Filters) */}
        <div className="flex flex-wrap items-center gap-4 mb-10 border-t border-b border-gray-100 py-4">
          <div className="flex items-center gap-2 font-bold text-sm mr-4">
            <Filter size={18} /> BỘ LỌC
          </div>
          {filters.map((f) => (
            <div key={f} className="relative group">
              <button className="border border-gray-200 px-6 py-2 rounded bg-gray-50 flex items-center gap-4 text-xs font-semibold hover:border-orange-500 transition">
                {f} <ChevronDown size={14} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-16">
          {currentProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden mb-4 bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Badge giảm giá */}
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2 py-1">
                  -{product.discountPercent}%
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="space-y-1">
                <h3 className="text-[14px] font-medium text-gray-800 line-clamp-2 min-h-[40px] leading-tight uppercase group-hover:text-orange-500 transition">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-bold text-sm">
                    {product.price.toLocaleString()}đ
                  </span>
                  <span className="text-gray-400 line-through text-[12px]">
                    {product.originalPrice?.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-1">
                    {/* Giả lập các chấm màu */}
                    <div className="w-4 h-4 rounded-full border border-gray-300 bg-green-800"></div>
                    <div className="w-4 h-4 rounded-full border border-gray-300 bg-[#EFE4D5]"></div>
                  </div>
                  <span className="text-[11px] text-gray-400 italic">
                    Đã bán {Math.floor(Math.random() * 100)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex justify-center items-center space-x-2 mb-20">
          <button className="p-2 hover:bg-gray-100 rounded transition">
            <ChevronLeft size={20} />
          </button>
          {[1, 2, 3, "...", totalPages].map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded transition font-medium ${
                currentPage === page
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 hover:bg-gray-100 rounded transition">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 4 Icon Dịch vụ cuối trang */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gray-100 rounded-lg overflow-hidden">
          {[
            {
              icon: <Truck size={36} />,
              title: "Giao Hàng & Lắp Đặt",
              sub: "Miễn Phí",
            },
            {
              icon: <RefreshCw size={36} />,
              title: "Đổi Trả 1 - 1",
              sub: "Miễn Phí",
            },
            {
              icon: <ShieldCheck size={36} />,
              title: "Bảo Hành Đến 5 Năm",
              sub: "Miễn Phí",
            },
            {
              icon: <Headphones size={36} />,
              title: "Tư Vấn Thiết Kế",
              sub: "Miễn Phí",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-10 border-r border-b last:border-r-0 lg:border-b-0 hover:bg-gray-50 transition cursor-default"
            >
              <div className="text-gray-700 mb-4">{s.icon}</div>
              <h4 className="font-bold text-sm mb-1">{s.title}</h4>
              <p className="text-xs text-gray-500">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <div className="mt-16 text-center text-gray-500 text-sm max-w-5xl mx-auto leading-relaxed">
          Danh sách đồ nội thất gỗ đang được 3T HOME ưu đãi lớn, cơ hội săn sale
          để mua sắm những món đồ nội thất phòng khách, phòng ăn, phòng ngủ,
          phòng làm việc chất lượng với giá tốt nhất.
        </div>
      </div>
    </main>
  );
}
