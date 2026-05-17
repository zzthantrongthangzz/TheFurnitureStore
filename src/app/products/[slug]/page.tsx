"use client";

// CẬP NHẬT: Nhớ import thêm hook `use` từ "react"
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";

type ProductAttribute = {
  key: string;
  value: string;
};

type ProductDetail = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  slug: string;
  images: string[];
  material: string;
  size: string;
  color: string;
  description: string;
  inStock: boolean;
};

// CẬP NHẬT: Đổi kiểu params thành Promise
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // CẬP NHẬT: Sử dụng React.use() để unwrap params
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const addItem = useCart((state) => state.addItem);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        // CẬP NHẬT: Thay params.slug thành biến slug đã unwrap ở trên
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) throw new Error("Sản phẩm không tồn tại");

        const data = await response.json();

        const allImages = [data.imageUrl];
        if (data.gallery && data.gallery.length > 0) {
          allImages.push(...data.gallery);
        }

        const getAttribute = (keyName: string) => {
          const attr = data.attributes?.find((a: ProductAttribute) =>
            a.key.toLowerCase().includes(keyName.toLowerCase()),
          );
          return attr ? attr.value : "Đang cập nhật";
        };

        const formattedProduct = {
          id: data._id,
          name: data.name,
          price: data.price,
          originalPrice: data.originalPrice || data.price,
          slug: data.slug,
          images: allImages,
          material: getAttribute("chất liệu"),
          size: getAttribute("kích thước"),
          color:
            getAttribute("màu") ||
            (data.variants && data.variants[0]?.color) ||
            "Đang cập nhật",
          description: data.description,
          inStock:
            data.inStock !== false &&
            (!data.variants?.length ||
              data.variants.reduce(
                (total: number, variant: { inStock?: number }) =>
                  total + (variant.inStock || 0),
                0,
              ) > 0),
        };

        setProduct(formattedProduct);
        setActiveImage(formattedProduct.images[0]);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!session) {
      alert("Vui lòng đăng nhập hoặc đăng ký tài khoản để mua hàng nhé!");
      return;
    }
    if (!product.inStock) {
      alert("Sản phẩm này hiện đang tạm hết hàng!");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0],
      slug: product.slug,
      quantity: quantity,
    });
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-20">
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm text-gray-500 space-x-2">
          <Link href="/" className="hover:text-orange-500 transition">
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-orange-500 transition">
            Sản phẩm
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 hide-scrollbar">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 md:w-full md:aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img
                      ? "border-orange-500"
                      : "border-transparent hover:border-orange-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx}`}
                    fill
                    sizes="(min-width: 768px) 96px, 80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="relative w-full aspect-square md:aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden flex-1">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
              <span className="text-3xl font-bold text-orange-600">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through mb-1">
                  {product.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <span className="w-24 text-gray-500 font-medium">
                  Chất liệu:
                </span>
                <span className="flex-1 text-gray-900">{product.material}</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-24 text-gray-500 font-medium">
                  Kích thước:
                </span>
                <span className="flex-1 text-gray-900">{product.size}</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-24 text-gray-500 font-medium">Màu sắc:</span>
                <span className="flex-1 text-gray-900">{product.color}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-600 text-white h-12 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
              >
                <ShoppingCart size={20} /> Thêm vào giỏ
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Truck className="text-orange-500" size={20} />
                <span>Giao hàng tận nơi</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <ShieldCheck className="text-orange-500" size={20} />
                <span>Bảo hành 5 năm</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <RefreshCw className="text-orange-500" size={20} />
                <span>Đổi trả dễ dàng</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Headphones className="text-orange-500" size={20} />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Mô tả sản phẩm
          </h2>
          <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      </div>
    </main>
  );
}
