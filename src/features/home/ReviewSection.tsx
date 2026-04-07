import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Review } from '@/types';

const REVIEWS: Review[] = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        rating: 5,
        content: 'Sản phẩm chất lượng rất tốt, gỗ chắc chắn, màu sắc đẹp như hình.',
        productImage: 'https://picsum.photos/seed/sofa1/200/200',
        avatar: 'https://picsum.photos/seed/user1/100/100'
    },
    // Thêm các review khác...
];

export default function ReviewSection() {
    return (
        <section className="bg-orange-50/50 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Khách Hàng Đánh Giá</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Những phản hồi chân thực từ khách hàng đã trải nghiệm sản phẩm.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {REVIEWS.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-14 h-14 rounded-full border-2 border-orange-100 overflow-hidden">
                                    <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="56px" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{review.name}</h4>
                                    <div className="flex text-orange-400 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed italic">
                                &quot;{review.content}&quot;
                            </p>
                            {/* ... Phần thông tin sản phẩm đã mua giữ nguyên ... */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}