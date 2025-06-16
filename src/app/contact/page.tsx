'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import banner from '@/assets/banner.png';

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Listen to mobile menu state changes from a custom event
  useEffect(() => {
    const handleMobileMenuToggle = (e: CustomEvent) => {
      setIsMobileMenuOpen(e.detail.isOpen);
    };
    
    window.addEventListener('mobileMenuToggle' as any, handleMobileMenuToggle as any);
    
    return () => {
      window.removeEventListener('mobileMenuToggle' as any, handleMobileMenuToggle as any);
    };
  }, []);
  
  const contactMethods = [
    {
      icon: '📱',
      title: 'WhatsApp',
      description: 'Chat langsung untuk order dan bantuan',
      value: '+62 812-3456-7890',
      link: 'https://wa.me/628123456790',
      available: '24/7 Online'
    },
    {
      icon: '💬',
      title: 'Telegram',
      description: 'Support cepat via Telegram',
      value: '@doaibustore',
      link: 'https://t.me/doaibustore',
      available: '08:00 - 22:00'
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'Untuk pertanyaan detail dan kerjasama',
      value: 'support@doaibustore.site',
      link: 'mailto:support@doaibustore.site',
      available: 'Response < 2 jam'
    },
    {
      icon: '📞',
      title: 'Phone',
      description: 'Hubungi langsung untuk bantuan urgent',
      value: '+62 821-9876-5432',
      link: 'tel:+6282198765432',
      available: '09:00 - 21:00'
    }
  ];

  const faqs = [
    {
      question: 'Berapa lama proses top up?',
      answer: 'Proses top up otomatis dalam 1-5 menit setelah pembayaran berhasil. Jika lebih dari 10 menit, silakan hubungi customer service.'
    },
    {
      question: 'Apakah joki aman untuk akun saya?',
      answer: 'Ya, 100% aman. Kami menggunakan VPN dan tidak mengubah data pribadi akun. Sudah 1000+ order tanpa ada yang kena ban.'
    },
    {
      question: 'Bagaimana cara pembayaran?',
      answer: 'Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), E-wallet (OVO, DANA, GoPay), dan QRIS.'
    },
    {
      question: 'Apa garansi yang diberikan?',
      answer: 'Top up: Garansi refund jika tidak masuk. Joki: Garansi rank tidak turun selama 7 hari setelah selesai.'
    },
    {
      question: 'Bisa batalkan order yang sudah dibayar?',
      answer: 'Order bisa dibatalkan jika belum diproses. Jika sudah diproses, tidak bisa dibatalkan tapi bisa diganti dengan layanan lain.'
    },
    {
      question: 'Berapa lama proses joki rank?',
      answer: 'Tergantung target rank. Biasanya 1-7 hari sesuai estimasi yang tertera. Tim kami bekerja 12-16 jam per hari.'
    }
  ];

  const socialMedia = [
    { icon: '📘', name: 'Facebook', link: 'https://facebook.com/doaibustore' },
    { icon: '📷', name: 'Instagram', link: 'https://instagram.com/doaibustore' },
    { icon: '🐦', name: 'Twitter', link: 'https://twitter.com/doaibustore' },
    { icon: '📺', name: 'YouTube', link: 'https://youtube.com/@doaibustore' },
    { icon: '🎮', name: 'Discord', link: 'https://discord.gg/doaibustore' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Main Content with Gradient Background */}
      <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-green-400 mb-6">
              Hubungi Kami
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Tim customer service kami siap membantu 24/7 untuk semua kebutuhan gaming Anda. 
              Jangan ragu untuk bertanya atau konsultasi gratis!
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-green-600/20 p-6 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="text-4xl text-center mb-4">{method.icon}</div>
                  <h3 className="text-xl font-bold text-white text-center mb-2">{method.title}</h3>
                  <p className="text-dark-300 text-sm text-center mb-4">{method.description}</p>
                  
                  <div className="text-center mb-4">
                    <div className="text-green-400 font-semibold">{method.value}</div>
                    <div className="text-green-400/80 text-xs">{method.available}</div>
                  </div>

                  <a 
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold text-center transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                  >
                    Hubungi Sekarang
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-dark-800/30 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-green-400 mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-green-600/20 overflow-hidden shadow-lg">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-green-600/10 transition-colors">
                      <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                      <span className="text-green-400 transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-dark-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Jam Operasional</h2>
              <div className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-green-600/20 p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">Customer Service</h3>
                    <div className="space-y-2 text-dark-300">
                      <div className="flex justify-between">
                        <span>WhatsApp</span>
                        <span className="text-green-400">24/7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Telegram</span>
                        <span>08:00 - 22:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone</span>
                        <span>09:00 - 21:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email</span>
                        <span className="text-green-400">Anytime</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">Layanan</h3>
                    <div className="space-y-2 text-dark-300">
                      <div className="flex justify-between">
                        <span>Top Up</span>
                        <span className="text-green-400">Auto 24/7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Joki Rank</span>
                        <span>06:00 - 24:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Boost Services</span>
                        <span>12-16 jam/hari</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support</span>
                        <span className="text-green-400">Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="py-16 bg-dark-800/30 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Follow Social Media</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-dark-800/50 backdrop-blur-md border border-green-600/20 rounded-lg px-4 py-2 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                >
                  <span className="text-2xl">{social.icon}</span>
                  <span className="text-white font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-8 shadow-xl">
                <div className="text-4xl mb-4">🚨</div>
                <h2 className="text-2xl font-bold text-white mb-4">Emergency Contact</h2>
                <p className="text-dark-300 mb-6">
                  Untuk masalah urgent seperti akun bermasalah saat joki atau top up tidak masuk lebih dari 1 jam
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/628123456790"
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    WhatsApp Emergency
                  </a>
                  <a 
                    href="tel:+6282198765432"
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                  >
                    Call Emergency
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width Banner with gradient background to match above sections */}
        <div className="w-full relative bg-gradient-to-b from-green-900/10 to-black py-8">
          <div className="w-full max-w-7xl mx-auto">
            <Image 
              src={banner.src} 
              alt="DoaIbu Store Banner"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain max-h-96 md:max-h-[500px]"
              priority
            />
          </div>
        </div>

        {/* Deskripsi dan Informasi - Similar to home page */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-dark-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 text-green-400">Tentang DoaIbu Store</h2>
              <p className="text-dark-300">
                DoaIbu Store adalah Sahabat Para Gamers Dan Platform Top Up Game Termurah di Indonesia. 
                Penuhi Kebutuhan Gaming Mu Bersama DoaIbu Store. Store Specialist Game Mobile Legends No.1 Murah, 
                Aman, Terpercaya Dan Legal 100% (Open 24 Jam). DoaIbu Store Sahabat Para Gamers Kami berdedikasi 
                untuk menyediakan layanan terbaik dan terus menerus inovatif untuk memenuhi kebutuhan gamers. 
                Jangan lewatkan kesempatan untuk mengikuti kami di sosial media dan tetap update dengan informasi 
                terbaru, tips, trik, dan promo-promo menarik lainnya.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-green-400 mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="/top-up" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Top Up Games</Link></li>
                  <li><Link href="/boost-services" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Boost Services</Link></li>
                  <li><Link href="/joki" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Joki Account</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-green-400 mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Contact Us</Link></li>
                  <li><Link href="/dashboard" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-green-400 mb-4">Account</h3>
                <ul className="space-y-2">
                  <li><Link href="/login" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Login</Link></li>
                  <li><Link href="/register" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Register</Link></li>
                  <li><Link href="/dashboard" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Dashboard</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark-900 border-t border-dark-700 py-6 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-dark-400">&copy; 2024 DoaIbu Store. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
} 