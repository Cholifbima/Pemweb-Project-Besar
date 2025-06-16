#!/usr/bin/env node

/**
 * Azure Deployment Fix Script
 * This script fixes common issues with Azure deployment:
 * 1. Ensures Prisma client is generated
 * 2. Runs database migrations/setup
 * 3. Validates environment variables
 * 4. Creates tables if they don't exist
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Azure Deployment Fix Script Starting...');

// Check if we're in Azure environment
const isAzure = process.env.WEBSITE_SITE_NAME || process.env.AZURE_SQL_SERVER;
console.log('🌍 Environment:', isAzure ? 'Azure' : 'Local');

if (isAzure) {
  console.log('🔧 Running Azure-specific fixes...');
  
  // 1. Switch to Azure SQL schema
  try {
    console.log('🔄 Switching to Azure SQL schema...');
    execSync('node scripts/switch-db.js azure', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Schema switch failed, continuing...');
  }
  
  // 2. Generate Prisma client
  try {
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
  } catch (error) {
    console.error('❌ Prisma generation failed:', error.message);
    process.exit(1);
  }
  
  // 3. Check if node_modules/.prisma exists
  const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
  if (fs.existsSync(prismaClientPath)) {
    console.log('✅ Prisma client found at:', prismaClientPath);
  } else {
    console.error('❌ Prisma client not found, attempting to create...');
    try {
      execSync('npm install @prisma/client', { stdio: 'inherit' });
      execSync('npx prisma generate', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to install/generate Prisma client:', error.message);
    }
  }
  
  // 4. Test database connection and auto-migrate if needed
  try {
    console.log('🔍 Testing database connection...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Try to connect
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Users table exists with ${userCount} records`);
    } catch (error) {
      console.log('⚠️ Tables might not exist, attempting to create...');
      
      // Try to run migrations/push schema
      try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Database schema pushed successfully');
        
        // Seed initial data
        console.log('🌱 Seeding initial data...');
        await seedInitialData(prisma);
        
      } catch (pushError) {
        console.error('❌ Schema push failed:', pushError.message);
        console.log('💡 Please run the SQL setup script manually in Azure Portal');
      }
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Check your Azure SQL Database configuration and environment variables');
  }
  
} else {
  console.log('🏠 Local environment detected, skipping Azure fixes');
}

console.log('🎉 Azure deployment fix script completed');

// Seed initial data function
async function seedInitialData(prisma) {
  try {
    // Check if data already exists
    const existingGames = await prisma.game.count();
    if (existingGames > 0) {
      console.log('✅ Initial data already exists, skipping seed');
      return;
    }
    
    // Insert games
    const games = [
      { id: 'mobile_legends', name: 'Mobile Legends', category: 'MOBA', icon: '🎮' },
      { id: 'free_fire', name: 'Free Fire', category: 'Battle Royale', icon: '🔥' },
      { id: 'pubg_mobile', name: 'PUBG Mobile', category: 'Battle Royale', icon: '🎯' },
      { id: 'genshin_impact', name: 'Genshin Impact', category: 'RPG', icon: '⚔️' },
      { id: 'valorant', name: 'Valorant', category: 'FPS', icon: '💥' }
    ];
    
    for (const game of games) {
      await prisma.game.upsert({
        where: { id: game.id },
        update: {},
        create: game
      });
    }
    
    // Insert admins (with bcrypt hashed passwords)
    const admins = [
      { username: 'Cholif', password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'super_admin' },
      { username: 'Havizhan', password: '$2b$10$8K1p/a9Y8/G7c.TZJxr1iOKQx9lDhHXEc7C0l2jGlMqOG.2rKBSf.', role: 'admin' },
      { username: 'Fathan', password: '$2b$10$xJ3eK5k2R8p4L/mVnT1Q2OzHKQ8vG7aJ9R2s5p1M8fLlJ3qW9nO6C', role: 'admin' }
    ];
    
    for (const admin of admins) {
      await prisma.admin.upsert({
        where: { username: admin.username },
        update: {},
        create: admin
      });
    }
    
    // Insert demo user
    await prisma.user.upsert({
      where: { email: 'demo@doaibu.com' },
      update: {},
      create: {
        email: 'demo@doaibu.com',
        username: 'demo_user',
        password: '$2b$10$FuPLtqFkX3Q6uN8/aPhUFe.NYhTl4PvZQ1H2XQJGLaOtLzJFPJ3HW',
        fullName: 'Demo User',
        balance: 1000000
      }
    });
    
    console.log('✅ Initial data seeded successfully');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
} 