import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/models/Order";

// Ép Next.js lấy dữ liệu mới nhất (Không dùng cache)
export const dynamic = "force-dynamic";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

type OrderItem = {
  name?: string;
  quantity?: number;
  price?: number;
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Bạn không có quyền xem thống kê" },
        { status: 403 },
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    const query: { createdAt?: { $gte: Date } } = {};
    const now = new Date();

    if (range === "7d") {
      query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    } else if (range === "30d") {
      query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 30)) };
    } else if (range === "this_month") {
      query.createdAt = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      };
    } else if (range === "this_year") {
      query.createdAt = { $gte: new Date(now.getFullYear(), 0, 1) };
    }

    const orders = await Order.find(query).sort({ createdAt: 1 });
    const validOrders = orders.filter((o) => o.status !== "CANCELLED");
    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    const statusCounts = {
      PENDING: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    orders.forEach((o) => {
      if (statusCounts[o.status as keyof typeof statusCounts] !== undefined) {
        statusCounts[o.status as keyof typeof statusCounts]++;
      }
    });

    const orderStatusData = [
      { name: "Chờ xác nhận", value: statusCounts.PENDING, color: "#f59e0b" },
      { name: "Đang xử lý", value: statusCounts.PROCESSING, color: "#3b82f6" },
      { name: "Đang giao", value: statusCounts.SHIPPED, color: "#8b5cf6" },
      { name: "Đã giao", value: statusCounts.DELIVERED, color: "#10b981" },
      { name: "Đã hủy", value: statusCounts.CANCELLED, color: "#ef4444" },
    ].filter((item) => item.value > 0);

    const revenueByDate: Record<string, number> = {};
    validOrders.forEach((o) => {
      const date = new Date(o.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      revenueByDate[date] = (revenueByDate[date] || 0) + o.totalAmount;
    });
    const revenueChartData = Object.entries(revenueByDate).map(
      ([date, total]) => ({ date, total }),
    );

    //  Gom nhóm theo Tên Sản Phẩm
    const productSales: Record<
      string,
      { name: string; sold: number; revenue: number }
    > = {};
    validOrders.forEach((order) => {
      order.items.forEach((item: OrderItem) => {
        const key = item.name || "Sản phẩm chưa rõ"; // Dùng tên làm khóa
        if (!productSales[key]) {
          productSales[key] = { name: key, sold: 0, revenue: 0 };
        }
        productSales[key].sold += item.quantity || 1;
        productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topProductsData = Object.values(productSales)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    const totalOrders = orders.length;
    const pendingOrders = statusCounts.PENDING;
    const avgOrderValue =
      validOrders.length > 0
        ? Math.round(totalRevenue / validOrders.length)
        : 0;

    return NextResponse.json(
      {
        totalRevenue,
        totalOrders,
        pendingOrders,
        avgOrderValue,
        orderStatusData,
        revenueChartData,
        topProductsData,
        recentOrders: orders.slice(-5).reverse(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi Dashboard API:", error);
    return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
  }
}
