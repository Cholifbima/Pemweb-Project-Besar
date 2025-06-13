import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Debug environment variables (tanpa expose password)
    const envDebug = {
      NODE_ENV: process.env.NODE_ENV,
      
      // Azure SQL Variables
      hasAzureServer: !!process.env.AZURE_SQL_SERVER,
      AZURE_SQL_SERVER: process.env.AZURE_SQL_SERVER || 'Not set',
      
      hasAzureUsername: !!process.env.AZURE_SQL_USERNAME,
      AZURE_SQL_USERNAME: process.env.AZURE_SQL_USERNAME || 'Not set',
      
      hasAzurePassword: !!process.env.AZURE_SQL_PASSWORD,
      AZURE_SQL_PASSWORD_LENGTH: process.env.AZURE_SQL_PASSWORD?.length || 0,
      
      hasAzureDatabase: !!process.env.AZURE_SQL_DATABASE,
      AZURE_SQL_DATABASE: process.env.AZURE_SQL_DATABASE || 'Not set',
      
      AZURE_SQL_PORT: process.env.AZURE_SQL_PORT || '1433',
      
      // DATABASE_URL check
      hasDATA_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_preview: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set',
      
      timestamp: new Date().toISOString()
    }

    // Test connection string building
    let connectionTest = 'Failed to build';
    if (process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_USERNAME && process.env.AZURE_SQL_PASSWORD && process.env.AZURE_SQL_DATABASE) {
      const server = process.env.AZURE_SQL_SERVER;
      const username = process.env.AZURE_SQL_USERNAME;
      const database = process.env.AZURE_SQL_DATABASE;
      const port = process.env.AZURE_SQL_PORT || '1433';
      
      const serverName = server.includes('.') ? server.split('.')[0] : server;
      const azureUsername = username.includes('@') ? username : `${username}@${serverName}`;
      
      connectionTest = `sqlserver://${server}:${port};database=${database};user=${azureUsername};password=***;encrypt=true;trustServerCertificate=false;connectionTimeout=30;`;
    }

    return NextResponse.json({
      success: true,
      environment: envDebug,
      connectionStringTest: connectionTest,
      message: 'Environment debug info for Azure deployment'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 