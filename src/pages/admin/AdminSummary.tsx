import React, { useEffect, useState } from "react";
import { 
  IoCashOutline, 
  IoCartOutline, 
  IoShirtOutline, 
  IoPeopleOutline 
} from "react-icons/io5";
import { getStatistic, StatisticResult } from "../../services/StatisticService";

const AdminSummary = () => {
  const [stats, setStats] = useState<StatisticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getStatistic();
        if (res && res.code === 1000) {
          setStats(res.result);
        } else {
          setError(res.message || "Không thể tải dữ liệu thống kê");
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu thống kê:", err);
        setError("Đã xảy ra lỗi khi kết nối tới máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderStatusBadge = (status: string | undefined) => {
    const s = status ? status.toLowerCase() : 'pending';
    let bgClass = "bg-amber-50 text-amber-700 border-amber-200";
    let displayStatus = status || "Pending";

    if (s === "delivered") {
      bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (s === "cancelled") {
      bgClass = "bg-rose-50 text-rose-700 border-rose-200";
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${bgClass}`}>
        {displayStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-semibold text-center my-6">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-zinc-950 font-display">Tổng Quan Hệ Thống</h2>
        <p className="text-sm text-zinc-500 font-semibold mt-1">Dữ liệu thống kê doanh thu, đơn hàng và khách hàng theo thời gian thực.</p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu */}
        <div className="bg-white border border-zinc-200 hover:border-emerald-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">Tổng doanh thu</span>
            <div className="text-2xl font-black text-zinc-900 font-display">
              {stats?.totalRevenue ? stats.totalRevenue.toLocaleString("vi-VN") : "0"} ₫
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
            <IoCashOutline className="text-2xl" />
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white border border-zinc-200 hover:border-blue-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">Tổng đơn hàng</span>
            <div className="text-2xl font-black text-zinc-900 font-display">
              {stats?.totalOrders || 0}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
            <IoCartOutline className="text-2xl" />
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white border border-zinc-200 hover:border-amber-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">Sản phẩm</span>
            <div className="text-2xl font-black text-zinc-900 font-display">
              {stats?.totalProducts || 0}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
            <IoShirtOutline className="text-2xl" />
          </div>
        </div>

        {/* Khách hàng */}
        <div className="bg-white border border-zinc-200 hover:border-violet-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">Thành viên</span>
            <div className="text-2xl font-black text-zinc-900 font-display">
              {stats?.totalUsers || 0}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform duration-300">
            <IoPeopleOutline className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 font-display">Đơn Hàng Gần Đây</h3>

        <div className="overflow-hidden border border-zinc-200 rounded-2xl bg-white shadow-xs">
          <table className="min-w-full divide-y divide-zinc-200 text-left">
            <thead className="bg-zinc-50/80 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4">Mã Đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Thanh toán</th>
                <th className="px-6 py-4 text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-zinc-800">
                      #{order.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-800">
                      {order.fullName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-500">
                      {order.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-500">
                      {order.phone || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
                        order.paymentMethod === "Đã thanh toán" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-zinc-100 text-zinc-700 border-zinc-200"
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-zinc-700 text-right">
                      {(order.totalPrice || 0).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                      {renderStatusBadge(order.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm font-medium text-zinc-400">
                    Không có đơn hàng nào gần đây
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
