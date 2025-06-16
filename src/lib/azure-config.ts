// Azure Services Configuration for DoaIbu Store
// Make sure to add these environment variables to your .env file

// Safe environment variable access with fallbacks
const getEnvVar = (key: string, fallback: string = ""): string => {
  if (typeof process === 'undefined') return fallback
  return process.env[key] || fallback
}

export const azureConfig = {
  // Azure OpenAI Configuration
  openai: {
    endpoint: getEnvVar('AZURE_OPENAI_ENDPOINT', "https://doaibu-openai.openai.azure.com/"),
    apiKey: getEnvVar('AZURE_OPENAI_API_KEY', "dummy-key-for-build"),
    deploymentName: getEnvVar('AZURE_OPENAI_DEPLOYMENT_NAME', "gpt-4o"),
    apiVersion: "2024-02-15-preview"
  },

  // Azure Document Intelligence Configuration (corrected key name)
  documentIntelligence: {
    endpoint: getEnvVar('AZURE_AI_FORM_RECOGNIZER_ENDPOINT', "https://doaibu-document.cognitiveservices.azure.com/"),
    apiKey: getEnvVar('AZURE_AI_FORM_RECOGNIZER_KEY', "dummy-key-for-build")
  },

  // Azure SignalR Configuration
  signalr: {
    connectionString: getEnvVar('AZURE_SIGNALR_CONNECTION_STRING', "Endpoint=https://dummy.service.signalr.net;AccessKey=dummy-key-for-build;Version=1.0;")
  },

  // Azure Blob Storage Configuration
  storage: {
    accountName: getEnvVar('AZURE_STORAGE_ACCOUNT_NAME', "doaibustorage"),
    accountKey: getEnvVar('AZURE_STORAGE_ACCOUNT_KEY', "dummy-key-for-build"),
    connectionString: getEnvVar('AZURE_STORAGE_CONNECTION_STRING', "DefaultEndpointsProtocol=https;AccountName=dummy;AccountKey=dummy-key-for-build;EndpointSuffix=core.windows.net")
  }
}

// Check if we're in production environment
export const isProduction = () => {
  return getEnvVar('NODE_ENV') === 'production'
}

// Check if Azure services are properly configured
export const isAzureConfigured = () => {
  const requiredKeys = [
    'AZURE_OPENAI_API_KEY',
    'AZURE_AI_FORM_RECOGNIZER_KEY',
    'AZURE_SIGNALR_CONNECTION_STRING',
    'AZURE_STORAGE_CONNECTION_STRING'
  ]
  
  return requiredKeys.every(key => {
    const value = getEnvVar(key)
    return value && value !== "dummy-key-for-build" && !value.includes("dummy")
  })
}

// Validate configuration
export const validateAzureConfig = () => {
  const missingVars = []
  
  if (!azureConfig.openai.apiKey || azureConfig.openai.apiKey.includes("dummy")) {
    missingVars.push('AZURE_OPENAI_API_KEY')
  }
  if (!azureConfig.documentIntelligence.apiKey || azureConfig.documentIntelligence.apiKey.includes("dummy")) {
    missingVars.push('AZURE_AI_FORM_RECOGNIZER_KEY')
  }
  if (!azureConfig.signalr.connectionString || azureConfig.signalr.connectionString.includes("dummy")) {
    missingVars.push('AZURE_SIGNALR_CONNECTION_STRING')
  }
  if (!azureConfig.storage.connectionString || azureConfig.storage.connectionString.includes("dummy")) {
    missingVars.push('AZURE_STORAGE_CONNECTION_STRING')
  }
  
  if (missingVars.length > 0 && isProduction()) {
    console.warn('⚠️ Missing Azure environment variables in production:', missingVars)
    console.warn('Please add them to your environment variables')
  }
  
  return missingVars.length === 0
} 