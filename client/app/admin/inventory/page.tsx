'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { medicineApi } from '@/lib/api';

interface Medicine {
  id: string;
  name: string;
  description?: string;
  sellPrice: number;
  buyPrice: number;
  stock: number;
  unit: string;
  batchNumber?: string;
  expirationDate?: string;
  category: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sellPrice: '',
    buyPrice: '',
    stock: '',
    unit: '',
    batchNumber: '',
    expirationDate: '',
    categoryId: '',
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const data = await medicineApi.getAll();
      setMedicines(data);
    } catch (error: unknown) {
      console.error('Failed to load medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMedicine(null);
    setFormData({
      name: '',
      description: '',
      sellPrice: '',
      buyPrice: '',
      stock: '',
      unit: 'tablet',
      batchNumber: '',
      expirationDate: '',
      categoryId: '',
    });
    setShowModal(true);
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description || '',
      sellPrice: medicine.sellPrice.toString(),
      buyPrice: medicine.buyPrice.toString(),
      stock: medicine.stock.toString(),
      unit: medicine.unit,
      batchNumber: medicine.batchNumber || '',
      expirationDate: medicine.expirationDate
        ? new Date(medicine.expirationDate).toISOString().split('T')[0]
        : '',
      categoryId: medicine.category.id,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      await medicineApi.delete(id);
      loadMedicines();
    } catch (error: unknown) {
      console.error('Failed to delete medicine:', error);
      alert('Failed to delete medicine');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      sellPrice: parseFloat(formData.sellPrice),
      buyPrice: parseFloat(formData.buyPrice),
      stock: parseInt(formData.stock),
      expirationDate: formData.expirationDate || undefined,
    };

    try {
      if (editingMedicine) {
        await medicineApi.update(editingMedicine.id, payload);
      } else {
        await medicineApi.create(payload);
      }
      setShowModal(false);
      loadMedicines();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save medicine';
      alert(errorMessage);
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Medicine
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Batch No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Sell Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {medicine.name}
                        </div>
                        <div className="text-sm text-gray-500">{medicine.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medicine.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            medicine.stock <= 10
                              ? 'bg-red-100 text-red-800'
                              : medicine.stock <= 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {medicine.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medicine.batchNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(medicine.expirationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(medicine.sellPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(medicine)}
                          className="text-emerald-600 hover:text-emerald-900 mr-3"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(medicine.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buy Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sell Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="tablet">Tablet</option>
                    <option value="kapsul">Kapsul</option>
                    <option value="botol">Botol</option>
                    <option value="box">Box</option>
                    <option value="strip">Strip</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Enter category ID (Get from database)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingMedicine ? 'Update' : 'Add'} Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default withAdminAuth(InventoryPage);
