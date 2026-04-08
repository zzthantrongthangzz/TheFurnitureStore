// src/app/nem/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Filter,
} from "lucide-react";

const MATTRESS_CATEGORIES = [
  { label: "Vạn Thành", val: "van-thanh" },
  { label: "Thế Giới Nệm", val: "the-gioi-nem" },
  { label: "3THOME Sleep", val: "3thome-sleep" },
  { label: "Khác", val: "khac" },
];

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
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 overflow-y-auto" : "max-h-0 opacity-0"}`}
    >
      {children}
    </div>
  </div>
);

export default function MattressPage() {
  // LỌC DỮ LIỆU: Chỉ lấy các sản phẩm thuộc danh mục "nem"
  const mattressProducts = mockProducts.filter((p) => p.category === "nem");

  const {
    filters,
    toggleFilter,
    clearAllFilters,
    customPrice,
    setCustomPrice,
    maxProductPrice,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    totalCount,
  } = useProductFilter(mattressProducts);

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    color: true,
    size: true,
  });
  const toggleSection = (key: "category" | "price" | "color" | "size") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [showCustomPrice, setShowCustomPrice] = useState(false);
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxProductPrice);

  useEffect(() => {
    if (showCustomPrice)
      setCustomPrice({ min: tempMinPrice, max: tempMaxPrice });
    else setCustomPrice(null);
  }, [showCustomPrice, tempMinPrice, tempMaxPrice, setCustomPrice]);

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* 1. Thay đổi Title Banner */}
      <div className="w-full relative aspect-[21/9] md:aspect-[1920/400] bg-gray-100 overflow-hidden">
        <Image
          src="/images/banner-products.jpg"
          alt="Nệm"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2. Đổi Title H1 */}
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4 text-gray-900">
            Nệm
          </h1>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">
              Hiển thị {totalCount} kết quả
            </span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="font-medium">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-b border-gray-300 py-1 pr-2 font-medium text-gray-800 outline-none focus:border-orange-500 bg-transparent cursor-pointer"
              >
                <option value="default">Sản phẩm nổi bật</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tag đang lọc */}
        {(filters.categories.length > 0 ||
          filters.priceRanges.length > 0 ||
          filters.colors.length > 0 ||
          filters.sizes.length > 0 ||
          customPrice) && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-800 border-l-4 border-orange-500 pl-3">
              <Filter size={16} /> <span>Đang lọc:</span>
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-gray-400 hover:text-red-500 hover:underline ml-4 transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>

            <div className="flex flex-col gap-2 pl-4">
              {filters.categories.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-600 min-w-[80px]">
                    Danh mục:
                  </span>
                  {filters.categories.map((val) => (
                    <span
                      key={val}
                      className="flex items-center space-x-1 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {/* Đổi thành MATTRESS_CATEGORIES */}
                      <span>
                        {MATTRESS_CATEGORIES.find((c) => c.val === val)
                          ?.label || val}
                      </span>
                      <button
                        onClick={() => toggleFilter("categories", val)}
                        className="hover:text-red-500 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Giữ nguyên tag Khoảng giá */}
              {(filters.priceRanges.length > 0 || customPrice) && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-600 min-w-[80px]">
                    Khoảng giá:
                  </span>
                  {filters.priceRanges.map((val) => (
                    <span
                      key={val}
                      className="flex items-center space-x-1 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{val}</span>
                      <button
                        onClick={() => toggleFilter("priceRanges", val)}
                        className="hover:text-red-500 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {customPrice && (
                    <span className="flex items-center space-x-1 bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      <span>
                        {customPrice.min.toLocaleString()}đ -{" "}
                        {customPrice.max.toLocaleString()}đ
                      </span>
                      <button
                        onClick={() => setShowCustomPrice(false)}
                        className="hover:text-red-500 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Giữ nguyên tag Màu sắc */}
              {filters.colors.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-600 min-w-[80px]">
                    Màu sắc:
                  </span>
                  {filters.colors.map((val) => (
                    <span
                      key={val}
                      className="flex items-center space-x-1 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{val}</span>
                      <button
                        onClick={() => toggleFilter("colors", val)}
                        className="hover:text-red-500 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Giữ nguyên tag Kích thước */}
              {filters.sizes.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-600 min-w-[80px]">
                    Kích thước:
                  </span>
                  {filters.sizes.map((val) => (
                    <span
                      key={val}
                      className="flex items-center space-x-1 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{val}</span>
                      <button
                        onClick={() => toggleFilter("sizes", val)}
                        className="hover:text-red-500 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[240px] shrink-0">
            <div className="sticky top-24 space-y-5">
              <h2 className="font-bold text-xl text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">
                BỘ LỌC
              </h2>

              {/* ĐỔI THÀNH DANH MỤC NỆM */}
              <FilterAccordion
                title="Danh mục"
                isOpen={openSections.category}
                onToggle={() => toggleSection("category")}
              >
                <ul className="space-y-3 text-sm text-gray-600">
                  {MATTRESS_CATEGORIES.map((cat) => (
                    <label
                      key={cat.val}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat.val)}
                        onChange={() => toggleFilter("categories", cat.val)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </ul>
              </FilterAccordion>

              {/* Giữ nguyên filter Khoảng giá */}
              <FilterAccordion
                title="Khoảng giá"
                isOpen={openSections.price}
                onToggle={() => toggleSection("price")}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  {[
                    "Dưới 500.000đ",
                    "500.000đ - 1.000.000đ",
                    "1.000.000đ - 1.500.000đ",
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

                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <label className="flex items-center space-x-3 cursor-pointer group mb-4">
                      <input
                        type="checkbox"
                        checked={showCustomPrice}
                        onChange={() => setShowCustomPrice(!showCustomPrice)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition font-medium">
                        Tùy chọn thanh kéo
                      </span>
                    </label>

                    {showCustomPrice && (
                      <div className="px-2">
                        <div className="flex justify-between text-xs text-orange-600 font-bold mb-2">
                          <span>{tempMinPrice.toLocaleString()}đ</span>
                          <span>{tempMaxPrice.toLocaleString()}đ</span>
                        </div>
                        <div className="relative h-1.5 bg-gray-200 rounded-full mb-6">
                          <div
                            className="absolute h-1.5 bg-orange-500 rounded-full"
                            style={{
                              left: `${(tempMinPrice / maxProductPrice) * 100}%`,
                              right: `${100 - (tempMaxPrice / maxProductPrice) * 100}%`,
                            }}
                          />
                          <input
                            type="range"
                            min="0"
                            max={maxProductPrice}
                            step="100000"
                            value={tempMinPrice}
                            onChange={(e) =>
                              setTempMinPrice(
                                Math.min(
                                  Number(e.target.value),
                                  tempMaxPrice - 100000,
                                ),
                              )
                            }
                            className="absolute w-full -top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:rounded-full"
                          />
                          <input
                            type="range"
                            min="0"
                            max={maxProductPrice}
                            step="100000"
                            value={tempMaxPrice}
                            onChange={(e) =>
                              setTempMaxPrice(
                                Math.max(
                                  Number(e.target.value),
                                  tempMinPrice + 100000,
                                ),
                              )
                            }
                            className="absolute w-full -top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FilterAccordion>

              {/* Giữ nguyên filter Màu sắc */}
              <FilterAccordion
                title="Màu sắc"
                isOpen={openSections.color}
                onToggle={() => toggleSection("color")}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  {[
                    "Gỗ tự nhiên",
                    "Nâu",
                    "Xám",
                    "Be",
                    "Trắng",
                    "Đen",
                    "Vàng",
                    "Xanh navy",
                  ].map((color) => (
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

              {/* Giữ nguyên filter Kích thước */}
              <FilterAccordion
                title="Kích thước"
                isOpen={openSections.size}
                onToggle={() => toggleSection("size")}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  {["90cm", "1m2", "1m4", "1m6", "1m8"].map((size) => (
                    <label
                      key={size}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.sizes.includes(size)}
                        onChange={() => toggleFilter("sizes", size)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition">
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterAccordion>
            </div>
          </aside>

          {/* Lưới sản phẩm */}
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

        {/* Khối Slogan */}
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
