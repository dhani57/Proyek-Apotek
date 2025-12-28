'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { medicineApi, transactionApi } from '@/lib/api';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockCount: 0,
    expiringCount: 0,
    totalSales: 0,
    totalTransactions: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const [medicineStats, transactionStats, transactions] = await Promise.all([
        medicineApi.getStatistics(),
        transactionApi.getStatistics(),
        transactionApi.getAll(),
      ]);

      setStats({
        ...medicineStats,
        totalSales: transactionStats.totalSales,
        totalTransactions: transactionStats.totalTransactions,
      });

      // Get recent transactions (last 5)
      const recent = Array.isArray(transactions) ? transactions.slice(0, 5) : [];
      setRecentTransactions(recent);

      // Calculate sales data for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const salesByDate = last7Days.map(date => {
        const dayTransactions = Array.isArray(transactions) 
          ? transactions.filter((t: any) => 
              t.createdAt && new Date(t.createdAt).toISOString().split('T')[0] === date
            )
          : [];
        const total = dayTransactions.reduce((sum: number, t: any) => sum + (t.totalAmount || 0), 0);
        return {
          date: new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
          sales: total,
        };
      });

      setSalesData(salesByDate);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatCurrency(stats.totalSales)}
                    </p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Medicines</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.totalMedicines}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.lowStockCount}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Expiring Soon</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.expiringCount}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Penjualan 7 Hari Terakhir
                </h3>
                <div className="h-64">
                  {salesData.length > 0 ? (
                    <div className="flex items-end justify-between h-full gap-2">
                      {salesData.map((data, index) => {
                        const maxSales = Math.max(...salesData.map(d => d.sales), 1);
                        const heightPercent = (data.sales / maxSales) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-100 rounded-t-lg relative group">
                              <div
                                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-emerald-700 hover:to-emerald-500 min-h-5"
                                style={{ height: `${Math.max(heightPercent, 10)}%` }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {formatCurrency(data.sales)}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">{data.date}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Tidak ada data penjualan
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Transaksi Terbaru
                </h3>
                <div className="space-y-3">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction: any, index: number) => (
                      <div
                        key={transaction.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {transaction.items?.length || 0} item(s)
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.createdAt 
                                ? new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">
                            {formatCurrency(transaction.totalAmount || 0)}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {transaction.paymentMethod?.toLowerCase() || 'cash'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada transaksi
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Stock Distribution */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Distribusi Stok
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Stok Normal</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {stats.totalMedicines - stats.lowStockCount} item
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.totalMedicines > 0 ? ((stats.totalMedicines - stats.lowStockCount) / stats.totalMedicines) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Stok Rendah</span>
                      <span className="text-sm font-semibold text-orange-600">
                        {stats.lowStockCount} item
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.totalMedicines > 0 ? (stats.lowStockCount / stats.totalMedicines) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Hampir Kadaluarsa</span>
                      <span className="text-sm font-semibold text-red-600">
                        {stats.expiringCount} item
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.totalMedicines > 0 ? (stats.expiringCount / stats.totalMedicines) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Ringkasan Performa
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total Penjualan</p>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(stats.totalSales)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total Transaksi</p>
                      <p className="text-xl font-bold text-blue-600">
                        {stats.totalTransactions}
                      </p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Rata-rata per Transaksi</p>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(stats.totalTransactions > 0 ? stats.totalSales / stats.totalTransactions : 0)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdminAuth(AdminDashboard);
