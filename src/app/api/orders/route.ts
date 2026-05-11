// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// 1. HÀM GET: Dùng cho Admin lấy toàn bộ danh sách đơn hàng
export async function GET() {
  try {
    await connectDB();
    // Lấy tất cả đơn hàng, sắp xếp theo thời gian mới nhất lên đầu
    const orders = await Order.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi Server khi tải đơn hàng" },
      { status: 500 }
    );
  }
}

// 2. HÀM POST: Dùng cho Khách hàng đặt đơn mới (Giữ nguyên của bạn)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newOrder = new Order({
      customerInfo: body.customerInfo,
      items: body.items,
      totalAmount: body.totalAmount,
    });

    const savedOrder = await newOrder.save();

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