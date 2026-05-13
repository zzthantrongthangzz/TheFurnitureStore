// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// 1. HÀM GET: Khách hàng xem đơn của mình (hoặc Admin xem tất cả)
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập" },
        { status: 401 },
      );
    }

    let query = {};
    // Nếu KHÔNG phải admin, chỉ cho phép lấy các đơn hàng chứa email của khách đó
    if ((session.user as any).role !== "admin") {
      query = { userEmail: session.user.email };
    }

    // Lấy đơn hàng, sắp xếp mới nhất lên đầu
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi Server khi tải đơn hàng" },
      { status: 500 },
    );
  }
}

// 2. HÀM POST: Khách hàng đặt đơn mới
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = await req.json();

    // 1. Tạo và lưu đơn hàng mới
    const newOrder = new Order({
      userEmail: session?.user?.email || "guest",
      customerInfo: body.customerInfo,
      items: body.items,
      totalAmount: body.totalAmount,
    });

    const savedOrder = await newOrder.save();

    for (const item of body.items) {
      await Product.findByIdAndUpdate(item.id, {
        $inc: { soldQuantity: item.quantity },
      });
    }

    return NextResponse.json(
      { message: "Đặt hàng thành công", order: savedOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error("Lỗi khi lưu đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi Server khi đặt hàng" },
      { status: 500 },
    );
  }
}
