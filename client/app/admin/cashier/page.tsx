'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  Pill
} from 'lucide-react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { medicineApi, transactionApi } from '@/lib/api';
import Receipt from '@/components/Receipt';

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
  category?: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

interface MedicineDisplay {
  id: string;
  name: string;
  genericName: string;
  price: number;
  stock: number;
  batchNumber: string;
  expiryDate: string;
}

interface CartItem extends MedicineDisplay {
  quantity: number;
}

function CashierPage() {
  const [medicines, setMedicines] = useState<MedicineDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data: Medicine[] = await medicineApi.getAll();
      // Transform API data to display format
      const displayData: MedicineDisplay[] = data.map(med => ({
        id: med.id,
        name: med.name,
        genericName: med.description || med.name,
        price: med.sellPrice,
        stock: med.stock,
        batchNumber: med.batchNumber || 'N/A',
        expiryDate: med.expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setMedicines(displayData);
    } catch (error) {
      console.error('Failed to load medicines:', error);
      alert('Gagal memuat data obat');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (medicine: MedicineDisplay) => {
    const existingItem = cart.find((item) => item.id === medicine.id);

    if (existingItem) {
      if (existingItem.quantity >= medicine.stock) {
        alert('Stok tidak mencukupi!');
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (medicine.stock === 0) {
        alert('Stok habis!');
        return;
      }
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (newQuantity > item.stock) {
      alert('Stok tidak mencukupi!');
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }
    // Show payment confirmation
    setShowPaymentConfirm(true);
  };

  const handlePaymentConfirm = async (paymentMethod: 'CASH' | 'QRIS') => {
    try {
      setProcessingPayment(true);

      const transactionData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: String(item.quantity), // Convert to string as required by API
        })),
        paymentMethod: paymentMethod,
      };

      const result = await transactionApi.create(transactionData);

      // Close modal and reset
      setShowPaymentConfirm(false);
      setCart([]);
      loadMedicines(); // Refresh stock
    } catch (error) {
      console.error('Failed to process transaction:', error);
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Gagal memproses transaksi';
      alert(errorMessage);
      setShowPaymentConfirm(false);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentConfirm(false);
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kasir</h1>
          <p className="text-gray-600">Proses transaksi penjualan obat</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medicine List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Cari obat berdasarkan nama atau batch number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="p-4 max-h-150 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : filteredMedicines.length === 0 ? (
                  <div className="text-center py-12">
                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Tidak ada obat ditemukan</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredMedicines.map((medicine) => (
                      <button
                        key={medicine.id}
                        onClick={() => addToCart(medicine)}
                        disabled={medicine.stock === 0}
                        className={`text-left p-4 border rounded-lg transition-all ${
                          medicine.stock === 0
                            ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                            : 'border-gray-200 hover:border-emerald-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {medicine.name}
                            </h3>
                            <p className="text-xs text-gray-600 mb-1">
                              {medicine.genericName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Batch: {medicine.batchNumber}
                            </p>
                          </div>
                          <div className="ml-3">
                            <div
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                medicine.stock > 10
                                  ? 'bg-green-100 text-green-800'
                                  : medicine.stock > 0
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {medicine.stock} unit
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-emerald-600">
                            {formatCurrency(medicine.price)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Exp:{' '}
                            {new Date(medicine.expiryDate).toLocaleDateString(
                              'id-ID'
                            )}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md sticky top-6">
              <div className="p-4 border-b bg-emerald-600">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-white" />
                  <h2 className="text-lg font-bold text-white">
                    Keranjang ({cart.length})
                  </h2>
                </div>
              </div>

              <div className="p-4 max-h-100 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Keranjang kosong</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {formatCurrency(item.price)} × {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-bold text-emerald-600">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-emerald-600">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={processingPayment}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Memproses...
                      </span>
                    ) : (
                      'Proses Pembayaran'
                    )}
                  </button>

                  <button
                    onClick={() => setCart([])}
                    className="w-full mt-2 py-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    Kosongkan Keranjang
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentConfirm && (
        <Receipt
          items={cart}
          total={calculateTotal()}
          onConfirm={handlePaymentConfirm}
          onCancel={handleCancelPayment}
        />
      )}
    </AdminLayout>
  );
}

export default withAdminAuth(CashierPage);
