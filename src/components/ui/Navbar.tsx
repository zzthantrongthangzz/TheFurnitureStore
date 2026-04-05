// src/components/MohoNavbar.tsx
import React from 'react';
import Link from 'next/link';
// Chúng ta sẽ dùng thư viện lucide-react cho các icon
import { User, ShoppingBag, Search, ChevronDown } from 'lucide-react';

// Định nghĩa dữ liệu cho các liên kết danh mục
interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Sản phẩm', href: '/products', hasDropdown: true },
  { label: 'Thiết kế - Thi công', href: '/design' },
  { label: 'Khuyến mãi', href: '/promotions', hasDropdown: true },
  { label: 'Tin tức', href: '/news', hasDropdown: true },
  { label: 'Về MOHO', href: '/about' },
  { label: 'Cửa hàng', href: '/stores' },
];

const MohoNavbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 font-sans text-gray-800">
      {/* Hàng trên: Logo, Thanh tìm kiếm, Người dùng, Giỏ hàng */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo "moho." */}
        <Link href="/" className="text-3xl font-bold flex items-center">
          3T
         
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="flex-grow max-w-2xl px-8">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border border-gray-300 px-4 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {/* Nút tìm kiếm màu xám đậm */}
            <button className="bg-gray-800 text-white px-4 py-2 border border-gray-800 rounded-r hover:bg-gray-700 transition">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Hành động Người dùng & Giỏ hàng */}
        <div className="flex items-center space-x-6 text-sm">
          {/* Tài khoản Người dùng */}
          <div className="flex items-center space-x-2">
            <User className="text-gray-600" size={20} />
            <div className="flex flex-col">
              <span>Đăng nhập / Đăng ký</span>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">Tài khoản của tôi</span>
                <ChevronDown size={14} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Giỏ hàng */}
          <Link href="/cart" className="relative flex items-center space-x-2 hover:text-orange-500 transition">
            <ShoppingBag className="text-gray-600" size={24} />
            {/* Badge Giỏ hàng màu cam với số lượng 0 */}
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
            <span>Giỏ hàng</span>
          </Link>
        </div>
      </div>

      {/* Hàng dưới: Các liên kết danh mục */}
      <div className="container mx-auto px-4 py-2 border-t border-gray-100 flex items-center justify-center space-x-6 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center space-x-1 hover:text-orange-500 transition ${
              item.label === 'Khuyến mãi' ? 'font-medium' : '' // Làm đậm 'Khuyến mãi' một chút
            }`}
          >
            <span>{item.label}</span>
            {/* Hiển thị dấu mũi tên xuống nếu có dropdown */}
            {item.hasDropdown && <ChevronDown size={14} className="text-gray-400" />}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default MohoNavbar;