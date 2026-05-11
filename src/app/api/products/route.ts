import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Product from "@/models/Product";
import { connectToDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).lean();
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    // 1. Lấy thông tin session từ Server
    const session = await getServerSession(authOptions);
    
    // 2. Chốt chặn bảo mật cốt lõi: Chỉ Admin mới được phép gọi API này
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Hành động bị từ chối. Bạn không có quyền truy cập!" }, 
        { status: 403 }
      );
    }

    // 3. Kết nối DB và lấy dữ liệu người dùng gửi lên
    await connectToDatabase();
    const body = await req.json();

    // 4. Lưu vào Database (Giả định bạn đã có schema Product chuẩn)
    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json(
      { message: "Đã thêm sản phẩm thành công!", product: newProduct }, 
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống khi thêm sản phẩm", error: error.message }, 
      { status: 500 }
    );
  }
}

