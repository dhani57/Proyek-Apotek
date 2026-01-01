'use client';

import { useRef } from 'react';
import { X, Printer } from 'lucide-react';

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptProps {
  transaction: {
    id: string;
    date: string;
    items: ReceiptItem[];
    total: number;
    paymentMethod: string;
  };
  onClose: () => void;
}

export default function Receipt({ transaction, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
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
              padding: 20px;
              background: white;
            }
            
            .receipt {
              width: 80mm;
              margin: 0 auto;
              background: white;
            }
            
            .receipt-header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            
            .store-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            
            .store-info {
              font-size: 11px;
              line-height: 1.4;
            }
            
            .receipt-info {
              font-size: 11px;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px dashed #000;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            
            .items-table {
              width: 100%;
              font-size: 11px;
              margin-bottom: 10px;
            }
            
            .item-row {
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px dotted #ccc;
            }
            
            .item-name {
              font-weight: bold;
              margin-bottom: 3px;
            }
            
            .item-details {
              display: flex;
              justify-content: space-between;
              font-size: 10px;
            }
            
            .receipt-summary {
              border-top: 2px solid #000;
              padding-top: 8px;
              margin-top: 10px;
              font-size: 11px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            
            .total-row {
              font-size: 14px;
              font-weight: bold;
              padding-top: 8px;
              border-top: 1px dashed #000;
              margin-top: 8px;
            }
            
            .receipt-footer {
              text-align: center;
              font-size: 11px;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px dashed #000;
            }
            
            .footer-text {
              margin: 4px 0;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .receipt {
                width: 80mm;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Struk Pembayaran</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="p-6">
          <div 
            ref={receiptRef}
            className="receipt bg-white border-2 border-gray-200 rounded-lg p-6 mb-6"
            style={{ width: '80mm', margin: '0 auto' }}
          >
            {/* Receipt Header */}
            <div className="receipt-header">
              <div className="store-name">APOTEK B213</div>
              <div className="store-info">
                Jl. Kesehatan No. 213<br />
                Jakarta Selatan, DKI Jakarta 12345<br />
                Telp: +62 21 1234 5678<br />
                Email: info@apotekb213.com
              </div>
            </div>

            {/* Transaction Info */}
            <div className="receipt-info">
              <div className="info-row">
                <span>No. Transaksi:</span>
                <span><strong>{transaction.id.slice(-8).toUpperCase()}</strong></span>
              </div>
              <div className="info-row">
                <span>Tanggal:</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
              <div className="info-row">
                <span>Kasir:</span>
                <span>Admin</span>
              </div>
              <div className="info-row">
                <span>Pembayaran:</span>
                <span>{transaction.paymentMethod}</span>
              </div>
            </div>

            {/* Items */}
            <div className="items-table">
              {transaction.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">
                    <span>{item.quantity} x {formatCurrency(item.price)}</span>
                    <span><strong>{formatCurrency(item.price * item.quantity)}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="receipt-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
              <div className="summary-row">
                <span>Diskon:</span>
                <span>-</span>
              </div>
              <div className="summary-row">
                <span>Pajak:</span>
                <span>-</span>
              </div>
              <div className="summary-row total-row">
                <span>TOTAL:</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="receipt-footer">
              <div className="footer-text">
                <strong>Terima kasih atas kunjungan Anda!</strong>
              </div>
              <div className="footer-text">
                Barang yang sudah dibeli tidak dapat dikembalikan
              </div>
              <div className="footer-text">
                Simpan struk ini sebagai bukti pembelian
              </div>
              <div className="footer-text" style={{ marginTop: '10px', fontSize: '10px' }}>
                www.apotekb213.com
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Printer className="h-5 w-5" />
              Cetak Struk
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Tekan tombol &quot;Cetak Struk&quot; untuk mencetak atau simpan sebagai PDF
          </p>
        </div>
      </div>
    </div>
  );
}
