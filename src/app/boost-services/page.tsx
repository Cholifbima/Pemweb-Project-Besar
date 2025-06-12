import Link from 'next/link';

export default function BoostServicesPage() {
  const services = [
    {
      id: 'mobile-legends-rank',
      game: 'Mobile Legends',
      icon: '⚔️',
      title: 'Rank Push',
      description: 'Naikan rank ML kamu dengan player professional',
      services: [
        { from: 'Epic', to: 'Legend', price: 'Rp 50.000', duration: '1-2 hari', popular: false },
        { from: 'Legend', to: 'Mythic', price: 'Rp 100.000', duration: '2-3 hari', popular: true },
        { from: 'Mythic', to: 'Mythical Glory', price: 'Rp 200.000', duration: '3-5 hari', popular: false },
        { from: 'Epic', to: 'Mythic', price: 'Rp 140.000', duration: '2-4 hari', popular: false },
      ]
    },
    {
      id: 'free-fire-rank',
      game: 'Free Fire',
      icon: '🔥',
      title: 'Rank Push',
      description: 'Boost rank Free Fire dengan win rate tinggi',
      services: [
        { from: 'Gold', to: 'Platinum', price: 'Rp 30.000', duration: '1-2 hari', popular: false },
        { from: 'Platinum', to: 'Diamond', price: 'Rp 60.000', duration: '2-3 hari', popular: true },
        { from: 'Diamond', to: 'Heroic', price: 'Rp 120.000', duration: '3-4 hari', popular: false },
        { from: 'Gold', to: 'Diamond', price: 'Rp 80.000', duration: '2-4 hari', popular: false },
      ]
    },
    {
      id: 'pubg-rank',
      game: 'PUBG Mobile',
      icon: '🎯',
      title: 'Rank Push',
      description: 'Push rank PUBG Mobile dengan K/D ratio terbaik',
      services: [
        { from: 'Platinum', to: 'Diamond', price: 'Rp 70.000', duration: '2-3 hari', popular: false },
        { from: 'Diamond', to: 'Crown', price: 'Rp 120.000', duration: '3-4 hari', popular: true },
        { from: 'Crown', to: 'Ace', price: 'Rp 200.000', duration: '4-6 hari', popular: false },
        { from: 'Ace', to: 'Conqueror', price: 'Rp 400.000', duration: '7-10 hari', popular: false },
      ]
    },
    {
      id: 'genshin-services',
      game: 'Genshin Impact',
      icon: '⭐',
      title: 'Account Services',
      description: 'Layanan farming dan quest completion',
      services: [
        { from: 'Daily Commission', to: '30 Hari', price: 'Rp 100.000', duration: '30 hari', popular: false },
        { from: 'Spiral Abyss', to: '36 Star', price: 'Rp 150.000', duration: '1-2 hari', popular: true },
        { from: 'Artifact Farming', to: '1 Week', price: 'Rp 200.000', duration: '7 hari', popular: false },
        { from: 'Character Build', to: 'Complete', price: 'Rp 300.000', duration: '3-5 hari', popular: false },
      ]
    }
  ];

  const features = [
    {
      icon: '🏆',
      title: 'Player Professional',
      description: 'Tim joki berpengalaman dengan win rate tinggi'
    },
    {
      icon: '🔒',
      title: 'Account Aman',
      description: 'Jaminan keamanan 100% untuk akun kamu'
    },
    {
      icon: '⚡',
      title: 'Pengerjaan Cepat',
      description: 'Selesai tepat waktu sesuai estimasi'
    },
    {
      icon: '📱',
      title: 'Live Progress',
      description: 'Pantau progress real-time via WhatsApp'
    },
    {
      icon: '💎',
      title: 'Garansi Rank',
      description: 'Garansi rank tidak turun selama 7 hari'
    },
    {
      icon: '🎮',
      title: 'Multi Game',
      description: 'Layanan untuk berbagai game populer'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎮</span>
              <span className="text-xl font-bold text-white">DoaIbu Store</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link href="/top-up" className="text-gray-300 hover:text-white transition-colors">Top Up</Link>
              <Link href="/boost-services" className="text-purple-400 font-semibold">Boost Services</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            </nav>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
            Boost Services
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Layanan joki dan boost rank profesional untuk semua game populer. 
            Dikerjakan oleh player berpengalaman dengan garansi keamanan account 100%.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-lg">
              <span className="text-green-400">✓</span>
              <span className="text-white">1000+ Order Selesai</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-lg">
              <span className="text-green-400">✓</span>
              <span className="text-white">Win Rate 90%+</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-lg">
              <span className="text-green-400">✓</span>
              <span className="text-white">0% Account Ban</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300">
                <div className="p-6 border-b border-purple-500/20">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{service.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{service.game}</h3>
                      <p className="text-purple-400 font-semibold">{service.title}</p>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.services.map((item, index) => (
                      <div 
                        key={index}
                        className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${
                          item.popular 
                            ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                            : 'bg-gray-800/30 border-gray-600/30 hover:border-purple-500/30'
                        }`}
                      >
                        {item.popular && (
                          <div className="absolute -top-2 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded">
                            POPULER
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">{item.from}</span>
                            <span className="text-purple-400">→</span>
                            <span className="text-white font-semibold">{item.to}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-2xl font-bold text-purple-400">{item.price}</div>
                              <div className="text-gray-400 text-sm">Estimasi: {item.duration}</div>
                            </div>
                            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                              Order
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Mengapa Pilih Boost Services Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-black/20 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Cara Kerja Boost Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="text-lg font-bold text-white mb-2">Pilih Service</h3>
              <p className="text-gray-400 text-sm">Pilih game dan layanan yang diinginkan</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="text-lg font-bold text-white mb-2">Data Account</h3>
              <p className="text-gray-400 text-sm">Berikan data login account (aman & terjamin)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="text-lg font-bold text-white mb-2">Proses Joki</h3>
              <p className="text-gray-400 text-sm">Tim professional mengerjakan sesuai target</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="text-lg font-bold text-white mb-2">Selesai</h3>
              <p className="text-gray-400 text-sm">Account dikembalikan dengan rank baru</p>
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