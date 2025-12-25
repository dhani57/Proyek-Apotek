'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Pill, LogIn, Filter, ShieldCheck, Clock, Package, Sparkles } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  stock: number;
  batchNumber: string;
  expiryDate: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CustomerPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medicinesRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3000/medicines'),
        fetch('http://localhost:3000/categories'),
      ]);

      const medicinesData = await medicinesRes.json();
      const categoriesData = await categoriesRes.json();

      setMedicines(medicinesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || medicine.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && medicine.stock > 0;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                  <Pill className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Apotek B213
                </h1>
                <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  Kesehatan Terpercaya Keluarga Indonesia
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold">Login Admin</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Modern Design */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJ2LTJhNiA2IDAgMTAwIDEyek0yNCA0NGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6 animate-bounce">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-semibold">Terpercaya & Terjamin Kualitas</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Temukan Obat yang
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Anda Butuhkan
              </span>
            </h2>
            <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
              Koleksi lengkap obat berkualitas dengan harga terjangkau untuk kesehatan keluarga Anda
            </p>

            {/* Search Bar with Modern Design */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-6 w-6 h-6 text-emerald-600 z-10" />
                  <input
                    type="text"
                    placeholder="Ketik nama obat atau kandungan yang dicari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl text-gray-800 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-bold text-sm">Obat Original</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300">
              <Clock className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-bold text-sm">Layanan Cepat</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300">
              <Package className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-bold text-sm">Stok Lengkap</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter with Pills Design */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Pilih Kategori
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`group relative px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-300'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span className="relative z-10">✨ Semua Obat</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-emerald-300'
                }`}
              >
                <span className="relative z-10">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Menampilkan <span className="font-bold text-emerald-600">{filteredMedicines.length}</span> obat
            </p>
          </div>
        )}

        {/* Medicine Grid with Premium Cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-4 border-emerald-600 border-t-transparent"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Memuat koleksi obat...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur opacity-30"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Pill className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Tidak ada obat ditemukan</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau pilih kategori lain untuk menemukan obat yang Anda butuhkan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-100"
              >
                {/* Card Header with Gradient */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {medicine.category.name}
                  </span>
                </div>

                <div className="p-6">
                  {/* Medicine Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Pill className="w-8 h-8 text-emerald-600" />
                  </div>

                  {/* Medicine Name */}
                  <h3 className="font-black text-gray-800 text-xl mb-2 group-hover:text-emerald-600 transition-colors">
                    {medicine.name}
                  </h3>
                  <p className="text-sm text-gray-500 italic mb-4 line-clamp-2">
                    {medicine.genericName}
                  </p>

                  {/* Price Tag */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-600 mb-1">Harga</p>
                    <p className="font-black text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {formatCurrency(medicine.price)}
                    </p>
                  </div>

                  {/* Stock Info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Ketersediaan</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          medicine.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                        }`}
                      ></div>
                      <span
                        className={`font-bold text-sm ${
                          medicine.stock < 10 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {medicine.stock} unit
                      </span>
                    </div>
                  </div>

                  {/* Batch & Expiry */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Batch</p>
                        <p className="text-xs font-bold text-gray-700">{medicine.batchNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Kadaluarsa</p>
                        <p className="text-xs font-bold text-gray-700">
                          {new Date(medicine.expiryDate).toLocaleDateString('id-ID', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer with Modern Design */}
      <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJ2LTJhNiA2IDAgMTAwIDEyek0yNCA0NGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">Apotek B213</h3>
            </div>
            
            <p className="text-emerald-200 mb-6 max-w-2xl mx-auto">
              Layanan kesehatan terpercaya untuk keluarga Indonesia. Kami menyediakan berbagai jenis obat berkualitas dengan harga terjangkau.
            </p>
            
            <div className="border-t border-emerald-800 pt-6">
              <p className="text-emerald-300 text-sm">
                © {new Date().getFullYear()} Apotek B213. Semua hak dilindungi undang-undang.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
