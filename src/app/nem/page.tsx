"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import { useProductFilter } from "@/hooks/useProductFilter";
import { Product } from "@/types/product";
import {
  ChevronDown,
  RefreshCw,
  ShieldCheck,
  Headphones,
  Truck,
} from "lucide-react";

const MATTRESS_CATEGORIES = [
  { label: "Vạn Thành", val: "van-thanh" },
  { label: "Thế Giới Nệm", val: "the-gioi-nem" },
  { label: "3THOME Sleep", val: "3thome-sleep" },
  { label: "Nệm Lò Xo", val: "nem-lo-xo" },
  { label: "Nệm Cao Su", val: "nem-cao-su" },
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
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen
          ? "max-h-[1000px] opacity-100 overflow-y-auto"
          : "max-h-0 opacity-0"
      }`}
    >
      {children}
    </div>
  </div>
);

function MattressContent() {
  const [productsFromDB, setProductsFromDB] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    filters,
    toggleFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    totalCount,
  } = useProductFilter(productsFromDB);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?timestamp=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await response.json();
        const productsArray = Array.isArray(data) ? data : data.products || [];

        // Lọc ra các sản phẩm thuộc danh mục Nệm
        const mattressProducts = productsArray.filter(
          (p: Product) => p.category === "nem" || p.subCategory === "nem",
        );

        const formattedData = mattressProducts.map((p: Product) => ({
          ...p,
          id: p._id?.toString() || p.id || p.slug,
        }));

        setProductsFromDB(formattedData);
      } catch (error) {
        console.error("Lỗi tải sản phẩm nệm:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
  });
  const toggleSection = (key: "category" | "price") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải danh sách nệm...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="w-full relative aspect-[21/9] md:aspect-[1920/400] bg-gray-100 overflow-hidden">
        <Image
          src="/images/banner-products.jpg"
          alt="Thế giới Nệm"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 xl:py-12">
        <div className="mb-6 border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2 text-gray-900">
              Nệm & Chăm Sóc Giấc Ngủ
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Tìm thấy {totalCount} sản phẩm phù hợp
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-b border-gray-300 py-1 pr-2 font-medium outline-none bg-transparent cursor-pointer"
          >
            <option value="default">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="w-full lg:w-[260px] shrink-0">
            <div className="sticky top-24 space-y-5">
              <h2 className="font-bold text-xl text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">
                BỘ LỌC
              </h2>

              <FilterAccordion
                title="Thương hiệu nệm"
                isOpen={openSections.category}
                onToggle={() => toggleSection("category")}
              >
                <div className="space-y-3 text-sm text-gray-600">
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
                </div>
              </FilterAccordion>

              <FilterAccordion
                title="Khoảng giá"
                isOpen={openSections.price}
                onToggle={() => toggleSection("price")}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  {[
                    "Dưới 5.000.000đ",
                    "5.000.000đ - 10.000.000đ",
                    "Trên 10.000.000đ",
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
            </div>
          </aside>

          <section className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="py-20 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-3xl">
                Không tìm thấy loại nệm nào phù hợp với bộ lọc.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center font-medium rounded-lg transition ${
                      currentPage === i + 1
                        ? "bg-orange-500 text-white shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-orange-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-20 py-10 border-t border-gray-100 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl text-center">
            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <Truck size={36} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-lg text-gray-800">
                Giao Nệm Tận Nhà
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <RefreshCw size={36} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-lg text-gray-800">Nằm Thử 100 Đêm</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <ShieldCheck size={36} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-lg text-gray-800">Bảo Hành 10 Năm</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="p-5 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                <Headphones size={36} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-lg text-gray-800">Tư Vấn Giấc Ngủ</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function MattressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải dữ liệu...
        </div>
      }
    >
      <MattressContent />
    </Suspense>
  );
}
