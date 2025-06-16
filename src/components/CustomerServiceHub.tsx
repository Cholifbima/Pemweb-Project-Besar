'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Bot, Users, X, Minimize2, Maximize2 } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import LiveChatCustomer from './LiveChatCustomer'
import FloatingAIChat from './FloatingAIChat'

interface CustomerServiceHubProps {
  onClose?: () => void
}

export default function CustomerServiceHub({ onClose }: CustomerServiceHubProps) {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeService, setActiveService] = useState<'selection' | 'ai' | 'live'>('selection')
  const [showAIChat, setShowAIChat] = useState(false)
  const [showLiveChat, setShowLiveChat] = useState(false)

  const handleChatClick = () => {
    setIsOpen(true)
    setActiveService('selection')
  }

  const handleServiceSelect = (service: 'ai' | 'live') => {
    console.log('🔀 Service selected:', service)
    
    // Check if user is logged in
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menggunakan layanan chat.')
      return
    }
    
    setActiveService(service)
    setIsOpen(false) // Close selection modal first
    
    if (service === 'ai') {
      setShowAIChat(true)
      setShowLiveChat(false)
    } else if (service === 'live') {
      setShowLiveChat(true)
      setShowAIChat(false)
    }
  }

  const handleBackToSelection = () => {
    setActiveService('selection')
    setShowAIChat(false)
    setShowLiveChat(false)
    setIsOpen(true)
  }

  const handleCloseAll = () => {
    setIsOpen(false)
    setShowAIChat(false)
    setShowLiveChat(false)
    setActiveService('selection')
    onClose?.()
  }

  // Always render button, but restrict functionality based on login status

  return (
    <>
      {/* Main Customer Service Button - Always visible when no chat is active */}
      {!showAIChat && !showLiveChat && (
        <button
          onClick={handleChatClick}
          className="fixed bottom-6 right-6 w-16 h-16 z-[9998] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group animate-pulse flex items-center justify-center"
          title="Customer Service"
        >
          <MessageCircle className="w-7 h-7" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
            <div className="bg-black/90 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              🎧 Customer Service
              <div className="text-xs text-gray-300 mt-1">AI Chat & Live Support</div>
              <div className="absolute top-full right-4 border-4 border-transparent border-t-black/90"></div>
            </div>
          </div>
        </button>
      )}

      {/* Service Selection Modal */}
      {isOpen && activeService === 'selection' && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-end p-6 pointer-events-none">
          <div className="bg-slate-900 rounded-2xl border border-purple-500/20 shadow-2xl w-96 h-auto pointer-events-auto mb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-white mr-2" />
                <h3 className="text-white font-semibold">Customer Service</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={handleCloseAll}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="p-6">
                {!user ? (
                  <div className="text-center mb-6">
                    <p className="text-yellow-400 text-sm mb-2">
                      ⚠️ Silakan login terlebih dahulu
                    </p>
                    <p className="text-gray-300 text-xs">
                      Untuk menggunakan layanan chat, Anda perlu login ke akun
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm mb-6 text-center">
                    Pilih layanan customer service yang Anda butuhkan
                  </p>
                )}
                
                <div className="space-y-4">
                  {/* AI Chat Option */}
                  <button
                    onClick={() => handleServiceSelect('ai')}
                    className={`w-full rounded-xl p-4 transition-all duration-200 transform hover:scale-105 ${
                      user 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                        : 'bg-gray-600 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!user}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-white font-semibold mb-1">🤖 AI Customer Service</h4>
                        <p className="text-green-100 text-sm">Bantuan instan 24/7 dengan AI</p>
                      </div>
                    </div>
                  </button>

                  {/* Live Chat Option */}
                  <button
                    onClick={() => handleServiceSelect('live')}
                    className={`w-full rounded-xl p-4 transition-all duration-200 transform hover:scale-105 ${
                      user 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                        : 'bg-gray-600 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!user}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-white font-semibold mb-1">👨‍💼 Live Chat dengan Admin</h4>
                        <p className="text-purple-100 text-sm">Chat real-time dengan admin</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Component */}
      {showAIChat && (
        <FloatingAIChat 
          onClose={() => {
            console.log('🔒 Closing AI chat')
            setShowAIChat(false)
            setActiveService('selection')
          }}
          onBack={handleBackToSelection}
          showButton={false}
        />
      )}

      {/* Live Chat Component */}
      {showLiveChat && (
        <LiveChatCustomer 
          onClose={() => {
            console.log('🔒 Closing live chat')
            setShowLiveChat(false)
            setActiveService('selection')
          }}
          onBack={handleBackToSelection}
          isEmbedded={true}
        />
      )}
    </>
  )
} 