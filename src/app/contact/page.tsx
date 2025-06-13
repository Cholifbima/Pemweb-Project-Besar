import Link from 'next/link';

export default function ContactPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">


      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Tim customer service kami siap membantu 24/7 untuk semua kebutuhan gaming Anda. 
            Jangan ragu untuk bertanya atau konsultasi gratis!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                <div className="text-4xl text-center mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-white text-center mb-2">{method.title}</h3>
                <p className="text-gray-400 text-sm text-center mb-4">{method.description}</p>
                
                <div className="text-center mb-4">
                  <div className="text-purple-400 font-semibold">{method.value}</div>
                  <div className="text-green-400 text-xs">{method.available}</div>
                </div>

                <a 
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-semibold text-center transition-all duration-300 transform hover:scale-105"
                >
                  Hubungi Sekarang
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-purple-500/10 transition-colors">
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <span className="text-purple-400 transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Jam Operasional</h2>
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Customer Service</h3>
                  <div className="space-y-2 text-gray-300">
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
                      <span className="text-purple-400">Anytime</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Layanan</h3>
                  <div className="space-y-2 text-gray-300">
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
                      <span className="text-purple-400">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Follow Social Media</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-lg px-4 py-2 hover:border-purple-500/40 transition-all duration-300 hover:scale-105"
              >
                <span className="text-2xl">{social.icon}</span>
                <span className="text-white font-medium">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-8">
              <div className="text-4xl mb-4">🚨</div>
              <h2 className="text-2xl font-bold text-white mb-4">Emergency Contact</h2>
              <p className="text-gray-300 mb-6">
                Untuk masalah urgent seperti akun bermasalah saat joki atau top up tidak masuk lebih dari 1 jam
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://wa.me/628123456790"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  WhatsApp Emergency
                </a>
                <a 
                  href="tel:+6282198765432"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Call Emergency
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 border-t border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">🎮</span>
              <span className="text-xl font-bold text-white">DoaIbu Store</span>
            </div>
            <div className="text-center text-gray-400">
              <p>&copy; 2024 DoaIbu Store. Platform gaming terpercaya Indonesia.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 