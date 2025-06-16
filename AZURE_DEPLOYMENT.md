# DoaIbu Store - Azure Deployment Guide

## Panduan Deploy ke Azure Web App dengan Database SQL Server

### 1. Prerequisites

Pastikan Anda sudah memiliki:
- Azure subscription yang aktif
- Azure SQL Database yang sudah dibuat dengan nama `doaibustore-db`
- Azure App Service yang sudah dibuat dengan nama `doaibustore`
- GitHub repository dengan kode aplikasi

### 2. Setup Azure SQL Database

#### Langkah 1: Jalankan Script Database
Anda sudah menjalankan script SQL untuk membuat tabel dan data awal. Script tersebut sudah benar dan mencakup:
- Pembuatan semua tabel yang diperlukan
- Admin accounts (Cholif, Havizhan, Fathan) dengan password yang sudah di-hash
- Sample games data
- Indexes untuk performance
- Triggers untuk automatic timestamp updates

#### Langkah 2: Dapatkan Connection String
Connection string Azure SQL Database Anda akan berbentuk:
```
sqlserver://username:password@server.database.windows.net:1433;database=doaibustore-db;encrypt=true
```

### 3. Setup Environment Variables di Azure App Service

Masuk ke Azure Portal → App Services → doaibustore → Configuration → Application Settings

Tambahkan environment variables berikut:

#### Database Configuration
```
DATABASE_URL=sqlserver://your-username:your-password@your-server.database.windows.net:1433;database=doaibustore-db;encrypt=true
DATABASE_PROVIDER=sqlserver
NODE_ENV=production
```

#### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
NEXTAUTH_URL=https://doaibustore.azurewebsites.net
```

#### Azure AI Services
```
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_AI_FORM_RECOGNIZER_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_AI_FORM_RECOGNIZER_KEY=your-form-recognizer-key
```

#### Azure Storage
```
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account
AZURE_STORAGE_ACCOUNT_KEY=your-storage-key
AZURE_STORAGE_CONTAINER_NAME=uploads
```

#### Email Service
```
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@doaibustore.site
```

### 4. Setup GitHub Actions untuk Deployment

#### Langkah 1: Download Publish Profile
1. Masuk ke Azure Portal → App Services → doaibustore
2. Klik "Get publish profile" dan download file `.PublishSettings`

#### Langkah 2: Setup GitHub Secrets
Masuk ke GitHub Repository → Settings → Secrets and variables → Actions

Tambahkan secrets berikut:
```
AZUREAPPSERVICE_PUBLISHPROFILE=<isi file .PublishSettings>
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
NEXTAUTH_URL=https://doaibustore.azurewebsites.net
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_AI_FORM_RECOGNIZER_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_AI_FORM_RECOGNIZER_KEY=your-form-recognizer-key
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account
AZURE_STORAGE_ACCOUNT_KEY=your-storage-key
AZURE_STORAGE_CONTAINER_NAME=uploads
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@doaibustore.site
```

### 5. Development vs Production

#### Local Development (SQLite)
```bash
# Jalankan setup environment untuk development
npm run dev
```
Ini akan otomatis:
- Set DATABASE_URL="file:./dev.db"
- Set DATABASE_PROVIDER="sqlite"
- Generate Prisma client
- Start development server

#### Build untuk Production
```bash
# Build dengan environment production tapi tetap pakai SQLite untuk build process
npm run build
```

#### Deploy ke Azure
Deployment akan otomatis terjadi saat push ke branch `master` melalui GitHub Actions.

### 6. Admin Accounts

Setelah deployment berhasil, Anda dapat login sebagai admin dengan:

| Username | Password  | Role        |
|----------|-----------|-------------|
| Cholif   | Cholif123 | super_admin |
| Havizhan | Havizhan123| admin      |
| Fathan   | Fathan123 | admin       |

URL admin panel: `https://doaibustore.azurewebsites.net/admin/login`

### 7. Troubleshooting

#### Masalah Database Connection
- Pastikan Azure SQL Database firewall mengizinkan Azure services
- Periksa connection string sudah benar
- Pastikan database `doaibustore-db` sudah dibuat

#### Masalah Build Process
- Build process menggunakan SQLite untuk menghindari masalah koneksi Azure saat build
- Production runtime menggunakan Azure SQL Server sesuai environment variables

#### Masalah Environment Variables
- Pastikan semua environment variables sudah diset di Azure App Service
- Restart App Service setelah menambah/mengubah environment variables

### 8. Features yang Berfungsi

Setelah deployment berhasil, fitur-fitur berikut sudah dapat digunakan:
- ✅ User registration dan login
- ✅ Admin panel dengan 3 admin accounts
- ✅ Live chat dengan admin
- ✅ AI chatbot dengan analisis gambar
- ✅ Top-up game dan joki services
- ✅ Transaction management
- ✅ Email notifications
- ✅ File upload ke Azure Blob Storage
- ✅ Responsive mobile design

### 9. Monitoring

- Gunakan Azure Application Insights untuk monitoring
- Check logs di Azure Portal → App Services → doaibustore → Log stream
- Monitor database performance di Azure SQL Analytics

Selamat! DoaIbu Store sudah siap untuk production di Azure! 🚀 