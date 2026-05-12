// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// HÀM PUT: Dùng để Admin cập nhật trạng thái đơn hàng
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // 1. Định nghĩa params là một Promise
) {
  try {
    await connectDB();
    
    // 2. Await params để lấy ID (Khắc phục lỗi Next.js)
    const resolvedParams = await context.params;
    const orderId = resolvedParams.id;

    // Lấy trạng thái mới mà Frontend gửi lên
    const body = await req.json();
    const { status } = body;

    // 3. Tìm đơn hàng theo ID và cập nhật
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { returnDocument: 'after' } // 4. Khắc phục cảnh báo vàng của Mongoose
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Cập nhật trạng thái thành công", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi Server khi cập nhật" },
      { status: 500 }
    );
  }
}