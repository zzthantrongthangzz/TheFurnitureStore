"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react"; // 1. Import hook kiểm tra đăng nhập

export interface MongoProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: MongoProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // 2. Lấy danh sách items cũ và hàm addItem
  const { items, addItem } = useCart();
  // 3. Lấy thông tin đăng nhập của khách hàng
  const { data: session } = useSession();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // LÕI BẢO MẬT: Kiểm tra xem đã đăng nhập chưa
    if (!session) {
      alert("Vui lòng đăng nhập hoặc đăng ký tài khoản để mua hàng nhé!");
      return; // Dừng hàm ngay lập tức, không cho thêm vào giỏ
    }

    const newItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug,
      quantity: 1,
    };

    // 4A. Cập nhật giao diện mượt mà ngay lập tức (Zustand)
    addItem(newItem);

    // 4B. Cấu trúc lại mảng items mới nhất để gửi lên Server
    const updatedItems = [...items];
    const existingIndex = updatedItems.findIndex((i) => i.id === product._id);
    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += 1;
    } else {
      updatedItems.push(newItem);
    }

    // 5. Ngầm gọi API lưu dữ liệu xuống MongoDB
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
      alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (error) {
      console.error("Lỗi đồng bộ giỏ hàng:", error);
    }
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

      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-orange-600 font-bold text-lg">
          {product.price
            ? `${product.price.toLocaleString("vi-VN")}đ`
            : "Đang cập nhật"}
        </p>

        {product.originalPrice && product.originalPrice > product.price && (
          <p className="text-gray-400 line-through text-sm font-medium">
            {product.originalPrice.toLocaleString("vi-VN")}đ
          </p>
        )}
      </div>
    </div>
  );
}
