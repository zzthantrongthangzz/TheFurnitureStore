import React from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="min-w-[260px] max-w-[260px] snap-start group cursor-pointer">
            <div className="relative w-full h-[260px] overflow-hidden rounded-xl mb-4 bg-white shadow-sm">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="260px"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300">
                        <ShoppingCart size={18} /> Thêm vào giỏ
                    </button>
                </div>
            </div>
            <h3 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors text-lg truncate">
                {product.name}
            </h3>
            <p className="text-orange-600 font-bold mt-1 text-lg">{product.price}</p>
        </div>
    );
}