import React from "react";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

// 1. Định nghĩa kiểu dữ liệu dựa trên schema MongoDB của bạn
export interface MongoProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  isActive: boolean;
}

// 2. Hàm fetch data gọi đến API route của bạn
async function getProducts(): Promise<MongoProduct[]> {
  try {
    // Gọi đến API route /api/products bạn đã tạo
    // Trong môi trường dev, URL có thể là http://localhost:3000
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products`,
      {
        cache: "no-store", // Đảm bảo luôn lấy data mới nhất (có thể đổi thành 'force-cache' nếu muốn)
      },
    );

    if (!res.ok) throw new Error("Không thể tải dữ liệu sản phẩm");

    const data = await res.json();
    // Giả sử API trả về object có dạng { success: true, data: [...] }
    return data.data || data;
  } catch (error) {
    console.error("Lỗi khi fetch products:", error);
    return []; // Trả về mảng rỗng nếu lỗi để UI không bị crash
  }
}

// 3. Biến component thành async
export default async function ProductSection() {
  // Fetch toàn bộ sản phẩm
  const products = await getProducts();

  // 4. Lọc và nhóm dữ liệu theo category từ MongoDB
  // Lấy 4 sản phẩm đầu tiên cho mỗi nhóm để giao diện đẹp gọn
  const livingRoomProducts = products
    .filter((p) => p.category === "phong-khach")
    .slice(0, 5);
  const bedroomProducts = products
    .filter((p) => p.category === "phong-ngu")
    .slice(0, 5);

  // Cấu trúc lại mảng render để map ra UI
  const PRODUCT_GROUPS = [
    {
      id: "living-room",
      title: "Nội Thất Phòng Khách",
      products: livingRoomProducts,
    },
    {
      id: "bedroom",
      title: "Nội Thất Phòng Ngủ",
      products: bedroomProducts,
    },
  ];

  return (
    // Thêm max-w-[1440px] để khung rộng ra đủ sức chứa 5 item trên màn hình to
    <section className="container mx-auto px-4 py-16 space-y-16 max-w-[1440px]">
      {PRODUCT_GROUPS.map(
        (group) =>
          group.products.length > 0 && (
            <div key={group.id}>
              <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {group.title}
                </h2>
                <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 group">
                  Xem thêm
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>

              {/* Thêm 2xl:justify-center để ép các thẻ vào giữa màn hình khi xem trên Desktop */}
              <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar justify-start 2xl:justify-center">
                {group.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ),
      )}
    </section>
  );
}
