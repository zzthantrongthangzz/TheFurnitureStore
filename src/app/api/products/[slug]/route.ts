import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product"; 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// CẬP NHẬT: Đổi kiểu params thành Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } 
) {
  try {
    await connectDB();
    
    // CẬP NHẬT: Phải await params trước khi dùng
    const resolvedParams = await params; 
    
    // Sử dụng resolvedParams.slug
    const product = await Product.findOne({ slug: resolvedParams.slug, isActive: true });
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> } // Chữ 'slug' phải khớp với tên thư mục [slug]
) {
  try {
    // 1. Kiểm tra quyền Admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện hành động này!" },
        { status: 403 }
      );
    }

    // 2. Lấy ID từ URL (mặc dù tên biến là slug nhưng ở frontend mình truyền ID vào nên giá trị thực tế sẽ là ID)
    const resolvedParams = await params;
    const productId = resolvedParams.slug; 

    // 3. Kết nối DB và xóa
    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm để xóa" }, { status: 404 });
    }

    return NextResponse.json({ message: "Đã xóa sản phẩm thành công!" }, { status: 200 });

  } catch (error: any) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống khi xóa sản phẩm", error: error.message },
      { status: 500 }
    );
  }
}

// API CẬP NHẬT SẢN PHẨM (SỬA)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Kiểm tra quyền Admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Bạn không có quyền!" }, { status: 403 });
    }

    // 2. Lấy ID (hoặc slug) và dữ liệu mới gửi lên
    const resolvedParams = await params;
    const productId = resolvedParams.slug; 
    const body = await req.json();

    // 3. Kết nối DB và Cập nhật
    await connectToDatabase();
    
    // Tìm sản phẩm theo ID và cập nhật nội dung mới ({ new: true } để trả về data sau khi đã sửa)
    const updatedProduct = await Product.findByIdAndUpdate(productId, body, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json({ message: "Đã cập nhật thành công!", product: updatedProduct }, { status: 200 });

  } catch (error: any) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống khi cập nhật", error: error.message },
      { status: 500 }
    );
  }
}