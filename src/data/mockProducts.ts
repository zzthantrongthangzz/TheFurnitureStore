import { Product } from "@/types/product";

const baseProducts: Product[] = [
  {
    id: "p1",
    name: "Tủ Quần Áo Gỗ MOHO VIENNA 201",
    slug: "tu-quan-ao-go-moho-vienna-201",
    price: 4490000,
    originalPrice: 5990000,
    discountPercent: 25,
    tags: ["Trả góp 0%"],
    imageUrl: "/images/products/vienna-201.jpg",
    category: "phong-ngu",
    subCategory: "tu-quan-ao",
    collection: "VIENNA",
    colors: ["Gỗ tự nhiên", "Nâu"],
    sizes: ["1m2", "1m6"],
    inStock: true,
  },
  {
    id: "p2",
    name: "Giường Ngủ Gỗ Tràm MOHO VLINE 601",
    slug: "giuong-ngu-go-tram-moho-vline-601",
    price: 3490000,
    originalPrice: 4490000,
    discountPercent: 22,
    tags: ["Bán Chạy", "Trả góp 0%"],
    imageUrl: "/images/products/vline-601.jpg",
    category: "phong-ngu",
    subCategory: "giuong-ngu",
    collection: "VLINE",
    colors: ["Nâu"],
    sizes: ["1m2", "1m6 x 2m", "1m8 x 2m"],
    inStock: true,
  },
  {
    id: "p3",
    name: "Ghế Sofa Băng MOHO VLINE 601",
    slug: "ghe-sofa-bang-moho-vline-601",
    price: 4990000,
    originalPrice: 6990000,
    discountPercent: 29,
    tags: ["Trả góp 0%"],
    imageUrl: "/images/products/sofa-vline.jpg",
    category: "phong-khach",
    subCategory: "ghe-sofa",
    collection: "VLINE",
    colors: ["Xám", "Be"],
    sizes: ["1m8"],
    inStock: true,
  },
];

export const mockProducts: Product[] = Array.from({ length: 10 }).flatMap(
  (_, index) =>
    baseProducts.map((product) => ({
      ...product,
      id: `${product.id}-${index}`,
      price: product.price + index * 150000,
    })),
);
