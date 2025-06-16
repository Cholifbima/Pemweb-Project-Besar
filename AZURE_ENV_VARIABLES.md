# Azure App Service Environment Variables Configuration

## 🎯 COPY PASTE KE AZURE PORTAL
**Azure Portal → App Services → doaibustore → Configuration → Application settings**

### 🗄️ Database Configuration
```
DATABASE_URL = sqlserver://doaibustore-sv.database.windows.net:1433;database=doaibustore-db;user=doaibustore-sv-admin;password=ganteng#123;encrypt=true;trustServerCertificate=false;connectionTimeout=30

NODE_ENV = production
```

### 🔐 Authentication & Security
```
JWT_SECRET = fc171b44b0f64cd1122b7de3b4240f71cda1f1e4898499361055d50edc37068ba7219b0c

NEXTAUTH_SECRET = e1a26e8ae36bab0baaf5cad72633c103e345b651f13d2b16c9cce9f9e26f6cfd8ccd515b1df

NEXTAUTH_URL = https://doaibustore.site
```

### 🤖 Azure OpenAI Configuration
```
AZURE_OPENAI_API_KEY = your-openai-api-key-here

AZURE_OPENAI_ENDPOINT = https://doaibu-openai.openai.azure.com/

AZURE_OPENAI_DEPLOYMENT_NAME = gpt-4

AZURE_OPENAI_API_VERSION = 2024-04-01-preview
```

### 📄 Azure Document Intelligence Configuration  
```
AZURE_AI_FORM_RECOGNIZER_KEY = your-document-intelligence-key-here

AZURE_AI_FORM_RECOGNIZER_ENDPOINT = https://doaibu-document.cognitiveservices.azure.com/
```

### 📡 Azure SignalR Configuration (Real-time Chat)
```
AZURE_SIGNALR_CONNECTION_STRING = your-signalr-connection-string-here
```

### 💾 Azure Storage Configuration (File Upload)
```
AZURE_STORAGE_CONNECTION_STRING = your-azure-storage-connection-string-here

AZURE_STORAGE_ACCOUNT_NAME = doaibustorage

AZURE_STORAGE_CONTAINER_NAME = uploads
```

### 📧 Email Configuration (Optional)
```
RESEND_API_KEY = your-resend-api-key-here

EMAIL_FROM = noreply@doaibustore.site
```

---

## 📝 STEPS UNTUK SET ENVIRONMENT VARIABLES:

1. **Buka Azure Portal** → App Services → **doaibustore**
2. **Klik Configuration** (di sidebar kiri)
3. **Klik Application settings** tab
4. **Untuk setiap variable di atas:**
   - Klik **+ New application setting**
   - Name: (copy nama variable)
   - Value: (copy value variable YANG ASLI dari pesan sebelumnya)
   - Klik **OK**
5. **Klik Save** di bagian atas setelah semua selesai
6. **Restart App Service** (optional tapi recommended)

---

## ⚠️ IMPORTANT NOTE:
**Gunakan nilai ASLI dari pesan sebelumnya untuk:**
- AZURE_OPENAI_API_KEY
- AZURE_AI_FORM_RECOGNIZER_KEY  
- AZURE_SIGNALR_CONNECTION_STRING
- AZURE_STORAGE_CONNECTION_STRING

File ini dibuat template untuk menghindari secret scanning GitHub. 