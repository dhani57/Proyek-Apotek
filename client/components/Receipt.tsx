'use client';

import { useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react';

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptProps {
  items: ReceiptItem[];
  total: number;
  onConfirm: (paymentMethod: 'CASH' | 'QRIS') => void;
  onCancel: () => void;
}

export default function Receipt({ 
  items, 
  total, 
  onConfirm, 
  onCancel
}: ReceiptProps) {
  const [selectedPayment, setSelectedPayment] = useState<'CASH' | 'QRIS' | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirm = () => {
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran!');
      return;
    }
    
    const confirmPrint = window.confirm('Transaksi berhasil! Apakah Anda ingin mencetak struk?');
    
    if (confirmPrint) {
      printReceipt();
    }
    
    onConfirm(selectedPayment);
  };

  const printReceipt = () => {
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
                <span><strong>${new Date().getTime().toString().slice(-8).toUpperCase()}</strong></span>
              </div>
              <div class="info-row">
                <span>Tanggal:</span>
                <span>${new Date().toLocaleString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span>
              </div>
              <div class="info-row">
                <span>Kasir:</span>
                <span>Admin</span>
              </div>
              <div class="info-row">
                <span>Pembayaran:</span>
                <span>${selectedPayment}</span>
              </div>
            </div>

            <div class="items-table">
              ${items.map(item => `
                <div class="item-row">
                  <div class="item-name">${item.name}</div>
                  <div class="item-details">
                    <span>${item.quantity} x ${formatCurrency(item.price)}</span>
                    <span><strong>${formatCurrency(item.price * item.quantity)}</strong></span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="receipt-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(total)}</span>
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
                <span>${formatCurrency(total)}</span>
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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-2 border-emerald-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white text-center">Konfirmasi Pembayaran</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Items Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rincian Pembelian</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 rounded-xl p-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-emerald-600 ml-4">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t-2 border-emerald-200 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
              <span className="text-xl font-bold text-gray-800">Total Pembayaran</span>
              <span className="text-2xl font-black text-emerald-600">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Pilih Metode Pembayaran</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedPayment('CASH')}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedPayment === 'CASH'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    selectedPayment === 'CASH' 
                      ? 'bg-emerald-500' 
                      : 'bg-gray-100'
                  }`}>
                    <Banknote className={`w-8 h-8 ${
                      selectedPayment === 'CASH' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-bold text-lg ${
                      selectedPayment === 'CASH' ? 'text-emerald-600' : 'text-gray-700'
                    }`}>
                      TUNAI
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Pembayaran Cash</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedPayment('QRIS')}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedPayment === 'QRIS'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    selectedPayment === 'QRIS' 
                      ? 'bg-purple-500' 
                      : 'bg-gray-100'
                  }`}>
                    <CreditCard className={`w-8 h-8 ${
                      selectedPayment === 'QRIS' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-bold text-lg ${
                      selectedPayment === 'QRIS' ? 'text-purple-600' : 'text-gray-700'
                    }`}>
                      QRIS
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Quick Response Code</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-4 p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPayment}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proses Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
