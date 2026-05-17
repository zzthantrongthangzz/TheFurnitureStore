import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // IMPORT authOptions VÀO ĐÂY

// API GET
export async function GET() {
  try {
    // NHÉT authOptions VÀO TRONG NGOẶC (QUAN TRỌNG NHẤT)
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    await connectToDatabase();
    const cart = await Cart.findOne({ userEmail: session.user.email });

    if (!cart) return NextResponse.json({ items: [] }, { status: 200 });

    return NextResponse.json(cart, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// API POST
export async function POST(req: Request) {
  try {
    // NHÉT authOptions VÀO TRONG NGOẶC (QUAN TRỌNG NHẤT)
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập" },
        { status: 401 },
      );
    }

    const { items } = await req.json();
    await connectToDatabase();

    const updatedCart = await Cart.findOneAndUpdate(
      { userEmail: session.user.email },
      { items: items },
      { new: true, upsert: true },
    );

    return NextResponse.json(updatedCart, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Lỗi lưu giỏ hàng" }, { status: 500 });
  }
}
