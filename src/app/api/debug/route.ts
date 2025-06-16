import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Azure SQL Environment Variables Check
    const azureEnv = {
      NODE_ENV: process.env.NODE_ENV,
      hasAzureServer: !!process.env.AZURE_SQL_SERVER,
      AZURE_SQL_SERVER: process.env.AZURE_SQL_SERVER || 'Not set',
      hasAzureUsername: !!process.env.AZURE_SQL_USERNAME,
      AZURE_SQL_USERNAME: process.env.AZURE_SQL_USERNAME || 'Not set',
      hasAzurePassword: !!process.env.AZURE_SQL_PASSWORD,
      AZURE_SQL_PASSWORD_LENGTH: process.env.AZURE_SQL_PASSWORD?.length || 0,
      hasAzureDatabase: !!process.env.AZURE_SQL_DATABASE,
      AZURE_SQL_DATABASE: process.env.AZURE_SQL_DATABASE || 'Not set',
      AZURE_SQL_PORT: process.env.AZURE_SQL_PORT || '1433',
      hasDATA_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_preview: process.env.DATABASE_URL?.substring(0, 20) + '...' || 'Not set',
      timestamp: new Date().toISOString()
    }

    // Try to build connection string
    let connectionStringTest = 'Failed to build'
    if (process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_USERNAME && 
        process.env.AZURE_SQL_PASSWORD && process.env.AZURE_SQL_DATABASE) {
      try {
        const server = process.env.AZURE_SQL_SERVER
        const username = process.env.AZURE_SQL_USERNAME
        const database = process.env.AZURE_SQL_DATABASE
        const port = process.env.AZURE_SQL_PORT || '1433'
        
        // Check if username already includes server name
        const azureUsername = username.includes('@') ? username : `${username}@${server.split('.')[0]}`
        
        connectionStringTest = `sqlserver://${server}:${port};database=${database};user=${azureUsername};...`
        console.log('✅ Successfully built Azure connection string')
      } catch (err) {
        connectionStringTest = 'Error building connection string'
        console.error('❌ Error building connection string:', err)
      }
    }

    const response = {
      success: true,
      environment: azureEnv,
      connectionStringTest,
      message: 'Environment debug info for Azure deployment'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 