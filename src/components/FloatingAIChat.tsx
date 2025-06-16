'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import AIChatBot from './AIChatBot'

interface FloatingAIChatProps {
  onClose?: () => void
  onBack?: () => void
  showButton?: boolean
}

export default function FloatingAIChat({ onClose, onBack, showButton = true }: FloatingAIChatProps) {
  const [isOpen, setIsOpen] = useState(!showButton) // Auto open if no button

  const handleChatClick = () => {
    setIsOpen(true)
  }

  const handleContactAdmin = () => {
    // Trigger the live chat by dispatching an event
    const event = new CustomEvent('openLiveChat')
    window.dispatchEvent(event)
  }

  return (
    <>
      {/* Floating Chat Button - Only show if showButton is true */}
      {showButton && (
        <button
          onClick={handleChatClick}
          className="fixed bottom-6 right-24 w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-[9997] animate-pulse hover:animate-none hover:scale-110 group"
          title="🤖 Chat dengan AI Customer Service"
        >
          <MessageCircle className="w-6 h-6" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
            <div className="bg-black/90 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              🤖 Chat dengan AI
              <div className="text-xs text-gray-300 mt-1">24/7 AI Assistant</div>
              <div className="absolute top-full right-4 border-4 border-transparent border-t-black/90"></div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Modal */}
      <AIChatBot 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false)
          onClose?.()
        }}
        onContactAdmin={handleContactAdmin}
        onBack={onBack}
      />
    </>
  )
} 