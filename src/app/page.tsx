import { GamepadIcon, Zap, Shield, Headphones } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const popularGames = [
    {
      id: 'ml',
      name: 'Mobile Legends',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop',
      category: 'MOBA'
    },
    {
      id: 'ff',
      name: 'Free Fire',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop',
      category: 'Battle Royale'
    },
    {
      id: 'valorant',
      name: 'Valorant',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop',
      category: 'FPS'
    },
    {
      id: 'pubg',
      name: 'PUBG Mobile',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop',
      category: 'Battle Royale'
    },
  ]

  const services = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Top Up Instan',
      description: 'Proses top up yang cepat dalam hitungan detik'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Aman & Terpercaya',
      description: 'Transaksi aman dengan jaminan 100% legal'
    },
    {
      icon: <GamepadIcon className="w-8 h-8" />,
      title: 'Jasa Boosting',
      description: 'Layanan boost rank dan joki account profesional'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Customer Service 24/7',
      description: 'Dukungan pelanggan siap membantu kapan saja'
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GamepadIcon className="w-8 h-8 text-purple-400 mr-2" />
              <span className="text-xl font-bold text-white">DoaIbu Store</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors">Home</Link>
              <Link href="/top-up" className="text-gray-300 hover:text-purple-400 transition-colors">Top Up</Link>
              <Link href="/boost-services" className="text-gray-300 hover:text-purple-400 transition-colors">Boost Services</Link>
              <Link href="/contact" className="text-gray-300 hover:text-purple-400 transition-colors">Contact</Link>
            </div>
            <button className="gaming-button px-6 py-2 rounded-lg text-white font-semibold">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-float">
              DoaIbu <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Store</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Platform terpercaya untuk top up game dan jasa boosting account game favorit Anda. 
              Proses cepat, aman, dan harga terjangkau untuk semua kalangan gamer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/top-up" className="gaming-button px-8 py-4 rounded-lg text-white font-semibold text-lg glow inline-block text-center">
                Mulai Top Up
              </Link>
              <Link href="/boost-services" className="border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-block text-center">
                Lihat Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Game Populer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map((game) => (
              <div key={game.id} className="gaming-card rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                  <GamepadIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>
                <span className="text-sm text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                  {game.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Mengapa Memilih DoaIbu Store?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Siap untuk Meningkatkan Pengalaman Gaming Anda?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Bergabunglah dengan ribuan gamer yang sudah mempercayai DoaIbu Store
          </p>
          <button className="gaming-button px-8 py-4 rounded-lg text-white font-semibold text-lg glow">
            Daftar Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GamepadIcon className="w-8 h-8 text-purple-400 mr-2" />
                <span className="text-xl font-bold text-white">DoaIbu Store</span>
              </div>
              <p className="text-gray-400">
                Platform terpercaya untuk kebutuhan gaming Anda.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/top-up" className="hover:text-purple-400 transition-colors">Top Up Games</Link></li>
                <li><Link href="/boost-services" className="hover:text-purple-400 transition-colors">Boost Services</Link></li>
                <li><Link href="/boost-services" className="hover:text-purple-400 transition-colors">Joki Account</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-purple-400 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DoaIbu Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 