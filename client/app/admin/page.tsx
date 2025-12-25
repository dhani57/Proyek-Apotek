'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { withAdminAuth } from '@/components/withAdminAuth';
import { medicineApi, transactionApi } from '@/lib/api';
import { removeAuthToken, removeUser, getUser } from '@/lib/auth';

function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockCount: 0,
    expiringCount: 0,
    totalSales: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    setUser(getUser());
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

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    router.push('/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-600 to-emerald-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-white bg-emerald-700 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>Inventory</span>
            </Link>

            <Link
              href="/admin/transactions"
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Transactions</span>
            </Link>

            <Link
              href="/admin/alerts"
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Alerts</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-emerald-700">
            <div className="px-4 py-2 mb-2 text-sm text-emerald-100">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="w-6" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
