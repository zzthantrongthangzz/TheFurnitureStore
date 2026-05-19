import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";

export interface MongoProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  category: string;
  inStock?: boolean;
  isActive?: boolean;
  soldQuantity?: number;
  variants?: { inStock?: number }[];
}

type ProductDocument = Omit<MongoProduct, "_id"> & {
  _id: { toString(): string };
};

async function getProducts(): Promise<MongoProduct[]> {
  try {
    await connectToDatabase();

    const products = (await ProductModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean()) as ProductDocument[];

    return products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      imageUrl: product.imageUrl,
      category: product.category,
      inStock: product.inStock !== false,
      isActive: product.isActive !== false,
      soldQuantity: product.soldQuantity || 0,
      variants: product.variants,
    }));
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm trang chủ:", error);
    return [];
  }
}

export default async function ProductSection() {
  const products = await getProducts();

  const livingRoomProducts = products
    .filter((product) => product.category === "phong-khach")
    .slice(0, 5);
  const bedroomProducts = products
    .filter((product) => product.category === "phong-ngu")
    .slice(0, 5);

  const productGroups = [
    {
      id: "living-room",
      title: "Nội Thất Phòng Khách",
      products: livingRoomProducts,
      href: "/phong-khach",
    },
    {
      id: "bedroom",
      title: "Nội Thất Phòng Ngủ",
      products: bedroomProducts,
      href: "/phong-ngu",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 space-y-16 max-w-[1440px]">
      {productGroups.map(
        (group) =>
          group.products.length > 0 && (
            <div key={group.id}>
              <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {group.title}
                </h2>
                <Link
                  href={group.href}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 group"
                >
                  Xem thêm
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

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
