'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@/contexts/UserContext'
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  X, 
  Users, 
  Circle,
  Minimize2,
  Maximize2,
  Download,
  Image,
  FileText,
  Check
} from 'lucide-react'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import ImagePreviewModal from './ImagePreviewModal'

interface Admin {
  id: number
  username: string
  role: string
  isOnline: boolean
  lastSeen: string | null
}

interface ChatMessage {
  id: number
  content: string
  isFromUser: boolean
  adminId?: number
  messageType: 'text' | 'file' | 'image'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  createdAt: string
  isRead?: boolean
  admin?: {
    username: string
  }
}

interface ChatSession {
  id: number
  adminId?: number
  status: 'active' | 'closed'
  messages: ChatMessage[]
  admin?: {
    username: string
    isOnline: boolean
  }
}

interface LiveChatCustomerProps {
  onClose?: () => void
  onBack?: () => void
  isEmbedded?: boolean
}

export default function LiveChatCustomer({ onClose, onBack, isEmbedded = false }: LiveChatCustomerProps) {
  const { user, isAuthenticated } = useUser()
  const [isOpen, setIsOpen] = useState(isEmbedded) // Auto-open when embedded
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentView, setCurrentView] = useState<'adminList' | 'chat'>('adminList')
  const [admins, setAdmins] = useState<Admin[]>([])
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [recentChats, setRecentChats] = useState<{[adminId: number]: ChatMessage}>({})
  const [unreadCounts, setUnreadCounts] = useState<{[adminId: number]: number}>({})
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize SignalR connection with Azure SignalR Service
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🚀 Initializing SignalR connection for user:', user.id)
      
      const token = localStorage.getItem('token')
      const newConnection = new HubConnectionBuilder()
        .withUrl('/api/signalr/negotiate', {
          skipNegotiation: true,
          transport: 1, // WebSockets
          accessTokenFactory: () => token || ''
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(LogLevel.Information)
        .build()

      setConnection(newConnection)
    }

    return () => {
      if (connection) {
        console.log('🔌 Stopping SignalR connection')
        connection.stop()
      }
    }
  }, [isAuthenticated, user])

  // Start SignalR connection and setup event handlers
  useEffect(() => {
    if (connection && user) {
      console.log('🔗 Starting SignalR connection...')
      
      connection.start()
        .then(() => {
          console.log('✅ SignalR connected successfully')
          setIsConnected(true)
          
          // Join user-specific room
          connection.invoke('JoinUserRoom', user.id.toString())
            .then(() => console.log(`👤 Joined user room: ${user.id}`))
            .catch(err => console.error('❌ Failed to join user room:', err))
        })
        .catch(err => {
          console.error('❌ SignalR connection failed:', err)
          setIsConnected(false)
        })

      // Handle connection events
      connection.onreconnecting(() => {
        console.log('🔄 SignalR reconnecting...')
        setIsConnected(false)
      })

      connection.onreconnected(() => {
        console.log('✅ SignalR reconnected')
        setIsConnected(true)
        // Rejoin rooms after reconnection
        if (user) {
          connection.invoke('JoinUserRoom', user.id.toString())
        }
        if (chatSession) {
          connection.invoke('JoinChatRoom', chatSession.id.toString())
        }
      })

      connection.onclose(() => {
        console.log('🔌 SignalR connection closed')
        setIsConnected(false)
      })

      // Listen for new messages from admin
      connection.on('ReceiveMessage', (message: ChatMessage) => {
        console.log('📨 New message received from admin:', message)
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.find(m => m.id === message.id)
          if (exists) return prev
          return [...prev, message]
        })
        
        // Update recent chat if message is from admin
        if (!message.isFromUser && message.adminId) {
          setRecentChats(prev => ({
            ...prev,
            [message.adminId!]: message
          }))
          
          // Increase unread count if this admin is not currently selected
          if (!selectedAdmin || selectedAdmin.id !== message.adminId) {
            setUnreadCounts(prev => ({
              ...prev,
              [message.adminId!]: (prev[message.adminId!] || 0) + 1
            }))
          }
        }
        
        scrollToBottom()
      })

      // Listen for admin status updates
      connection.on('AdminStatusChanged', (adminId: number, isOnline: boolean) => {
        console.log(`👤 Admin ${adminId} is now ${isOnline ? 'online' : 'offline'}`)
        setAdmins(prev => prev.map(admin => 
          admin.id === adminId ? { ...admin, isOnline } : admin
        ))
        
        // Update selected admin status
        if (selectedAdmin?.id === adminId) {
          setSelectedAdmin(prev => prev ? { ...prev, isOnline } : null)
        }
      })

      // Listen for typing indicators
      connection.on('UserTyping', (userId: number, isTyping: boolean) => {
        console.log(`⌨️ User ${userId} is ${isTyping ? 'typing' : 'stopped typing'}`)
        // Handle typing indicator UI here
      })

    }
  }, [connection, user?.id, selectedAdmin?.id, chatSession?.id])

  // Handle embedded mode
  useEffect(() => {
    if (isEmbedded) {
      setIsOpen(true)
    }
  }, [isEmbedded])

  // Fetch admins list
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdmins()
      // Refresh admin list every 5 seconds for near realtime updates
      const interval = setInterval(fetchAdmins, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Poll for new messages when chat session is active
  useEffect(() => {
    if (!chatSession || !isAuthenticated) return

    let pollInterval: NodeJS.Timeout

    const pollMessages = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/chat/messages/${chatSession.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const newMessages = data.messages || []
          
          // Update messages if there are new ones
          if (newMessages.length > messages.length) {
            console.log('📨 New messages received via polling:', newMessages.length - messages.length)
            setMessages(newMessages)
            
            // Update recent chat with latest message
            const latestMessage = newMessages[newMessages.length - 1]
            if (latestMessage && !latestMessage.isFromUser && selectedAdmin) {
              setRecentChats(prev => ({
                ...prev,
                [selectedAdmin.id]: latestMessage
              }))
              
              // Mark messages as read for current selected admin
              markMessagesAsRead(chatSession.id)
            }
            
            scrollToBottom()
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error)
      }
    }

    // Poll every 2 seconds when chat is active
    pollInterval = setInterval(pollMessages, 2000)

    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [chatSession?.id, messages.length, selectedAdmin?.id, isAuthenticated])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Listen for openLiveChat event from any page
  useEffect(() => {
    const handleOpenLiveChat = () => {
      console.log('🚀 Opening live chat from external trigger...')
      setIsOpen(true)
    }

    // Global event listener
    window.addEventListener('openLiveChat', handleOpenLiveChat)
    
    return () => window.removeEventListener('openLiveChat', handleOpenLiveChat)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No auth token found')
        return
      }

      const response = await fetch('/api/chat/admins', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('📋 Fetched admins:', data.admins)
        setAdmins(data.admins)
        
        // Fetch recent messages for each admin
        await fetchRecentMessages(data.admins)
      } else {
        console.error('Failed to fetch admins:', response.status)
        // Set dummy admins for testing
        setAdmins([
          { id: 1, username: 'Cholif', role: 'super_admin', isOnline: true, lastSeen: null },
          { id: 2, username: 'Havizhan', role: 'admin', isOnline: false, lastSeen: new Date().toISOString() },
          { id: 3, username: 'Fathan', role: 'admin', isOnline: true, lastSeen: null }
        ])
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      // Set dummy admins for testing
      setAdmins([
        { id: 1, username: 'Cholif', role: 'super_admin', isOnline: true, lastSeen: null },
        { id: 2, username: 'Havizhan', role: 'admin', isOnline: false, lastSeen: new Date().toISOString() },
        { id: 3, username: 'Fathan', role: 'admin', isOnline: true, lastSeen: null }
      ])
    }
  }

  const fetchRecentMessages = async (adminList: Admin[]) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      for (const admin of adminList) {
        try {
          // Fetch recent chat sessions with this admin
          const response = await fetch(`/api/chat/recent/${admin.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            
            if (data.recentMessage) {
              setRecentChats(prev => ({
                ...prev,
                [admin.id]: data.recentMessage
              }))
            }

            if (data.unreadCount > 0) {
              setUnreadCounts(prev => ({
                ...prev,
                [admin.id]: data.unreadCount
              }))
            }
          } else {
            console.log(`Failed to fetch recent messages for admin ${admin.id}: ${response.status}`)
          }
        } catch (error) {
          console.error(`Error fetching recent messages for admin ${admin.id}:`, error)
          // Continue with other admins even if one fails
        }
      }
    } catch (error) {
      console.error('Error fetching recent messages:', error)
    }
  }

  const markMessagesAsRead = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await fetch(`/api/chat/sessions/${sessionId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const startChatWithAdmin = async (admin: Admin) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first')
        return
      }

      setIsLoading(true)

      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminId: admin.id })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Chat session started:', data.session)
        setChatSession(data.session)
        setMessages(data.session.messages || [])
        setSelectedAdmin(admin)
        setCurrentView('chat')
        
        // Clear unread count for this admin
        setUnreadCounts(prev => ({
          ...prev,
          [admin.id]: 0
        }))
        
        // Mark messages as read on the server as well
        markMessagesAsRead(data.session.id)
        
        // Join chat room in SignalR
        if (connection && isConnected) {
          connection.invoke('JoinChatRoom', data.session.id.toString())
            .then(() => console.log(`💬 Joined chat room: ${data.session.id}`))
            .catch(err => console.error('❌ Failed to join chat room:', err))
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to start chat:', errorData)
        alert(`Failed to start chat: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Failed to start chat. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatSession || isLoading) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: chatSession.id,
          content: messageText,
          messageType: 'text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Message sent:', data.message)
        
        // Add message to local state immediately
        const newMsg: ChatMessage = {
          id: data.message.id,
          content: messageText,
          isFromUser: true,
          messageType: 'text',
          createdAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, newMsg])
        
        // Update recent chat for this admin
        if (selectedAdmin) {
          setRecentChats(prev => ({
            ...prev,
            [selectedAdmin.id]: newMsg
          }))
        }
        
        // Send via SignalR for real-time delivery to admin
        if (connection && isConnected) {
          connection.invoke('SendMessageToAdmin', chatSession.id.toString(), data.message)
            .then(() => console.log('📨 Message sent via SignalR to admin'))
            .catch(err => console.error('❌ SignalR send failed:', err))
        } else {
          console.log('⚠️ SignalR not connected, message saved to DB only')
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to send message:', errorData)
        alert(`Failed to send message: ${errorData.error || 'Unknown error'}`)
        // Restore message text
        setNewMessage(messageText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
      // Restore message text
      setNewMessage(messageText)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !chatSession) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', chatSession.id.toString())

      const token = localStorage.getItem('token')
      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ File uploaded:', data.message)
        
        // Add file message to local state
        setMessages(prev => [...prev, data.message])
        
        // Send file message via SignalR
        if (connection && isConnected) {
          connection.invoke('SendMessageToAdmin', chatSession.id.toString(), data.message)
            .then(() => console.log('📎 File message sent via SignalR'))
            .catch(err => console.error('❌ SignalR file send failed:', err))
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to upload file:', errorData)
        alert(`Failed to upload file: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-green-400' : 'text-gray-400'
  }

  const getStatusText = (admin: Admin) => {
    if (admin.isOnline) return 'Online'
    if (admin.lastSeen) {
      const lastSeen = new Date(admin.lastSeen)
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))
      
      if (diffMinutes < 60) return `${diffMinutes}m ago`
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
      return `${Math.floor(diffMinutes / 1440)}d ago`
    }
    return 'Offline'
  }

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️'
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'xls':
      case 'xlsx':
        return '📊'
      case 'zip':
      case 'rar':
        return '📦'
      default:
        return '📎'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const previewText = (text: string) => {
    const words = text.split(/\s+/)
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '…'
    }
    if (text.length > 30) {
      return text.slice(0, 30) + '…'
    }
    return text
  }

  // Only show if user is authenticated
  if (!isAuthenticated) return null

  return (
    <>
      {/* Chat Modal - accessible from any page */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-end p-6 pointer-events-none">
          <div 
            className={`bg-slate-900 rounded-2xl border border-purple-500/20 shadow-2xl transition-all duration-300 pointer-events-auto mb-20 ${
              isMinimized 
                ? 'w-80 h-16' 
                : 'w-96 h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                {onBack && currentView === 'adminList' && (
                  <button
                    onClick={onBack}
                    className="text-white/70 hover:text-white transition-colors mr-2"
                  >
                    ←
                  </button>
                )}
                <MessageCircle className="w-5 h-5 text-white mr-2" />
                <h3 className="text-white font-semibold">
                  {currentView === 'adminList' ? 'Pilih Admin' : `Chat dengan ${selectedAdmin?.username}`}
                </h3>
                {selectedAdmin && (
                  <div className="ml-2 flex items-center">
                    <Circle className={`w-2 h-2 fill-current ${getStatusColor(selectedAdmin.isOnline)}`} />
                    <span className={`text-xs ml-1 ${getStatusColor(selectedAdmin.isOnline)}`}>
                      {getStatusText(selectedAdmin)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {!isMinimized && (
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} 
                       title={isConnected ? 'Connected' : 'Disconnected'}></div>
                )}
                
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onClose?.()
                  }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="flex flex-col h-[552px]">
                {currentView === 'adminList' ? (
                  // Admin Selection View
                  <div className="flex-1 p-4">
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm mb-4">
                        Pilih admin yang ingin Anda hubungi untuk bantuan real-time
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {admins.map((admin) => (
                        <div
                          key={admin.id}
                          onClick={() => !isLoading && startChatWithAdmin(admin)}
                          className={`bg-slate-800 hover:bg-slate-700 rounded-xl p-4 cursor-pointer transition-all duration-200 border border-gray-600/30 hover:border-purple-500/50 relative ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-between overflow-hidden">
                            <div className="flex items-center flex-1">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-semibold text-sm">
                                    {admin.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                {unreadCounts[admin.id] > 0 && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {unreadCounts[admin.id] > 9 ? '9+' : unreadCounts[admin.id]}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <div className="flex items-center">
                                  <h4 className="text-white font-medium">{admin.username}</h4>
                                  {unreadCounts[admin.id] > 0 && (
                                    <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 capitalize">{admin.role}</p>
                                {recentChats[admin.id] ? (
                                  <div className="mt-1">
                                    <p
                                      className={`text-xs truncate w-full block min-w-0 ${unreadCounts[admin.id] > 0 ? 'text-white font-medium' : 'text-gray-500'}`}
                                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    >
                                      {recentChats[admin.id].isFromUser ? 'Anda: ' : `${admin.username}: `}
                                      {recentChats[admin.id].messageType === 'image' ? '🖼️ Image' :
                                       recentChats[admin.id].messageType === 'file' ? '📎 File' :
                                       previewText(recentChats[admin.id].content)}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                      {formatTime(recentChats[admin.id].createdAt)}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 mt-1">Belum ada pesan</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center whitespace-nowrap absolute right-4 top-3">
                              <Circle className={`w-3 h-3 fill-current ${getStatusColor(admin.isOnline)}`} />
                              <span className={`text-xs ml-1 ${getStatusColor(admin.isOnline)}`}>{getStatusText(admin)}</span>
                            </div>
                          </div>
                          
                          {!admin.isOnline && (
                            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <p className="text-yellow-400 text-xs">
                                Admin sedang offline. Pesan Anda akan dikirim dan akan dibalas ketika admin online.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Chat View
                  <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${
                              message.isFromUser
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'bg-slate-700 text-gray-100'
                            }`}
                            style={{ wordBreak: 'break-word' }}
                          >
                            {message.messageType === 'text' ? (
                              <p className="text-sm break-words">{message.content}</p>
                            ) : message.messageType === 'image' ? (
                              // Image message
                              <div className="space-y-2">
                                {message.fileUrl && (
                                  <div className="space-y-2">
                                    <img 
                                      src={message.fileUrl} 
                                      alt={message.fileName || 'Image'}
                                      className="max-w-full h-auto rounded-lg cursor-pointer"
                                      style={{ maxHeight: '200px' }}
                                      onClick={() => setPreviewImage(message.fileUrl!)}
                                    />
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg">🖼️</span>
                                      <div>
                                        <p className="text-sm font-medium">{message.fileName}</p>
                                        <p className="text-xs opacity-70">
                                          {formatFileSize(message.fileSize || 0)}
                                        </p>
                                      </div>
                                    </div>
                                    <a
                                      href={`${message.fileUrl}?download=true`}
                                      className="inline-flex items-center text-xs bg-black/20 hover:bg-black/30 px-2 py-1 rounded transition-colors"
                                    >
                                      <Download className="w-3 h-3 mr-1" />
                                      Download
                                    </a>
                                  </div>
                                )}
                                {message.content && message.content !== `📎 ${message.fileName}` && (
                                  <p className="text-sm mt-2">{message.content}</p>
                                )}
                              </div>
                            ) : (
                              // File message
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{getFileTypeIcon(message.fileName || '')}</span>
                                  <div>
                                    <p className="text-sm font-medium">{message.fileName}</p>
                                    <p className="text-xs opacity-70">
                                      {formatFileSize(message.fileSize || 0)}
                                    </p>
                                  </div>
                                </div>
                                
                                {message.fileUrl && (
                                  <a
                                    href={`${message.fileUrl}?download=true`}
                                    className="inline-flex items-center text-xs bg-black/20 hover:bg-black/30 px-2 py-1 rounded transition-colors"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </a>
                                )}
                                
                                {message.content && message.content !== `📎 ${message.fileName}` && (
                                  <p className="text-sm mt-2">{message.content}</p>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs opacity-70">
                                {formatTime(message.createdAt)}
                              </p>
                              {message.isFromUser ? (
                                <Check className={`w-3 h-3 ${message.isRead ? 'text-blue-400' : 'text-gray-400'}`} />
                              ) : message.admin ? (
                                <p className="text-xs opacity-70">{message.admin.username}</p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-600">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                        
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder={isLoading ? 'Sending...' : isUploading ? 'Uploading...' : 'Ketik pesan...'}
                          disabled={isLoading || isUploading}
                          className="flex-1 bg-slate-800 border border-gray-600 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || isLoading || isUploading}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white p-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Navigation Buttons */}
                      <div className="mt-2 flex justify-between items-center">
                        <button
                          onClick={() => {
                            setCurrentView('adminList')
                            setChatSession(null)
                            setMessages([])
                            setSelectedAdmin(null)
                          }}
                          className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          ← Kembali ke daftar admin
                        </button>
                        
                        {onBack && (
                          <button
                            onClick={onBack}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            🎧 Customer Service
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
      />

      {previewImage && (
        <ImagePreviewModal url={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </>
  )
} 