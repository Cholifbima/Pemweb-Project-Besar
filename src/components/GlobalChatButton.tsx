'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

export default function GlobalChatButton() {
  const { isAuthenticated } = useUser()
  const [isVisible, setIsVisible] = useState(false)

  // Show button only for authenticated users
  useEffect(() => {
    setIsVisible(isAuthenticated)
  }, [isAuthenticated])

  // Handle click to open live chat
  const handleChatClick = () => {
    console.log('🚀 Global chat button clicked')
    // Trigger the LiveChatCustomer component to open
    const event = new CustomEvent('openLiveChat')
    window.dispatchEvent(event)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Floating Chat Button - Global */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 w-16 h-16 z-[9998] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group animate-pulse flex items-center justify-center"
        title="Chat Live dengan Admin"
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Online indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
          <div className="bg-black/90 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            👨‍💼 Chat Live dengan Admin
            <div className="text-xs text-gray-300 mt-1">Real-time customer support</div>
            <div className="absolute top-full right-4 border-4 border-transparent border-t-black/90"></div>
          </div>
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-purple-600 opacity-30 animate-ping"></div>
      </button>
    </>
  )
} 