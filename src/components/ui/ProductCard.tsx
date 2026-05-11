"use client"; // Bắt buộc thêm dòng này

import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart"; // Import Store giỏ hàng

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn link bọc ngoài bị kích hoạt
    e.stopPropagation();

    // Fix tùy chỉnh theo model Product trong type của bạn
    addItem({
      id: product.id || (product as any)._id,
      name: product.name,
      price:
        typeof product.price === "string"
          ? parseInt(product.price.replace(/\D/g, ""))
          : product.price,
      imageUrl: product.image || (product as any).imageUrl, // Hỗ trợ cả 2 trường hợp tên biến ảnh
      slug: (product as any).slug || product.id,
      quantity: 1,
    });

    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="min-w-[260px] max-w-[260px] snap-start group cursor-pointer relative">
      <div className="relative w-full h-[260px] overflow-hidden rounded-xl mb-4 bg-white shadow-sm">
        <Image
          src={product.image || (product as any).imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="260px"
        />
        {/* Lớp phủ đen và nút (cho thẻ button pointer-events-auto để click được) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
          <button
            onClick={handleAddToCart}
            className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto"
          >
            <ShoppingCart size={18} /> Thêm vào giỏ
          </button>
        </div>
      </div>
      <h3 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors text-lg truncate">
        {product.name}
      </h3>
      <p className="text-orange-600 font-bold mt-1 text-lg">
        {!isNaN(Number(product?.price))
          ? `${Number(product.price).toLocaleString("vi-VN")}đ`
          : product?.price || "Đang cập nhật"}
      </p>
    </div>
  );
}
