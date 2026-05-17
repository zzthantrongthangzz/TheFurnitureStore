"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  avgOrderValue: number;
  orderStatusData: { name: string; value: number; color: string }[];
  revenueChartData: { date: string; total: number }[];
  topProductsData: { name: string; sold: number; revenue: number }[];
  recentOrders: {
    _id: string;
    customerInfo?: { fullName?: string };
    totalAmount: number;
    status: string;
  }[];
}

type ChartTooltipPayload = {
  value: number;
  payload: {
    name: string;
    revenue: number;
  };
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d"); // Trạng thái lưu bộ lọc

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Gọi API kèm theo tham số thời gian
        const res = await fetch(`/api/dashboard?range=${timeRange}`);
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
  }, [timeRange]); // Mỗi khi timeRange đổi, sẽ gọi lại API

  // Tooltip Tùy chỉnh cho Doanh thu
  const CustomRevenueTooltip = ({
    active,
    payload,
    label,
  }: ChartTooltipProps) => {
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

  // Tooltip Tùy chỉnh cho Top Sản phẩm
  const CustomProductTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-lg rounded-xl max-w-xs">
          <p className="font-bold text-gray-800 mb-2 line-clamp-2">
            {payload[0].payload.name}
          </p>
          <p className="text-blue-600 text-sm">
            Đã bán: <span className="font-bold">{payload[0].value}</span> sản
            phẩm
          </p>
          <p className="text-green-600 text-sm">
            Doanh thu:{" "}
            <span className="font-bold">
              {payload[0].payload.revenue.toLocaleString("vi-VN")}đ
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-2 md:p-6 space-y-8">
      {/* Header & Bộ lọc thời gian */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tổng quan thống kê
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Phân tích hiệu suất kinh doanh của cửa hàng
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer"
          >
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="this_month">Tháng này</option>
            <option value="this_year">Năm nay</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-gray-500 animate-pulse">
          Đang tổng hợp dữ liệu...
        </div>
      ) : !data ? (
        <div className="h-64 flex items-center justify-center text-red-500">
          Lỗi tải dữ liệu.
        </div>
      ) : (
        <>
          {/* --- KHỐI 1: KPI CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
            {/* Doanh thu */}
            <div className="bg-white p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 xl:gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 xl:w-14 xl:h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6 xl:w-7 xl:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs xl:text-sm font-medium text-gray-500 mb-1 truncate">
                  Doanh thu
                </p>
                <h3
                  className="text-xl xl:text-2xl font-black text-gray-900 truncate"
                  title={`${data.totalRevenue.toLocaleString("vi-VN")}đ`}
                >
                  {data.totalRevenue.toLocaleString("vi-VN")}đ
                </h3>
              </div>
            </div>

            {/* Tổng đơn hàng */}
            <div className="bg-white p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 xl:gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 xl:w-14 xl:h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6 xl:w-7 xl:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs xl:text-sm font-medium text-gray-500 mb-1 truncate">
                  Tổng đơn hàng
                </p>
                <h3
                  className="text-xl xl:text-2xl font-black text-gray-900 truncate"
                  title={`${data.totalOrders}`}
                >
                  {data.totalOrders}
                </h3>
              </div>
            </div>

            {/* Đơn chờ xử lý */}
            <div className="bg-white p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 xl:gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 xl:w-14 xl:h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 xl:w-7 xl:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs xl:text-sm font-medium text-gray-500 mb-1 truncate">
                  Chờ xác nhận
                </p>
                <h3
                  className="text-xl xl:text-2xl font-black text-gray-900 truncate"
                  title={`${data.pendingOrders}`}
                >
                  {data.pendingOrders}
                </h3>
              </div>
            </div>

            {/* Giá trị TB/Đơn */}
            <div className="bg-white p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 xl:gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 xl:w-14 xl:h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 xl:w-7 xl:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs xl:text-sm font-medium text-gray-500 mb-1 truncate">
                  TB / Đơn hàng
                </p>
                <h3
                  className="text-xl xl:text-2xl font-black text-gray-900 truncate"
                  title={`${data.avgOrderValue.toLocaleString("vi-VN")}đ`}
                >
                  {data.avgOrderValue.toLocaleString("vi-VN")}đ
                </h3>
              </div>
            </div>
          </div>

          {/* --- KHỐI 2: 3 BIỂU ĐỒ CHÍNH --- */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Biểu đồ Doanh thu (Area Chart) - Chiếm 2 cột */}
            <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Biểu đồ Doanh thu
              </h2>
              <div className="h-[300px] w-full">
                {data.revenueChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.revenueChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#f97316"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f97316"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f3f4f6"
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickFormatter={(val) =>
                          `${(val / 1000000).toFixed(0)}M`
                        }
                        dx={-10}
                      />
                      <Tooltip content={<CustomRevenueTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#f97316"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Chưa có dữ liệu giao dịch trong khoảng thời gian này.
                  </div>
                )}
              </div>
            </div>

            {/* Biểu đồ Trạng thái đơn (Pie Chart) - Chiếm 1 cột */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Tỷ trọng trạng thái
              </h2>
              <div className="flex-1 h-[250px]">
                {data.orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value ?? 0} đơn`, "Số lượng"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Chưa có đơn hàng.
                  </div>
                )}
              </div>
            </div>

            {/* Biểu đồ Top 5 Bestseller (Bar Chart) - Chiếm toàn bộ 3 cột ở dưới */}
            <div className="xl:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" /> Top 5 Sản phẩm bán
                chạy nhất
              </h2>
              <div className="h-[300px] w-full">
                {data.topProductsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.topProductsData}
                      layout="vertical"
                      margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#f3f4f6"
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={200}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "#4b5563",
                          fontWeight: 500,
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f3f4f6" }}
                        content={<CustomProductTooltip />}
                      />
                      <Bar
                        dataKey="sold"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Chưa có dữ liệu sản phẩm bán ra.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
