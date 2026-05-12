import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
  try {
    await connectDB();
    
    // Lấy tất cả đơn hàng, sắp xếp từ cũ đến mới để vẽ biểu đồ thời gian
    const orders = await Order.find({}).sort({ createdAt: 1 });

    // 1. Tính tổng doanh thu (Bỏ qua các đơn Đã hủy)
    const validOrders = orders.filter(o => o.status !== "CANCELLED");
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Thống kê trạng thái đơn hàng (Biểu đồ Tròn)
    const statusCounts = { PENDING: 0, PROCESSING: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };
    orders.forEach(o => {
      if (statusCounts[o.status as keyof typeof statusCounts] !== undefined) {
        statusCounts[o.status as keyof typeof statusCounts]++;
      }
    });

    const orderStatusData = [
      { name: "Chờ xác nhận", value: statusCounts.PENDING, color: "#f59e0b" }, // Vàng
      { name: "Đang xử lý", value: statusCounts.PROCESSING, color: "#3b82f6" }, // Xanh dương
      { name: "Đang giao", value: statusCounts.SHIPPED, color: "#8b5cf6" }, // Tím
      { name: "Đã giao", value: statusCounts.DELIVERED, color: "#10b981" }, // Xanh lá
      { name: "Đã hủy", value: statusCounts.CANCELLED, color: "#ef4444" }, // Đỏ
    ].filter(item => item.value > 0); // Chỉ lấy những trạng thái có dữ liệu để biểu đồ không bị rác

    // Gom nhóm doanh thu theo ngày (Dùng cho Biểu đồ Vùng - Area Chart)
    const revenueByDate: Record<string, number> = {};
    validOrders.forEach(o => {
      const date = new Date(o.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
      revenueByDate[date] = (revenueByDate[date] || 0) + o.totalAmount;
    });

    const revenueChartData = Object.entries(revenueByDate)
      .map(([date, total]) => ({ date, total }))
      .slice(-7); // Chỉ lấy 7 ngày gần nhất có phát sinh giao dịch

    // Tính toán các chỉ số phụ (KPIs)
    const totalOrders = orders.length;
    const pendingOrders = statusCounts.PENDING;
    const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      avgOrderValue,
      orderStatusData,
      revenueChartData,
      recentOrders: orders.slice(-5).reverse() // Cắt 5 đơn hàng mới nhất
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi Dashboard API:", error);
    return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
  }
}