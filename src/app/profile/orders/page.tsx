"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Clock, ShoppingBag, MapPin, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const translateStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPED":
      return "Đang giao";
    case "DELIVERED":
      return "Đã giao";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "PROCESSING":
      return "bg-blue-100 text-blue-700";
    case "SHIPPED":
      return "bg-purple-100 text-purple-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchOrders();
  }, [session]);

  // --- HÀM XỬ LÝ HỦY ĐƠN HÀNG ---
  const handleCancelOrder = async (orderId: string) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        alert("Hủy đơn hàng thành công!");
        // Cập nhật lại UI ngay lập tức
        setOrders((prevOrders: any) =>
          prevOrders.map((o: any) =>
            o._id === orderId ? { ...o, status: "CANCELLED" } : o,
          ),
        );
      } else {
        const data = await res.json();
        alert(data.message || "Lỗi khi hủy đơn");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-medium text-gray-500">
        Đang tải lịch sử đơn hàng...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <ShoppingBag className="text-orange-500" /> Đơn hàng của tôi
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
            <Link
              href="/products"
              className="text-orange-500 font-bold hover:underline"
            >
              Bắt đầu mua sắm ngay →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                    <span>
                      Mã đơn:{" "}
                      <span className="font-mono text-gray-900 font-bold">
                        {order._id.slice(-8).toUpperCase()}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}
                  >
                    {translateStatus(order.status)}
                  </span>
                </div>

                <div className="p-5 divide-y divide-gray-100">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-medium text-gray-800 hover:text-orange-500 transition line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          Số lượng: x{item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-bold text-gray-900">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600 max-w-sm">
                    <MapPin
                      size={16}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.customerInfo.fullName} -{" "}
                        {order.customerInfo.phone}
                      </p>
                      <p className="line-clamp-1">
                        {order.customerInfo.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-gray-100 pt-4 sm:pt-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 font-medium">
                        Tổng tiền:
                      </span>
                      <span className="text-xl font-bold text-orange-600">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    {/* NÚT HỦY ĐƠN HÀNG CHỈ HIỆN KHI ĐANG PENDING */}
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="ml-4 flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                      >
                        <XCircle size={16} /> Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
