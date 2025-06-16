'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import AIChatBot from './AIChatBot'

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false)

  const handleChatClick = () => {
    setIsOpen(true)
  }

  return (
    <>
      {/* Floating Chat Button - Available for everyone */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-[9999] animate-pulse hover:animate-none hover:scale-110"
        title="Chat dengan AI Customer Service"
        style={{ zIndex: 9999 }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat Modal */}
      <AIChatBot 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
} 