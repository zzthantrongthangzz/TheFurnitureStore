import { useState, useMemo } from "react";
import { Product } from "@/types/product";

type Filters = {
  categories: string[];
  priceRanges: string[];
  colors: string[];
  sizes: string[];
};

export const useProductFilter = (initialProducts: Product[]) => {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRanges: [],
    colors: [],
    sizes: [],
  });
  // State riêng cho thanh kéo giá Tùy chọn
  const [customPrice, setCustomPrice] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Lấy ra mức giá lớn nhất từ kho hàng để làm điểm max cho thanh kéo
  const maxProductPrice = useMemo(() => {
    if (initialProducts.length === 0) return 10000000;
    return Math.max(...initialProducts.map((p) => p.price));
  }, [initialProducts]);

  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[type];
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

    if (filters.categories.length > 0) {
      result = result.filter(
        (p) =>
          filters.categories.includes(p.category) ||
          filters.categories.includes(p.subCategory),
      );
    }
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c)),
      );
    }
    if (filters.sizes.length > 0) {
      result = result.filter(
        (p) => p.sizes && p.sizes.some((s) => filters.sizes.includes(s)),
      );
    }

    // Lọc Giá: Kết hợp cả checkbox và thanh kéo Tùy chọn
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
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

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
