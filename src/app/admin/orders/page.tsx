// src/app/admin/orders/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  Search,
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  CreditCard,
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
}

interface Order {
  _id: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

const ORDER_STATUSES = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  PROCESSING: {
    label: "Đang chuẩn bị hàng",
    color: "bg-blue-100 text-blue-800",
    icon: Package,
  },
  SHIPPED: {
    label: "Đang giao hàng",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao thành công",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State cho Modal Chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // FETCH DỮ LIỆU TỪ BACKEND
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      // Sắp xếp đơn hàng mới nhất lên đầu
      const sortedOrders = data.orders.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      setOrders([
        {
          _id: "ORD-9823741",
          customerInfo: {
            fullName: "Nguyễn Thái Sơn",
            phone: "0987654321",
            address: "12 Nguyễn Văn Bảo, Gò Vấp, HCM",
            note: "Giao giờ hành chính",
          },
          items: [
            {
              id: "1",
              productId: "p1",
              name: "Tủ Quần Áo Đơn VLINE V3 60cm",
              price: 7990000,
              quantity: 2,
              imageUrl: "https://via.placeholder.com/150",
            },
          ],
          totalAmount: 15980000,
          paymentMethod: "COD",
          status: "PENDING",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // NGHIỆP VỤ CẬP NHẬT TRẠNG THÁI
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái: ${ORDER_STATUSES[newStatus as keyof typeof ORDER_STATUSES].label}?`,
      )
    )
      return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      // Cập nhật lại UI ngay lập tức
      setOrders(
        orders.map((o) =>
          o._id === orderId
            ? { ...o, status: newStatus as Order["status"] }
            : o,
        ),
      );
      if (selectedOrder)
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus as Order["status"],
        });

      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Lọc đơn hàng theo tìm kiếm (Tên khách hoặc Mã ĐH)
  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      o.customerInfo.phone.includes(searchTerm),
  );

  return (
    <div className="p-6">
      {/* Header & Thanh công cụ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi và xử lý các đơn hàng từ khách hàng
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm mã đơn, tên, SĐT khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Bảng dữ liệu chính */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Mã Đơn Hàng</th>
                <th className="p-4 font-semibold">Khách Hàng</th>
                <th className="p-4 font-semibold">Ngày Đặt</th>
                <th className="p-4 font-semibold">Tổng Tiền</th>
                <th className="p-4 font-semibold">Trạng Thái</th>
                <th className="p-4 font-semibold text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig =
                    ORDER_STATUSES[order.status] || ORDER_STATUSES.PENDING;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {/* Cắt ngắn ID MongoDB cho đẹp */}#
                        {order._id
                          .substring(order._id.length - 6)
                          .toUpperCase()}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {order.customerInfo.fullName}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {order.customerInfo.phone}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4 font-bold text-orange-600">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT & CẬP NHẬT ĐƠN HÀNG*/}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết đơn hàng #
                  {selectedOrder._id
                    .substring(selectedOrder._id.length - 6)
                    .toUpperCase()}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  ID hệ thống: {selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cột 1 & 2: Sản phẩm & Khách hàng */}
              <div className="md:col-span-2 space-y-8">
                {/* Thông tin sản phẩm */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">
                    Sản phẩm đã đặt
                  </h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 line-clamp-1">
                            {item.name}
                          </h4>
                          <div className="text-sm text-gray-500 mt-1">
                            Mã SP: {item.productId}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            SL: x{item.quantity}
                          </div>
                          <div className="font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Thông tin nhận hàng */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">
                    Thông tin nhận hàng
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 text-sm">
                    <p className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Họ và tên:</span>
                      <span className="font-medium text-gray-900">
                        {selectedOrder.customerInfo.fullName}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Số điện thoại:</span>
                      <span className="font-medium text-gray-900">
                        {selectedOrder.customerInfo.phone}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Địa chỉ:</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs">
                        {selectedOrder.customerInfo.address}
                      </span>
                    </p>
                    {selectedOrder.customerInfo.note && (
                      <p className="flex justify-between">
                        <span className="text-gray-500">Ghi chú:</span>
                        <span className="font-medium text-orange-600 italic text-right max-w-xs">
                          "{selectedOrder.customerInfo.note}"
                        </span>
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* Cột 3: Thanh toán & Xử lý */}
              <div className="space-y-6">
                {/* Tổng quan thanh toán */}
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Thanh toán
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-orange-800">
                      <span>Tạm tính</span>
                      <span>
                        {selectedOrder.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-orange-800 border-b border-orange-200/50 pb-3">
                      <span>Phí giao hàng</span>
                      <span>0đ</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="font-bold text-orange-900">
                        Tổng cộng
                      </span>
                      <span className="text-2xl font-black text-orange-600">
                        {selectedOrder.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-orange-200/50">
                      <span className="block text-xs text-orange-700 mb-1">
                        Phương thức
                      </span>
                      <span className="font-bold text-orange-900 bg-white px-3 py-1.5 rounded-md inline-block border border-orange-200 shadow-sm">
                        {selectedOrder.paymentMethod === "COD"
                          ? "Thanh toán khi nhận hàng (COD)"
                          : "Chuyển khoản ngân hàng"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khối Cập nhật trạng thái */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Cập nhật trạng thái
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Trạng thái hiện tại:
                  </p>

                  {/* Hiển thị trạng thái hiện tại */}
                  <div
                    className={`px-4 py-3 rounded-lg flex items-center mb-6 border ${ORDER_STATUSES[selectedOrder.status].color.replace("text", "border").replace("100", "200")}`}
                  >
                    {React.createElement(
                      ORDER_STATUSES[selectedOrder.status].icon,
                      { className: "w-5 h-5 mr-2" },
                    )}
                    <span className="font-bold">
                      {ORDER_STATUSES[selectedOrder.status].label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 mb-2">
                      Chuyển trạng thái sang:
                    </p>
                    {/* Các nút hành động */}
                    {selectedOrder.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder._id, "PROCESSING")
                        }
                        disabled={isUpdatingStatus}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        Xác nhận & Chuẩn bị hàng
                      </button>
                    )}
                    {selectedOrder.status === "PROCESSING" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder._id, "SHIPPED")
                        }
                        disabled={isUpdatingStatus}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        Giao cho đơn vị vận chuyển
                      </button>
                    )}
                    {selectedOrder.status === "SHIPPED" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder._id, "DELIVERED")
                        }
                        disabled={isUpdatingStatus}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        Xác nhận đã giao thành công
                      </button>
                    )}

                    {/* Nút hủy đơn (Chỉ hiện khi chưa giao hàng) */}
                    {(selectedOrder.status === "PENDING" ||
                      selectedOrder.status === "PROCESSING") && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder._id, "CANCELLED")
                        }
                        disabled={isUpdatingStatus}
                        className="w-full py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-sm mt-2"
                      >
                        Hủy đơn hàng này
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
