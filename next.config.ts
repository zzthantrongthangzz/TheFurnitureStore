import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Giải quyết lỗi không hiển thị được ảnh từ thư viện Picsum
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },

  // Giải quyết lỗi Cross-origin khi bạn xem web bằng địa chỉ IP mạng LAN
  allowedDevOrigins: ["26.179.93.209", "localhost:3000"],
};

export default nextConfig;
