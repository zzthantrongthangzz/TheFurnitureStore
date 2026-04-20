import { NextResponse } from "next/server";
// Dùng đường dẫn @/ vì bạn đã cấu hình tsconfig.json thành công
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";
import { mockProducts } from "@/data/mockProducts";

export async function GET() {
  try {
    console.log("Đang kết nối MongoDB...");
    await connectToDatabase();
    console.log("Kết nối thành công! Đang xóa dữ liệu cũ...");

    await ProductModel.deleteMany({});

    console.log("Đang chèn dữ liệu mới...");
    const insertedProducts = await ProductModel.insertMany(mockProducts);

    return NextResponse.json({
      message: "Seeding dữ liệu thành công!",
      totalInserted: insertedProducts.length,
    });
  } catch (error: any) {
    console.error("Lỗi khi seed dữ liệu:", error);

    // Trả về mã lỗi 500 cùng chi tiết lỗi để dễ bắt bệnh
    return NextResponse.json(
      {
        message: "Seeding thất bại. Hãy xem log ở Terminal của VS Code.",
        error: error.message || String(error),
      },
      { status: 500 },
    );
  }
}
