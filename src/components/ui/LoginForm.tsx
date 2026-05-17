"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, X, Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      // Nếu có lỗi (Sai pass, sai email, hoặc lỗi server)
      if (result?.error) {
        setErrorMsg(result.error);
        return; // DỪNG LẠI NGAY, KHÔNG chạy code báo thành công bên dưới
      }

      // Chỉ báo thành công khi result.ok là true
      if (result?.ok) {
        alert("Đăng nhập thành công!");
        onClose();
        window.location.reload();
      }
    } catch {
      setErrorMsg("Lỗi hệ thống, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md bg-white p-8 border border-gray-100 rounded-xl shadow-2xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
          <p className="text-gray-500 text-sm">
            Chào mừng bạn quay lại với 3T Home
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-black"
                placeholder="nhapemail@domain.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-black"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />{" "}
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Bạn chưa có tài khoản?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-orange-500 hover:text-orange-600 font-bold"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
