export interface SubCategory {
  name: string;
  href: string;
}

export interface MenuCategory {
  title: string;
  href: string;
  items?: SubCategory[];
}

export interface SubItem {
  name: string;
  href: string;
}

export interface MenuItem {
  title: string;
  href: string;
  items?: SubItem[]; // Cấp 2
}

export const productCategories: MenuCategory[] = [
  {
    title: "Bộ Sưu Tập",
    href: "/collections",
    items: [
      { name: "ASTRO", href: "/collections/astro" },
      { name: "SIGNATURE", href: "/collections/signature" },
      { name: "SCARLET", href: "/collections/scarlet" },
      { name: "SERENA", href: "/collections/serena" },
      { name: "PLANK", href: "/collections/plank" },
      { name: "KLINE", href: "/collections/kline" },
      { name: "DALUMD", href: "/collections/dalumd" },
      { name: "HOBRO", href: "/collections/hobro" },
      { name: "VLINE", href: "/collections/vline" },
      { name: "VIENNA", href: "/collections/vienna" },
      { name: "KOSTER", href: "/collections/koster" },
      { name: "NARVIK", href: "/collections/narvik" },
      { name: "OSLO", href: "/collections/oslo" },
      { name: "MILAN", href: "/collections/milan" },
      { name: "FYN", href: "/collections/fyn" },
    ],
  },
  {
    title: "Phòng Ngủ",
    href: "/phong-ngu",
    items: [
      { name: "Combo Phòng Ngủ", href: "/phong-ngu/combo" },
      { name: "Tủ Quần Áo", href: "/phong-ngu/tu-quan-ao" },
      { name: "Giường Ngủ", href: "/phong-ngu/giuong-ngu" },
      { name: "Tủ Đầu Giường", href: "/phong-ngu/tu-dau-giuong" },
      { name: "Bàn Trang Điểm", href: "/phong-ngu/ban-trang-diem" },
    ],
  },
  {
    title: "Phòng Khách",
    href: "/phong-khach",
    items: [
      { name: "Ghế Sofa", href: "/phong-khach/ghe-sofa" },
      { name: "Bàn Sofa - Bàn Cafe - Bàn Trà", href: "/phong-khach/ban-sofa" },
      { name: "Tủ Kệ Tivi", href: "/phong-khach/tu-ke-tivi" },
      { name: "Tủ Giày - Tủ Trang Trí", href: "/phong-khach/tu-giay" },
    ],
  },
  {
    title: "Phòng Ăn",
    href: "/phong-an",
    items: [
      { name: "Bàn Ăn", href: "/phong-an/ban-an" },
      { name: "Ghế Ăn", href: "/phong-an/ghe-an" },
      { name: "Bộ Bàn Ăn", href: "/phong-an/bo-ban-an" },
    ],
  },
  {
    title: "Phòng Làm Việc",
    href: "/phong-lam-viec",
    items: [
      { name: "Bàn Làm Việc", href: "/phong-lam-viec/ban-lam-viec" },
      { name: "Ghế Văn Phòng", href: "/phong-lam-viec/ghe-van-phong" },
      { name: "Tủ & Kệ", href: "/phong-lam-viec/tu-ke" },
    ],
  },
  {
    title: "Tủ Bếp",
    href: "/tu-bep",
  },
  {
    title: "Nệm",
    href: "/nem",
  },
];

export const promotionCategories: MenuItem[] = [
  { title: "Brand Day", href: "/promotions/brand-day" },
  { title: "3T Outlet - Hàng Thanh Lý", href: "/promotions/outlet" },
];

// Dữ liệu cho Tin tức
export const newsCategories: MenuItem[] = [
  { title: "Tips", href: "/news/tips" },
  {
    title: "Thi công - Thiết kế",
    href: "/news/design",
    items: [
      { name: "Phòng Bếp", href: "/news/design/kitchen" },
      { name: "Phòng Ngủ", href: "/news/design/bedroom" },
    ],
  },
  { title: "Media", href: "/news/media" },
  { title: "News", href: "/news/general" },
  { title: "People", href: "/news/people" },
  { title: "Inspiration", href: "/news/inspiration" },
  { title: "Báo chí", href: "/news/press" },
  { title: "Nệm", href: "/news/mattress" },
];
