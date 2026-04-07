import React from "react";
import { mockProducts } from "@/data/mockProducts";
import {
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  Headphones,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AllProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Banner ngang đầu trang */}
      <div className="w-full h-[300px] relative bg-gray-200">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="container mx-auto h-full flex flex-col justify-center relative z-20 px-4 text-white">
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            Tất cả sản phẩm
          </h1>
          <p className="mt-2 text-lg">
            Khám phá không gian sống hiện đại cùng 3T Furniture
          </p>
        </div>
        {/* Thay src bằng link ảnh thật hoặc public image sau này */}
        <div className="absolute inset-0 bg-[url('https://moho.com.vn/cdn/shop/files/Banner_Web_PC_-_Noi_that_MOHO_1.jpg?v=1701397854')] bg-cover bg-center" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. Sidebar - Bộ lọc sản phẩm (Filter) */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">
                  Danh mục
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Phòng Ngủ
                  </li>
                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Phòng Khách
                  </li>
                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Phòng Ăn
                  </li>
                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Phòng Làm Việc
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">
                  Khoảng giá
                </h3>
                <div className="space-y-2">
                  {[
                    "Dưới 2.000.000đ",
                    "2.000.000đ - 5.000.000đ",
                    "Trên 5.000.000đ",
                  ].map((range) => (
                    <label
                      key={range}
                      className="flex items-center space-x-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="group-hover:text-orange-500 transition">
                        {range}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">
                  Màu sắc
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["#D2B48C", "#8B4513", "#FFFFFF", "#000000"].map(
                    (color, i) => (
                      <button
                        key={i}
                        className="w-8 h-8 rounded-full border border-gray-300 shadow-sm hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* 3. Danh sách sản phẩm (Grid Cards) */}
          <section className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
              <p>Hiển thị {mockProducts.length} sản phẩm</p>
              <select className="border p-2 rounded outline-none focus:ring-1 focus:ring-orange-500">
                <option>Mới nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountPercent && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-20">
                        -{product.discountPercent}%
                      </span>
                    )}
                    {/* Nút xem nhanh hiện lên khi hover */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-gray-400 uppercase tracking-tighter">
                      {product.subCategory}
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-medium text-gray-800 hover:text-orange-600 line-clamp-2 min-h-[3rem] transition"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-orange-600 font-bold">
                        {product.price.toLocaleString()}đ
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-sm line-through">
                          {product.originalPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination (Phân trang) */}
            <div className="mt-12 flex justify-center items-center space-x-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-orange-500 hover:text-white transition">
                1
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-orange-500 hover:text-white transition">
                2
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-orange-500 hover:text-white transition text-gray-400 border-none">
                <ChevronRight size={20} />
              </button>
            </div>
          </section>
        </div>

        {/* 4. Slogan - Giá trị cốt lõi */}
        <div className="mt-20 py-12 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center space-y-3 group">
            <div className="p-4 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
              <Truck size={30} />
            </div>
            <div className="text-sm">
              <p className="font-bold">Giao Hàng & Lắp Đặt</p>
              <p className="text-orange-500 font-medium italic">Miễn Phí</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3 group">
            <div className="p-4 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
              <RefreshCw size={30} />
            </div>
            <div className="text-sm">
              <p className="font-bold">Đổi Trả 1 - 1</p>
              <p className="text-orange-500 font-medium italic">Miễn Phí</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3 group">
            <div className="p-4 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
              <ShieldCheck size={30} />
            </div>
            <div className="text-sm">
              <p className="font-bold">Bảo Hành Đến 5 Năm</p>
              <p className="text-orange-500 font-medium italic">Miễn Phí</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3 group">
            <div className="p-4 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
              <Headphones size={30} />
            </div>
            <div className="text-sm">
              <p className="font-bold">Tư Vấn Thiết Kế</p>
              <p className="text-orange-500 font-medium italic">Miễn Phí</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
