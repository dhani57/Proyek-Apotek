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
        const total = dayTransactions.reduce((sum: number, t: any) => sum + (t.totalPrice || 0), 0);
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
                <div className="h-64 flex flex-col">
                  {salesData.length > 0 ? (
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 relative">
                        <svg 
                          viewBox="0 0 700 200" 
                          className="w-full h-full"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          {(() => {
                            const maxSales = Math.max(...salesData.map(d => d.sales), 1);
                            const points = salesData.map((data, index) => {
                              const x = (index / (salesData.length - 1)) * 700;
                              const y = 200 - ((data.sales / maxSales) * 180);
                              return { x, y, sales: data.sales };
                            });

                            // Create smooth curve path
                            const createSmoothPath = (points: any[]) => {
                              if (points.length < 2) return '';
                              
                              let path = `M ${points[0].x} ${points[0].y}`;
                              
                              for (let i = 0; i < points.length - 1; i++) {
                                const current = points[i];
                                const next = points[i + 1];
                                const controlX = (current.x + next.x) / 2;
                                
                                path += ` Q ${controlX} ${current.y}, ${controlX} ${(current.y + next.y) / 2}`;
                                path += ` Q ${controlX} ${next.y}, ${next.x} ${next.y}`;
                              }
                              
                              return path;
                            };

                            const linePath = createSmoothPath(points);
                            const areaPath = `${linePath} L 700 200 L 0 200 Z`;

                            return (
                              <>
                                {/* Area fill */}
                                <path
                                  d={areaPath}
                                  fill="url(#areaGradient)"
                                  className="transition-all duration-300"
                                />
                                
                                {/* Line */}
                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke="rgb(16, 185, 129)"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="transition-all duration-300"
                                />
                                
                                {/* Data points */}
                                {points.map((point, index) => (
                                  <g key={index}>
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="5"
                                      fill="white"
                                      stroke="rgb(16, 185, 129)"
                                      strokeWidth="3"
                                      className="transition-all duration-300 hover:r-7 cursor-pointer"
                                    />
                                    <g className="opacity-0 hover:opacity-100 transition-opacity">
                                      <rect
                                        x={point.x - 50}
                                        y={point.y - 35}
                                        width="100"
                                        height="25"
                                        rx="5"
                                        fill="rgb(31, 41, 55)"
                                        className="pointer-events-none"
                                      />
                                      <text
                                        x={point.x}
                                        y={point.y - 18}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="12"
                                        className="pointer-events-none font-medium"
                                      >
                                        {formatCurrency(point.sales)}
                                      </text>
                                    </g>
                                  </g>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      
                      {/* X-axis labels */}
                      <div className="flex justify-between mt-4 px-2">
                        {salesData.map((data, index) => (
                          <div key={index} className="text-xs text-gray-600 font-medium">
                            {data.date}
                          </div>
                        ))}
                      </div>
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
                            {formatCurrency(transaction.totalPrice || 0)}
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
