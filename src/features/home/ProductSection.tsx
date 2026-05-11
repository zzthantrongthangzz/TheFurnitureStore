import React from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGroup } from '@/types';

// Data mẫu (có thể chuyển sang file mock data riêng)
const PRODUCT_GROUPS: ProductGroup[] = [
    {
        id: 'living-room',
        title: 'Nội Thất Phòng Khách',
        products: [
            { id: 1, name: 'Sofa Da Cao Cấp', price: '15.000.000đ', image: 'https://picsum.photos/seed/sofa1/400/400' },
            { id: 2, name: 'Bàn Trà Gỗ Sồi', price: '3.500.000đ', image: 'https://picsum.photos/seed/table1/400/400' },
            { id: 3, name: 'Kệ Tivi Hiện Đại', price: '4.200.000đ', image: 'https://picsum.photos/seed/tvstand/400/400' },
        ]
    },
    {
        id: 'bedroom',
        title: 'Nội Thất Phòng Ngủ',
        products: [
            { id: 6, name: 'Giường Ngủ Gỗ Óc Chó', price: '12.500.000đ', image: 'https://picsum.photos/seed/bed1/400/400' },
            { id: 7, name: 'Tủ Quần Áo 3 Buồng', price: '8.900.000đ', image: 'https://picsum.photos/seed/wardrobe/400/400' },
            { id: 8, name: 'Bàn Trang Điểm', price: '4.500.000đ', image: 'https://picsum.photos/seed/makeup/400/400' },
        ]
    }
];

export default function ProductSection() {
    return (
        <section className="container mx-auto px-4 py-16 space-y-16">
            {PRODUCT_GROUPS.map((group) => (
                <div key={group.id}>
                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{group.title}</h2>
                        <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 group">
                            Xem thêm
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar">
                        {group.products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}