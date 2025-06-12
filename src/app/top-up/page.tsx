import Link from 'next/link';

export default function TopUpPage() {
  const games = [
    {
      id: 'mobile-legends',
      name: 'Mobile Legends',
      icon: '⚔️',
      currency: 'Diamonds',
      packages: [
        { amount: '86 Diamonds', price: 'Rp 20.000', popular: false },
        { amount: '172 Diamonds', price: 'Rp 40.000', popular: false },
        { amount: '257 Diamonds', price: 'Rp 60.000', popular: true },
        { amount: '514 Diamonds', price: 'Rp 120.000', popular: false },
        { amount: '706 Diamonds', price: 'Rp 160.000', popular: false },
        { amount: '1412 Diamonds', price: 'Rp 320.000', popular: false },
      ]
    },
    {
      id: 'free-fire',
      name: 'Free Fire',
      icon: '🔥',
      currency: 'Diamonds',
      packages: [
        { amount: '70 Diamonds', price: 'Rp 10.000', popular: false },
        { amount: '140 Diamonds', price: 'Rp 20.000', popular: false },
        { amount: '355 Diamonds', price: 'Rp 50.000', popular: true },
        { amount: '720 Diamonds', price: 'Rp 100.000', popular: false },
        { amount: '1450 Diamonds', price: 'Rp 200.000', popular: false },
        { amount: '7290 Diamonds', price: 'Rp 1.000.000', popular: false },
      ]
    },
    {
      id: 'pubg-mobile',
      name: 'PUBG Mobile',
      icon: '🎯',
      currency: 'UC',
      packages: [
        { amount: '60 UC', price: 'Rp 15.000', popular: false },
        { amount: '120 UC', price: 'Rp 30.000', popular: false },
        { amount: '325 UC', price: 'Rp 75.000', popular: true },
        { amount: '660 UC', price: 'Rp 150.000', popular: false },
        { amount: '1800 UC', price: 'Rp 400.000', popular: false },
        { amount: '3850 UC', price: 'Rp 800.000', popular: false },
      ]
    },
    {
      id: 'genshin-impact',
      name: 'Genshin Impact',
      icon: '⭐',
      currency: 'Genesis Crystal',
      packages: [
        { amount: '60 Genesis Crystal', price: 'Rp 15.000', popular: false },
        { amount: '300 Genesis Crystal', price: 'Rp 75.000', popular: false },
        { amount: '980 Genesis Crystal', price: 'Rp 240.000', popular: true },
        { amount: '1980 Genesis Crystal', price: 'Rp 480.000', popular: false },
        { amount: '3280 Genesis Crystal', price: 'Rp 800.000', popular: false },
        { amount: '6480 Genesis Crystal', price: 'Rp 1.600.000', popular: false },
      ]
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
              <Link href="/top-up" className="text-purple-400 font-semibold">Top Up</Link>
              <Link href="/boost-services" className="text-gray-300 hover:text-white transition-colors">Boost Services</Link>
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
            Top Up Game
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Isi ulang game favoritmu dengan proses yang cepat, aman, dan terpercaya. 
            Harga terjangkau untuk semua kalangan gamer.
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {games.map((game) => (
              <div key={game.id} className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300">
                <div className="p-6 border-b border-purple-500/20">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{game.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{game.name}</h3>
                      <p className="text-purple-400">{game.currency}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {game.packages.map((pkg, index) => (
                      <div 
                        key={index}
                        className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${
                          pkg.popular 
                            ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                            : 'bg-gray-800/30 border-gray-600/30 hover:border-purple-500/30'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded">
                            POPULER
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-white mb-2">{pkg.amount}</div>
                          <div className="text-2xl font-bold text-purple-400 mb-3">{pkg.price}</div>
                          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            Beli Sekarang
                          </button>
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

      {/* Features */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Mengapa Pilih DoaIbu Store?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Proses Cepat</h3>
              <p className="text-gray-400">Top up otomatis dalam hitungan detik</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">100% Aman</h3>
              <p className="text-gray-400">Transaksi terjamin dan data terlindungi</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-white mb-2">Harga Terbaik</h3>
              <p className="text-gray-400">Harga kompetitif untuk semua package</p>
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