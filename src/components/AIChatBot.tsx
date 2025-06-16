'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Upload, X, Bot, User, FileText, Image, Loader } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  file?: {
    name: string
    url: string
    type: string
  }
}

interface AIChatBotProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIChatBot({ isOpen, onClose }: AIChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Halo! 👋 Saya AI Customer Service DoaIbu Store. Ada yang bisa saya bantu dengan layanan gaming Anda?',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          chatHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim pesan')
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error: any) {
      console.error('Chat error:', error)
      showToast.error(error.message || 'Gagal mengirim pesan')
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi customer service.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      showToast.error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      showToast.error('Ukuran file terlalu besar. Maksimal 10MB.')
      return
    }

    setIsUploadingFile(true)
    showToast.loading('Menganalisis dokumen...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ai-chat/analyze-document', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menganalisis dokumen')
      }

      // Add user message with file
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `📎 Mengirim file: ${file.name}`,
        timestamp: new Date().toISOString(),
        file: {
          name: file.name,
          url: data.fileUrl,
          type: file.type
        }
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.analysis.aiResponse,
        timestamp: data.timestamp
      }

      setMessages(prev => [...prev, userMessage, aiMessage])
      showToast.success('Dokumen berhasil dianalisis!')

    } catch (error: any) {
      console.error('File upload error:', error)
      showToast.error(error.message || 'Gagal menganalisis dokumen')
    } finally {
      setIsUploadingFile(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/20 w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Customer Service</h3>
              <p className="text-gray-400 text-sm">DoaIbu Store • Online 24/7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-100'
                  }`}
                >
                  {message.file && (
                    <div className="mb-2 p-2 bg-black/20 rounded border border-gray-600">
                      <div className="flex items-center text-sm">
                        {message.file.type.startsWith('image/') ? (
                          <Image className="w-4 h-4 mr-2" aria-hidden="true" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                        )}
                        {message.file.name}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  <div className="mt-1 text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 mr-2 flex-shrink-0 ${
                message.role === 'user' ? 'order-1' : 'order-2'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-purple-400" />
                ) : (
                  <Bot className="w-5 h-5 text-blue-400" />
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="bg-gray-800/50 text-gray-100 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">AI sedang mengetik...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingFile}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Upload file"
            >
              {isUploadingFile ? (
                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan Anda..."
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                rows={1}
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-300"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Upload screenshot atau dokumen untuk analisis AI
          </p>
        </div>
      </div>
    </div>
  )
} 