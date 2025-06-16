'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Show loading toast
    showToast.loading('Sedang masuk...');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      // Store token in localStorage for chat functionality
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('✅ Token stored in localStorage for chat functionality');
      }

      // Show success toast
      showToast.success('Login berhasil! Selamat datang kembali 🎮');

      // Small delay to show success message, then redirect
      setTimeout(() => {
        router.push('/dashboard');
        // Force page refresh to ensure auth state is updated
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (error: any) {
      // Show error toast
      showToast.error(error.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content with Gradient Background */}
      <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 min-h-screen flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">Masuk ke Akun</h1>
            <p className="text-dark-300 text-sm md:text-base">Selamat datang kembali, gamer!</p>
          </div>

          {/* Login Form */}
          <div className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-green-600/20 p-6 md:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Username Field */}
              <div>
                <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-300 mb-2">
                  Email atau Username
                </label>
                <input
                  type="text"
                  id="emailOrUsername"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="Masukkan email atau username"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700/70 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="Masukkan password"
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
                    Masuk...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-dark-600"></div>
              <span className="px-4 text-dark-400 text-sm">atau</span>
              <div className="flex-1 border-t border-dark-600"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-dark-400 text-sm">
                Belum punya akun?{' '}
                <Link 
                  href="/register" 
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Daftar Sekarang
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