const fs = require('fs')
const path = require('path')

// Database configuration utilities
const DB_CONFIG = {
  development: {
    provider: 'sqlite',
    url: 'file:./dev.db'
  },
  production: {
    provider: 'sqlserver',
    url: process.env.DATABASE_URL || 'sqlserver://localhost:1433'
  }
}

function getDatabaseConfig(env = 'development') {
  return DB_CONFIG[env] || DB_CONFIG.development
}

function updatePrismaSchema(targetEnv = 'development') {
  const config = getDatabaseConfig(targetEnv)
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
  
  let schemaContent = fs.readFileSync(schemaPath, 'utf8')
  
  // Update provider in datasource block
  schemaContent = schemaContent.replace(
    /provider\s*=\s*env\("DATABASE_PROVIDER"\)[^}]*/,
    `provider = "${config.provider}"`
  )
  
  fs.writeFileSync(schemaPath, schemaContent)
  console.log(`✅ Updated Prisma schema for ${targetEnv} environment`)
  console.log(`   Provider: ${config.provider}`)
}

function checkEnvironment() {
  const requiredVars = [
    'NODE_ENV',
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '))
    return false
  }
  
  console.log('✅ All required environment variables are set')
  return true
}

// If run directly
if (require.main === module) {
  const command = process.argv[2]
  const env = process.argv[3] || 'development'
  
  switch (command) {
    case 'update-schema':
      updatePrismaSchema(env)
      break
    case 'check-env':
      checkEnvironment()
      break
    case 'config':
      console.log('Database configuration:')
      console.log(JSON.stringify(getDatabaseConfig(env), null, 2))
      break
    default:
      console.log('Available commands:')
      console.log('  update-schema [env] - Update Prisma schema for environment')
      console.log('  check-env          - Check required environment variables')
      console.log('  config [env]       - Show database configuration')
  }
}

module.exports = {
  getDatabaseConfig,
  updatePrismaSchema,
  checkEnvironment
} 