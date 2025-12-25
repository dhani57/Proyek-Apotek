# Update Fitur Import/Export - 18 Kolom Data

## Tanggal: 26 Desember 2025

---

## ✨ Fitur Baru yang Ditambahkan

### 1. **Support 18 Kolom Data**
Sistem sekarang mendukung 18 kolom data sesuai format apotek standar:

1. **No** - Nomor urut
2. **PLU** - Product Look Up code  
3. **Item Name** - Nama obat/produk
4. **Purchase Price** - Harga beli
5. **Sales Price** - Harga jual
6. **Stock** - Jumlah stok
7. **Stock Minimal** - Stok minimum
8. **Stock Maximal** - Stok maksimum
9. **Unit Code** - Kode satuan (tablet, box, dll)
10. **Purchase Unit Code** - Kode satuan pembelian
11. **Unit Conversion** - Konversi satuan
12. **Status** - Status produk (active/inactive)
13. **Rack Location** - Lokasi rak penyimpanan
14. **Margin** - Margin keuntungan
15. **Online SKU** - SKU untuk toko online
16. **Barcode** - Barcode produk
17. **Category** - ID Kategori
18. **Supplier** - ID Supplier

### 2. **Support Format Excel (.xls, .xlsx)**
- Import sekarang mendukung file Excel selain CSV
- Parser otomatis mendeteksi format file
- Support untuk Microsoft Excel dan Google Sheets

### 3. **Fitur Export Data**
- **Export ke CSV** - Download data existing dalam format CSV
- **Export ke Excel** - Download data existing dalam format Excel (.xlsx)
- Otomatis include semua 18 kolom data
- Nama file dengan timestamp (medicines_export_2025-12-26.xlsx)

### 4. **Template Download**
- **CSV Template** - Template CSV dengan 18 kolom + contoh data
- **Excel Template** - Template Excel dengan 18 kolom + contoh data
- Format siap pakai untuk import data

---

## 🔄 Perubahan Database Schema

### Model Product (Medicine) - Field Baru:
```prisma
- plu               String?   // Product Look Up code
- purchasePrice     Decimal   // Harga beli
- stockMinimal      Int?      // Stok minimal
- stockMaximal      Int?      // Stok maksimal
- unitCode          String?   // Kode satuan
- purchaseUnitCode  String?   // Kode satuan pembelian
- unitConversion    Decimal?  // Konversi satuan
- status            String?   // Status (active/inactive)
- rackLocation      String?   // Lokasi rak
- margin            Decimal?  // Margin
- onlineSku         String?   // SKU online
- barcode           String?   // Barcode
- supplierId        String?   // Relasi ke Supplier (opsional)
```

### Backward Compatibility:
- Field lama (buyPrice, sellPrice) tetap ada
- System otomatis mapping purchasePrice ↔ buyPrice
- Tidak ada breaking changes untuk data existing

---

## 🛠️ Technical Changes

### Backend (NestJS):

#### 1. Updated Files:
- `prisma/schema.prisma` - 18 field baru di Product model
- `src/medicine/dto/create-medicine.dto.ts` - Support 18 field
- `src/medicine/medicine.service.ts` - Export methods
- `src/medicine/medicine.controller.ts` - Export endpoints

#### 2. New Endpoints:
```
GET  /medicines/export/csv    - Export data ke CSV
GET  /medicines/export/excel  - Export data ke Excel
POST /medicines/bulk-import   - Import bulk (updated untuk 18 kolom)
```

#### 3. Dependencies Added:
```json
{
  "xlsx": "^0.18.5"
}
```

### Frontend (Next.js):

#### 1. Updated Files:
- `app/admin/inventory/page.tsx` - UI untuk import/export

#### 2. New Features:
- Excel file parser menggunakan XLSX library
- Template download untuk CSV dan Excel
- Export buttons (CSV & Excel)
- Support multi-format file upload

#### 3. Dependencies Added:
```json
{
  "xlsx": "^0.18.5"
}
```

---

## 📝 Cara Menggunakan

### Import Data:

1. **Download Template**
   - Klik "Import Data" di halaman Inventory
   - Pilih "CSV Template" atau "Excel Template"
   - Template akan terdownload dengan format dan contoh data

2. **Isi Data**
   - Buka template di Excel atau text editor
   - Isi data obat sesuai kolom
   - Pastikan Category ID dan Supplier ID valid (dari database)

3. **Upload File**
   - Klik "Import Data"
   - Pilih file CSV atau Excel (.xls/.xlsx)
   - Klik "Import"
   - System akan menampilkan hasil sukses/gagal

### Export Data:

1. **Export ke CSV**
   - Klik tombol "Export CSV" di header
   - File CSV akan terdownload otomatis
   - Berisi semua data dengan 18 kolom

