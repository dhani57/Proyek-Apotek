'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { medicineApi } from '@/lib/api';
import * as XLSX from 'xlsx';

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

interface ImportRow {
  [key: string]: string | number | undefined;
}

function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      setLoading(true);
      const data = await medicineApi.getAll();
      setMedicines(data);
    } catch (error: unknown) {
      console.error('Failed to load medicines:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load medicines';
      alert(`Error: ${errorMessage}`);
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

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['.csv', '.xls', '.xlsx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        alert('Please select a CSV or Excel file (.csv, .xls, .xlsx)');
        return;
      }
      setImportFile(file);
    }
  };

  const parseFile = async (file: File): Promise<ImportRow[]> => {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExtension === '.csv') {
      return parseCSV(await file.text());
    } else {
      // Parse Excel file
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet) as ImportRow[];
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }
  };

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data: ImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj: ImportRow = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj);
    }

    return data;
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      alert('Please select a file');
      return;
    }

    setImporting(true);

    try {
      const parsedData = await parseFile(importFile);

      // Transform data to match API format (support 18 columns)
      const medicines = parsedData.map((row: ImportRow) => ({
        plu: String(row.PLU || row.plu || ''),
        name: String(row['Item Name'] || row.name || row.Name || ''),
        description: String(row.description || row.Description || ''),
        purchasePrice: parseFloat(String(row['Purchase Price'] || row.purchasePrice || row.purchase_price || '0')),
        sellPrice: parseFloat(String(row['Sales Price'] || row.sellPrice || row.sell_price || '0')),
        buyPrice: parseFloat(String(row['Purchase Price'] || row.purchasePrice || row.buyPrice || row.buy_price || '0')),
        stock: parseInt(String(row.Stock || row.stock || '0')),
        stockMinimal: parseInt(String(row['Stock Minimal'] || row.stockMinimal || row.stock_minimal || '0')),
        stockMaximal: parseInt(String(row['Stock Maximal'] || row.stockMaximal || row.stock_maximal || '0')) || undefined,
        unit: String(row['Unit Code'] || row.unit || row.Unit || 'tablet'),
        unitCode: String(row['Unit Code'] || row.unitCode || row.unit_code || ''),
        purchaseUnitCode: String(row['Purchase Unit Code'] || row.purchaseUnitCode || row.purchase_unit_code || ''),
        unitConversion: parseFloat(String(row['Unit Conversion'] || row.unitConversion || row.unit_conversion || '1')),
        status: String(row.Status || row.status || 'active'),
        rackLocation: String(row['Rack Location'] || row.rackLocation || row.rack_location || ''),
        margin: parseFloat(String(row.Margin || row.margin || '0')),
        onlineSku: String(row['Online SKU'] || row.onlineSku || row.online_sku || ''),
        barcode: String(row.Barcode || row.barcode || ''),
        // Kirim nama kategori untuk auto-create
        category: String(row.Category || row.category || ''),
        categoryId: row.categoryId || row.category_id || row['Category ID'] ? String(row.categoryId || row.category_id || row['Category ID']) : undefined,
        // Kirim nama supplier untuk auto-create
        supplier: row.Supplier || row.supplier ? String(row.Supplier || row.supplier) : undefined,
        supplierId: row.supplierId || row.supplier_id || row['Supplier ID'] ? String(row.supplierId || row.supplier_id || row['Supplier ID']) : undefined,
      }));

      // Call bulk import API
      const response = await fetch('http://localhost:3000/medicines/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ medicines }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Import failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.success)) {
        const successCount = result.success.length;
        const failedCount = result.failed?.length || 0;
        
        let message = `Import completed!\n✓ Success: ${successCount} items`;
        if (failedCount > 0) {
          message += `\n✗ Failed: ${failedCount} items`;
          if (result.failed[0]?.error) {
            message += `\n\nFirst error: ${result.failed[0].error}`;
          }
        }
        
        alert(message);
        setShowImportModal(false);
        setImportFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        loadMedicines();
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (error: unknown) {
      console.error('Import error:', error);
      let errorMessage = 'Failed to import file';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please ensure the server is running at http://localhost:3000';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Import Error:\n${errorMessage}`);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Template sesuai format data existing dari apotek
    const template = 'No,PLU,Item Name,Purchase Price,Sales Price,Stock,Stock Minimal,Stock Maximal,Unit Code,Purchase Unit Code,Unit Conversion,Status,Rack Location,Margin,Online SKU,Barcode,Category,Supplier\n' +
      '1,701570,POT PLASTIK 50 CC,8000,10000,500,10,1000,POT,BOX,50,Aktif,WADAH,2000,DEX1PT10-0,701570,Wadah,PT Sumber Medika\n' +
      '2,PP0001,POT PLASTIK 65 CC,8000,10000,500,10,1000,POT,BOX,50,Aktif,WADAH,2000,,PP0001,Wadah,PT Sumber Medika\n' +
      '3,BTL001,BOTOL KOSONG PLASTIK 30 ML,7000,10000,500,10,1000,BTL,BOX,30,Aktif,WADAH,3000,BTL001,,Wadah,PT Kimia Farma';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicine_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadTemplateExcel = () => {
    // Template sesuai format data existing dari apotek
    const templateData = [
      {
        'No': 1,
        'PLU': '701570',
        'Item Name': 'POT PLASTIK 50 CC',
        'Purchase Price': 8000,
        'Sales Price': 10000,
        'Stock': 500,
        'Stock Minimal': 10,
        'Stock Maximal': 1000,
        'Unit Code': 'POT',
        'Purchase Unit Code': 'BOX',
        'Unit Conversion': 50,
        'Status': 'Aktif',
        'Rack Location': 'WADAH',
        'Margin': 2000,
        'Online SKU': 'DEX1PT10-0',
        'Barcode': '701570',
        'Category': 'Wadah',
        'Supplier': 'PT Sumber Medika'
      },
      {
        'No': 2,
        'PLU': 'PP0001',
        'Item Name': 'POT PLASTIK 65 CC',
        'Purchase Price': 8000,
        'Sales Price': 10000,
        'Stock': 500,
        'Stock Minimal': 10,
        'Stock Maximal': 1000,
        'Unit Code': 'POT',
        'Purchase Unit Code': 'BOX',
        'Unit Conversion': 50,
        'Status': 'Aktif',
        'Rack Location': 'WADAH',
        'Margin': 2000,
        'Online SKU': '',
        'Barcode': 'PP0001',
        'Category': 'Wadah',
        'Supplier': 'PT Sumber Medika'
      },
      {
        'No': 3,
        'PLU': 'BTL001',
        'Item Name': 'BOTOL KOSONG PLASTIK 30 ML',
        'Purchase Price': 7000,
        'Sales Price': 10000,
        'Stock': 500,
        'Stock Minimal': 10,
        'Stock Maximal': 1000,
        'Unit Code': 'BTL',
        'Purchase Unit Code': 'BOX',
        'Unit Conversion': 30,
        'Status': 'Aktif',
        'Rack Location': 'WADAH',
        'Margin': 3000,
        'Online SKU': 'BTL001',
        'Barcode': '',
        'Category': 'Wadah',
        'Supplier': 'PT Kimia Farma'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'medicine_import_template.xlsx');
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    setExporting(true);
    try {
      const endpoint = format === 'csv' ? 'csv' : 'excel';
      const response = await fetch(`http://localhost:3000/medicines/export/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = format === 'csv' ? 'csv' : 'xlsx';
      a.download = `medicines_export_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
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
          <div className="flex gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Export Data
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-5 w-5" />
              Import Data
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Medicine
            </button>
          </div>
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

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Import Medicines Data</h2>
              <button onClick={() => setShowImportModal(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Format Instructions:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Supported formats: CSV (.csv), Excel (.xls, .xlsx)</li>
                  <li>• 18 columns template (see download buttons)</li>
                  <li>• Required: No, PLU, Item Name, Purchase/Sales Price, Stock, Category</li>
                  <li>• Get Category ID and Supplier ID from database</li>
                </ul>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  CSV Template
                </button>
                <button
                  onClick={downloadTemplateExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <FileSpreadsheet className="h-5 w-5" />
                  Excel Template
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {importFile ? importFile.name : 'Click to select CSV or Excel file'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Supported: .csv, .xls, .xlsx
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={importing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportSubmit}
                  disabled={!importFile || importing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Export Medicines Data</h2>
              <button onClick={() => setShowExportModal(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Pilih format file untuk export semua data obat:
              </p>

              <button
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Download className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">Export ke CSV</div>
                    <div className="text-xs text-gray-500">Format: .csv (Excel compatible)</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleExport('excel')}
                disabled={exporting}
                className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">Export ke Excel</div>
                    <div className="text-xs text-gray-500">Format: .xlsx (Microsoft Excel)</div>
                  </div>
                </div>
              </button>

              {exporting && (
                <div className="text-center text-sm text-gray-600">
                  Sedang mengexport data...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default withAdminAuth(InventoryPage);

