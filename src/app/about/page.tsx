"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const services = [
    {
      icon: <Truck size={40} strokeWidth={1.5} />,
      title: "Giao Hàng & Lắp Đặt",
      desc: "Miễn Phí",
    },
    {
      icon: <RefreshCw size={40} strokeWidth={1.5} />,
      title: "Đổi Trả 1 - 1",
      desc: "Miễn Phí",
    },
    {
      icon: <ShieldCheck size={40} strokeWidth={1.5} />,
      title: "Bảo Hành Đến 5 Năm",
      desc: "Miễn Phí",
    },
    {
      icon: <Headphones size={40} strokeWidth={1.5} />,
      title: "Tư Vấn Thiết Kế",
      desc: "Miễn Phí",
    },
  ];

  return (
    <main className="bg-[#FDFBF7] min-h-screen font-sans text-gray-800 pb-20 overflow-x-hidden">
      {/* 1. Phần Giới Thiệu */}
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-center mb-10" data-aos="fade-down">
          <img
            src="/images/about/gioithieu.png"
            alt="Giới thiệu 3T Home"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* 2. Giá trị cốt lõi (Xếp liên tiếp nhau - Dọc) */}
        <div className="flex flex-col gap-10">
          <div data-aos="fade-up">
            <img
              src="/images/about/giatricotloi.png"
              alt="Giá trị cốt lõi 1"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <img
              src="/images/about/giatricotloi2.png"
              alt="Giá trị cốt lõi 2"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* 3. Chứng chỉ chứng nhận */}
        <div className="mt-20 flex justify-center" data-aos="zoom-in">
          <img
            src="/images/about/chungnhan.png"
            alt="Chứng nhận"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* 4. Icon dịch vụ với hiệu ứng Hover (Lia chuột qua nền đen, chữ trắng) */}
      <section className="py-16 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
            {services.map((service, index) => (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-12 text-center border-r border-b border-gray-50 last:border-r-0 lg:border-b-0 transition-all duration-500 hover:bg-gray-900 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-gray-600 mb-6 transition-all duration-500 group-hover:text-orange-500 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="font-bold text-xl mb-2 transition-colors duration-500 group-hover:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-500 font-medium transition-colors duration-500 group-hover:text-gray-400">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
