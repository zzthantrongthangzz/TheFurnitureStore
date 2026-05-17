"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";

export interface MongoProduct {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  soldQuantity?: number;
  inStock?: boolean;
  variants?: { inStock?: number }[];
}

interface ProductCardProps {
  product: MongoProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem } = useCart();
  const { data: session } = useSession();
  const productId = product._id || product.id || product.slug;

  // Tính tổng hàng tồn kho ngầm để khóa nút nếu hết hàng
  const totalStock = product.variants?.length
    ? product.variants.reduce(
        (total, variant) => total + (variant.inStock || 0),
        0,
      )
    : product.inStock === false
      ? 0
      : 1;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert("Vui lòng đăng nhập hoặc đăng ký tài khoản để mua hàng nhé!");
      return;
    }

    if (totalStock <= 0) {
      alert("Sản phẩm này hiện đang tạm hết hàng!");
      return;
    }

    const newItem = {
      id: productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug,
      quantity: 1,
    };

    addItem(newItem);

    const updatedItems = [...items];
    const existingIndex = updatedItems.findIndex((i) => i.id === productId);
    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += 1;
    } else {
      updatedItems.push(newItem);
    }

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
    <div className="w-full h-full group cursor-pointer relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 hover:border-orange-200 transition-all duration-300 overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square overflow-hidden bg-gray-50 block"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {product.discountPercent && product.discountPercent > 0 ? (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-sm">
            -{product.discountPercent}%
          </div>
        ) : null}

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
          <button
            onClick={handleAddToCart}
            disabled={totalStock <= 0}
            className={`${
              totalStock > 0
                ? "bg-white text-gray-900 hover:bg-orange-500 hover:text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto`}
          >
            <ShoppingCart size={18} />{" "}
            {totalStock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`} className="block mb-2">
          <h3 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors text-base line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Chỉ hiển thị Đã bán */}
        <div className="flex items-center text-xs text-gray-500 mb-2 mt-auto">
          <span>Đã bán</span>
          <span className="ml-1 font-medium text-gray-700">
            {product.soldQuantity || 0}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-1 pt-2 border-t border-gray-100">
          <p className="text-orange-600 font-bold text-lg">
            {product.price
              ? `${product.price.toLocaleString("vi-VN")}đ`
              : "Đang cập nhật"}
          </p>

          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-gray-400 line-through text-xs font-medium">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
