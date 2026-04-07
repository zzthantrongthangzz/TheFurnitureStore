import React from "react";
import Link from "next/link";
// Đã xóa import Youtube, Instagram
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f8f9fa] pt-12 pb-6 border-t border-gray-200 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-gray-800 uppercase mb-4 text-base">
              Nội Thất 3T Home
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Nội Thất 3T Home là thương hiệu đến từ Savimex với gần 40 năm kinh
              nghiệm trong việc sản xuất và xuất khẩu nội thất đạt chuẩn quốc
              tế.
            </p>
          </div>

          {/* Cột 2: THÔNG TIN */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase mb-4 text-base">
              Thông tin
            </h3>
            <ul className="text-gray-600 text-sm space-y-3">
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Chính Sách Bán Hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Chính Sách Giao Hàng & Lắp Đặt
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Chính Sách Bảo Hành & Bảo Trì
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Chính Sách Đổi Trả
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Khách Hàng Thân Thiết – 3T Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Chính Sách Đối Tác Bán Hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: THÔNG TIN LIÊN HỆ */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase mb-4 text-base">
              Thông tin liên hệ
            </h3>
            <div className="text-gray-600 text-sm space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-gray-700" />
                <div>
                  <span className="font-bold">[Trụ sở chính]</span>
                  <br />
                  12 Nguyễn Văn Bảo
                  <br />
                  Hotline: 0369688243
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="shrink-0 mt-0.5 text-gray-700" />
                <div>
                  cskh@3thome.com.vn
                  <br />
                  Phát triển giao diện ứng dụng
                  <br />
                  Nguyễn Văn Tân
                  <br />
                  Lê Nhật Tân
                  <br />
                  Thân Trọng Thắng
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phần dưới cùng: Icons mạng xã hội (Chỉ còn TikTok) và Link Maps */}
        {/* Phần dưới cùng: Icons mạng xã hội (Thay TikTok bằng Google Maps) và Link Maps */}
        <div className="flex flex-col items-center justify-center border-t border-gray-200 pt-8 gap-4">
          <div className="flex gap-3">
            {/* Nút Google Maps thay cho TikTok */}
            <a
              href="https://maps.app.goo.gl/hpq8f2uS25udFEB77"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#4285F4] flex items-center justify-center text-white hover:bg-[#357abd] transition shadow-md"
            >
              <MapPin size={20} />
            </a>
          </div>

          <Link
            href="#"
            className="text-gray-500 hover:text-gray-800 transition text-sm"
          >
            Chỉ đường đến showroom trên Google Maps
          </Link>
        </div>
      </div>

      {/* Nút Liên hệ trôi nổi */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a
          href="tel:0971141140"
          className="w-12 h-12 rounded-full bg-[#4caf50] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        >
          <Phone size={24} fill="currentColor" />
        </a>
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-[#0068ff] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform font-bold text-xs"
        >
          Zalo
        </a>
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-[#0084ff] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle size={24} fill="currentColor" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
