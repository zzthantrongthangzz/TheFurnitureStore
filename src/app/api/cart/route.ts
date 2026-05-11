import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth"; // Lấy session ở Backend

// API lấy giỏ hàng của User (GET)
export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    // Nếu chưa đăng nhập, trả về mảng rỗng
    if (!session || !session.user?.email) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    await connectToDatabase();

    // Tìm giỏ hàng theo email user (Hoặc User ID nếu bạn lưu theo ID)
    // Ở đây giả sử trong Schema Cart của bạn có lưu email user
    let cart = await Cart.findOne({ userEmail: session.user.email });

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
