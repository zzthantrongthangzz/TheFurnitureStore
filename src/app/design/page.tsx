"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import AOS
import AOS from "aos";
import "aos/dist/aos.css";

const bannerImages = [
  { id: 1, src: "/images/design/banner1.jpg", alt: "Không gian phòng khách" },
  { id: 2, src: "/images/design/banner2.jpg", alt: "Không gian phòng ngủ" },
  { id: 3, src: "/images/design/banner3.jpg", alt: "Không gian nhà bếp" },
];

const reasons = [
  {
    title: "1. Thực tế giống với 3D",
    content:
      "Trải nghiệm thực tế trước khi đặt hàng. Chúng tôi cam kết độ chính xác cao nhất giữa bản vẽ thiết kế và công trình thi công thực tế.",
  },
  {
    title: "2. Luôn cá nhân hoá",
    content:
      "Đa dạng thiết kế theo gu thẩm mỹ riêng của từng gia chủ, giúp ngôi nhà mang đậm dấu ấn cá nhân.",
  },
  {
    title: "3. Dịch vụ cao cấp",
    content:
      "Dịch vụ uy tín với thương hiệu bền vững hơn 25 năm, đồng hành cùng khách hàng từ khâu ý tưởng đến khi bàn giao.",
  },
];

const projects = [
  {
    id: 1,
    title: "Biệt thự Ecopark - Phong cách Hiện đại",
    src: "/images/design/duan1.jpg",
  },
  {
    id: 2,
    title: "Căn hộ Penthouse - Nét đẹp Sang trọng",
    src: "/images/design/duan2.jpg",
  },
  {
    id: 3,
    title: "Nhà phố cổ - Tối ưu không gian",
    src: "/images/design/duan3.jpg",
  },
  {
    id: 4,
    title: "Showroom trưng bày - Nghệ thuật ánh sáng",
    src: "/images/design/phongngu.jpg",
  },
];

export default function DesignPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Tốc độ hiện lên (1 giây)
      once: true, // Chỉ hiện một lần khi lướt qua
      offset: 100, // Hiện lên sớm hơn 100px trước khi tới vị trí
    });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1,
    );
  };
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1,
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <main className="bg-[#FDFBF7] min-h-screen font-sans text-gray-800 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/design/background.jpg"
            alt="Interior Design Hero"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 px-4 max-w-3xl" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">
            THIẾT KẾ NỘI THẤT
          </h1>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            Hẹn gặp ngay đội ngũ chuyên nghiệp và giàu kinh nghiệm từ{" "}
            <span className="font-bold text-orange-400">3T Home</span> để được
            tư vấn những giải pháp hoàn thiện nội thất cho ngôi nhà của bạn.
          </p>
          <a
            href="tel:0369688243"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl"
          >
            <Phone size={20} /> LIÊN HỆ NGAY: 0369688243
          </a>
        </div>
      </section>

      {/* 2. LÝ DO CHỌN 3T HOME - FIX LỖI NHẢY DROPDOWN */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2
          className="text-3xl font-bold mb-6 text-gray-900"
          data-aos="fade-up"
        >
          3 LÝ DO NÊN CHỌN 3T HOME
        </h2>
        <p
          className="max-w-3xl mx-auto text-gray-600 leading-relaxed mb-16"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Với kinh nghiệm hơn 25 năm trong thiết kế và hoàn thiện nội thất cùng
          đội ngũ thiết kế chuyên nghiệp, 3T Home mang đến giải pháp toàn diện
          trong nội thất.
        </p>

        {/* Thêm items-start để fix lỗi nhảy cả hàng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
              data-aos="zoom-in"
              data-aos-delay={index * 200}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
              >
                <span className="font-bold text-lg">{item.title}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {openIndex === index && (
                <div className="p-6 pt-0 text-gray-600 border-t border-gray-50 animate-fade-in text-sm leading-relaxed">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. BANNER SLIDER */}
      <section className="py-10" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="relative w-full h-[450px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl group">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {bannerImages.map((image) => (
                <div
                  key={image.id}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ))}
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-orange-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 z-10 transition-all"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-orange-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 z-10 transition-all"
            >
              <ChevronRight size={30} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FORM ĐĂNG KÝ */}
      <section className="py-20 container mx-auto px-4">
        <div
          className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-[2rem] overflow-hidden shadow-2xl p-8 lg:p-0"
          data-aos="fade-right"
        >
          <div className="w-full lg:w-1/2 relative h-[500px] overflow-hidden">
            <Image
              src="/images/design/anhkeformtuvan.jpg"
              alt="Consultation"
              fill
              className="object-cover"
            />
          </div>
          <div
            className="w-full lg:w-1/2 lg:p-12"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <h2 className="text-3xl font-bold mb-4">ĐĂNG KÝ TƯ VẤN TẠI NHÀ</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Tên của bạn"
                className="w-full p-3 border-b border-gray-200 focus:border-orange-500 outline-none transition text-black bg-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Điện thoại"
                className="w-full p-3 border-b border-gray-200 focus:border-orange-500 outline-none transition text-black bg-transparent"
                required
              />
              <textarea
                placeholder="Yêu cầu của bạn"
                rows={3}
                className="w-full p-3 border-b border-gray-200 focus:border-orange-500 outline-none transition text-black bg-transparent"
                required
              ></textarea>
              <button className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition duration-300 shadow-lg">
                <Send size={18} /> GỬI YÊU CẦU
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. ĐỘI NGŨ THIẾT KẾ */}
      <section className="py-20 bg-stone-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-6">ĐỘI NGŨ THIẾT KẾ</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Đội ngũ kiến trúc sư chuyên nghiệp luôn sẵn sàng tư vấn dịch vụ.
              Theo sát từ bản vẽ tới thi công.
            </p>
          </div>
          <div
            className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
            data-aos="flip-left"
          >
            <Image
              src="/images/design/doinguthietke.jpg"
              alt="Design Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. CÁC DỰ ÁN THỰC HIỆN */}
      <section className="py-20 container mx-auto px-4">
        <h2
          className="text-3xl font-bold mb-12 text-center"
          data-aos="fade-down"
        >
          CÁC DỰ ÁN THỰC HIỆN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="group cursor-pointer"
              data-aos={idx % 2 === 0 ? "fade-right" : "fade-left"}
            >
              <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden rounded-2xl mb-6 shadow-lg">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                {project.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="text-center" data-aos="fade-up">
          <Link
            href="/projects"
            className="inline-block border-2 border-gray-900 text-gray-900 font-bold py-4 px-12 rounded-full hover:bg-gray-900 hover:text-white transition-all"
          >
            XEM TẤT CẢ
          </Link>
        </div>
      </section>
    </main>
  );
}
