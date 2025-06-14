-- =====================================================
-- AZURE SQL DATABASE SETUP FOR DOAIBUSTORE
-- Copy paste this entire script to Azure Query Editor
-- =====================================================

-- Step 1: Create users table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    username NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    fullName NVARCHAR(255) NULL,
    phoneNumber NVARCHAR(50) NULL,
    favoriteGames NVARCHAR(MAX) NULL,
    totalSpent FLOAT NOT NULL DEFAULT 0,
    balance FLOAT NOT NULL DEFAULT 1000000,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Step 2: Create orders table
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    gameId NVARCHAR(255) NOT NULL,
    gameName NVARCHAR(255) NOT NULL,
    serviceType NVARCHAR(50) NOT NULL,
    packageName NVARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'pending',
    paymentId NVARCHAR(255) NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Step 3: Create transactions table
CREATE TABLE transactions (
    id NVARCHAR(255) PRIMARY KEY,
    userId INT NOT NULL,
    type NVARCHAR(50) NOT NULL,
    gameId NVARCHAR(255) NOT NULL,
    itemId NVARCHAR(255) NULL,
    serviceId NVARCHAR(255) NULL,
    amount FLOAT NOT NULL,
    userGameId NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'pending',
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Step 4: Create games table
CREATE TABLE games (
    id NVARCHAR(255) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    category NVARCHAR(255) NOT NULL,
    icon NVARCHAR(255) NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Step 5: Insert test users
INSERT INTO users (email, username, password, fullName, phoneNumber, favoriteGames, totalSpent, balance, createdAt, updatedAt)
VALUES 
('test@doaibustore.com', 'testuser', '$2b$10$rQJ1vQJ1vQJ1vQJ1vQJ1vOJ1vQJ1vQJ1vQJ1vQJ1vQJ1vQJ1vQJ1vQ', 'Test User', '081234567890', '["Mobile Legends", "Free Fire"]', 0.0, 1000000.0, GETDATE(), GETDATE()),
('cholifbima@gmail.com', 'cholif', '$2b$10$rQJ1vQJ1vQJ1vQJ1vQJ1vOJ1vQJ1vQJ1vQJ1vQJ1vQJ1vQJ1vQJ1vQ', 'Cholif Bima', '081234567890', '["Mobile Legends", "Free Fire", "PUBG Mobile"]', 0.0, 1000000.0, GETDATE(), GETDATE());

-- Step 6: Insert sample games
INSERT INTO games (id, name, category, icon, isActive, createdAt, updatedAt)
VALUES 
('mobile-legends', 'Mobile Legends', 'MOBA', '/images/games/ml.png', 1, GETDATE(), GETDATE()),
('free-fire', 'Free Fire', 'Battle Royale', '/images/games/ff.png', 1, GETDATE(), GETDATE()),
('pubg-mobile', 'PUBG Mobile', 'Battle Royale', '/images/games/pubg.png', 1, GETDATE(), GETDATE()),
('valorant', 'Valorant', 'FPS', '/images/games/valorant.png', 1, GETDATE(), GETDATE()),
('genshin-impact', 'Genshin Impact', 'RPG', '/images/games/genshin.png', 1, GETDATE(), GETDATE());

-- Step 7: Verify setup
SELECT 'Setup completed successfully!' as Status;

-- Show table counts
SELECT 
    'users' as TableName, COUNT(*) as RecordCount FROM users
UNION ALL
SELECT 
    'orders' as TableName, COUNT(*) as RecordCount FROM orders
UNION ALL
SELECT 
    'transactions' as TableName, COUNT(*) as RecordCount FROM transactions
UNION ALL
SELECT 
    'games' as TableName, COUNT(*) as RecordCount FROM games;

-- Show test users
SELECT id, email, username, fullName, balance, totalSpent FROM users; 