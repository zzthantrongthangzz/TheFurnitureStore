// src/app/cart/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- HÀM ĐỒNG BỘ LÊN MONGODB ---
  const syncCartToDB = async (updatedItems: any[]) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
    } catch (error) {
      console.error("Lỗi đồng bộ giỏ hàng:", error);
    }
  };

  // --- XỬ LÝ NÚT TĂNG GIẢM SỐ LƯỢNG ---
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1

    // 1. Cập nhật giao diện mượt mà (Zustand)
    updateQuantity(id, newQuantity);

    // 2. Chuẩn bị mảng mới và gửi lên DB
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item,
    );
    syncCartToDB(updatedItems);
  };

  // --- XỬ LÝ NÚT XÓA SẢN PHẨM ---
  const handleRemoveItem = (id: string) => {
    // 1. Xóa khỏi giao diện (Zustand)
    removeItem(id);

    // 2. Chuẩn bị mảng mới (đã lọc bỏ sản phẩm) và gửi lên DB
    const updatedItems = items.filter((item) => item.id !== id);
    syncCartToDB(updatedItems);
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto p-8 text-center text-gray-500 font-medium">
        Đang tải giỏ hàng...
      </div>
    );
  }

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500 mb-6">
          Chưa có sản phẩm nào được thêm vào giỏ hàng.
        </p>
        <Link
          href="/products"
          className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Giỏ hàng của bạn
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột danh sách sản phẩm */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-2">
                              <Link href={`/products/${item.slug}`}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="ml-4 whitespace-nowrap">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN",
                              )}{" "}
                              đ
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Đơn giá: {item.price.toLocaleString("vi-VN")} đ
                          </p>
                        </div>

                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                          {/* Bộ tăng giảm số lượng */}
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                              disabled={item.quantity <= 1} // Mờ nút đi nếu số lượng là 1
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 py-1 font-medium text-gray-800 min-w-[40px] text-center border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="font-medium text-red-500 hover:text-red-600 flex items-center transition"
                            >
                              <Trash2 size={18} className="mr-1" />
                              <span className="hidden sm:inline">Xóa</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Cột Tổng tiền & Thanh toán */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="flow-root">
                <dl className="-my-4 divide-y divide-gray-200 text-sm">
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Tạm tính</dt>
                    <dd className="font-medium text-gray-900">
                      {cartTotal.toLocaleString("vi-VN")} đ
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Phí vận chuyển</dt>
                    <dd className="text-green-600 font-medium">Miễn phí</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-bold text-gray-900">
                      Tổng cộng
                    </dt>
                    <dd className="text-xl font-bold text-orange-500">
                      {cartTotal.toLocaleString("vi-VN")} đ
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 transition"
                >
                  Tiến hành thanh toán
                </Link>
              </div>
              <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                <p>
                  hoặc{" "}
                  <Link
                    href="/products"
                    className="font-medium text-orange-500 hover:text-orange-400"
                  >
                    Tiếp tục mua sắm
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
