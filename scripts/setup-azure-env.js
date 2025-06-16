const fs = require('fs')
const path = require('path')

// Get environment from command line argument
const targetEnv = process.argv[2] || 'dev'

console.log(`Setting up environment for: ${targetEnv}`)

// Environment configurations
const environments = {
  dev: {
    NODE_ENV: 'development',
    DATABASE_URL: 'file:./dev.db'
  },
  build: {
    NODE_ENV: 'production',
    DATABASE_URL: 'file:./dev.db' // Use SQLite for build process
  },
  azure: {
    NODE_ENV: 'production'
    // Azure environment variables will be set in Azure portal
  }
}

// Function to copy appropriate Prisma schema
function setupPrismaSchema(targetEnv) {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
  
  if (targetEnv === 'azure') {
    // Copy SQL Server schema for Azure production
    const sqlServerSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.sqlserver.prisma')
    if (fs.existsSync(sqlServerSchemaPath)) {
      const sqlServerSchema = fs.readFileSync(sqlServerSchemaPath, 'utf8')
      fs.writeFileSync(schemaPath, sqlServerSchema)
      console.log('✅ Switched to SQL Server schema for Azure production')
    }
  } else {
    // Keep SQLite schema for dev and build
    console.log('✅ Using SQLite schema for development/build')
  }
}

// Read current .env file
let envContent = ''
try {
  envContent = fs.readFileSync('.env', 'utf8')
} catch (error) {
  console.log('No existing .env file found, creating new one')
}

// Parse existing env vars
const existingVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    existingVars[key.trim()] = valueParts.join('=').trim()
  }
})

// Merge with target environment
const targetConfig = environments[targetEnv] || environments.dev
const finalConfig = { ...existingVars, ...targetConfig }

// Generate new .env content
let newEnvContent = ''
Object.entries(finalConfig).forEach(([key, value]) => {
  if (value !== undefined) {
    newEnvContent += `${key}=${value}\n`
  }
})

// Write .env file
fs.writeFileSync('.env', newEnvContent)

// Setup Prisma schema based on environment
setupPrismaSchema(targetEnv)

console.log(`Environment variables updated for ${targetEnv}`)
if (targetEnv === 'dev') {
  console.log('Using SQLite database for development')
} else if (targetEnv === 'build') {
  console.log('Using SQLite database for build process')
} else if (targetEnv === 'azure') {
  console.log('Environment prepared for Azure deployment')
} 