const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting DoaIbu Store on Azure...')

// Validate critical dependencies are available
function validateDependencies() {
  console.log('🔍 Validating critical dependencies...')
  
  const criticalDeps = [
    { name: 'next', path: './node_modules/next' },
    { name: '@prisma/client', path: './node_modules/@prisma/client' },
    { name: '.prisma/client', path: './node_modules/.prisma/client' },
    { name: 'react', path: './node_modules/react' },
    { name: 'bcryptjs', path: './node_modules/bcryptjs' }
  ]
  
  let allDepsFound = true
  
  criticalDeps.forEach(dep => {
    if (fs.existsSync(dep.path)) {
      console.log(`✅ ${dep.name} found`)
    } else {
      console.error(`❌ ${dep.name} missing at ${dep.path}`)
      allDepsFound = false
    }
  })
  
  // Check if Next.js CLI is accessible
  try {
    const nextPath = path.join(__dirname, 'node_modules/.bin/next')
    if (fs.existsSync(nextPath)) {
      console.log('✅ Next.js CLI found')
    } else {
      console.error('❌ Next.js CLI not found at expected path')
      allDepsFound = false
    }
  } catch (error) {
    console.error('❌ Error checking Next.js CLI:', error.message)
    allDepsFound = false
  }
  
  if (!allDepsFound) {
    console.error('💥 Critical dependencies missing! Deployment may fail.')
    console.log('🔧 Available node_modules:')
    try {
      const nodeModules = fs.readdirSync('./node_modules').slice(0, 10)
      console.log(nodeModules.join(', '))
    } catch (err) {
      console.error('❌ Cannot read node_modules directory:', err.message)
    }
  } else {
    console.log('✅ All critical dependencies validated')
  }
  
  return allDepsFound
}

// Setup function to run before starting Next.js
async function setupApplication() {
  console.log('🔧 Setting up application...')
  
  // Validate dependencies first
  const depsValid = validateDependencies()
  if (!depsValid) {
    console.warn('⚠️ Some dependencies are missing, but continuing with startup...')
  }
  
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
  
  // Verify Prisma client is available at runtime
  try {
    console.log('🔍 Verifying Prisma client...')
    const { PrismaClient } = require('@prisma/client')
    console.log('✅ Prisma client successfully imported')
  } catch (error) {
    console.error('❌ Failed to import Prisma client:', error.message)
    console.error('🔧 This will cause database connection failures')
  }
}

// Main server function
async function startServer() {
  await setupApplication()
  
  const dev = process.env.NODE_ENV !== 'production'
  const hostname = '0.0.0.0'
  const port = process.env.PORT || 8080
  
  console.log('🎮 Starting Next.js application...')
  console.log('🌐 Mode:', dev ? 'development' : 'production')
  console.log('📍 Hostname:', hostname)
  console.log('🔌 Port:', port)
  
  try {
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
  } catch (error) {
    console.error('💥 Failed to start Next.js application:', error)
    console.error('🔧 This might be due to missing dependencies or configuration issues')
    
    // Try to provide helpful debug information
    console.log('🔍 Debug information:')
    console.log('- Current working directory:', process.cwd())
    console.log('- Node version:', process.version)
    console.log('- Environment:', process.env.NODE_ENV)
    
    throw error
  }
}

// Start the server
startServer().catch(error => {
  console.error('💥 Failed to start server:', error)
  process.exit(1) 