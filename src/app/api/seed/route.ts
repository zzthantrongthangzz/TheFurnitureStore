import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";
import { mockProducts } from "@/data/mockProducts";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export async function GET() {
  return NextResponse.json(
    { message: "Use POST /api/seed with an admin session" },
    { status: 405 },
  );
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Bạn không có quyền seed dữ liệu" },
        { status: 403 },
      );
    }

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
  } catch (error: unknown) {
    console.error("Lỗi khi seed dữ liệu:", error);

    return NextResponse.json(
      {
        message: "Seeding thất bại. Hãy xem log ở Terminal của VS Code.",
        error: getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
