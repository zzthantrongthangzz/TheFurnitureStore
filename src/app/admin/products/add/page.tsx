"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";
import { productCategories } from "@/data/navData";

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

type ProductFormState = {
  name: string;
  slug: string;
  category: string;
  subCategory: string;
  collectionName: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  gallery: string[];
  material: string;
  size: string;
  color: string;
  description: string;
};

const initialFormData: ProductFormState = {
  name: "",
  slug: "",
  category: "",
  subCategory: "",
  collectionName: "",
  price: "",
  originalPrice: "",
  imageUrl: "",
  gallery: [],
  material: "",
  size: "",
  color: "",
  description: "",
};

const getCategoryValue = (href: string) => {
  const path = href.split("?")[0];
  if (path === "/collections") return "bo-suu-tap";
  return path.replace("/", "");
};

const getSubCategoryValue = (href: string) => {
  const query = href.split("?")[1];
  if (!query) return "";
  return new URLSearchParams(query).get("category") || "";
};

const adminCategories = productCategories.map((category) => ({
  label: category.title,
  value: getCategoryValue(category.href),
  items:
    category.items?.map((item) => ({
      label: item.name,
      value: getSubCategoryValue(item.href),
    })) || [],
}));

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState<ProductFormState>(initialFormData);

  const selectedCategory = adminCategories.find(
    (category) => category.value === formData.category,
  );
  const classificationValue =
    formData.category === "bo-suu-tap"
      ? formData.collectionName
      : formData.subCategory;
  const uploadedImageCount = formData.imageUrl
    ? 1 + formData.gallery.length
    : 0;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
        collectionName: "",
      }));
      return;
    }

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      setFormData((prev) => ({ ...prev, name: value, slug: generatedSlug }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassificationChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;

    setFormData((prev) =>
      prev.category === "bo-suu-tap"
        ? { ...prev, collectionName: value, subCategory: "" }
        : { ...prev, subCategory: value, collectionName: "" },
    );
  };

  const uploadImageFile = async (
    file: File,
    signatureData: CloudinarySignatureResponse,
  ) => {
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

    return uploadData.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.some((file) => !file.type.startsWith("image/"))) {
      alert("Vui lòng chỉ chọn file ảnh.");
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

      const uploadedUrls = await Promise.all(
        files.map((file) => uploadImageFile(file, signatureData)),
      );

      setFormData((prev) => {
        const currentImages = prev.imageUrl
          ? [prev.imageUrl, ...prev.gallery]
          : [];
        const nextImages = [...currentImages, ...uploadedUrls];
        const [imageUrl = "", ...gallery] = nextImages;

        return { ...prev, imageUrl, gallery };
      });
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert(error instanceof Error ? error.message : "Không thể upload ảnh.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const clearUploadedImages = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "", gallery: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImage) return;

    if (!classificationValue) {
      alert("Vui lòng chọn phân loại sản phẩm.");
      return;
    }

    if (!formData.imageUrl) {
      alert("Vui lòng upload ảnh sản phẩm trước khi lưu.");
      return;
    }

    setIsLoading(true);

    try {
      const isCollection = formData.category === "bo-suu-tap";
      const payload = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        subCategory: isCollection ? undefined : formData.subCategory,
        collectionName: isCollection ? formData.collectionName : undefined,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || Number(formData.price),
        imageUrl: formData.imageUrl,
        gallery: formData.gallery,
        description: formData.description,
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
        setFormData(initialFormData);
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
                {adminCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phân loại *
              </label>
              <select
                required
                disabled={!selectedCategory}
                value={classificationValue}
                onChange={handleClassificationChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="" disabled>
                  -- Chọn phân loại --
                </option>
                {selectedCategory?.items.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
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
                Hình ảnh sản phẩm *
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="w-full border border-dashed border-orange-300 bg-orange-50/50 rounded-lg p-3 mb-3 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <input
                type="text"
                name="imageUrl"
                required
                value={formData.imageUrl}
                readOnly
                className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-3 outline-none cursor-not-allowed"
                placeholder="https://res.cloudinary.com/..."
              />
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-500">
                <span>
                  {isUploadingImage
                    ? "Đang upload ảnh lên Cloudinary..."
                    : uploadedImageCount > 0
                      ? `Đã upload ${uploadedImageCount} ảnh`
                      : ""}
                </span>
                {uploadedImageCount > 0 && (
                  <button
                    type="button"
                    onClick={clearUploadedImages}
                    className="font-semibold text-red-500 hover:text-red-600"
                  >
                    Xóa ảnh đã chọn
                  </button>
                )}
              </div>
            </div>
          </div>

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
            placeholder="Nhập mô tả sản phẩm..."
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
