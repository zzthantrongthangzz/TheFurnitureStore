"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";

type CloudinarySignatureResponse = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
  uploadUrl: string;
  message?: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Khởi tạo state lưu trữ dữ liệu form
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
  });

  // ĐÃ SỬA LỖI Ở ĐÂY: Thêm | HTMLSelectElement vào kiểu dữ liệu
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Tự động tạo slug (link thân thiện) khi nhập tên sản phẩm
    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
        .replace(/[^a-z0-9]/g, "-") // Thay khoảng trắng và ký tự đặc biệt bằng dấu gạch ngang
        .replace(/-+/g, "-") // Xóa các dấu gạch ngang liền nhau
        .replace(/^-|-$/g, ""); // Xóa dấu gạch ngang ở đầu và cuối

      setFormData((prev) => ({ ...prev, [name]: value, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn đúng file ảnh.");
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);

    try {
      const signatureRes = await fetch("/api/upload/signature", {
        method: "POST",
      });
      const signatureData =
        (await signatureRes.json()) as CloudinarySignatureResponse;

      if (!signatureRes.ok) {
        throw new Error(
          signatureData.message || "Không thể tạo chữ ký upload ảnh.",
        );
      }

      const uploadBody = new FormData();
      uploadBody.append("file", file);
      uploadBody.append("api_key", signatureData.apiKey);
      uploadBody.append("timestamp", String(signatureData.timestamp));
      uploadBody.append("signature", signatureData.signature);
      uploadBody.append("folder", signatureData.folder);

      const uploadRes = await fetch(signatureData.uploadUrl, {
        method: "POST",
        body: uploadBody,
      });
      const uploadData = (await uploadRes.json()) as CloudinaryUploadResponse;

      if (!uploadRes.ok || !uploadData.secure_url) {
        throw new Error(
          uploadData.error?.message || "Upload ảnh lên Cloudinary thất bại.",
        );
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: uploadData.secure_url || "",
      }));
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert(error instanceof Error ? error.message : "Không thể upload ảnh.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Hàm gửi dữ liệu lên API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImage) return;
    setIsLoading(true);

    try {
      // Ép kiểu dữ liệu giá tiền về số trước khi gửi
      const payload = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || Number(formData.price),
        imageUrl: formData.imageUrl,
        description: formData.description,
        // Dựa theo logic cũ của bạn, các thông số được lưu trong mảng attributes
        attributes: [
          { key: "Chất liệu", value: formData.material },
          { key: "Kích thước", value: formData.size },
          { key: "Màu", value: formData.color },
        ],
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Đã thêm sản phẩm thành công!");
        setFormData({
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
        });
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.message}`);
      }
    } catch {
      alert("Có lỗi xảy ra khi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thêm Sản Phẩm Mới</h1>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition"
        >
          <ArrowLeft size={20} /> Quay lại
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Cột trái */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="VD: Tủ quần áo gỗ sồi..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đường dẫn (Slug)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="" disabled>
                  -- Chọn danh mục --
                </option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá bán (VNĐ) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá gốc (VNĐ)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  min="0"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link hình ảnh (URL) *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="w-full border border-dashed border-orange-300 bg-orange-50/50 rounded-lg p-3 mb-3 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <input
                type="text"
                name="imageUrl"
                required
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://res.cloudinary.com/..."
              />
              <p className="mt-2 text-xs text-gray-500">
                {isUploadingImage
                  ? "Đang upload ảnh lên Cloudinary..."
                  : "Ảnh mới sẽ được lưu trên Cloudinary; ảnh cũ trong public vẫn dùng bình thường."}
              </p>
            </div>
          </div>

          {/* Cột phải */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chất liệu
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kích thước
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Mô tả full width */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nhập mô tả sản phẩm (có thể hỗ trợ thẻ HTML cơ bản)..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-bold transition-colors ${
              isLoading || isUploadingImage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {isUploadingImage ? (
              "Đang upload ảnh..."
            ) : isLoading ? (
              "Đang lưu..."
            ) : (
              <>
                <Save size={20} /> Lưu Sản Phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
