'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  LogOut,
  Menu,
  X,
  FolderTree,
  Truck,
  CreditCard
} from 'lucide-react';
import { removeAuthToken, removeUser, getUser } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-600 to-emerald-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Logo placeholder - user akan tambahkan nanti */}
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-xl">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Administrator</h1>
                  <p className="text-emerald-200 text-xs">Apotek B213</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white lg:hidden"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/inventory"
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors ${
                isActive('/admin/inventory')
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700'
              }`}
            >
              <Package className="h-5 w-5" />
              <span>Inventory</span>
            </Link>

            <Link
              href="/admin/cashier"
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors ${
                isActive('/admin/cashier')
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Kasir</span>
            </Link>

            <Link
              href="/admin/transactions"
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors ${
                isActive('/admin/transactions')
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Transactions</span>
            </Link>

            <Link
              href="/admin/alerts"
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors ${
                isActive('/admin/alerts')
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Alerts</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors ${
                isActive('/admin/categories')
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700'
              }`}
            >
              <FolderTree className="h-5 w-5" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/suppliers"
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors ${
                isActive('/admin/suppliers')
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700'
              }`}
            >
              <Truck className="h-5 w-5" />
              <span>Suppliers</span>
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
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="w-6" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
