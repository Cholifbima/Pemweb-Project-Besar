# 🚀 Azure AI Customer Service Setup Guide

## 📋 Prerequisites
- Azure Account dengan credit $900
- All 4 Azure services sudah dibuat:
  - ✅ doaibu-openai (Azure OpenAI)
  - ✅ doaibu-signalr (SignalR Service)  
  - ✅ doaibustorage (Storage Account)
  - ✅ doaibu-document (Document Intelligence)

## 🔧 Step 1: Get Azure Service Keys

### 1. Azure OpenAI Service
1. Go to Azure Portal → **doaibu-openai**
2. Navigate to **Keys and Endpoint**
3. Copy:
   - **Endpoint**: `https://doaibu-openai.openai.azure.com/`
   - **Key 1**: `your-openai-api-key`

### 2. Azure Document Intelligence
1. Go to Azure Portal → **doaibu-document**
2. Navigate to **Keys and Endpoint**
3. Copy:
   - **Endpoint**: `https://doaibu-document.cognitiveservices.azure.com/`
   - **Key 1**: `your-document-intelligence-key`

### 3. Azure SignalR Service
1. Go to Azure Portal → **doaibu-signalr**
2. Navigate to **Keys**
3. Copy **Connection String**: `Endpoint=https://doaibu-signalr.service.signalr.net;AccessKey=...`

### 4. Azure Storage Account
1. Go to Azure Portal → **doaibustorage**
2. Navigate to **Access Keys**
3. Copy:
   - **Storage account name**: `doaibustorage`
   - **Key1**: `your-storage-key`
   - **Connection string**: `DefaultEndpointsProtocol=https;AccountName=...`

## 🔐 Step 2: Setup Environment Variables

Create `.env.local` file in project root:

```env
# Database Configuration (Keep existing)
DATABASE_URL="your-existing-database-url"
AZURE_SQL_SERVER="doaibustore-sv.database.windows.net"
AZURE_SQL_DATABASE="doaibustore-db"
AZURE_SQL_USERNAME="doaibustore-sv-admin"
AZURE_SQL_PASSWORD="ganteng#123"
JWT_SECRET="your-existing-jwt-secret"

# Azure AI Services (ADD THESE)
AZURE_OPENAI_ENDPOINT="https://doaibu-openai.openai.azure.com/"
AZURE_OPENAI_API_KEY="your-openai-api-key-here"
AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4"

AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT="https://doaibu-document.cognitiveservices.azure.com/"
AZURE_DOCUMENT_INTELLIGENCE_API_KEY="your-document-intelligence-key-here"

AZURE_SIGNALR_CONNECTION_STRING="Endpoint=https://doaibu-signalr.service.signalr.net;AccessKey=your-access-key;Version=1.0;"

AZURE_STORAGE_ACCOUNT_NAME="doaibustorage"
AZURE_STORAGE_ACCOUNT_KEY="your-storage-account-key-here"
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=doaibustorage;AccountKey=your-key;EndpointSuffix=core.windows.net"

# Email Service (Keep existing)
RESEND_API_KEY="re_your_resend_api_key"
```

## 🧪 Step 3: Deploy GPT-4 Model

1. Go to **Azure OpenAI Studio**: [https://oai.azure.com/](https://oai.azure.com/)
2. Select your **doaibu-openai** resource
3. Go to **Deployments** → **Create new deployment**
4. Configure:
   - **Model**: `gpt-4` or `gpt-4-turbo-preview`
   - **Deployment name**: `gpt-4`
   - **Version**: Latest available
   - **Tokens per minute rate limit**: 30K (or as needed)

## 🔄 Step 4: Test the Setup

1. Run the development server:
```bash
npm run dev
```

2. Test features:
   - ✅ Complete a transaction
   - ✅ Go to support page: `/support`
   - ✅ Open AI ChatBot
   - ✅ Send a message: "Halo, saya butuh bantuan"
   - ✅ Upload a screenshot/document
   - ✅ Check if AI responds correctly

## 🎯 Available Features

### 🤖 AI ChatBot Features:
- **24/7 Gaming Customer Service** - Specialized in gaming support
- **File Upload & Analysis** - Screenshot analysis, document reading
- **Smart Responses** - Context-aware gaming help
- **Multi-format Support** - PNG, JPG, PDF files
- **Chat History** - Persistent conversation memory

### 📄 Document Intelligence:
- **Screenshot Analysis** - Game error detection
- **Receipt Recognition** - Payment confirmation
- **Text Extraction** - OCR for any document
- **AI Interpretation** - Smart gaming-related advice

### 🔄 Integration Points:
- **Post-Transaction Support** - Auto-redirect after payment
- **Dashboard Integration** - Accessible from user dashboard
- **Mobile Responsive** - Works on all devices

## 🐛 Troubleshooting

### Common Issues:

1. **AI Not Responding**
   - Check `AZURE_OPENAI_API_KEY` is correct
   - Verify GPT-4 model is deployed
   - Check quota limits in Azure

2. **File Upload Fails**
   - Verify `AZURE_STORAGE_CONNECTION_STRING`
   - Check storage account permissions
   - Ensure file size < 10MB

3. **Document Analysis Fails**
   - Check `AZURE_DOCUMENT_INTELLIGENCE_API_KEY`
   - Verify service region matches
   - Try different file formats

### Debug Commands:
```bash
# Check environment variables
npm run dev

# View logs in browser console
# Check Network tab for API responses
```

## 💰 Cost Monitoring

Monitor usage in Azure Portal:
- **OpenAI**: ~$0.002-0.006 per request
- **Document Intelligence**: ~$0.001 per page
- **Storage**: ~$0.02 per GB
- **SignalR**: ~$1 per unit/month

## 🚀 Next Features to Implement:
1. **Real-time Human Chat** with SignalR
2. **Admin Dashboard** for customer service agents
3. **Chat History Storage** in database
4. **Advanced Analytics** and reporting
5. **Multi-language Support** for international users

---

🎮 **DoaIbu Store AI Customer Service is now ready!** 
Users can get instant help, upload screenshots for analysis, and receive gaming-specific support 24/7. 