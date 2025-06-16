'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { 
  MessageCircle, 
  Send, 
  Users, 
  Circle,
  Clock,
  FileText,
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  Image
} from 'lucide-react'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'

interface Customer {
  id: number
  username: string
  fullName?: string
  isOnline: boolean
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
  isRead: boolean
}

interface ChatSession {
  id: number
  userId: number
  status: 'active' | 'closed' | 'waiting'
  assignedTo?: number
  createdAt: string
  updatedAt: string
  user: Customer
  messages: ChatMessage[]
  unreadCount: number
}

export default function AdminChatInterface() {
  const { admin, isAuthenticated } = useAdmin()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize SignalR connection for admin
  useEffect(() => {
    if (isAuthenticated && admin) {
      console.log('🚀 Admin initializing SignalR connection:', admin.id)
      
      const token = localStorage.getItem('adminToken')
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
        console.log('🔌 Admin stopping SignalR connection')
        connection.stop()
      }
    }
  }, [isAuthenticated, admin])

  // Start SignalR connection and setup admin event handlers
  useEffect(() => {
    if (connection && admin) {
      console.log('🔗 Admin starting SignalR connection...')
      
      connection.start()
        .then(() => {
          console.log('✅ Admin SignalR connected successfully')
          setIsConnected(true)
          
          // Join admin room
          connection.invoke('JoinAdminRoom', admin.id.toString())
            .then(() => console.log(`👨‍💼 Joined admin room: ${admin.id}`))
            .catch(err => console.error('❌ Failed to join admin room:', err))
        })
        .catch(err => {
          console.error('❌ Admin SignalR connection failed:', err)
          setIsConnected(false)
        })

      // Handle connection events
      connection.onreconnecting(() => {
        console.log('🔄 Admin SignalR reconnecting...')
        setIsConnected(false)
      })

      connection.onreconnected(() => {
        console.log('✅ Admin SignalR reconnected')
        setIsConnected(true)
        // Rejoin rooms after reconnection
        if (admin) {
          connection.invoke('JoinAdminRoom', admin.id.toString())
        }
        if (selectedSession) {
          connection.invoke('JoinChatRoom', selectedSession.id.toString())
        }
      })

      connection.onclose(() => {
        console.log('🔌 Admin SignalR connection closed')
        setIsConnected(false)
      })

      // Listen for new messages from customers
      connection.on('ReceiveCustomerMessage', (sessionId: number, message: ChatMessage) => {
        console.log('📨 New customer message received:', message)
        
        // Update sessions with new message
        setSessions(prev => prev.map(session => {
          if (session.id === sessionId) {
            const exists = session.messages.find(m => m.id === message.id)
            if (exists) return session
            
            return {
              ...session,
              messages: [...session.messages, message],
              unreadCount: session.id === selectedSession?.id ? 0 : session.unreadCount + 1,
              updatedAt: new Date().toISOString()
            }
          }
          return session
        }))

        // Update selected session messages
        if (selectedSession?.id === sessionId) {
          setSelectedSession(prev => prev ? {
            ...prev,
            messages: [...prev.messages, message]
          } : null)
          scrollToBottom()
        }
      })

      // Listen for new chat sessions
      connection.on('NewChatSession', (session: ChatSession) => {
        console.log('🆕 New chat session created:', session)
        setSessions(prev => [session, ...prev])
      })

      // Listen for customer online status
      connection.on('CustomerStatusChanged', (userId: number, isOnline: boolean) => {
        console.log(`👤 Customer ${userId} is now ${isOnline ? 'online' : 'offline'}`)
        setSessions(prev => prev.map(session => 
          session.userId === userId ? {
            ...session,
            user: { ...session.user, isOnline }
          } : session
        ))
      })

    }
  }, [connection, admin?.id, selectedSession?.id])

  // Fetch chat sessions
  useEffect(() => {
    if (isAuthenticated && admin) {
      fetchChatSessions()
      // Refresh sessions every 5 seconds for real-time updates
      const interval = setInterval(fetchChatSessions, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, admin])

  // Poll for new messages when session is selected
  useEffect(() => {
    if (!selectedSession || !isAuthenticated || !admin) return

    let pollInterval: NodeJS.Timeout

    const pollMessages = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/chat/sessions/${selectedSession.id}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const newMessages = data.messages || []
          
          // Update messages if there are new ones
          if (newMessages.length > selectedSession.messages.length) {
            console.log('📨 New messages received via polling:', newMessages.length - selectedSession.messages.length)
            
            setSelectedSession(prev => prev ? {
              ...prev,
              messages: newMessages
            } : null)
            
            // Update sessions list
            setSessions(prev => prev.map(session => 
              session.id === selectedSession.id ? {
                ...session,
                messages: newMessages,
                updatedAt: new Date().toISOString()
              } : session
            ))
            
            scrollToBottom()
          }
        }
      } catch (error) {
        console.error('Error polling admin messages:', error)
      }
    }

    // Poll every 2 seconds when session is active
    pollInterval = setInterval(pollMessages, 2000)

    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [selectedSession?.id, selectedSession?.messages?.length, isAuthenticated, admin])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [selectedSession?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChatSessions = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await fetch('/api/admin/chat/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📋 Fetched chat sessions:', data.sessions)
        setSessions(data.sessions)
        
        // Update selected session if it exists
        if (selectedSession) {
          const updatedSession = data.sessions.find((s: ChatSession) => s.id === selectedSession.id)
          if (updatedSession) {
            setSelectedSession(updatedSession)
          }
        }
      } else {
        console.error('Failed to fetch chat sessions:', response.status)
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    }
  }

  const selectSession = async (session: ChatSession) => {
    setSelectedSession(session)
    
    // Mark messages as read
    if (session.unreadCount > 0) {
      try {
        const token = localStorage.getItem('adminToken')
        await fetch(`/api/admin/chat/sessions/${session.id}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        // Update local state
        setSessions(prev => prev.map(s => 
          s.id === session.id ? { ...s, unreadCount: 0 } : s
        ))
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    }

    // Join chat room
    if (connection && isConnected) {
      connection.invoke('JoinChatRoom', session.id.toString())
        .then(() => console.log(`💬 Admin joined chat room: ${session.id}`))
        .catch(err => console.error('❌ Failed to join chat room:', err))
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || isLoading) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          content: messageText,
          messageType: 'text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Admin message sent:', data.message)
        
        // Add message to local state
        const newMsg: ChatMessage = {
          id: data.message.id,
          content: messageText,
          isFromUser: false,
          adminId: admin?.id,
          messageType: 'text',
          createdAt: new Date().toISOString(),
          isRead: false
        }

        setSelectedSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMsg]
        } : null)

        // Update sessions list
        setSessions(prev => prev.map(session => 
          session.id === selectedSession.id ? {
            ...session,
            messages: [...session.messages, newMsg],
            updatedAt: new Date().toISOString()
          } : session
        ))
        
        // Send via SignalR to customer
        if (connection && isConnected) {
          connection.invoke('SendMessageToCustomer', selectedSession.userId.toString(), data.message)
            .then(() => console.log('📨 Message sent to customer via SignalR'))
            .catch(err => console.error('❌ SignalR send failed:', err))
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to send message:', errorData)
        alert(`Failed to send message: ${errorData.error || 'Unknown error'}`)
        setNewMessage(messageText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
      setNewMessage(messageText)
    } finally {
      setIsLoading(false)
    }
  }

  const closeSession = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/chat/sessions/${sessionId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? { ...session, status: 'closed' } : session
        ))
        
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null)
        }
        
        console.log(`✅ Session ${sessionId} closed`)
      }
    } catch (error) {
      console.error('Error closing session:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredSessions = sessions.filter(session =>
    session.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.user.fullName && session.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const activeSessions = filteredSessions.filter(s => s.status === 'active')
  const waitingSessions = filteredSessions.filter(s => s.status === 'waiting')

  if (!isAuthenticated || !admin) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
        <p className="text-gray-400">You need to be logged in as admin to access this page.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Sessions Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Chat Sessions</h2>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} 
                 title={isConnected ? 'Connected' : 'Disconnected'}></div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {/* Waiting Sessions */}
          {waitingSessions.length > 0 && (
            <div className="p-3">
              <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Waiting ({waitingSessions.length})
              </h3>
              {waitingSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => selectSession(session)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    selectedSession?.id === session.id
                      ? 'bg-purple-600'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {session.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{session.user.fullName || session.user.username}</h4>
                        <p className="text-gray-400 text-xs">Waiting for admin</p>
                      </div>
                    </div>
                    {session.unreadCount > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {session.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <div className="p-3">
              <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Active ({activeSessions.length})
              </h3>
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => selectSession(session)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    selectedSession?.id === session.id
                      ? 'bg-purple-600'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {session.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{session.user.fullName || session.user.username}</h4>
                        <div className="flex items-center">
                          <Circle className={`w-2 h-2 fill-current mr-1 ${session.user.isOnline ? 'text-green-400' : 'text-gray-400'}`} />
                          <p className="text-gray-400 text-xs">{session.user.isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                      </div>
                    </div>
                    {session.unreadCount > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {session.unreadCount}
                      </div>
                    )}
                  </div>
                  {session.messages.length > 0 && (
                    <p className="text-gray-300 text-xs mt-1 truncate">
                      {(() => {
                        const lastMessage = session.messages[session.messages.length - 1]
                        if (lastMessage.messageType === 'image') {
                          return `🖼️ ${lastMessage.fileName || 'Image'}`
                        } else if (lastMessage.messageType === 'file') {
                          return `📎 ${lastMessage.fileName || 'File'}`
                        }
                        return lastMessage.content
                      })()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredSessions.length === 0 && (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No Chat Sessions</h3>
              <p className="text-gray-400 text-sm">
                {searchTerm ? 'No sessions match your search.' : 'No customers are currently chatting.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">
                    {selectedSession.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{selectedSession.user.fullName || selectedSession.user.username}</h3>
                  <div className="flex items-center">
                    <Circle className={`w-2 h-2 fill-current mr-1 ${selectedSession.user.isOnline ? 'text-green-400' : 'text-gray-400'}`} />
                    <p className="text-gray-400 text-sm">{selectedSession.user.isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedSession.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  selectedSession.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {selectedSession.status}
                </span>
                
                {selectedSession.status === 'active' && (
                  <button
                    onClick={() => closeSession(selectedSession.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Close Chat
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromUser ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.isFromUser
                        ? 'bg-slate-700 text-gray-100'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    }`}
                  >
                    {message.messageType === 'text' ? (
                      <p className="text-sm">{message.content}</p>
                    ) : message.messageType === 'image' ? (
                      // Image message
                      <div className="space-y-2">
                        {message.fileUrl && (
                          <div className="space-y-2">
                            <img 
                              src={message.fileUrl} 
                              alt={message.fileName || 'Image'}
                              className="max-w-full h-auto rounded-lg"
                              style={{ maxHeight: '200px' }}
                            />
                            <div className="flex items-center space-x-2">
                              <Image className="w-4 h-4" />
                              <div>
                                <p className="text-sm font-medium">{message.fileName}</p>
                                <p className="text-xs opacity-70">
                                  {formatFileSize(message.fileSize || 0)}
                                </p>
                              </div>
                            </div>
                            <a
                              href={message.fileUrl}
                              download={message.fileName}
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
                          <FileText className="w-4 h-4" />
                          <div>
                            <p className="text-sm font-medium">{message.fileName}</p>
                            <p className="text-xs opacity-70">
                              {formatFileSize(message.fileSize || 0)}
                            </p>
                          </div>
                        </div>
                        
                        {message.fileUrl && (
                          <a
                            href={message.fileUrl}
                            download={message.fileName}
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
                      {!message.isFromUser && (
                        <CheckCircle2 className={`w-3 h-3 ${message.isRead ? 'text-blue-400' : 'text-gray-400'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-slate-800 p-4 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isLoading ? 'Sending...' : 'Type your message...'}
                  disabled={isLoading || selectedSession.status !== 'active'}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                />
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading || selectedSession.status !== 'active'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white p-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Select a Chat Session</h3>
              <p className="text-gray-400">Choose a customer to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 