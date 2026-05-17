"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types/cart";

export default function CartPage() {
  const router = useRouter();

  // Lấy thêm các state và hàm xử lý checkbox từ Zustand
  const {
    items,
    selectedIds,
    removeItem,
    updateQuantity,
    toggleSelectItem,
    selectAllItems,
  } = useCart();

  const syncCartToDB = async (updatedItems: CartItem[]) => {
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

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item,
    );
    syncCartToDB(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    const updatedItems = items.filter((item) => item.id !== id);
    syncCartToDB(updatedItems);
  };

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để tiến hành thanh toán!");
      return;
    }
    // Chuyển sang trang checkout
    router.push("/checkout");
  };

  // CHỈ TÍNH TỔNG TIỀN CHO NHỮNG SẢN PHẨM ĐƯỢC TÍCH CHỌN
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const cartTotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <Link
          href="/products"
          className="mt-4 bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} /> Tiếp tục mua sắm
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
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {/* Checkbox CHỌN TẤT CẢ */}
              <div className="flex items-center gap-4 p-5 bg-gray-50/50 border-b border-gray-100">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => selectAllItems(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 rounded border-gray-300 cursor-pointer"
                />
                <span className="font-bold text-gray-700">
                  Chọn tất cả ({items.length} sản phẩm)
                </span>
              </div>

              <div className="p-6">
                <ul className="-my-6 divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-6 items-center gap-4">
                      {/* Checkbox TỪNG SẢN PHẨM */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-5 h-5 accent-orange-500 rounded border-gray-300 cursor-pointer flex-shrink-0"
                      />

                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={96}
                          height={96}
                          unoptimized
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-2">
                              <Link href={`/products/${item.slug}`}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="ml-4 whitespace-nowrap text-orange-600 font-bold">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN",
                              )}{" "}
                              đ
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
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

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="font-medium text-red-500 hover:text-red-600 flex items-center transition"
                          >
                            <Trash2 size={18} className="mr-1" />{" "}
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>
              <div className="flow-root">
                <dl className="-my-4 divide-y divide-gray-200 text-sm">
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Đã chọn</dt>
                    <dd className="font-medium text-gray-900">
                      {selectedItems.length} sản phẩm
                    </dd>
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
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 transition"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
