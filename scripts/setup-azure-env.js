const fs = require('fs')
const path = require('path')

// Get environment from command line argument
const targetEnv = process.argv[2] || 'dev'

console.log(`Setting up environment for: ${targetEnv}`)

// Environment configurations
const environments = {
  dev: {
    NODE_ENV: 'development',
    DATABASE_URL: 'file:./dev.db',
    DATABASE_PROVIDER: 'sqlite'
  },
  build: {
    NODE_ENV: 'production',
    DATABASE_URL: 'file:./dev.db', // Use SQLite for build process
    DATABASE_PROVIDER: 'sqlite'
  },
  azure: {
    NODE_ENV: 'production',
    DATABASE_PROVIDER: 'sqlserver'
    // Azure environment variables will be set in Azure portal
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

console.log(`Environment variables updated for ${targetEnv}`)
if (targetEnv === 'dev') {
  console.log('Using SQLite database for development')
} else if (targetEnv === 'build') {
  console.log('Using SQLite database for build process')
} else if (targetEnv === 'azure') {
  console.log('Environment prepared for Azure deployment')
}

// Production environment variables template for Azure
const azureEnvTemplate = `# DoaIbu Store Production Environment Variables
# Update these values with your actual Azure credentials

# Database Configuration (Azure SQL Database)  
DATABASE_URL="sqlserver://doaibustore-sv.database.windows.net:1433;database=doaibustore-db;user=doaibustore-sv-admin;password=ganteng#123;encrypt=true;"

# Next.js Configuration
NODE_ENV=production
NEXTAUTH_URL=https://doaibustore.site
NEXTAUTH_SECRET=e1a26e8ae36bab0baaff5cad72633c103e345b65

# JWT Configuration
JWT_SECRET=fc171b44b0f64cd1122b7de3b42405f71cfda1f1e

# Azure OpenAI Configuration (Optional - will use fallback if not set)
AZURE_OPENAI_ENDPOINT=https://doaibu-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=sk-dummy-key-replace-with-actual
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Azure Document Intelligence Configuration (Optional)
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://doaibu-document.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_API_KEY=dummy-key-replace-with-actual

# Azure SignalR Configuration (Optional)
AZURE_SIGNALR_CONNECTION_STRING=Endpoint=https://doaibu-signalr.service.signalr.net;AccessKey=dummy-key-replace-with-actual;Version=1.0;

# Azure Blob Storage Configuration (Optional)
AZURE_STORAGE_ACCOUNT_NAME=doaibustorage
AZURE_STORAGE_ACCOUNT_KEY=dummy-key-replace-with-actual
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=doaibustorage;AccountKey=dummy-key-replace-with-actual;EndpointSuffix=core.windows.net

# Application Insights Configuration  
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=1e8e11f0-1c37-4ba0-8ce7-your-key-here

# XDT Configuration
XDT_MicrosoftApplicationInsights_Mode=default
`

// Development environment variables template
const devEnvTemplate = `# DoaIbu Store Development Environment Variables

# Database Configuration (SQLite for development)
DATABASE_URL="file:./dev.db"

# Next.js Configuration
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=e1a26e8ae36bab0baaff5cad72633c103e345b65

# JWT Configuration
JWT_SECRET=fc171b44b0f64cd1122b7de3b42405f71cfda1f1e

# Azure Services (Optional - leave empty for development)
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT_NAME=
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=
AZURE_DOCUMENT_INTELLIGENCE_API_KEY=
AZURE_SIGNALR_CONNECTION_STRING=
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=
AZURE_STORAGE_CONNECTION_STRING=
`

function setupEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production'
  const envFile = path.join(process.cwd(), '.env')
  const envLocalFile = path.join(process.cwd(), '.env.local')
  
  console.log('🔧 Setting up environment variables...')
  
  // Check if .env already exists
  if (fs.existsSync(envFile)) {
    console.log('✅ .env file already exists')
    return
  }
  
  if (fs.existsSync(envLocalFile)) {
    console.log('✅ .env.local file already exists')
    return
  }
  
  // Create appropriate env file based on environment
  if (isProduction) {
    console.log('🚀 Creating production .env file...')
    fs.writeFileSync(envFile, azureEnvTemplate)
    console.log('✅ Created .env with Azure configuration')
    console.log('⚠️  Please update the Azure credentials in .env file')
  } else {
    console.log('🛠️  Creating development .env.local file...')
    fs.writeFileSync(envLocalFile, devEnvTemplate)
    console.log('✅ Created .env.local for development')
  }
}

// Create build-safe environment for CI/CD
function createBuildEnv() {
  const buildEnv = `# Build-time environment variables for CI/CD
DATABASE_URL="sqlserver://localhost:1433;database=temp;user=temp;password=temp;encrypt=true;"
NODE_ENV=production
NEXTAUTH_URL=https://doaibustore.site
NEXTAUTH_SECRET=e1a26e8ae36bab0baaff5cad72633c103e345b65
JWT_SECRET=fc171b44b0f64cd1122b7de3b42405f71cfda1f1e

# Dummy Azure keys for build (will not be used at runtime)
AZURE_OPENAI_ENDPOINT=https://dummy.openai.azure.com/
AZURE_OPENAI_API_KEY=dummy-build-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://dummy.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_API_KEY=dummy-build-key
AZURE_SIGNALR_CONNECTION_STRING=Endpoint=https://dummy.service.signalr.net;AccessKey=dummy-build-key;Version=1.0;
AZURE_STORAGE_ACCOUNT_NAME=dummy
AZURE_STORAGE_ACCOUNT_KEY=dummy-build-key
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=dummy;AccountKey=dummy-build-key;EndpointSuffix=core.windows.net
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=dummy-build-key
XDT_MicrosoftApplicationInsights_Mode=default
`

  const envFile = path.join(process.cwd(), '.env')
  
  if (!fs.existsSync(envFile)) {
    console.log('🔨 Creating build environment for CI/CD...')
    fs.writeFileSync(envFile, buildEnv)
    console.log('✅ Created .env for build process')
  }
}

// Run the setup
if (require.main === module) {
  const command = process.argv[2]
  
  if (command === 'build') {
    createBuildEnv()
  } else {
    setupEnvironment()
  }
}

module.exports = { setupEnvironment, createBuildEnv } 
>>>>>>> 8783543a8f9913badff3ba06cd59c872ab8b6152
