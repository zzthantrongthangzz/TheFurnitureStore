import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { getErrorMessage, normalizeProductPayload } from "@/lib/productPayload";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// API LẤY THÔNG TIN SẢN PHẨM
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const product = await Product.findOne({
      slug: resolvedParams.slug,
      isActive: true,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// API XÓA SẢN PHẨM
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // 1. Kiểm tra quyền Admin
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện hành động này!" },
        { status: 403 },
      );
    }

    // 2. Lấy ID từ URL
    const resolvedParams = await params;
    const productId = resolvedParams.slug;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "ID sản phẩm không hợp lệ" },
        { status: 400 },
      );
    }

    // 3. Kết nối DB và xóa
    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm để xóa" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Đã xóa sản phẩm thành công!" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return NextResponse.json(
      {
        message: "Lỗi hệ thống khi xóa sản phẩm",
        error: getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

// API CẬP NHẬT SẢN PHẨM (SỬA)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // 1. Kiểm tra quyền Admin
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Bạn không có quyền!" },
        { status: 403 },
      );
    }

    // 2. Lấy ID và dữ liệu mới gửi lên
    const resolvedParams = await params;
    const productId = resolvedParams.slug;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "ID sản phẩm không hợp lệ" },
        { status: 400 },
      );
    }

    const { payload, error } = normalizeProductPayload(await req.json(), {
      partial: true,
    });

    if (!payload || error) {
      return NextResponse.json(
        { message: error || "Dữ liệu sản phẩm không hợp lệ" },
        { status: 400 },
      );
    }

    // 3. Kết nối DB và Cập nhật
    await connectToDatabase();

    // Tìm sản phẩm theo ID và cập nhật nội dung mới
    const updatedProduct = await Product.findByIdAndUpdate(productId, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Đã cập nhật thành công!", product: updatedProduct },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống khi cập nhật", error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
