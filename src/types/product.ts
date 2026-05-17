// src/types/product.ts

export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  tags?: string[];
  imageUrl: string;
  category: string;
  subCategory?: string;
  collection?: string;
  collectionName?: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  variants?: { inStock?: number; color?: string; size?: string }[];
}
