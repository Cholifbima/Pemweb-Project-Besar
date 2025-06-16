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
      
      console.log('🏗️ Generating Prisma client...')
      await new Promise((resolve, reject) => {
        exec('npx prisma generate', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Prisma generate failed:', error)
            reject(error)
          } else {
            console.log('✅ Prisma client generated successfully')
            console.log(stdout)
            resolve()
          }
        })
      })
      
      // Check if Prisma client exists
      const prismaClientPath = path.join(__dirname, 'node_modules/.prisma/client')
      if (fs.existsSync(prismaClientPath)) {
        console.log('✅ Prisma client verified at:', prismaClientPath)
      } else {
        console.error('❌ Prisma client not found at:', prismaClientPath)
      }
      
    } catch (error) {
      console.error('⚠️ Azure setup failed, continuing anyway:', error.message)
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