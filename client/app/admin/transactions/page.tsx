'use client';

import { useEffect, useState } from 'react';
import { Search, Printer } from 'lucide-react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { transactionApi } from '@/lib/api';

interface Transaction {
  id: string;
  transactionNo: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  cashier: {
    name: string;
    email: string;
  };
  items: Array<{
    quantity: number;
    price: number;
    subtotal: number;
    product: {
      name: string;
      unit: string;
    };
  }>;
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await transactionApi.getAll(
        dateFilter.start || undefined,
        dateFilter.end || undefined
      );
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    loadTransactions();
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transactionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.cashier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const printReceipt = (transaction: Transaction) => {
    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk - Apotek B213</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Courier New', monospace;
              padding: 5mm;
              background: white;
            }
            
            .receipt {
              width: 58mm;
              margin: 0 auto;
              background: white;
              font-size: 9px;
            }
            
            .receipt-header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 6px;
              margin-bottom: 6px;
            }
            
            .store-name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 2px;
            }
            
            .store-info {
              font-size: 8px;
              line-height: 1.3;
            }
            
            .receipt-info {
              font-size: 8px;
              margin-bottom: 6px;
              padding-bottom: 6px;
              border-bottom: 1px dashed #000;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            
            .items-table {
              width: 100%;
              font-size: 8px;
              margin-bottom: 6px;
              border-bottom: 1px dashed #000;
              padding-bottom: 6px;
            }
            
            .item-row {
              margin-bottom: 5px;
              padding-bottom: 5px;
              border-bottom: 1px dotted #ccc;
            }
            
            .item-row:last-child {
              border-bottom: none;
            }
            
            .item-name {
              font-weight: bold;
              margin-bottom: 2px;
              font-size: 9px;
            }
            
            .item-details {
              display: flex;
              justify-content: space-between;
              font-size: 8px;
            }
            
            .receipt-summary {
              padding-top: 5px;
              margin-top: 6px;
              font-size: 8px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            
            .total-row {
              font-size: 11px;
              font-weight: bold;
              padding-top: 5px;
              border-top: 1px dashed #000;
              margin-top: 5px;
            }
            
            .receipt-footer {
              text-align: center;
              font-size: 8px;
              margin-top: 8px;
              padding-top: 6px;
              border-top: 1px dashed #000;
            }
            
            .footer-text {
              margin: 2px 0;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .receipt {
                width: 58mm;
              }
              
              @page {
                size: 58mm auto;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="receipt-header">
              <div class="store-name">APOTEK B213</div>
              <div class="store-info">
                Jl. Kesehatan No. 213<br />
                Jakarta Selatan 12345<br />
                Telp: +62 21 1234 5678<br />
                info@apotekb213.com
              </div>
            </div>

            <div class="receipt-info">
              <div class="info-row">
                <span>No. Transaksi:</span>
                <span><strong>${transaction.transactionNo}</strong></span>
              </div>
              <div class="info-row">
                <span>Tanggal:</span>
                <span>${formatDate(transaction.createdAt)}</span>
              </div>
              <div class="info-row">
                <span>Kasir:</span>
                <span>${transaction.cashier.name}</span>
              </div>
              <div class="info-row">
                <span>Pembayaran:</span>
                <span>${transaction.paymentMethod}</span>
              </div>
            </div>

            <div class="items-table">
              ${transaction.items.map(item => `
                <div class="item-row">
                  <div class="item-name">${item.product.name}</div>
                  <div class="item-details">
                    <span>${item.quantity} x ${formatCurrency(item.price)}</span>
                    <span><strong>${formatCurrency(item.subtotal)}</strong></span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="receipt-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(transaction.totalPrice)}</span>
              </div>
              <div class="summary-row">
                <span>Diskon:</span>
                <span>-</span>
              </div>
              <div class="summary-row">
                <span>Pajak:</span>
                <span>-</span>
              </div>
              <div class="summary-row total-row">
                <span>TOTAL:</span>
                <span>${formatCurrency(transaction.totalPrice)}</span>
              </div>
            </div>

            <div class="receipt-footer">
              <div class="footer-text">
                <strong>Terima kasih!</strong>
              </div>
              <div class="footer-text" style="font-size: 7px;">
                Barang yang sudah dibeli<br/>tidak dapat dikembalikan
              </div>
              <div class="footer-text" style="margin-top: 4px; font-size: 7px;">
                www.apotekb213.com
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by transaction number or cashier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleFilter}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Apply Filter
          </button>
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
                      Transaction No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Cashier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transactionNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.cashier.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.items.length} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => printReceipt(transaction)}
                            className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors"
                            title="Cetak Struk"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors text-xs font-medium"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedTransaction.transactionNo}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(selectedTransaction.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Cashier</h3>
                <p className="text-gray-900">{selectedTransaction.cashier.name}</p>
                <p className="text-sm text-gray-600">{selectedTransaction.cashier.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedTransaction.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.product.unit} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(selectedTransaction.totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                  <span>Payment Method</span>
                  <span className="font-medium">{selectedTransaction.paymentMethod}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => printReceipt(selectedTransaction)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Printer className="h-5 w-5" />
                  Cetak Struk
                </button>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default withAdminAuth(TransactionsPage);
