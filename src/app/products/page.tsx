// src/app/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { mockProducts } from "@/data/mockProducts";
import { useProductFilter } from "@/hooks/useProductFilter";
import {
  ChevronRight,
  ChevronDown,
  X,
  Filter,
  RefreshCw,
  ShieldCheck,
  Headphones,
  Truck,
} from "lucide-react";
import Link from "next/link";

// Danh sách map tên tiếng Việt có dấu chuẩn xác
const CATEGORIES = [
  { label: "Bộ Sưu Tập", val: "bo-suu-tap" },
  { label: "Phòng Ngủ", val: "phong-ngu" },
  { label: "Phòng Khách", val: "phong-khach" },
  { label: "Phòng Ăn", val: "phong-an" },
  { label: "Phòng Làm Việc", val: "phong-lam-viec" },
  { label: "Tủ Bếp", val: "tu-bep" },
  { label: "Nệm", val: "nem" },
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

export default function AllProductsPage() {
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
  } = useProductFilter(mockProducts);

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    color: true,
    size: true,
  });
  
  const toggleSection = (key: "category" | "price" | "color" | "size") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Xử lý Slider Giá Tùy Chọn
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
      {/* Banner Hình ảnh */}
      <div className="w-full relative aspect-[21/9] md:aspect-[1920/400] bg-gray-100 overflow-hidden">
        <Image
          src="/images/banner-products.jpg"
          alt="Banner Tất cả sản phẩm"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tiêu đề và Hiển thị kết quả */}
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4 text-gray-900">
            Tất cả sản phẩm
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

        {/* Gom nhóm các tag đang lọc */}
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
                      <span>
                        {CATEGORIES.find((c) => c.val === val)?.label || val}
                      </span>
                      <button onClick={() => toggleFilter("categories", val)} className="hover:text-red-500 ml-1">
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
          {/* Sidebar BỘ LỌC */}
          <aside className="w-full lg:w-[240px] shrink-0">
            <div className="sticky top-24 space-y-5">
              <h2 className="font-bold text-xl text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">
                BỘ LỌC
              </h2>

              <FilterAccordion
                title="Danh mục"
                isOpen={openSections.category}
                onToggle={() => toggleSection("category")}
              >
                <ul className="space-y-3 text-sm text-gray-600">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.val} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat.val)}
                        onChange={() => toggleFilter("categories", cat.val)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition">{cat.label}</span>
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
                  {["Dưới 500.000đ", "500.000đ - 1.000.000đ", "1.000.000đ - 1.500.000đ", "2.000.000đ - 5.000.000đ", "Trên 5.000.000đ"].map((range) => (
                    <label key={range} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.priceRanges.includes(range)}
                        onChange={() => toggleFilter("priceRanges", range)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition">{range}</span>
                    </label>
                  ))}
                  
                  {/* Thanh kéo tuỳ chọn */}
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <label className="flex items-center space-x-3 cursor-pointer group mb-4">
                      <input
                        type="checkbox"
                        checked={showCustomPrice}
                        onChange={() => setShowCustomPrice(!showCustomPrice)}
                        className="w-4 h-4 accent-orange-500 rounded border-gray-300"
                      />
                      <span className="group-hover:text-orange-500 transition font-medium">Tùy chọn thanh kéo</span>
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
                            onChange={(e) => setTempMinPrice(Math.min(Number(e.target.value), tempMaxPrice - 100000))}
                            className="absolute w-full -top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:rounded-full"
                          />
                          <input
                            type="range"
                            min="0"
                            max={maxProductPrice}
                            step="100000"
                            value={tempMaxPrice}
                            onChange={(e) => setTempMaxPrice(Math.max(Number(e.target.value), tempMinPrice + 100000))}
                            className="absolute w-full -top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FilterAccordion>
            </div>
          </aside>

          {/* Grid Sản phẩm */}
          <section className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="py-20 text-center text-gray-500">Không tìm thấy sản phẩm nào.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      {product.discountPercent && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md z-20">-{product.discountPercent}%</span>
                      )}
                    </div>
                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                      <Link href={`/products/${product.slug}`} className="font-medium text-sm md:text-base text-gray-800 hover:text-orange-600 line-clamp-2 min-h-[2.5rem] transition mb-2">
                        {product.name}
                      </Link>
                      <div className="mt-auto flex items-center gap-2">
                        <span className="text-orange-600 font-bold text-sm md:text-base">{product.price.toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center font-medium rounded-lg transition ${currentPage === i + 1 ? "bg-orange-500 text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-500"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Slogan & Giá trị cốt lõi */}
        <div className="mt-20 py-10 border-t border-gray-100 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl text-center">
             <div className="flex flex-col items-center space-y-3 group cursor-pointer">
               <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                 <Truck size={36} strokeWidth={1.5} />
               </div>
               <div>
                 <p className="font-bold text-lg text-gray-800">Giao Hàng & Lắp Đặt</p>
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
                 <p className="font-bold text-lg text-gray-800">Bảo Hành 5 Năm</p>
                 <p className="text-orange-500 font-bold text-base">Miễn Phí</p>
               </div>
             </div>
             <div className="flex flex-col items-center space-y-3 group cursor-pointer">
               <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                 <Headphones size={36} strokeWidth={1.5} />
               </div>
               <div>
                 <p className="font-bold text-lg text-gray-800">Tư Vấn Thiết Kế</p>
                 <p className="text-orange-500 font-bold text-base">Miễn Phí</p>
               </div>
             </div>
          </div>
          <p className="mt-10 text-center text-gray-600 text-base md:text-lg max-w-4xl leading-relaxed px-4">
            Nội Thất 3T Home thân thiện môi trường, an toàn sức khỏe, chất lượng
            quốc tế với đa dạng đồ nội thất hiện đại cho mọi không gian sống.
          </p>
        </div>
      </div>
    </main>
  );
}
