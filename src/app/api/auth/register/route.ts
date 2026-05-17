import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db"; // Đường dẫn file db của bạn

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Lỗi không xác định";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // 1. Lấy thêm name từ request
    const { name, email, phone, password } = await req.json();

    // 2. Kiểm tra dữ liệu (bổ sung check name)
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email này đã được đăng ký" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Lưu thêm name vào DB
    await User.create({
      name, // Lưu Tên khách hàng
      email,
      phone,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Đăng ký thành công" },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Lỗi server: " + getErrorMessage(error) },
      { status: 500 },
    );
  }
}
