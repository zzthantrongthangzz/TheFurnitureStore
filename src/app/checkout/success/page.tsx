// src/app/checkout/success/page.tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center space-y-6">
        <div className="flex justify-center">
          {/* Icon check màu xanh lá */}
          <CheckCircle className="w-24 h-24 text-green-500 bg-green-50 rounded-full p-2" />
        </div>
        
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h2>
          <p className="text-gray-600">
            Cảm ơn bạn đã mua sắm tại 3T Home. Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý.
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 text-sm text-orange-800">
          Chúng tôi sẽ sớm liên hệ với bạn qua số điện thoại để xác nhận đơn hàng và thời gian giao hàng.
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col space-y-3">
          <Link
            href="/products"
            className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}