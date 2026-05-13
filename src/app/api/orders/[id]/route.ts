// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Cần để hoàn trả số lượng đã bán
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// ==========================================
// HÀM PUT: Dùng để Admin cập nhật trạng thái đơn hàng
// ==========================================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await context.params;
    const orderId = resolvedParams.id;

    const body = await req.json();
    const { status } = body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { returnDocument: "after" },
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn hàng" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Cập nhật trạng thái thành công", order: updatedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi Server khi cập nhật" },
      { status: 500 },
    );
  }
}

// ==========================================
// HÀM PATCH: Dùng để Khách tự hủy đơn & Hoàn trả tồn kho
// ==========================================
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // 1. Kiểm tra đăng nhập
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập" },
        { status: 401 },
      );
    }

    // 2. Lấy ID đơn hàng chuẩn theo Next.js 15
    const resolvedParams = await context.params;
    const orderId = resolvedParams.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn hàng" },
        { status: 404 },
      );
    }

    // 3. Xác thực quyền chủ sở hữu đơn hàng (Chỉ người đặt hoặc admin mới được hủy)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (
      order.userEmail !== session.user.email &&
      (session.user as any).role !== "admin"
    ) {
      return NextResponse.json(
        { message: "Không có quyền thao tác" },
        { status: 403 },
      );
    }

    // 4. Chỉ cho phép hủy khi đang chờ xác nhận
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { message: "Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận" },
        { status: 400 },
      );
    }

    // 5. Đổi trạng thái sang Hủy
    order.status = "CANCELLED";
    await order.save();

    // 6. HOÀN TRẢ SỐ LƯỢNG ĐÃ BÁN (Trừ đi số lượng khách đã hủy)
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.id,
        { $inc: { soldQuantity: -item.quantity } }, // Phép toán $inc với số âm để trừ đi
      );
    }

    return NextResponse.json(
      { message: "Hủy đơn hàng thành công" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
  }
}
