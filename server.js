const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting DoaIbu Store...')
console.log('📍 Environment:', process.env.NODE_ENV || 'development')

// Setup function to run before starting Next.js
async function setupApplication() {
  console.log('🔧 Setting up application...')
  
  // Check if we're in production and need Azure setup
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sqlserver')) {
    console.log('🔄 Production environment detected, setting up Azure...')
    
    try {
      // Check if scripts directory exists
      if (fs.existsSync('./scripts/switch-db.js')) {
        console.log('🔄 Switching to Azure SQL Server schema...')
        await new Promise((resolve, reject) => {
          exec('node scripts/switch-db.js azure', (error, stdout, stderr) => {
            if (error) {
              console.error('❌ Schema switch failed:', error)
              reject(error)
            } else {
              console.log('✅ Schema switched successfully')
              console.log(stdout)
              resolve()
            }
          })
        })
      }
      
      console.log('🏗️ Checking Prisma client (should be pre-built)...')
      
      // Just verify that Prisma client exists (should be pre-built from GitHub Actions)
      const prismaClientPaths = [
        './node_modules/.prisma/client',
        '/node_modules/.prisma/client'
      ]
      
      let clientFound = false
      for (const clientPath of prismaClientPaths) {
        if (fs.existsSync(clientPath)) {
          console.log('✅ Found pre-built Prisma client at:', clientPath)
          const files = fs.readdirSync(clientPath).slice(0, 3)
          console.log('📁 Client files:', files)
          clientFound = true
          break
        }
      }
      
      if (!clientFound) {
        console.error('❌ Prisma client not found! This will cause runtime errors.')
        console.log('🔍 Available paths:')
        prismaClientPaths.forEach(p => {
          console.log(`   ${p}: ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`)
        })
      } else {
        console.log('✅ Prisma client verification successful')
      }
      

      
    } catch (error) {
      console.error('⚠️ Prisma setup failed, trying alternative approach:', error.message)
      
      // Alternative: Check for pre-built Prisma client
      try {
        console.log('🔄 Checking for pre-built Prisma client...')
        
        const prismaClientPaths = [
          './node_modules/.prisma/client',
          '/node_modules/.prisma/client',
          './node_modules/@prisma/client',
          '/node_modules/@prisma/client'
        ]
        
        let found = false
        for (const clientPath of prismaClientPaths) {
          if (fs.existsSync(clientPath)) {
            console.log('✅ Found Prisma client at:', clientPath)
            const files = fs.readdirSync(clientPath).slice(0, 5)
            console.log('📁 Client files:', files)
            found = true
            break
          }
        }
        
        if (!found) {
          console.log('❌ No Prisma client found, this may cause runtime errors')
        }
        
      } catch (checkError) {
        console.error('❌ Error checking Prisma client:', checkError.message)
      }
    }
  } else {
    console.log('🏠 Development environment or SQLite detected')
  }
}

// Main server function
async function startServer() {
  await setupApplication()
  
  const dev = process.env.NODE_ENV !== 'production'
  const hostname = '0.0.0.0'
  const port = process.env.PORT || 3000
  
  console.log('🎮 Starting Next.js application...')
  console.log('🌐 Mode:', dev ? 'development' : 'production')
  console.log('📍 Hostname:', hostname)
  console.log('🔌 Port:', port)
  
  const app = next({ dev, hostname, port })
  const handle = app.getRequestHandler()
  
  await app.prepare()
  console.log('✅ Next.js prepared successfully')
  
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`🎉 DoaIbu Store ready on http://${hostname}:${port}`)
  })
}

// Start the server
startServer().catch(error => {
  console.error('💥 Failed to start server:', error)
  process.exit(1) 