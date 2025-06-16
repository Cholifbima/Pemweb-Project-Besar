# 🚀 Azure Deployment Guide

## GitHub Actions Auto Deployment Setup

### 📋 Prerequisites

1. **Azure App Service** - Web app sudah dibuat
2. **Azure SQL Database** - Database sudah dikonfigurasi
3. **GitHub Repository** - Code sudah di-push ke master branch
4. **Azure Storage Account** - Untuk file uploads
5. **Azure OpenAI & Document Intelligence** - Untuk AI features

### 🔐 GitHub Secrets Configuration

Masuk ke **GitHub Repository → Settings → Secrets and variables → Actions** dan tambahkan secrets berikut:

#### 🔑 Authentication & Database
```
JWT_SECRET=fc171b44b0f64cd1122b7de3b42405f71cfda1f1e489849936105d55d0edc37068ba7219b0c16270ec331ecff44f363ce3482ef19d9f9dfedb5e7a1d1e6f7de2
DATABASE_URL=sqlserver://doaibustore-sv.database.windows.net:1433;database=doaibustore-db;user=doaibustore-sv-admin;password=ganteng#123;encrypt=true;trustServerCertificate=false;connectionTimeout=30;
```

#### ☁️ Azure Storage
```
AZURE_STORAGE_ACCOUNT_NAME=doaibustorestorage
AZURE_STORAGE_ACCOUNT_KEY=[Your Azure Storage Account Key]
AZURE_STORAGE_CONTAINER_NAME=uploads
```

#### 🤖 Azure AI Services
```
AZURE_OPENAI_API_KEY=[Your Azure OpenAI API Key]
AZURE_OPENAI_ENDPOINT=[Your Azure OpenAI Endpoint]
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=[Your Document Intelligence Endpoint]
AZURE_DOCUMENT_INTELLIGENCE_KEY=[Your Document Intelligence Key]
```

#### 📡 SignalR (Real-time Chat)
```
SIGNALR_CONNECTION_STRING=[Your Azure SignalR Connection String]
```

#### 🌐 Azure App Service Authentication
```
AZUREAPPSERVICE_CLIENTID_98343B524EC149B09B2BAF053632C6F9=[Your Azure Service Principal Client ID]
AZUREAPPSERVICE_TENANTID_8A72675D09B4437A8B79B90A75DD6CC0=[Your Azure Tenant ID]
AZUREAPPSERVICE_SUBSCRIPTIONID_9901E9BE8782443796A7EE83CA8D5454=[Your Azure Subscription ID]
```

#### 📋 Optional Secrets (untuk workflow alternatif)
```
AZURE_APP_NAME=doaibustore
AZURE_APP_URL=https://doaibustore.azurewebsites.net
AZURE_PUBLISH_PROFILE=[Your Azure App Service Publish Profile - dari Azure Portal]
MIGRATION_SECRET=[Random secret for migration endpoint - opsional]
```

### 🔐 How to Get Azure Service Principal Credentials

#### Method 1: Using Azure CLI (Recommended)
```bash
# Login to Azure
az login

# Create service principal for your app
az ad sp create-for-rbac --name "doaibustore-github-actions" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group-name} --sdk-auth

# This will output JSON with the credentials you need
```

#### Method 2: From Azure Portal
1. Go to **Azure Portal → Azure Active Directory → App registrations**
2. Click **New registration** → Name: "doaibustore-github-actions"
3. After creation, note the **Application (client) ID** and **Directory (tenant) ID**
4. Go to **Certificates & secrets** → **New client secret**
5. Copy the secret value
6. Go to **Subscriptions** → Your subscription → **Access control (IAM)**
7. Add role assignment → **Contributor** → Select your app registration

#### Method 3: Get from existing deployment
The secrets in the workflow are already configured for your Azure subscription:
- Client ID: `98343B524EC149B09B2BAF053632C6F9`
- Tenant ID: `8A72675D09B4437A8B79B90A75DD6CC0`
- Subscription ID: `9901E9BE8782443796A7EE83CA8D5454`

### 📥 Alternative: How to Get Azure Publish Profile

1. Go to **Azure Portal → App Services → [Your App]**
2. Click **Get publish profile** button
3. Download the `.publishsettings` file
4. Copy the entire content of the file
5. Paste it as `AZURE_PUBLISH_PROFILE` secret in GitHub

### 🔄 Deployment Process

The GitHub Action will automatically:

1. **🚀 Trigger** on push to `master` branch
2. **🟢 Setup** Node.js 18 environment
3. **📦 Install** dependencies with `npm ci`
4. **🔧 Generate** Prisma client
5. **🏗️ Build** Next.js application
6. **🧪 Run** tests (if available)
7. **📁 Package** deployment files
8. **🚀 Deploy** to Azure App Service
9. **🔄 Run** database migrations
10. **🎉 Notify** deployment status

### 📊 Deployment Features

✅ **Automatic Build & Deploy** on every push to master  
✅ **Environment Variables** properly configured  
✅ **Prisma Database** migrations  
✅ **Next.js Optimization** for production  
✅ **Azure App Service** compatibility  
✅ **Error Handling** and notifications  
✅ **JWT Authentication** ready  
✅ **Chat System** functional  
✅ **File Upload** to Azure Storage  
✅ **AI Integration** configured  

### 🛠️ Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# 1. Build the application
npm run build

# 2. Generate Prisma client
npx prisma generate

# 3. Deploy to Azure using Azure CLI
az webapp deployment source config-zip \
  --resource-group [your-resource-group] \
  --name [your-app-name] \
  --src deployment.zip
```

### 🔍 Troubleshooting

#### Common Issues:

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are in package.json
   - Check Node.js version compatibility

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check Azure SQL firewall rules
   - Ensure database exists and is accessible

3. **Authentication Problems**
   - Verify JWT_SECRET is exactly 128 characters
   - Check all auth endpoints are working
   - Verify token generation and validation

4. **File Upload Issues**
   - Check Azure Storage account credentials
   - Verify container exists and permissions
   - Check CORS settings if needed

### 📈 Post-Deployment Verification

After successful deployment, verify:

1. **🌐 Website** loads at your Azure URL
2. **🔐 Login/Register** functionality works
3. **💬 Chat System** is operational
4. **📁 File Upload** works correctly
5. **👨‍💼 Admin Panel** is accessible
6. **🎮 Game Services** are functional

### 🔄 Database Setup on Azure

The admin accounts are already configured:

- **Cholif** (Super Admin) - `Cholif` / `Cholif123`
- **Havizhan** (Admin) - `Havizhan` / `Havizhan123`  
- **Fathan** (Admin) - `Fathan` / `Fathan123`

### 🎯 Production Checklist

- [ ] All GitHub secrets configured
- [ ] Azure App Service created
- [ ] Azure SQL Database accessible
- [ ] Azure Storage Account setup
- [ ] Domain name configured (optional)
- [ ] SSL certificate enabled
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented

### 📞 Support

If you encounter issues:

1. Check GitHub Actions logs
2. Review Azure App Service logs
3. Verify all environment variables
4. Test database connectivity
5. Check Azure service status

---

## 🎉 Ready for Production!

Your DoaIbu Store application is now configured for automatic deployment to Azure with full chat functionality, JWT authentication, and all features working perfectly! 