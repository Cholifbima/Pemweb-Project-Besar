import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import ToastProvider from '@/components/ToastProvider'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DoaIbu Store - Top Up Gaming & Boost Services',
  description: 'Platform terpercaya untuk top up game dan jasa boosting account game favorit Anda',
  keywords: 'top up game, boost game, joki game, mobile legends, pubg, free fire, valorant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <UserProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Navigation />
            {children}
            <ToastProvider />
          </div>
        </UserProvider>
      </body>
    </html>
  )
} 