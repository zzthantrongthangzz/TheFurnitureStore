import React from 'react';
import Link from 'next/link';
// Đã xóa import Youtube, Instagram
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

const MohoFooter: React.FC = () => {
  return (
    <footer className="bg-[#f8f9fa] pt-12 pb-6 border-t border-gray-200 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Cột 1: NỘI THẤT MOHO */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase mb-4 text-base">Nội Thất MOHO</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Nội Thất MOHO là thương hiệu đến từ Savimex với gần 40 năm kinh nghiệm trong việc sản xuất và xuất khẩu nội thất đạt chuẩn quốc tế.
            </p>
            <div className="space-y-3">
              <div className="w-36 flex items-center bg-[#1a73e8] text-white p-1 rounded rounded-tl-3xl rounded-bl-3xl">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2 shrink-0 text-[#1a73e8] text-xs font-bold">✓</div>
                <div className="leading-tight">
                  <div className="text-[10px] uppercase">Đã thông báo</div>
                  <div className="text-xs font-bold uppercase">Bộ Công Thương</div>
                </div>
              </div>
              <div className="w-28 bg-gray-300 text-gray-600 font-bold text-xs p-2 text-center rounded border border-gray-400">
                PROTECTED BY<br/>
                <span className="text-sm">DMCA</span>
              </div>
            </div>
          </div>

          {/* Cột 2: THÔNG TIN */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase mb-4 text-base">Thông tin</h3>
            <ul className="text-gray-600 text-sm space-y-3">
              <li><Link href="#" className="hover:text-orange-500 transition">Chính Sách Bán Hàng</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Chính Sách Giao Hàng & Lắp Đặt</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Chính Sách Bảo Hành & Bảo Trì</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Chính Sách Đổi Trả</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Khách Hàng Thân Thiết – MOHOmie</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Chính Sách Đối Tác Bán Hàng</Link></li>
            </ul>
          </div>

          {/* Cột 3: THÔNG TIN LIÊN HỆ */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase mb-4 text-base">Thông tin liên hệ</h3>
            <div className="text-gray-600 text-sm space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-gray-700" />
                <div>
                  <span className="font-bold">[Trụ sở chính]</span><br />
                  162 HT17, P. Hiệp Thành, Q. 12, TP. HCM (Nằm trong khuôn viên công ty SAVIMEX phía sau bến xe buýt Hiệp Thành)<br />
                  Hotline: 097 114 1140
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="shrink-0 mt-0.5 text-gray-700" />
                <div>
                  097 114 1140 (Hotline/Zalo)<br />
                  0902 415 359 (Đội Giao Hàng)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="shrink-0 mt-0.5 text-gray-700" />
                <div>
                  cskh@moho.com.vn<br /><br />
                  Công Ty Cổ Phần Hợp Tác Kinh Tế Và Xuất Nhập Khẩu Savimex -<br />
                  STK: 0071001303667 -<br />
                  Vietcombank CN HCM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phần dưới cùng: Icons mạng xã hội (Chỉ còn TikTok) và Link Maps */}
        <div className="flex flex-col items-center justify-center border-t border-gray-200 pt-8 gap-4">
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:opacity-80 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
          <Link href="#" className="text-gray-500 hover:text-gray-800 transition text-sm">
            Chỉ đường đến showroom trên Google Maps
          </Link>
        </div>
      </div>

      {/* Nút Liên hệ trôi nổi */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a href="tel:0971141140" className="w-12 h-12 rounded-full bg-[#4caf50] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
          <Phone size={24} fill="currentColor" />
        </a>
        <a href="#" className="w-12 h-12 rounded-full bg-[#0068ff] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform font-bold text-xs">
          Zalo
        </a>
        <a href="#" className="w-12 h-12 rounded-full bg-[#0084ff] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
          <MessageCircle size={24} fill="currentColor" />
        </a>
      </div>
    </footer>
  );
};

export default MohoFooter;