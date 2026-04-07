// src/app/products/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image"; // Đã thêm import Image chuẩn Next.js
import { mockProducts } from "@/data/mockProducts";
import { useProductFilter } from "@/hooks/useProductFilter";
import {
  ChevronRight,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
  Headphones,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";

const FilterAccordion = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-b pb-4">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full font-bold text-base mb-3 group"
    >
      {title}
      <ChevronDown
        size={18}
        className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
    >
      {children}
    </div>
  </div>
);

export default function AllProductsPage() {
  const {
    filters,
    toggleFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    totalCount,
  } = useProductFilter(mockProducts);

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    color: true,
  });
  const toggleSection = (key: "category" | "price" | "color") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeFilterTags = [
    ...filters.categories.map((val) => ({
      type: "categories" as const,
      label: `Danh mục: ${val}`,
      val,
    })),
    ...filters.priceRanges.map((val) => ({
      type: "priceRanges" as const,
      label: `Giá: ${val}`,
      val,
    })),
    ...filters.colors.map((val) => ({
      type: "colors" as const,
      label: `Màu: ${val}`,
      val,
    })),
  ];

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="w-full h-[250px] md:h-[300px] relative bg-gray-200">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center relative z-20 px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            Tất cả sản phẩm
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold">Hiển thị {totalCount} kết quả</h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-b-2 border-gray-200 py-1 pr-2 font-medium outline-none focus:border-orange-500 bg-transparent cursor-pointer"
              >
                <option value="default">Sản phẩm nổi bật</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
              </select>
            </div>
          </div>

          {activeFilterTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm font-semibold text-gray-600 mr-2">
                Đang lọc:
              </span>
              {activeFilterTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center space-x-1 bg-orange-50 border border-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <span>{tag.label}</span>
                  <button
                    onClick={() => toggleFilter(tag.type, tag.val)}
                    className="hover:text-red-500 ml-1"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-gray-400 hover:text-red-500 hover:underline ml-2 transition"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[240px] shrink-0">
            <div className="sticky top-24 space-y-5">
              <FilterAccordion
                title="Danh mục"
                isOpen={openSections.category}
                onToggle={() => toggleSection("category")}
              >
                <ul className="space-y-3 text-sm text-gray-600">
                  {["phong-ngu", "phong-khach", "phong-an"].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => toggleFilter("categories", cat)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition capitalize">
                        {cat.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </ul>
              </FilterAccordion>

              <FilterAccordion
                title="Khoảng giá"
                isOpen={openSections.price}
                onToggle={() => toggleSection("price")}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  {[
                    "Dưới 2.000.000đ",
                    "2.000.000đ - 5.000.000đ",
                    "Trên 5.000.000đ",
                  ].map((range) => (
                    <label
                      key={range}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.priceRanges.includes(range)}
                        onChange={() => toggleFilter("priceRanges", range)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition">
                        {range}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              <FilterAccordion
                title="Màu sắc"
                isOpen={openSections.color}
                onToggle={() => toggleSection("color")}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  {["Gỗ tự nhiên", "Nâu", "Xám", "Be"].map((color) => (
                    <label
                      key={color}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.colors.includes(color)}
                        onChange={() => toggleFilter("colors", color)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition">
                        {color}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterAccordion>
            </div>
          </aside>

          <section className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.discountPercent && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md z-20">
                          -{product.discountPercent}%
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <button className="bg-white text-gray-800 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-medium text-sm md:text-base text-gray-800 hover:text-orange-600 line-clamp-2 min-h-[2.5rem] transition leading-tight mb-2"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-auto flex flex-wrap items-center gap-1 md:gap-2">
                        <span className="text-orange-600 font-bold text-sm md:text-base">
                          {product.price.toLocaleString()}đ
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 text-xs md:text-sm line-through">
                            {product.originalPrice.toLocaleString()}đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center font-medium rounded-lg transition ${
                      currentPage === i + 1
                        ? "bg-orange-500 text-white shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-orange-500 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="mt-20 py-10 border-t border-gray-100 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-4xl text-center">
            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <Truck size={36} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-800">
                  Giao Hàng & Lắp Đặt
                </p>
                <p className="text-orange-500 font-bold text-base">Miễn Phí</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <RefreshCw size={36} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-800">Đổi Trả 1 - 1</p>
                <p className="text-orange-500 font-bold text-base">Miễn Phí</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <ShieldCheck size={36} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-800">
                  Bảo Hành Đến 5 Năm
                </p>
                <p className="text-orange-500 font-bold text-base">Miễn Phí</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <Headphones size={36} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-800">
                  Tư Vấn Thiết Kế
                </p>
                <p className="text-orange-500 font-bold text-base">Miễn Phí</p>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-gray-600 text-base md:text-lg max-w-4xl leading-relaxed px-4">
            Nội Thất 3T Home thân thiện môi trường, an toàn sức khỏe, chất lượng
            quốc tế với đa dạng đồ nội thất hiện đại cho phòng khách, phòng ăn,
            phòng ngủ, phòng làm việc, văn phòng và tủ bếp.
          </p>
        </div>
      </div>
    </main>
  );
}
