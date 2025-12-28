# Panduan Menjalankan Aplikasi Web Apotek

## Status Perbaikan

✅ **Masalah Terselesaikan:**
1. Server port sudah dikonfigurasi dengan benar (3001)
2. Database telah di-seed dengan data awal
3. Issues Tailwind CSS sudah diperbaiki
4. Dashboard sudah diupdate dengan grafik dan informasi berguna

## Cara Menjalankan Aplikasi

### 1. Menjalankan Server (Backend)

Buka terminal baru dan jalankan:

```bash
cd C:/Users/dhnah/Documents/Project/web-apotek/server
npm run start:dev
```

**Server akan berjalan di:** `http://localhost:3000`

**Tunggu hingga muncul log:**
```
[NestApplication] Nest application successfully started
```

### 2. Menjalankan Client (Frontend)

Buka terminal baru yang berbeda dan jalankan:

```bash
cd C:/Users/dhnah/Documents/Project/web-apotek/client
npm run dev
```

**Client akan berjalan di:** `http://localhost:3001`

### 3. Akses Aplikasi

1. Buka browser: `http://localhost:3001`
2. Login dengan kredensial:
   - **Email:** admin@apotek.com
   - **Password:** admin123

## Troubleshooting

### Error: "Port 3000 already in use"

Jika port 3000 sudah digunakan, cari dan kill prosesnya:

```bash
# Cari PID yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill proses (ganti XXXXX dengan PID yang ditemukan)
taskkill //PID XXXXX //F
```

### Error: "Port 3001 already in use (Client)"

Jika port 3001 sudah digunakan oleh client:

```bash
# Cari PID yang menggunakan port 3001
netstat -ano | findstr :3001

# Kill proses (ganti XXXXX dengan PID yang ditemukan)
taskkill //PID XXXXX //F
```

### Data Hilang atau Database Kosong

Jalankan seed script untuk mengisi database dengan data awal:

```bash
cd server
npx prisma db seed
```

Ini akan membuat:
- 1 Admin user (admin@apotek.com)
- 3 Kategori obat (OBAT ETHICAL, OBAT OTC, FOOD SUPLEMENT)

### Error: "Failed to fetch" di Frontend

Pastikan:
1. Server backend sudah berjalan di port 3001
2. Tidak ada firewall yang memblokir koneksi
3. Check browser console untuk detail error

### Tambah Data Obat

Setelah login sebagai admin:
1. Klik menu **Inventory** di sidebar
2. Klik tombol **+ Add Medicine** 
3. Isi form dengan lengkap
4. Atau gunakan fitur **Import Data** untuk upload CSV/Excel

## Database Schema

Database menggunakan **SQLite** yang tersimpan di:
```
server/prisma/dev.db
```

Untuk melihat data dengan GUI, gunakan:
```bash
cd server
npx prisma studio
```

## Struktur Port

- **Frontend (Next.js):** Port 3001
- **Backend (NestJS):** Port 3000
- **Database:** SQLite (file-based, no port)

## Catatan Penting

⚠️ **JANGAN menjalankan `npm run start:dev` di terminal yang sama dengan curl atau command lain karena akan mengganggu server.**

✅ **BEST PRACTICE:**
- Terminal 1: Server backend (biarkan berjalan)
- Terminal 2: Client frontend (biarkan berjalan)  
- Terminal 3: Command tambahan (seed, prisma studio, dll)

## Fitur Dashboard Baru

Dashboard sekarang menampilkan:

📊 **Grafik Penjualan 7 Hari Terakhir**
- Bar chart interaktif
- Hover untuk detail

🛒 **5 Transaksi Terbaru**
- Timestamp lengkap
- Total dan metode pembayaran

📦 **Distribusi Stok**
- Stok normal, rendah, dan hampir kadaluarsa
- Progress bar dengan persentase

💰 **Ringkasan Performa**
- Total penjualan
- Total transaksi
- Rata-rata per transaksi

## Support

Jika masih ada masalah, periksa:
1. Node.js version: `node --version` (minimal v18)
2. NPM version: `npm --version`
3. Dependencies terinstall: jalankan `npm install` di folder server dan client
