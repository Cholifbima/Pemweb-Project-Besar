// Azure Services Configuration for DoaIbu Store
// Make sure to add these environment variables to your .env.local file

export const azureConfig = {
  // Azure OpenAI Configuration
  openai: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || "https://doaibu-openai.openai.azure.com/",
    apiKey: process.env.AZURE_OPENAI_API_KEY || "",
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
    apiVersion: "2024-02-15-preview"
  },

  // Azure Document Intelligence Configuration
  documentIntelligence: {
    endpoint: process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "https://doaibu-document.cognitiveservices.azure.com/",
    apiKey: process.env.AZURE_DOCUMENT_INTELLIGENCE_API_KEY || ""
  },

  // Azure SignalR Configuration
  signalr: {
    connectionString: process.env.AZURE_SIGNALR_CONNECTION_STRING || ""
  },

  // Azure Blob Storage Configuration
  storage: {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || "doaibustorage",
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || "",
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || ""
  }
}

// Validate configuration
export const validateAzureConfig = () => {
  const missingVars = []
  
  if (!azureConfig.openai.apiKey) missingVars.push('AZURE_OPENAI_API_KEY')
  if (!azureConfig.documentIntelligence.apiKey) missingVars.push('AZURE_DOCUMENT_INTELLIGENCE_API_KEY')
  if (!azureConfig.signalr.connectionString) missingVars.push('AZURE_SIGNALR_CONNECTION_STRING')
  if (!azureConfig.storage.connectionString) missingVars.push('AZURE_STORAGE_CONNECTION_STRING')
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing Azure environment variables:', missingVars)
    console.warn('Please add them to your .env.local file')
  }
  
  return missingVars.length === 0
} 