"use client"; // Bắt buộc dùng vì có State và xử lý sự kiện onChange/onClick

import { useState } from "react";
import { mockStores } from "@/data/mockStore"; // Chỉnh lại đường dẫn nếu cần
import { MapPin } from "lucide-react"; // Cài thêm lucide-react nếu chưa có: npm install lucide-react

export default function StoreLocatorPage() {
  // Lấy danh sách các tỉnh thành không trùng lặp
  const cities = Array.from(new Set(mockStores.map((store) => store.city)));

  // States quản lý bộ lọc
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState(mockStores[0]); // Mặc định hiển thị CH đầu tiên

  // Lọc danh sách cửa hàng theo tỉnh thành
  const filteredStores = selectedCity
    ? mockStores.filter((store) => store.city === selectedCity)
    : mockStores;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-800">
          Hệ thống cửa hàng - Hotline: 0971 141 140
        </h1>
        <div className="text-sm text-gray-500 mt-2">
          <span>Trang chủ</span> / <span className="text-black">Hệ thống cửa hàng</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Cột trái: Bộ lọc và Danh sách */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-md shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Tìm cửa hàng</h2>
            
            {/* Bộ lọc */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Chọn tỉnh thành</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-orange-500"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    // Reset bản đồ về cửa hàng đầu tiên của tỉnh vừa chọn
                    const firstStoreOfCity = mockStores.find(s => s.city === e.target.value);
                    if (firstStoreOfCity) setSelectedStore(firstStoreOfCity);
                  }}
                >
                  <option value="">- Chọn tỉnh thành -</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Chọn cửa hàng</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-orange-500"
                  onChange={(e) => {
                    const store = mockStores.find(s => s.id.toString() === e.target.value);
                    if (store) setSelectedStore(store);
                  }}
                >
                  <option value="">- Chọn cửa hàng -</option>
                  {filteredStores.map((store) => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Danh sách hiển thị chi tiết */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {filteredStores.map((store) => (
                <div 
                  key={store.id} 
                  className={`border-l-4 pl-4 cursor-pointer transition-all ${
                    selectedStore.id === store.id ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStore(store)}
                >
                  <h3 className="font-semibold text-gray-800 flex items-start gap-2">
                    <MapPin className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" />
                    {store.name}
                  </h3>
                  <div className="text-sm text-gray-600 mt-2 space-y-1 ml-7">
                    <p><strong>Địa chỉ:</strong> {store.address}</p>
                    <p><strong>Thời gian hoạt động:</strong> {store.hours}</p>
                    <p><strong>Điện thoại:</strong> <span className="text-blue-600">{store.phone}</span></p>
                    <button 
                      className="text-blue-500 hover:underline mt-1 inline-block"
                      onClick={() => setSelectedStore(store)}
                    >
                      Xem bản đồ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Bản đồ Google Maps */}
          <div className="w-full lg:w-2/3 h-[500px] lg:h-[700px] bg-gray-200 rounded-md overflow-hidden shadow-sm">
            <iframe
              src={selectedStore.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </main>
  );
}