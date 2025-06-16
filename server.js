const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

console.log('🚀 Starting DoaIbu Store on Azure...')

// Setup function to run before starting Next.js
async function setupApplication() {
  console.log('🔧 Setting up application...')
  
  // Check if we're in Azure environment
  const isAzure = process.env.WEBSITE_SITE_NAME || process.env.AZURE_SQL_SERVER
  console.log('🌍 Environment:', isAzure ? 'Azure' : 'Local')
  
  if (isAzure) {
    console.log('🔧 Running Azure-specific setup...')
    console.log('🔗 Using Azure SQL Database configuration')
    console.log('📊 Database: doaibustore-db on doaibustore-sv.database.windows.net')
  } else {
    console.log('🏠 Local environment detected')
  }
  
  console.log('📊 Starting Next.js server...')
}

async function startServer() {
  try {
    await setupApplication()
    
    const dev = process.env.NODE_ENV !== 'production'
    const hostname = process.env.HOSTNAME || 'localhost'
    const port = process.env.PORT || 3000
    
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`)
    console.log(`🚀 Starting server on port ${port}`)
    
    const app = next({ dev, hostname, port })
    const handle = app.getRequestHandler()
    
    await app.prepare()
    
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        // Handle Next.js routing
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    })
      .once('error', (err) => {
        console.error(err)
        process.exit(1)
      })
      .listen(port, () => {
        console.log(`✅ Server ready on http://${hostname}:${port}`)
        console.log(`🔗 Access your application at: http://${hostname}:${port}`)
        console.log(`✅ DoaIbu Store Server Started Successfully`)
      })
    
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  process.exit(1)
})

// Start the server
startServer() 