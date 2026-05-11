"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

// 1. Cập nhật Interface để nhận thêm giá gốc và % giảm giá
export interface MongoProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number; // Thêm trường này
  discountPercent?: number; // Thêm trường này
  imageUrl: string;
}

interface ProductCardProps {
  product: MongoProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug,
      quantity: 1,
    });

    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="min-w-[260px] max-w-[260px] snap-start group cursor-pointer relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full h-[260px] overflow-hidden rounded-xl mb-4 bg-white shadow-sm block"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="260px"
        />

        {/* 2. Badge hiển thị % giảm giá nằm ở góc trên bên phải ảnh */}
        {product.discountPercent && product.discountPercent > 0 ? (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-sm">
            -{product.discountPercent}%
          </div>
        ) : null}

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
          <button
            onClick={handleAddToCart}
            className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto"
          >
            <ShoppingCart size={18} /> Thêm vào giỏ
          </button>
        </div>
      </Link>

      <Link href={`/products/${product.slug}`} className="block">
        <h3 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors text-lg truncate">
          {product.name}
        </h3>
      </Link>

      {/* 3. Vùng hiển thị giá tiền: Kết hợp Giá hiện tại và Giá gốc */}
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-orange-600 font-bold text-lg">
          {product.price
            ? `${product.price.toLocaleString("vi-VN")}đ`
            : "Đang cập nhật"}
        </p>

        {/* Chỉ hiển thị giá gốc nếu có giá gốc và giá gốc lớn hơn giá bán */}
        {product.originalPrice && product.originalPrice > product.price && (
          <p className="text-gray-400 line-through text-sm font-medium">
            {product.originalPrice.toLocaleString("vi-VN")}đ
          </p>
        )}
      </div>
    </div>
  );
}
