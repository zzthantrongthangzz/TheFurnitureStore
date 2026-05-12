// src/app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { 
  DollarSign, ShoppingBag, Package, TrendingUp, Clock
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  avgOrderValue: number;
  orderStatusData: { name: string; value: number; color: string }[];
  revenueChartData: { date: string; total: number }[];
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Lỗi tải dữ liệu thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full min-h-screen text-gray-500">Đang tải dữ liệu thống kê...</div>;
  }

  if (!data) return null;

  // Custom Tooltip cho Biểu đồ Doanh thu (Format tiền Việt Nam)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-lg rounded-xl">
          <p className="font-bold text-gray-800 mb-1">{label}</p>
          <p className="text-orange-600 font-bold">
            {payload[0].value.toLocaleString("vi-VN")}đ
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-2 md:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan thống kê</h1>
        <p className="text-gray-500 text-sm mt-1">Cập nhật số liệu kinh doanh của hệ thống</p>
      </div>

      {/* --- KHỐI 1: KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</p>
            <h3 className="text-2xl font-black text-gray-900">{data.totalRevenue.toLocaleString("vi-VN")}đ</h3>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng đơn hàng</p>
            <h3 className="text-2xl font-black text-gray-900">{data.totalOrders}</h3>
          </div>
        </div>

        {/* Đơn chờ xử lý */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Chờ xác nhận</p>
            <h3 className="text-2xl font-black text-gray-900">{data.pendingOrders}</h3>
          </div>
        </div>

        {/* Giá trị TB/Đơn */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">TB / Đơn hàng</p>
            <h3 className="text-2xl font-black text-gray-900">{data.avgOrderValue.toLocaleString("vi-VN")}đ</h3>
          </div>
        </div>
      </div>

      {/* --- KHỐI 2: BIỂU ĐỒ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ Doanh thu (Area Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Biểu đồ doanh thu 7 ngày qua</h2>
          <div className="h-[350px] w-full">
            {data.revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueChartData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Chưa có đủ dữ liệu giao dịch.</div>
            )}
          </div>
        </div>

        {/* Biểu đồ Trạng thái đơn (Pie Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Tỷ trọng trạng thái đơn hàng</h2>
          <div className="flex-1 h-[300px]">
            {data.orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} đơn`, "Số lượng"]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Chưa có đơn hàng nào.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}