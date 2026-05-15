export interface SubCategory {
  name: string;
  href: string;
}

export interface MenuCategory {
  title: string;
  href: string;
  items?: SubCategory[];
}

export type MenuItem = MenuCategory;
export type SubItem = SubCategory;

export const productCategories: MenuCategory[] = [
  {
    title: "Bộ Sưu Tập",
    href: "/collections",
    items: [
      { name: "ASTRO", href: "/collections?category=astro" },
      { name: "SCARLET", href: "/collections?category=scarlet" },
      { name: "HOBRO", href: "/collections?category=hobro" },
      { name: "VLINE", href: "/collections?category=vline" },
      { name: "VIENNA", href: "/collections?category=vienna" },
      { name: "OSLO", href: "/collections?category=oslo" },
      { name: "MILAN", href: "/collections?category=milan" },
    ],
  },
  {
    title: "Phòng Ngủ",
    href: "/phong-ngu",
    items: [
      { name: "Combo Phòng Ngủ", href: "/phong-ngu?category=combo-phong-ngu" },
      { name: "Tủ Quần Áo", href: "/phong-ngu?category=tu-quan-ao" },
      { name: "Giường Ngủ", href: "/phong-ngu?category=giuong-ngu" },
      { name: "Tủ Đầu Giường", href: "/phong-ngu?category=tu-dau-giuong" },
      { name: "Bàn Trang Điểm", href: "/phong-ngu?category=ban-trang-diem" },
    ],
  },
  {
    title: "Phòng Khách",
    href: "/phong-khach",
    items: [
      { name: "Ghế Sofa", href: "/phong-khach?category=ghe-sofa" },
      {
        name: "Bàn Sofa - Bàn Cafe - Bàn Trà",
        href: "/phong-khach?category=ban-sofa",
      },
      { name: "Tủ Kệ Tivi", href: "/phong-khach?category=tu-ke-tivi" },
      { name: "Tủ Giày - Tủ Trang Trí", href: "/phong-khach?category=tu-giay" },
    ],
  },
  {
    title: "Phòng Ăn",
    href: "/phong-an",
    items: [
      { name: "Bàn Ăn", href: "/phong-an?category=ban-an" },
      { name: "Ghế Ăn", href: "/phong-an?category=ghe-an" },
      { name: "Bộ Bàn Ăn", href: "/phong-an?category=bo-ban-an" },
    ],
  },
  {
    title: "Phòng Làm Việc",
    href: "/phong-lam-viec",
    items: [
      { name: "Bàn Làm Việc", href: "/phong-lam-viec?category=ban-lam-viec" },
      { name: "Ghế Văn Phòng", href: "/phong-lam-viec?category=ghe-van-phong" },
      { name: "Tủ & Kệ", href: "/phong-lam-viec?category=tu-ke" },
    ],
  },
];
