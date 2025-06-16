-- DoaIbu Store - Azure SQL Database Setup Script
-- Run this script in Azure SQL Database to create all tables and initial data

-- Drop existing tables if they exist (in correct order due to foreign keys)
IF OBJECT_ID('chat_messages', 'U') IS NOT NULL DROP TABLE chat_messages;
IF OBJECT_ID('chat_sessions', 'U') IS NOT NULL DROP TABLE chat_sessions;
IF OBJECT_ID('transactions', 'U') IS NOT NULL DROP TABLE transactions;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('admins', 'U') IS NOT NULL DROP TABLE admins;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('games', 'U') IS NOT NULL DROP TABLE games;
GO

-- Create Users table
CREATE TABLE users (
    id int IDENTITY(1,1) PRIMARY KEY,
    email nvarchar(255) NOT NULL UNIQUE,
    username nvarchar(255) NOT NULL UNIQUE,
    password nvarchar(255) NOT NULL,
    fullName nvarchar(255),
    phoneNumber nvarchar(255),
    favoriteGames nvarchar(max),
    totalSpent float NOT NULL DEFAULT 0,
    balance float NOT NULL DEFAULT 1000000,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE()
);
GO

-- Create Games table
CREATE TABLE games (
    id nvarchar(255) PRIMARY KEY,
    name nvarchar(255) NOT NULL,
    category nvarchar(255) NOT NULL,
    icon nvarchar(255),
    isActive bit NOT NULL DEFAULT 1,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE()
);
GO

-- Create Admins table
CREATE TABLE admins (
    id int IDENTITY(1,1) PRIMARY KEY,
    username nvarchar(255) NOT NULL UNIQUE,
    password nvarchar(255) NOT NULL,
    role nvarchar(255) NOT NULL DEFAULT 'admin',
    isActive bit NOT NULL DEFAULT 1,
    isOnline bit NOT NULL DEFAULT 0,
    lastLogin datetime2,
    lastSeen datetime2,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE()
);
GO

