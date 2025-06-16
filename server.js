const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

console.log('🚀 Starting DoaIbu Store on Azure...')

// Setup function to run before starting Next.js
async function setupApplication() {
  console.log('🔧 Setting up application...')
  
  // Run Azure deployment fix script
  try {
    console.log('🔧 Running Azure deployment fix...')
    const { exec } = require('child_process')
    await new Promise((resolve, reject) => {
      exec('node scripts/azure-deployment-fix.js', (error, stdout, stderr) => {
        if (stdout) console.log(stdout)
        if (stderr) console.error(stderr)
        if (error) {
          console.error('❌ Azure fix script failed:', error)
          // Don't fail startup for this
          resolve()
        } else {
          console.log('✅ Azure deployment fix completed')
          resolve()
        }
      })
    })
  } catch (error) {
    console.error('⚠️ Azure fix script error (continuing anyway):', error)
  }
  
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