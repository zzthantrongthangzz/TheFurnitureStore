// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

type CheckoutItemInput = {
  id?: string;
  slug?: string;
  quantity?: number;
};

type CheckoutPayload = {
  customerInfo?: {
    fullName?: string;
    phone?: string;
    address?: string;
    note?: string;
    paymentMethod?: string;
  };
  items?: CheckoutItemInput[];
  paymentMethod?: string;
};

// 1. HÀM GET: Khách hàng xem đơn của mình (hoặc Admin xem tất cả)
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập" },
        { status: 401 },
      );
    }

    let query = {};
    // Nếu KHÔNG phải admin, chỉ cho phép lấy các đơn hàng chứa email của khách đó
    if (session.user.role !== "admin") {
      query = { userEmail: session.user.email };
    }

    // Lấy đơn hàng, sắp xếp mới nhất lên đầu
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi Server khi tải đơn hàng" },
      { status: 500 },
    );
  }
}

// 2. HÀM POST: Khách hàng đặt đơn mới
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = (await req.json()) as CheckoutPayload;

    if (
      !body.customerInfo?.fullName ||
      !body.customerInfo.phone ||
      !body.customerInfo.address
    ) {
      return NextResponse.json(
        { message: "Thông tin nhận hàng chưa đầy đủ" },
        { status: 400 },
      );
    }

    const requestedItems = Array.isArray(body.items) ? body.items : [];
    const validItems = requestedItems
      .map((item) => ({
        id: item.id,
        slug: item.slug,
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      }))
      .filter((item) =>
        Boolean(
          (item.id && mongoose.Types.ObjectId.isValid(item.id)) || item.slug,
        ),
      );

    if (validItems.length === 0) {
      return NextResponse.json(
        { message: "Đơn hàng không có sản phẩm hợp lệ" },
        { status: 400 },
      );
    }

    const productIds = validItems
      .map((item) => item.id)
      .filter((id): id is string =>
        Boolean(id && mongoose.Types.ObjectId.isValid(id)),
      );
    const productSlugs = validItems
      .map((item) => item.slug)
      .filter((slug): slug is string => Boolean(slug));

    const products = await Product.find({
      isActive: true,
      $or: [{ _id: { $in: productIds } }, { slug: { $in: productSlugs } }],
    }).lean();

    const productMapById = new Map(
      products.map((product) => [product._id.toString(), product]),
    );
    const productMapBySlug = new Map(
      products.map((product) => [product.slug, product]),
    );
    const orderItems = validItems
      .map((item) => {
        const product =
          (item.id ? productMapById.get(item.id) : undefined) ||
          (item.slug ? productMapBySlug.get(item.slug) : undefined);
        if (!product) return null;

        return {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          imageUrl: product.imageUrl,
          slug: product.slug,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (orderItems.length !== validItems.length) {
      return NextResponse.json(
        { message: "Một số sản phẩm không tồn tại hoặc đã ngừng bán" },
        { status: 400 },
      );
    }

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // 1. Tạo và lưu đơn hàng mới
    const newOrder = new Order({
      userEmail: session?.user?.email || "guest",
      customerInfo: {
        fullName: body.customerInfo.fullName,
        phone: body.customerInfo.phone,
        address: body.customerInfo.address,
        note: body.customerInfo.note,
        paymentMethod:
          body.paymentMethod || body.customerInfo.paymentMethod || "COD",
      },
      items: orderItems,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.id, {
        $inc: { soldQuantity: item.quantity },
      });
    }

    return NextResponse.json(
      { message: "Đặt hàng thành công", order: savedOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error("Lỗi khi lưu đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi Server khi đặt hàng" },
      { status: 500 },
    );
  }
}
