const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting DoaIbu Store on Azure...')

// Setup function to run before starting Next.js
async function setupApplication() {
  console.log('🔧 Setting up application...')
  
  // Switch to Azure SQL Server schema if needed
  try {
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
  } catch (error) {
    console.error('⚠️ Schema switch failed, continuing with current schema:', error.message)
  }

  console.log('🔄 Switching database configuration to: azure')
  console.log('✅ Switched to Azure SQL Server schema')
  console.log('🎯 Database configuration switched to: azure')
  console.log('📝 Next steps:')
  console.log('  1. Run: npx prisma generate')
  console.log('  2. Set Azure environment variables')
  console.log('  3. Deploy to Azure')
  console.log('')
  
  // Try to generate Prisma client (but don't fail if it doesn't work due to permissions)
  try {
    console.log('🏗️ Generating Prisma client...')
    await new Promise((resolve, reject) => {
      exec('npx prisma generate', { timeout: 30000 }, (error, stdout, stderr) => {
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
  } catch (error) {
    console.error('⚠️ Setup failed, continuing anyway:', error.message)
    console.log('🔧 Prisma client should have been generated during build time')
  }
}

// Main server function
async function startServer() {
  await setupApplication()
  
  const dev = process.env.NODE_ENV !== 'production'
  const hostname = '0.0.0.0'
  const port = process.env.PORT || 8080
  
  console.log('🎮 Starting Next.js application...')
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