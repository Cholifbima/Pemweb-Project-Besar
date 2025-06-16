const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const target = args[0] || 'dev' // dev, azure

console.log(`🔄 Switching database configuration to: ${target}`)

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')

if (target === 'azure') {
  // Switch to Azure SQL Server schema
  const azureSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.azure.prisma')
  
  if (fs.existsSync(azureSchemaPath)) {
    const azureSchema = fs.readFileSync(azureSchemaPath, 'utf8')
    fs.writeFileSync(schemaPath, azureSchema)
    console.log('✅ Switched to Azure SQL Server schema')
  } else {
    console.error('❌ Azure schema file not found!')
    process.exit(1)
  }
  
} else if (target === 'dev') {
  // Switch to SQLite schema  
  const devSchemaPath = path.join(__dirname, '..', 'prisma', 'schema-dev.prisma')
  
  if (fs.existsSync(devSchemaPath)) {
    const devSchema = fs.readFileSync(devSchemaPath, 'utf8')
    fs.writeFileSync(schemaPath, devSchema)
    console.log('✅ Switched to SQLite development schema')
  } else {
    // Create SQLite schema from current schema.prisma if it doesn't exist
    console.log('🔧 Creating SQLite schema from current schema')
    const currentSchema = fs.readFileSync(schemaPath, 'utf8')
    const sqliteSchema = currentSchema
      .replace(/provider = "sqlserver"/, 'provider = "sqlite"')
      .replace(/onDelete: Cascade/g, 'onDelete: Cascade')
      .replace(/onDelete: SetNull/g, 'onDelete: SetNull')
      .replace(/onDelete: NoAction, onUpdate: NoAction/g, '')
    
    // Remove SQL Server specific constraints that don't work with SQLite
    const cleanSchema = sqliteSchema
      .replace(/@default\(cuid\(\)\)/g, '@default(cuid())')
      .replace(/onUpdate: NoAction/g, '')
    
    fs.writeFileSync(schemaPath, cleanSchema)
    console.log('✅ Using current schema as SQLite schema')
  }
  
} else {
  console.error('❌ Invalid target. Use: dev or azure')
  process.exit(1)
}

console.log(`🎯 Database configuration switched to: ${target}`)
console.log('📝 Next steps:')
console.log('  1. Run: npx prisma generate')
if (target === 'azure') {
  console.log('  2. Set Azure environment variables')
  console.log('  3. Deploy to Azure')
} else {
  console.log('  2. Run: npx prisma db push')
  console.log('  3. Run: npm run dev')
} 