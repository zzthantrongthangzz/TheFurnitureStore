"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    material: "",
    size: "",
    color: "",
    description: "",
    _id: "", // Thêm _id để biết đường mà gửi API Update
  });

  // Kéo dữ liệu của sản phẩm cũ để điền sẵn vào form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          
          // Trích xuất các thuộc tính (Chất liệu, Kích thước...) từ mảng attributes
          const getAttr = (keyName: string) => {
            const attr = data.attributes?.find((a: any) => a.key.toLowerCase() === keyName.toLowerCase());
            return attr ? attr.value : "";
          };

          setFormData({
            name: data.name,
            slug: data.slug,
            category: data.category || "",
            price: data.price.toString(),
            originalPrice: (data.originalPrice || data.price).toString(),
            imageUrl: data.imageUrl,
            material: getAttr("chất liệu"),
            size: getAttr("kích thước"),
            color: getAttr("màu"),
            description: data.description || "",
            _id: data._id,
          });
        } else {
          alert("Không tìm thấy sản phẩm!");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [slug, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // (Bỏ tính năng tự tạo slug ở trang Edit để tránh làm hỏng link cũ đang SEO)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        imageUrl: formData.imageUrl,
        description: formData.description,
        attributes: [
          { key: "Chất liệu", value: formData.material },
          { key: "Kích thước", value: formData.size },
          { key: "Màu", value: formData.color },
        ],
      };

      // GỌI API PUT (SỬA) BẰNG ID CỦA SẢN PHẨM
      const res = await fetch(`/api/products/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Cập nhật sản phẩm thành công!");
        router.push("/admin/products"); // Sửa xong thì quay về trang danh sách
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.message}`);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi kết nối máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="p-8 text-center text-gray-500">Đang tải thông tin sản phẩm...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Sản Phẩm</h1>
        <Link href="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition">
          <ArrowLeft size={20} /> Quay lại
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* CỘT TRÁI */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn (Slug)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                <option value="" disabled>-- Chọn danh mục --</option>
                <option value="phong-khach">Phòng Khách</option>
                <option value="phong-ngu">Phòng Ngủ</option>
                <option value="phong-an">Phòng Ăn</option>
                <option value="phong-lam-viec">Phòng Làm Việc</option>
                <option value="tu-bep">Tủ Bếp</option>
                <option value="nem">Nệm</option>
                <option value="bo-suu-tap">Bộ Sưu Tập</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá bán *</label>
                <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá gốc</label>
                <input type="number" name="originalPrice" min="0" value={formData.originalPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link hình ảnh</label>
              <input type="text" name="imageUrl" required value={formData.imageUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chất liệu</label>
              <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
              <input type="text" name="size" value={formData.size} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
          <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-bold transition-colors ${isLoading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}`}>
            {isLoading ? "Đang lưu..." : <><Save size={20} /> Cập Nhật Sản Phẩm</>}
          </button>
        </div>
      </form>
    </div>
  );
}