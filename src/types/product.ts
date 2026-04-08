// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  tags: string[];
  imageUrl: string;
  category: string;
  subCategory: string;
  collection?: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
}
