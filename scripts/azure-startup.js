const fs = require('fs')
const path = require('path')

console.log('🚀 Starting Azure production setup...')

// Check if we're in Azure environment
const isAzure = process.env.WEBSITE_SITE_NAME || process.env.APPSETTING_WEBSITE_SITE_NAME

if (isAzure) {
  console.log('📍 Detected Azure environment, switching to SQL Server schema...')
  
  try {
    // Copy SQL Server schema to main schema file
    const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
    const sqlServerSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.sqlserver.prisma')
    
    if (fs.existsSync(sqlServerSchemaPath)) {
      const sqlServerSchema = fs.readFileSync(sqlServerSchemaPath, 'utf8')
      fs.writeFileSync(schemaPath, sqlServerSchema)
      console.log('✅ Successfully switched to SQL Server schema')
    } else {
      console.log('⚠️  SQL Server schema file not found, keeping current schema')
    }
    
    console.log('✅ Azure startup completed successfully')
  } catch (error) {
    console.error('❌ Error during Azure startup:', error.message)
    // Don't exit with error, continue with current schema
  }
} else {
  console.log('📍 Not in Azure environment, keeping current configuration')
}

console.log('🎯 Environment setup completed') 