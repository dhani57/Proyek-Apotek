'use client';

import Link from 'next/link';
import { Pill, LogIn, ShieldCheck, Clock, MapPin, Phone, Mail, Award, Users, Building2, Heart, Star, CheckCircle } from 'lucide-react';

export default function PharmacyProfilePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
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
                  <Heart className="w-3 h-3 text-red-500" />
                  Kesehatan Terpercaya Keluarga Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJ2LTJhNiA2IDAgMTAwIDEyek0yNCA0NGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-semibold">Terpercaya Sejak 2010</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Selamat Datang di
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Apotek B213
              </span>
            </h2>
            <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
              Partner terpercaya kesehatan keluarga Indonesia dengan pelayanan profesional, 
              produk berkualitas, dan harga terjangkau untuk semua kalangan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* About Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Tentang Kami
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Apotek B213 berdiri sejak tahun 2010 dengan komitmen memberikan layanan kesehatan terbaik 
              untuk masyarakat Indonesia. Kami dipercaya oleh ribuan pelanggan di seluruh nusantara.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-emerald-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">Pengalaman 14+ Tahun</h4>
              <p className="text-gray-600 text-center">
                Melayani masyarakat dengan dedikasi tinggi dan profesionalitas yang teruji waktu.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-emerald-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">10.000+ Pelanggan</h4>
              <p className="text-gray-600 text-center">
                Dipercaya oleh ribuan keluarga Indonesia untuk kebutuhan kesehatan mereka.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-emerald-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">100% Original</h4>
              <p className="text-gray-600 text-center">
                Semua produk dijamin keaslian dan kualitasnya langsung dari distributor resmi.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Layanan Kami
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Kami menyediakan berbagai layanan kesehatan yang lengkap untuk memenuhi kebutuhan Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-400 transition-colors duration-300">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Obat Resep</h4>
              <p className="text-gray-600 text-sm">Penebusan resep dokter dengan apoteker berpengalaman</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Obat Bebas</h4>
              <p className="text-gray-600 text-sm">Tersedia berbagai obat bebas dan bebas terbatas</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Konsultasi</h4>
              <p className="text-gray-600 text-sm">Konsultasi gratis dengan apoteker profesional</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-colors duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Layanan 24/7</h4>
              <p className="text-gray-600 text-sm">Siap melayani Anda kapan saja dibutuhkan</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJ2LTJhNiA2IDAgMTAwIDEyek0yNCA0NGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="relative">
              <div className="text-center mb-10">
                <h3 className="text-4xl font-black text-white mb-4">
                  Mengapa Memilih Apotek B213?
                </h3>
                <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                  Kami berkomitmen memberikan yang terbaik untuk kesehatan Anda dan keluarga
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CheckCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Harga Terjangkau</h4>
                    <p className="text-emerald-50">Kami menawarkan harga kompetitif tanpa mengurangi kualitas produk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CheckCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Apoteker Profesional</h4>
                    <p className="text-emerald-50">Tim apoteker bersertifikat siap membantu dan memberikan konsultasi</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CheckCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Stok Lengkap</h4>
                    <p className="text-emerald-50">Ribuan jenis obat dan produk kesehatan selalu tersedia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CheckCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Lokasi Strategis</h4>
                    <p className="text-emerald-50">Mudah dijangkau dengan area parkir yang luas dan nyaman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Hubungi Kami
            </h3>
            <p className="text-gray-600 text-lg">
              Kami siap melayani Anda dengan sepenuh hati
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Alamat</h4>
              <p className="text-gray-600">
                Jl. Kesehatan No. 213<br />
                Jakarta Selatan, DKI Jakarta<br />
                12345 Indonesia
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Telepon</h4>
              <p className="text-gray-600">
                +62 21 1234 5678<br />
                +62 812 3456 7890<br />
                (Senin - Minggu, 24 Jam)
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Email</h4>
              <p className="text-gray-600">
                info@apotekb213.com<br />
                customer@apotekb213.com<br />
                support@apotekb213.com
              </p>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Testimoni Pelanggan
            </h3>
            <p className="text-gray-600 text-lg">
              Kepuasan pelanggan adalah prioritas utama kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Pelayanan sangat memuaskan, apotekernya ramah dan profesional. Harga juga terjangkau. Recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  BS
                </div>
                <div>
                  <p className="font-bold text-gray-800">Budi Santoso</p>
                  <p className="text-sm text-gray-500">Jakarta Selatan</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Apotek langganan keluarga. Stoknya lengkap dan selalu ada. Apotekernya juga sabar menjelaskan."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                  SP
                </div>
                <div>
                  <p className="font-bold text-gray-800">Siti Permata</p>
                  <p className="text-sm text-gray-500">Jakarta Timur</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Buka 24 jam sangat membantu saat butuh obat mendesak. Tempatnya bersih dan nyaman. Mantap!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                  AW
                </div>
                <div>
                  <p className="font-bold text-gray-800">Ahmad Wijaya</p>
                  <p className="text-sm text-gray-500">Tangerang</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer with Login Button */}
      <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJ2LTJhNiA2IDAgMTAwIDEyek0yNCA0NGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
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

          {/* Login Button - Bottom Right */}
          <div className="absolute bottom-8 right-8">
            <Link
              href="/login"
              className="group relative px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold text-sm">Admin Login</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
