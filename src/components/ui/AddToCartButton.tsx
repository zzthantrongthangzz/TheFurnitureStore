"use client";

import { useCart } from "@/hooks/useCart";

// Thay "any" bằng type Product thực tế của bạn sau này
export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image,
      slug: product.slug,
      quantity: 1,
    });
    alert("Đã thêm " + product.name + " vào giỏ!");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
    >
      Thêm vào giỏ
    </button>
  );
}
