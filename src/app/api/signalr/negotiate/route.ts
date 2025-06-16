import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const connectionString = process.env.AZURE_SIGNALR_CONNECTION_STRING

export async function GET(request: NextRequest) {
  try {
    if (!connectionString) {
      console.log('🔧 Azure SignalR not configured, using development mode')
      return NextResponse.json({
        url: 'http://localhost:3000/api/signalr/dev',
        accessToken: 'dev-token'
      })
    }

    // Parse connection string
    const endpoint = connectionString.match(/Endpoint=([^;]+)/)?.[1]
    const accessKey = connectionString.match(/AccessKey=([^;]+)/)?.[1]

    if (!endpoint || !accessKey) {
      throw new Error('Invalid SignalR connection string')
    }

    // Get user info from auth header
    const authHeader = request.headers.get('authorization')
    let userId = 'anonymous'
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        userId = decoded.id.toString()
      } catch (error) {
        console.log('Invalid token, using anonymous user')
      }
    }

    // Generate SignalR token
    const hubName = 'ChatHub'
    const exp = Math.floor(Date.now() / 1000) + 3600 // 1 hour
    
    const payload = {
      aud: `${endpoint}/client/?hub=${hubName}`,
      iat: Math.floor(Date.now() / 1000),
      exp: exp,
      nameid: userId
    }

    const signalrToken = jwt.sign(payload, Buffer.from(accessKey, 'base64'), {
      algorithm: 'HS256'
    })

    const negotiateResponse = {
      url: `${endpoint}/client/?hub=${hubName}`,
      accessToken: signalrToken
    }

    console.log(`🔗 SignalR negotiate for user: ${userId}`)
    return NextResponse.json(negotiateResponse)

  } catch (error) {
    console.error('❌ SignalR negotiate error:', error)
    
    // Fallback to development mode
    return NextResponse.json({
      url: 'http://localhost:3000/api/signalr/dev',
      accessToken: 'dev-token',
      error: 'Using development mode'
    })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
} 