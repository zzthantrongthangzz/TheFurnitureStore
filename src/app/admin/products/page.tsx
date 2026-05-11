"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Edit, Plus } from "lucide-react";
import Image from "next/image";

export default function AdminProductsList() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Lấy danh sách sản phẩm khi vào trang
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Hàm xử lý Xóa
    const handleDelete = async (id: string, name: string) => {
        // Hiện popup xác nhận tránh bấm nhầm
        const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`);
        if (!isConfirm) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Xóa thành công!");
                // Cập nhật lại danh sách trên giao diện ngay lập tức mà không cần load lại trang
                setProducts((prev) => prev.filter((product) => product._id !== id && product.id !== id));
            } else {
                const errorData = await res.json();
                alert(`Lỗi: ${errorData.message}`);
            }
        } catch (error) {
            alert("Đã xảy ra lỗi khi xóa sản phẩm.");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản Phẩm</h1>
                <Link
                    href="/admin/products/add"
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition"
                >
                    <Plus size={20} /> Thêm Sản Phẩm
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                            <th className="p-4 font-semibold">Hình ảnh</th>
                            <th className="p-4 font-semibold">Tên sản phẩm</th>
                            <th className="p-4 font-semibold">Danh mục</th>
                            <th className="p-4 font-semibold">Giá bán</th>
                            <th className="p-4 font-semibold text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Chưa có sản phẩm nào.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id || product.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                            <Image
                                                src={product.imageUrl || "/images/placeholder.jpg"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                    <td className="p-4 text-gray-600 capitalize">{product.category?.replace(/-/g, " ")}</td>
                                    <td className="p-4 text-orange-600 font-bold">
                                        {product.price?.toLocaleString("vi-VN")}đ
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <Link
                                                href={`/admin/products/edit/${product.slug}`}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition inline-flex"
                                                title="Chỉnh sửa sản phẩm"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id || product.id, product.name)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}