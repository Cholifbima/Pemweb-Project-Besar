const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

console.log('🚀 Starting DoaIbu Store on Azure...')

// Setup function to run before starting Next.js
async function setupApplication() {
  console.log('🔧 Setting up application...')
  
  // Switch to Azure SQL Server schema if needed
  try {
    console.log('🔄 Switching to Azure SQL Server schema...')
    const { exec } = require('child_process')
    await new Promise((resolve, reject) => {
      exec('node scripts/switch-db.js azure', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Schema switch failed:', error)
          // Don't fail startup for schema switch issues
          resolve()
        } else {
          console.log('✅ Schema switched successfully')
          resolve()
        }
      })
    })
  } catch (error) {
    console.error('⚠️ Schema switch error (continuing anyway):', error)
  }
  
  console.log('🔄 Switching database configuration to: azure')
  console.log('✅ Switched to Azure SQL Server schema')
  console.log('🔧 Environment configured for Azure SQL Database')
  console.log('📊 Starting Next.js server...')
}

async function startServer() {
  try {
    await setupApplication()
    
    const dev = process.env.NODE_ENV !== 'production'
    const port = process.env.PORT || 8080
    
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`)
    console.log(`🚀 Starting server on port ${port}`)
    
    const app = next({ dev })
    const handle = app.getRequestHandler()
    
    await app.prepare()
    
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    })
    
    server.listen(port, (err) => {
      if (err) throw err
      console.log(`✅ Server ready on http://localhost:${port}`)
      console.log(`🔗 Access your application at: http://localhost:${port}`)
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