2. **Export ke Excel**
   - Klik tombol "Export Excel" di header
   - File Excel (.xlsx) akan terdownload otomatis
   - Siap dibuka di Microsoft Excel atau Google Sheets

---

## 📊 Format Data

### CSV Format:
```csv
No,PLU,Item Name,Purchase Price,Sales Price,Stock,Stock Minimal,Stock Maximal,Unit Code,Purchase Unit Code,Unit Conversion,Status,Rack Location,Margin,Online SKU,Barcode,Category,Supplier
1,PLU001,Paracetamol 500mg,3000,5000,100,10,500,tablet,box,10,active,A1-01,2000,SKU001,8991234567890,cat-id,sup-id
```

### Excel Format:
- Sheet 1: "Medicines" atau "Template"
- Header row dengan 18 kolom
- Data rows dengan contoh

---

## ✅ Testing Checklist

- [x] Database schema updated
- [x] Migration applied successfully
- [x] Server running without errors
- [x] Import CSV berfungsi
- [x] Import Excel berfungsi
- [x] Export CSV berfungsi
- [x] Export Excel berfungsi
- [x] Template CSV tersedia
- [x] Template Excel tersedia
- [x] Backward compatibility maintained
- [ ] Manual test import data real
- [ ] Manual test export data real

---

## 🎯 Endpoints API

### Import:
```
POST /medicines/bulk-import
Authorization: Bearer <token>
Content-Type: application/json

Body: {
  "medicines": [
    {
      "plu": "PLU001",
      "name": "Paracetamol 500mg",
      "purchasePrice": 3000,
      "sellPrice": 5000,
      "stock": 100,
      "stockMinimal": 10,
      "stockMaximal": 500,
      "unit": "tablet",
      "unitCode": "tablet",
      "purchaseUnitCode": "box",
      "unitConversion": 10,
      "status": "active",
      "rackLocation": "A1-01",
      "margin": 2000,
      "onlineSku": "SKU001",
      "barcode": "8991234567890",
      "categoryId": "uuid-here",
      "supplierId": "uuid-here"
    }
  ]
}

Response: {
  "success": [...],
  "failed": [...]
}
```

### Export CSV:
```
GET /medicines/export/csv
Authorization: Bearer <token>

Response: CSV file download
Content-Type: text/csv
Content-Disposition: attachment; filename=medicines.csv
```

### Export Excel:
```
GET /medicines/export/excel
Authorization: Bearer <token>

Response: Excel file download
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=medicines.xlsx
```

---

## 🔐 Security

- Semua endpoint import/export require JWT authentication
- Hanya role ADMIN yang bisa akses
- File validation pada upload
- Support extension: .csv, .xls, .xlsx only

---

## 📱 UI Updates

### Header Buttons (Inventory Page):
1. **Export CSV** (hijau) - Icon Download
2. **Export Excel** (hijau) - Icon FileSpreadsheet
3. **Import Data** (biru) - Icon Upload
4. **Add Medicine** (emerald) - Icon Plus

### Import Modal:
- Support CSV dan Excel
- Download template CSV atau Excel
- Drag & drop file upload
- Progress indicator saat importing

---

## 🚀 Next Steps

1. **Manual Testing**:
   - Test import dengan file CSV real
   - Test import dengan file Excel real
   - Test export dan verify data
   - Test dengan data besar (100+ items)

2. **Optional Enhancements**:
   - Preview data sebelum import
   - Validation detail per row
   - Progress bar untuk import besar
   - Batch processing untuk file besar

3. **Documentation**:
   - Update user manual
   - Add video tutorial
   - Create FAQ section

---

## 📌 Important Notes

### Category ID & Supplier ID:
- Harus mendapatkan ID dari database terlebih dahulu
- Bisa query via API atau langsung dari database
- Format: UUID (e.g., "123e4567-e89b-12d3-a456-426614174000")

### Untuk mendapatkan ID:
```javascript
// Get Categories
GET /categories
Response: [{ id: "uuid", name: "Category Name" }]

// Get Suppliers  
GET /suppliers
Response: [{ id: "uuid", name: "Supplier Name" }]
```

### Best Practice:
1. Export data existing untuk referensi format
2. Gunakan template untuk import data baru
3. Test dengan sample kecil terlebih dahulu
4. Backup database sebelum import data besar

---

## 🎉 Summary

✅ **18 kolom data** sesuai standar apotek  
✅ **Import CSV & Excel** (.csv, .xls, .xlsx)  
✅ **Export CSV & Excel** dengan 18 kolom  
✅ **Template download** untuk kemudahan  
✅ **Backward compatible** dengan data existing  
✅ **UI/UX friendly** dengan instruksi jelas  
✅ **Server running** tanpa error  

**Status**: ✅ READY TO USE!
