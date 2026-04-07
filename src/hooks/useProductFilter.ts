// src/hooks/useProductFilter.ts
import { useState, useMemo } from "react";
import { Product } from "@/types/product";

type Filters = {
  categories: string[];
  priceRanges: string[];
  colors: string[];
};

export const useProductFilter = (initialProducts: Product[]) => {
  // 1. Các State quản lý dữ liệu
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRanges: [],
    colors: [],
  });
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20; // 4 thẻ/dòng x 5 dòng = 20 thẻ

  // 2. Hàm xử lý Click chọn/Bỏ chọn Filter
  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // Bỏ chọn
        : [...currentValues, value]; // Thêm mới
      return { ...prev, [type]: newValues };
    });
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const clearAllFilters = () => {
    setFilters({ categories: [], priceRanges: [], colors: [] });
    setCurrentPage(1);
  };

  // 3. Logic Lọc và Sắp xếp (Dùng useMemo để tối ưu hiệu năng)
  const processedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Lọc theo Danh mục
    if (filters.categories.length > 0) {
      result = result.filter(
        (p) =>
          filters.categories.includes(p.category) ||
          filters.categories.includes(p.subCategory),
      );
    }

    // Lọc theo Màu sắc
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c)),
      );
    }

    // Lọc theo Giá
    if (filters.priceRanges.length > 0) {
      result = result.filter((p) => {
        return filters.priceRanges.some((range) => {
          if (range === "Dưới 2.000.000đ") return p.price < 2000000;
          if (range === "2.000.000đ - 5.000.000đ")
            return p.price >= 2000000 && p.price <= 5000000;
          if (range === "Trên 5.000.000đ") return p.price > 5000000;
          return false;
        });
      });
    }

    // Sắp xếp
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [initialProducts, filters, sortBy]);

  // 4. Logic Phân trang
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return {
    filters,
    toggleFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    totalCount: processedProducts.length,
  };
};
