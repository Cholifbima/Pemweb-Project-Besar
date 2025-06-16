'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      showToast.error('Password dan konfirmasi password tidak sama');
      return false;
    }
    if (formData.password.length < 6) {
      showToast.error('Password minimal 6 karakter');
      return false;
    }
    if (formData.username.length < 3) {
      showToast.error('Username minimal 3 karakter');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast.error('Format email tidak valid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Show loading toast
    showToast.loading('Sedang membuat akun...');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName || undefined,
          phoneNumber: formData.phoneNumber || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrasi gagal');
      }

      // Show success toast
      showToast.success('🎉 Registrasi berhasil! Saldo demo Rp 1.000.000 telah ditambahkan ke akun Anda');

      // Small delay to show success message, then redirect
      setTimeout(() => {
        router.push('/dashboard');
        // Force page refresh to ensure auth state is updated
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error: any) {
      // Show error toast
      showToast.error(error.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content with Gradient Background */}
      <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-400 mb-2">Buat Akun Baru</h1>
            <p className="text-dark-300 mb-3">Bergabung dengan komunitas gamer!</p>
            <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4 text-left">
              <h3 className="text-green-400 font-semibold mb-2 flex items-center">
                <span className="mr-2">🎁</span>
                Bonus Pendaftaran
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Saldo demo Rp 1.000.000 gratis
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Invoice otomatis dikirim ke email
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Akses ke semua layanan gaming
                </li>
              </ul>
            </div>
          </div>

          {/* Register Form */}
          <div className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-green-600/20 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="contoh@email.com"
                  required
                  disabled={loading}
                />
                <p className="text-green-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">📧</span>
                  Email ini akan digunakan untuk pengiriman invoice transaksi
                </p>
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="usernameanda"
                  required
                  disabled={loading}
                />
                <p className="text-gray-400 text-xs mt-1">Minimal 3 karakter, tanpa spasi</p>
              </div>

              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="Nama Lengkap Anda"
                  disabled={loading}
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Nomor HP
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="08123456789"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="Minimal 6 karakter"
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Konfirmasi Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="Ulangi password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-green-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Mendaftar...
                  </span>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-dark-600"></div>
              <span className="px-4 text-dark-400 text-sm">atau</span>
              <div className="flex-1 border-t border-dark-600"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-dark-400 text-sm">
                Sudah punya akun?{' '}
                <Link 
                  href="/login" 
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-700 py-6 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-dark-400">&copy; 2024 DoaIbu Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 