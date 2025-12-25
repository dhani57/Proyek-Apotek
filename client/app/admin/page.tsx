'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  FolderTree,
  Truck
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

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const [medicineStats, transactionStats] = await Promise.all([
        medicineApi.getStatistics(),
        transactionApi.getStatistics(),
      ]);

      setStats({
        ...medicineStats,
        totalSales: transactionStats.totalSales,
        totalTransactions: transactionStats.totalTransactions,
      });
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Link
                  href="/admin/inventory"
                  className="flex items-center gap-3 p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                >
                  <Package className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-800">Manage Inventory</p>
                    <p className="text-sm text-gray-600">Add or edit medicines</p>
                  </div>
                </Link>

                <Link
                  href="/admin/transactions"
                  className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">View Transactions</p>
                    <p className="text-sm text-gray-600">Sales history</p>
                  </div>
                </Link>

                <Link
                  href="/admin/alerts"
                  className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-800">Check Alerts</p>
                    <p className="text-sm text-gray-600">Expiring medicines</p>
                  </div>
                </Link>

                <Link
                  href="/admin/categories"
                  className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                >
                  <FolderTree className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800">Categories</p>
                    <p className="text-sm text-gray-600">Manage categories</p>
                  </div>
                </Link>

                <Link
                  href="/admin/suppliers"
                  className="flex items-center gap-3 p-4 border-2 border-teal-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
                >
                  <Truck className="h-8 w-8 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-800">Suppliers</p>
                    <p className="text-sm text-gray-600">Manage suppliers</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdminAuth(AdminDashboard);
