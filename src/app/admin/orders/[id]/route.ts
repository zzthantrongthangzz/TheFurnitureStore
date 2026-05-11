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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { status } = body;

    // Tìm đơn hàng theo ID và cập nhật trạng thái
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { status: status },
      { new: true } // Trả về data mới sau khi cập nhật
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