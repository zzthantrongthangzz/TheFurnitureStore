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
  // --- 3 SẢN PHẨM CHO BỘ SƯU TẬP ---
  {
    id: "c1",
    name: "Tủ Quần Áo Gỗ MOHO ASTRO 201",
    slug: "tu-quan-ao-go-moho-astro-201",
    price: 6490000,
    originalPrice: 7990000,
    discountPercent: 18,
    tags: ["Mới", "Trả góp 0%"],
    imageUrl: "/images/products/vienna-201.jpg", // Dùng tạm ảnh cũ để test
    category: "bo-suu-tap",
    subCategory: "astro", // Menu cấp 3
    collection: "ASTRO",
    colors: ["Gỗ tự nhiên", "Đen"],
    sizes: ["1m6"],
    inStock: true,
  },
  {
    id: "c2",
    name: "Bàn Ăn Gỗ Tràm MOHO SIGNATURE 701",
    slug: "ban-an-go-tram-moho-signature-701",
    price: 4990000,
    originalPrice: 5500000,
    discountPercent: 9,
    tags: ["Bán Chạy"],
    imageUrl: "/images/products/vline-601.jpg", // Dùng tạm ảnh cũ
    category: "bo-suu-tap",
    subCategory: "signature", // Menu cấp 3
    collection: "SIGNATURE",
    colors: ["Nâu"],
    sizes: ["1m6", "1m8"],
    inStock: true,
  },
  {
    id: "c3",
    name: "Giường Ngủ Gỗ MOHO OSLO 301",
    slug: "giuong-ngu-go-moho-oslo-301",
    price: 5990000,
    originalPrice: 8990000,
    discountPercent: 33,
    tags: ["Trả góp 0%"],
    imageUrl: "/images/products/sofa-vline.jpg", // Dùng tạm ảnh cũ
    category: "bo-suu-tap",
    subCategory: "oslo", // Menu cấp 3
    collection: "OSLO",
    colors: ["Gỗ tự nhiên", "Trắng"],
    sizes: ["1m6", "1m8"],
    inStock: true,
  },
  // --- 3 SẢN PHẨM CHO PHÒNG NGỦ ---
  {
    id: "n1",
    name: "Bàn Trang Điểm Gỗ MOHO VIENNA 201",
    slug: "ban-trang-diem-go-moho-vienna-201",
    price: 2990000,
    originalPrice: 3490000,
    discountPercent: 14,
    tags: ["Mới", "Trả góp 0%"],
    imageUrl: "/images/products/vienna-201.jpg", // Dùng tạm ảnh
    category: "phong-ngu",
    subCategory: "ban-trang-diem", // Cấp 3 của phòng ngủ
    collection: "VIENNA",
    colors: ["Gỗ tự nhiên", "Nâu"],
    sizes: ["90cm"],
    inStock: true,
  },
  {
    id: "n2",
    name: "Tủ Đầu Giường Gỗ Tràm MOHO VLINE 601",
    slug: "tu-dau-giuong-go-tram-moho-vline-601",
    price: 990000,
    originalPrice: 1290000,
    discountPercent: 23,
    tags: ["Bán Chạy"],
    imageUrl: "/images/products/vline-601.jpg", // Dùng tạm ảnh
    category: "phong-ngu",
    subCategory: "tu-dau-giuong", // Cấp 3 của phòng ngủ
    collection: "VLINE",
    colors: ["Nâu"],
    sizes: ["90cm"],
    inStock: true,
  },
  {
    id: "n3",
    name: "Combo Phòng Ngủ MOHO OSLO",
    slug: "combo-phong-ngu-moho-oslo",
    price: 15990000,
    originalPrice: 19990000,
    discountPercent: 20,
    tags: ["Mới", "Trả góp 0%"],
    imageUrl: "/images/products/sofa-vline.jpg", // Dùng tạm ảnh
    category: "phong-ngu",
    subCategory: "combo-phong-ngu", // Cấp 3 của phòng ngủ
    collection: "OSLO",
    colors: ["Gỗ tự nhiên", "Trắng"],
    sizes: ["1m6", "1m8"],
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
