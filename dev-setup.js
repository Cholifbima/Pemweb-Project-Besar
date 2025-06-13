#!/usr/bin/env node

// Development setup script
// This script sets up SQLite database for local development

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up development environment...');

// Create .env.local for development
const envLocal = `# Local Development Environment
DATABASE_URL="file:./dev.db"
JWT_SECRET="doaibu-store-jwt-secret-key-2024-very-secure-random-string"
NODE_ENV="development"
NEXTAUTH_SECRET="doaibu-store-nextauth-secret-2024-random-key"
NEXTAUTH_URL="http://localhost:3000"
`;

fs.writeFileSync('.env.local', envLocal);
console.log('✅ Created .env.local for development');

// Create SQLite schema
const sqliteSchema = `// Development Prisma schema for SQLite
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  username    String   @unique
  password    String
  fullName    String?
  phoneNumber String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Gaming related fields
  favoriteGames String?  // Store as JSON string
  totalSpent    Float    @default(0)
  balance       Float    @default(1000000) // Demo balance 1 juta rupiah
  
  // Relations
  orders      Order[]
  
  @@map("users")
}

model Order {
  id          Int      @id @default(autoincrement())
  userId      Int
  gameId      String
  gameName    String
  serviceType String   // "topup" or "boost"
  packageName String
  price       Float
  status      String   @default("pending") // pending, processing, completed, failed
  paymentId   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
  
  @@map("orders")
}

model Game {
  id          String   @id
  name        String
  category    String
  icon        String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("games")
}
`;

fs.writeFileSync('prisma/schema-dev.prisma', sqliteSchema);
console.log('✅ Created SQLite schema for development');

try {
  // Set environment variable and run database setup
  process.env.DATABASE_URL = "file:./dev.db";
  
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate --schema=prisma/schema-dev.prisma', { stdio: 'inherit' });
  
  console.log('🗄️ Setting up database...');
  execSync('npx prisma db push --schema=prisma/schema-dev.prisma', { stdio: 'inherit' });
  
  console.log('🌱 Seeding database...');
  execSync('npx tsx prisma/seed.ts', { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: "file:./dev.db" }
  });
  
  console.log('🎉 Development environment setup complete!');
  console.log('');
  console.log('You can now run:');
  console.log('  npm run dev');
  console.log('');
  
} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
} 