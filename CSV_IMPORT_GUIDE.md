# Panduan Import CSV untuk Inventory

## Fitur Import CSV Obat

Fitur ini memungkinkan Anda untuk mengimpor data obat dalam jumlah besar menggunakan file CSV atau Excel (yang sudah dikonversi ke CSV).

## Cara Menggunakan

1. **Akses Halaman Inventory**
   - Login sebagai Admin
   - Navigasi ke menu "Inventory Management"

2. **Buka Dialog Import**
   - Klik tombol "Import CSV" di pojok kanan atas

3. **Download Template (Opsional)**
   - Klik "Download CSV Template" untuk mendapatkan contoh format CSV
   - Template ini sudah memiliki header yang benar dan contoh data

4. **Siapkan File CSV Anda**
   - Jika menggunakan Excel, save file sebagai CSV (.csv)
   - Pastikan format sesuai dengan template

5. **Upload File**
   - Klik area upload atau drag & drop file CSV
   - Klik tombol "Import" untuk memulai proses import

## Format CSV yang Diperlukan

### Header Kolom (Wajib):
```csv
name,description,sellPrice,buyPrice,stock,unit,batchNumber,expirationDate,categoryId
```
;;;
### Kolom Wajib:
- `name` - Nama obat (teks)
- `sellPrice` - Harga jual (angka)
- `buyPrice` - Harga beli (angka)
- `stock` - Jumlah stok (angka bulat)
- `categoryId` - ID kategori (teks UUID dari database)

### Kolom Opsional:
- `description` - Deskripsi obat (teks)
- `unit` - Satuan (tablet/capsule/syrup/dll) - default: tablet
- `batchNumber` - Nomor batch (teks)
- `expirationDate` - Tanggal kadaluarsa (format: YYYY-MM-DD)

## Contoh Data CSV

```csv
name,description,sellPrice,buyPrice,stock,unit,batchNumber,expirationDate,categoryId
Paracetamol 500mg,Pain reliever and fever reducer,5000,3000,100,tablet,BATCH001,2025-12-31,uuid-category-id
Amoxicillin 500mg,Antibiotic for bacterial infections,15000,10000,50,capsule,BATCH002,2026-06-30,uuid-category-id
Vitamin C 1000mg,Vitamin supplement,25000,18000,200,tablet,BATCH003,2026-03-31,uuid-category-id
```

## Cara Mendapatkan Category ID

1. Buka database atau gunakan API endpoint `/categories`
2. Salin UUID kategori yang sesuai
3. Gunakan UUID tersebut di kolom `categoryId` di CSV

## Tips & Catatan

- **Format Tanggal**: Gunakan format ISO (YYYY-MM-DD) untuk expirationDate
- **Harga**: Gunakan angka tanpa pemisah ribuan atau simbol mata uang
- **Stock**: Harus berupa angka bulat
- **Encoding**: Simpan file CSV dengan encoding UTF-8
- **Pemisah**: Gunakan koma (,) sebagai delimiter
- **Koma dalam Data**: Jika data mengandung koma, bungkus dengan tanda kutip ("Data dengan, koma")

## Konversi Excel ke CSV

### Microsoft Excel:
1. Buka file Excel
2. Klik File → Save As
3. Pilih "CSV (Comma delimited) (*.csv)"
4. Klik Save

### Google Sheets:
1. Buka spreadsheet
2. Klik File → Download
3. Pilih "Comma Separated Values (.csv)"

## Troubleshooting

### Error: "Please select a CSV file"
- Pastikan file berekstensi .csv

### Error: Import failed
- Periksa format CSV sesuai template
- Pastikan semua kolom wajib terisi
- Pastikan categoryId valid (ada di database)
- Periksa format tanggal (YYYY-MM-DD)
- Pastikan harga dan stock berupa angka valid

### Beberapa data gagal diimport
- Aplikasi akan menampilkan jumlah sukses dan gagal
- Data yang valid akan tetap diimport
- Periksa kembali data yang gagal untuk kesalahan format

## Hasil Import

Setelah import selesai, Anda akan melihat:
- Jumlah data yang berhasil diimport
- Jumlah data yang gagal diimport
- Data baru akan langsung muncul di tabel inventory

## Keamanan

- Fitur ini hanya dapat diakses oleh user dengan role ADMIN
- Semua request menggunakan JWT authentication
- Data divalidasi sebelum disimpan ke database
