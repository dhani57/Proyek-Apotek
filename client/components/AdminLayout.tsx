'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { removeAuthToken, removeUser, getUser } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = getUser();

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