-- Create Orders table
CREATE TABLE orders (
    id int IDENTITY(1,1) PRIMARY KEY,
    userId int NOT NULL,
    gameId nvarchar(255) NOT NULL,
    gameName nvarchar(255) NOT NULL,
    serviceType nvarchar(255) NOT NULL,
    packageName nvarchar(255) NOT NULL,
    price float NOT NULL,
    status nvarchar(255) NOT NULL DEFAULT 'pending',
    paymentId nvarchar(255),
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
GO

-- Create Transactions table
CREATE TABLE transactions (
    id nvarchar(255) PRIMARY KEY,
    userId int NOT NULL,
    type nvarchar(255) NOT NULL,
    gameId nvarchar(255),
    itemId nvarchar(255),
    serviceId nvarchar(255),
    amount float NOT NULL,
    userGameId nvarchar(255),
    email nvarchar(255),
    description nvarchar(255),
    status nvarchar(255) NOT NULL DEFAULT 'pending',
    adminId int,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (adminId) REFERENCES admins(id) ON DELETE SET NULL
);
GO

-- Create Chat Sessions table
CREATE TABLE chat_sessions (
    id int IDENTITY(1,1) PRIMARY KEY,
    userId int NOT NULL,
    status nvarchar(255) NOT NULL DEFAULT 'active',
    assignedTo int,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES admins(id) ON DELETE SET NULL
);
GO

-- Create Chat Messages table
CREATE TABLE chat_messages (
    id int IDENTITY(1,1) PRIMARY KEY,
    sessionId int NOT NULL,
    content nvarchar(max) NOT NULL,
    isFromUser bit NOT NULL DEFAULT 1,
    adminId int,
    isRead bit NOT NULL DEFAULT 0,
    messageType nvarchar(255) NOT NULL DEFAULT 'text',
    fileUrl nvarchar(255),
    fileName nvarchar(255),
    fileSize int,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (sessionId) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (adminId) REFERENCES admins(id)
);
GO

-- Insert initial games data
INSERT INTO games (id, name, category, icon, isActive) VALUES
('mobile_legends', 'Mobile Legends', 'MOBA', '🎮', 1),
('free_fire', 'Free Fire', 'Battle Royale', '🔥', 1),
('pubg_mobile', 'PUBG Mobile', 'Battle Royale', '🎯', 1),
('genshin_impact', 'Genshin Impact', 'RPG', '⚔️', 1),
('valorant', 'Valorant', 'FPS', '💥', 1),
('cod_mobile', 'Call of Duty Mobile', 'FPS', '🔫', 1),
('among_us', 'Among Us', 'Social Deduction', '👾', 1),
('clash_of_clans', 'Clash of Clans', 'Strategy', '🏰', 1),
('clash_royale', 'Clash Royale', 'Strategy', '👑', 1),
('roblox', 'Roblox', 'Sandbox', '🎲', 1);
GO

-- Insert admin users with their respective passwords
-- Password hashes using bcrypt (cost: 10)
INSERT INTO admins (username, password, role, isActive) VALUES
('Cholif', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 1),    -- Cholif123
('Havizhan', '$2b$10$8K1p/a9Y8/G7c.TZJxr1iOKQx9lDhHXEc7C0l2jGlMqOG.2rKBSf.', 'admin', 1),      -- Havizhan123  
('Fathan', '$2b$10$xJ3eK5k2R8p4L/mVnT1Q2OzHKQ8vG7aJ9R2s5p1M8fLlJ3qW9nO6C', 'admin', 1);       -- Fathan123
GO

-- Insert demo user (password: user123)
-- Password hash for 'user123' using bcrypt
INSERT INTO users (email, username, password, fullName, balance) VALUES
('demo@doaibu.com', 'demo_user', '$2b$10$FuPLtqFkX3Q6uN8/aPhUFe.NYhTl4PvZQ1H2XQJGLaOtLzJFPJ3HW', 'Demo User', 1000000);
GO

-- Create indexes for better performance
CREATE INDEX IX_orders_userId ON orders(userId);
CREATE INDEX IX_orders_status ON orders(status);
CREATE INDEX IX_transactions_userId ON transactions(userId);
CREATE INDEX IX_transactions_status ON transactions(status);
CREATE INDEX IX_chat_sessions_userId ON chat_sessions(userId);
CREATE INDEX IX_chat_sessions_assignedTo ON chat_sessions(assignedTo);
CREATE INDEX IX_chat_messages_sessionId ON chat_messages(sessionId);
GO

-- Create update trigger for updatedAt columns
-- Users table trigger
CREATE TRIGGER tr_users_updatedAt
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE users 
    SET updatedAt = GETDATE()
    FROM users u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

-- Games table trigger
CREATE TRIGGER tr_games_updatedAt
ON games
AFTER UPDATE
AS
BEGIN
    UPDATE games 
    SET updatedAt = GETDATE()
    FROM games g
    INNER JOIN inserted i ON g.id = i.id;
END;
GO

-- Admins table trigger
CREATE TRIGGER tr_admins_updatedAt
ON admins
AFTER UPDATE
AS
BEGIN
    UPDATE admins 
    SET updatedAt = GETDATE()
    FROM admins a
    INNER JOIN inserted i ON a.id = i.id;
END;
GO

-- Orders table trigger
CREATE TRIGGER tr_orders_updatedAt
ON orders
AFTER UPDATE
AS
BEGIN
    UPDATE orders 
    SET updatedAt = GETDATE()
    FROM orders o
    INNER JOIN inserted i ON o.id = i.id;
END;
GO

-- Transactions table trigger
CREATE TRIGGER tr_transactions_updatedAt
ON transactions
AFTER UPDATE
AS
BEGIN
    UPDATE transactions 
    SET updatedAt = GETDATE()
    FROM transactions t
    INNER JOIN inserted i ON t.id = i.id;
END;
GO

-- Chat sessions table trigger
CREATE TRIGGER tr_chat_sessions_updatedAt
ON chat_sessions
AFTER UPDATE
AS
BEGIN
    UPDATE chat_sessions 
    SET updatedAt = GETDATE()
    FROM chat_sessions cs
    INNER JOIN inserted i ON cs.id = i.id;
END;
GO

-- Verify setup
SELECT 'Database setup completed successfully!' as Status;
SELECT 'Tables created:' as Info;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME;

SELECT 'Initial data summary:' as Info;
SELECT 'Games' as TableName, COUNT(*) as RecordCount FROM games
UNION ALL
SELECT 'Admins' as TableName, COUNT(*) as RecordCount FROM admins
UNION ALL
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM users; 