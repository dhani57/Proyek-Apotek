'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, Package } from 'lucide-react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { medicineApi } from '@/lib/api';

interface Medicine {
  id: string;
  name: string;
  stock: number;
  unit: string;
  batchNumber?: string;
  expirationDate?: string;
  category: {
    name: string;
  };
}

function AlertsPage() {
  const [expiringMedicines, setExpiringMedicines] = useState<Medicine[]>([]);
  const [lowStockMedicines, setLowStockMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'expiring' | 'lowstock'>('expiring');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const [expiring, lowStock] = await Promise.all([
        medicineApi.getExpiring(3),
        medicineApi.getLowStock(10),
      ]);
      setExpiringMedicines(expiring);
      setLowStockMedicines(lowStock);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = (dateString?: string) => {
    if (!dateString) return null;
    const expiry = new Date(dateString);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (days: number | null) => {
    if (days === null) return 'bg-gray-100 text-gray-800';
    if (days < 0) return 'bg-red-600 text-white';
    if (days <= 30) return 'bg-red-100 text-red-800';
    if (days <= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Medicine Alerts</h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              {expiringMedicines.length} Expiring
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
              {lowStockMedicines.length} Low Stock
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('expiring')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'expiring'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Expiring Medicines ({expiringMedicines.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('lowstock')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'lowstock'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="h-5 w-5" />
                <span>Low Stock ({lowStockMedicines.length})</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : activeTab === 'expiring' ? (
              <div className="space-y-4">
                {expiringMedicines.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>No medicines expiring in the next 3 months</p>
                  </div>
                ) : (
                  expiringMedicines.map((medicine) => {
                    const daysUntilExpiry = getDaysUntilExpiry(medicine.expirationDate);
                    return (
                      <div
                        key={medicine.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Category: {medicine.category.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Batch: {medicine.batchNumber || 'N/A'} | Stock: {medicine.stock} {medicine.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getExpiryColor(
                              daysUntilExpiry
                            )}`}
                          >
                            {daysUntilExpiry !== null
                              ? daysUntilExpiry < 0
                                ? 'EXPIRED'
                                : `${daysUntilExpiry} days`
                              : 'Unknown'}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {formatDate(medicine.expirationDate)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockMedicines.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>All medicines have adequate stock</p>
                  </div>
                ) : (
                  lowStockMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Package className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Category: {medicine.category.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Batch: {medicine.batchNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            medicine.stock <= 5
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {medicine.stock} {medicine.unit}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {medicine.stock <= 5 ? 'Critical' : 'Low Stock'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdminAuth(AlertsPage);
