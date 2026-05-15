import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";

type Filters = {
  categories: string[];
  priceRanges: string[];
  colors: string[];
  sizes: string[];
};

export const useProductFilter = (initialProducts: Product[]) => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // 1. Khởi tạo giá trị ban đầu từ URL
  const [filters, setFilters] = useState<Filters>(() => ({
    categories: categoryParam ? [categoryParam] : [],
    priceRanges: [],
    colors: [],
    sizes: [],
  }));

  const [customPrice, setCustomPrice] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // 2. Dùng useRef để ghi nhớ xem URL trước đó là gì
  const prevCategoryParam = useRef(categoryParam);

  useEffect(() => {
    // SỬA LỖI TẠI ĐÂY: Chỉ reset bộ lọc khi tham số trên URL *THỰC SỰ THAY ĐỔI*
    // Việc này cho phép bạn tích vô số ô vuông (Astro + Scarlet + Vienna...) mà không bị mất ô cũ.
    if (categoryParam !== prevCategoryParam.current) {
      if (categoryParam) {
        setFilters({
          categories: [categoryParam],
          priceRanges: [],
          colors: [],
          sizes: [],
        });
      } else {
        setFilters({ categories: [], priceRanges: [], colors: [], sizes: [] });
      }
      setCustomPrice(null);
      setCurrentPage(1);
      prevCategoryParam.current = categoryParam;
    }
  }, [categoryParam]);

  const maxProductPrice = useMemo(() => {
    if (initialProducts.length === 0) return 10000000;
    return Math.max(...initialProducts.map((p) => p.price));
  }, [initialProducts]);

  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[type];
      // Nếu đã có thì bỏ tích, nếu chưa có thì thêm vào mảng (cho phép chọn NHIỀU)
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: newValues };
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({ categories: [], priceRanges: [], colors: [], sizes: [] });
    setCustomPrice(null);
    setCurrentPage(1);
  };

  const processedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Lọc theo mảng chứa NHIỀU Danh mục
    if (filters.categories.length > 0) {
      const activeCats = filters.categories.map((c) => c.toLowerCase());
      result = result.filter(
        (p) =>
          activeCats.includes((p.category || "").toLowerCase()) ||
          activeCats.includes((p.subCategory || "").toLowerCase()) ||
          activeCats.includes((p.collectionName || "").toLowerCase()),
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter(
        (p) => p.colors && p.colors.some((c) => filters.colors.includes(c)),
      );
    }
    if (filters.sizes.length > 0) {
      result = result.filter(
        (p) => p.sizes && p.sizes.some((s) => filters.sizes.includes(s)),
      );
    }

    if (filters.priceRanges.length > 0 || customPrice) {
      result = result.filter((p) => {
        let matchCheckbox = false;
        if (filters.priceRanges.length > 0) {
          matchCheckbox = filters.priceRanges.some((range) => {
            if (range === "Dưới 500.000đ") return p.price < 500000;
            if (range === "500.000đ - 1.000.000đ")
              return p.price >= 500000 && p.price <= 1000000;
            if (range === "1.000.000đ - 1.500.000đ")
              return p.price > 1000000 && p.price <= 1500000;
            if (range === "2.000.000đ - 5.000.000đ")
              return p.price >= 2000000 && p.price <= 5000000;
            if (range === "Trên 5.000.000đ") return p.price > 5000000;
            return false;
          });
        }
        let matchCustom = false;
        if (customPrice) {
          matchCustom =
            p.price >= customPrice.min && p.price <= customPrice.max;
        }
        return matchCheckbox || matchCustom;
      });
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "discount-desc")
      result.sort(
        (a, b) => (b.discountPercent || 0) - (a.discountPercent || 0),
      );

    return result;
  }, [initialProducts, filters, customPrice, sortBy]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return {
    filters,
    toggleFilter,
    clearAllFilters,
    customPrice,
    setCustomPrice,
    maxProductPrice,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    totalCount: processedProducts.length,
  };
};
