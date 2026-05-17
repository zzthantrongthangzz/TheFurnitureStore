// src/app/checkout/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { items, selectedIds, clearCart, clearSelectedItems, setItems } =
    useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State lưu trữ thông tin form
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "COD", // Mặc định là Thanh toán khi nhận hàng
  });

  // State lưu trữ lỗi Validation
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkoutItems =
    selectedIds.length > 0
      ? items.filter((item) => selectedIds.includes(item.id))
      : items;

  const cartTotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // 1. Hàm kiểm tra từng trường cụ thể (dùng chung cho onBlur, onChange, onSubmit)
  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "fullName":
        // Regex kiểm tra mỗi từ phải bắt đầu bằng chữ in hoa (Hỗ trợ tiếng Việt Unicode)
        const nameRegex = /^(\p{Lu}\p{Ll}*(\s|$))+$/u;
        if (!value.trim()) {
          error = "Vui lòng nhập họ và tên.";
        } else if (!nameRegex.test(value.trim())) {
          error = "Họ tên chưa đúng định dạng (VD: Nguyễn Văn Cảnh).";
        }
        break;
      case "phone":
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(value)) {
          error = "Số điện thoại không hợp lệ (10 số, VD: 0987654321).";
        }
        break;
      case "address":
        const trimmedAddress = value.trim();
        if (trimmedAddress.length === 0) {
          error = "Vui lòng không để trống địa chỉ.";
        } else {
          const firstChar = trimmedAddress.charAt(0);
          if (
            firstChar !== firstChar.toUpperCase() ||
            !/[A-ZÀ-Ỹ]/.test(firstChar)
          ) {
            error = "Địa chỉ phải bắt đầu bằng chữ cái in hoa.";
          } else if (trimmedAddress.length < 10) {
            error = "Vui lòng nhập địa chỉ chi tiết hơn (ít nhất 10 ký tự).";
          }
        }
        break;
    }
    return error;
  };

  // 2. Kích hoạt khi khách hàng click chuột ra khỏi ô nhập (onBlur)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // 3. Kích hoạt liên tục trong lúc gõ (onChange)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Nếu ô này ĐANG có lỗi, ta kiểm tra liên tục để tắt lỗi ngay khi khách gõ đúng
    if (errors[name as keyof typeof errors]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  // 4. Kiểm tra lại toàn bộ form trước khi Submit
  const validateForm = () => {
    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      phone: validateField("phone", formData.phone),
      address: validateField("address", formData.address),
    };
    setErrors(newErrors);

    // Form hợp lệ nếu không có bất kỳ thông báo lỗi nào
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // Chạy hàm Validate trước khi Submit
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị cục dữ liệu Đơn hàng để gửi xuống Backend
      const orderPayload = {
        customerInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          note: formData.note,
        },
        items: checkoutItems.map((item) => ({
          id: item.id,
          productId: item.id,
          slug: item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount: cartTotal,
        paymentMethod: formData.paymentMethod,
      };

      // Gọi API thật
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
      }

      const remainingItems =
        selectedIds.length > 0
          ? items.filter((item) => !selectedIds.includes(item.id))
          : [];

      if (remainingItems.length > 0) {
        setItems(remainingItems);
        clearSelectedItems();
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: remainingItems }),
        });
      } else {
        clearCart();
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [] }),
        });
      }

      router.push("/checkout/success");
    } catch (error: unknown) {
      console.error("Lỗi đặt hàng:", error);
      setSubmitError(error instanceof Error ? error.message : "Lỗi hệ thống");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-gray-400 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500 mb-8">
            Bạn chưa có sản phẩm nào để thanh toán.
          </p>
          <Link
            href="/products"
            className="inline-block bg-orange-500 text-white font-medium px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors duration-200"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          href="/cart"
          className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-8 transition-colors group font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Quay lại giỏ hàng
        </Link>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 font-medium">{submitError}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-3/5">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                Thông tin nhận hàng
              </h2>

              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Họ và tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Nhập họ và tên của bạn"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-colors ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Ví dụ: 0987654321"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-colors ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-colors ${
                      errors.address
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú đơn hàng (Tùy chọn)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Ghi chú thêm về đơn hàng hoặc thời gian giao hàng..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Phương thức thanh toán */}
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Phương thức thanh toán
                  </h3>
                  <div className="space-y-3">
                    {/* 1. Thanh toán COD */}
                    <label
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.paymentMethod === "COD"
                          ? "border-orange-500 bg-orange-50/30"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-3 font-medium text-gray-700">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </label>

                    {/* 2. Chuyển khoản ngân hàng */}
                    <label
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.paymentMethod === "BANK_TRANSFER"
                          ? "border-orange-500 bg-orange-50/30"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="BANK_TRANSFER"
                        checked={formData.paymentMethod === "BANK_TRANSFER"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-3 font-medium text-gray-700">
                        Chuyển khoản ngân hàng
                      </span>
                    </label>

                    {/* 3. Bảng thông tin hiện ra NẾU khách chọn Chuyển khoản */}
                    {formData.paymentMethod === "BANK_TRANSFER" && (
                      <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl mt-3 transition-all">
                        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                          Thông tin tài khoản nhận tiền:
                        </h4>
                        <div className="space-y-2 text-sm text-blue-900">
                          <p className="flex justify-between border-b border-blue-200/50 pb-2">
                            <span>Ngân hàng:</span>
                            <span className="font-bold">Vietcombank (VCB)</span>
                          </p>
                          <p className="flex justify-between border-b border-blue-200/50 pb-2">
                            <span>Số tài khoản:</span>
                            <span className="font-bold tracking-wider">
                              0123 456 789
                            </span>
                          </p>
                          <p className="flex justify-between border-b border-blue-200/50 pb-2">
                            <span>Chủ tài khoản:</span>
                            <span className="font-bold uppercase">
                              CONG TY NOI THAT 3T HOME
                            </span>
                          </p>
                          <p className="flex justify-between pt-1">
                            <span>Nội dung CK:</span>
                            <span className="font-bold text-orange-600">
                              Thanh toan don hang -{" "}
                              {formData.phone || "[Số điện thoại]"}
                            </span>
                          </p>
                        </div>
                        <p className="text-xs text-blue-600 italic mt-4 text-center">
                          * Vui lòng chuyển khoản đúng số tiền và nội dung. Đơn
                          hàng sẽ được xử lý ngay sau khi chúng tôi nhận được
                          thanh toán.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Tóm tắt đơn hàng ({checkoutItems.length} sản phẩm)
              </h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          SL: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-orange-600">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {cartTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí giao hàng</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {cartTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className={`w-full mt-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 flex justify-center items-center ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40"
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
                  "ĐẶT HÀNG NGAY"
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý với Điều khoản của
                3T Home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
