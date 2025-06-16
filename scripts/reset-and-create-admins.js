const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAndCreateAdmins() {
  try {
    console.log('🔗 Connecting to Azure SQL Database...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    
    // Delete in order to respect foreign key constraints
    await prisma.chatMessage.deleteMany({});
    console.log('✅ Cleared chat messages');
    
    await prisma.chatSession.deleteMany({});
    console.log('✅ Cleared chat sessions');
    
    await prisma.transaction.deleteMany({});
    console.log('✅ Cleared transactions');
    
    await prisma.order.deleteMany({});
    console.log('✅ Cleared orders');
    
    await prisma.user.deleteMany({});
    console.log('✅ Cleared users');
    
    await prisma.admin.deleteMany({});
    console.log('✅ Cleared admins');
    
    await prisma.game.deleteMany({});
    console.log('✅ Cleared games');
    
    console.log('🎯 Creating new admin accounts...');
    
    // Create admin accounts as specified
    const adminData = [
      {
        username: 'Cholif',
        password: 'Cholif123',
        role: 'super_admin'
      },
      {
        username: 'Havizhan',
        password: 'Havizhan123',
        role: 'admin'
      },
      {
        username: 'Fathan',
        password: 'Fathan123',
        role: 'admin'
      }
    ];
    
    for (const admin of adminData) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      
      const createdAdmin = await prisma.admin.create({
        data: {
          username: admin.username,
          password: hashedPassword,
          role: admin.role,
          isActive: true,
          isOnline: false
        }
      });
      
      console.log(`✅ Created ${admin.role}: ${admin.username} (ID: ${createdAdmin.id})`);
    }
    
    // Create a test user
    const testUserPassword = await bcrypt.hash('testuser123', 10);
    const testUser = await prisma.user.create({
      data: {
        email: 'testuser@test.com',
        username: 'testuser',
        password: testUserPassword,
        fullName: 'Test User',
        phoneNumber: '081234567890'
      }
    });
    
    console.log(`✅ Created test user: testuser (ID: ${testUser.id})`);
    
    // Create some basic games for testing
    const games = [
      { id: 'mobile-legends', name: 'Mobile Legends', category: 'MOBA' },
      { id: 'free-fire', name: 'Free Fire', category: 'Battle Royale' },
      { id: 'pubg-mobile', name: 'PUBG Mobile', category: 'Battle Royale' }
    ];
    
    for (const game of games) {
      await prisma.game.create({
        data: game
      });
      console.log(`✅ Created game: ${game.name}`);
    }
    
    console.log('🎉 Database reset and admin creation completed successfully!');
    console.log('\n📋 Admin Accounts Created:');
    console.log('• Cholif / Cholif123 (Super Admin)');
    console.log('• Havizhan / Havizhan123 (Admin)');
    console.log('• Fathan / Fathan123 (Admin)');
    console.log('\n🧪 Test User Created:');
    console.log('• testuser@test.com / testuser123');
    
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
resetAndCreateAdmins()
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }); 