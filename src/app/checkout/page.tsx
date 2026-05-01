// src/app/checkout/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State lưu trữ thông tin form
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "COD", // Mặc định là Thanh toán khi nhận hàng
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Gói dữ liệu chuẩn bị gửi lên Server
      const orderData = {
        customerInfo: formData,
        items: items,
        totalAmount: cartTotal,
      };

      // TẠM THỜI: In ra console để kiểm tra dữ liệu
      console.log("Dữ liệu chuẩn bị gửi đi:", orderData);

      /* ========================================================
         PHẦN NÀY SẼ MỞ KHÓA Ở BƯỚC SAU KHI CHÚNG TA VIẾT API
         
         const response = await fetch('/api/orders', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(orderData)
         });

         if (!response.ok) throw new Error("Lỗi khi đặt hàng");
         ======================================================== */

      // Giả lập thời gian server xử lý (1.5 giây)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      clearCart(); // Xóa giỏ hàng sau khi đặt thành công
      router.push("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return <div className="p-8 text-center">Đang tải...</div>;

  // Nếu không có sản phẩm trong giỏ thì không cho vào trang checkout
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Bạn chưa chọn sản phẩm nào</h2>
        <Link
          href="/products"
          className="text-orange-500 hover:underline flex items-center"
        >
          <ChevronLeft size={20} /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/cart"
            className="text-gray-500 hover:text-orange-600 flex items-center w-fit transition"
          >
            <ChevronLeft size={20} className="mr-1" /> Quay lại giỏ hàng
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Thanh toán</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Cột Trái: Form Thông Tin */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Thông tin giao hàng
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    placeholder="Nhập họ và tên người nhận"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    placeholder="Nhập số điện thoại liên hệ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng chi tiết *
                  </label>
                  <textarea
                    required
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú cho đơn hàng (Tùy chọn)
                  </label>
                  <textarea
                    name="note"
                    rows={2}
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    placeholder="Ghi chú thêm về thời gian giao hàng, yêu cầu đóng gói..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-600 accent-orange-500"
                  />
                  <span className="font-medium text-gray-800">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={formData.paymentMethod === "BANK_TRANSFER"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-600 accent-orange-500"
                  />
                  <span className="font-medium text-gray-800">
                    Chuyển khoản ngân hàng
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Cột Phải: Tóm tắt đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Đơn hàng của bạn
              </h2>

              <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-medium text-gray-800 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-gray-500">SL: {item.quantity}</p>
                      <p className="font-semibold text-orange-600">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{cartTotal.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center border-t mt-2 pt-4">
                  <span className="text-base font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-orange-500">
                    {cartTotal.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-6 py-3 px-4 flex items-center justify-center rounded-md font-bold text-white transition duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 size={20} className="mr-2" /> Hoàn tất đặt
                    hàng
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
