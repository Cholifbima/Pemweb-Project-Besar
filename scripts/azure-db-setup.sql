-- DoaIbu Store Azure SQL Database Setup Script
-- Run this in Azure Query Editor to create/update database schema

-- Drop existing tables if they exist (in correct order to avoid foreign key issues)
IF OBJECT_ID('dbo.chat_messages', 'U') IS NOT NULL DROP TABLE dbo.chat_messages;
IF OBJECT_ID('dbo.chat_sessions', 'U') IS NOT NULL DROP TABLE dbo.chat_sessions;
IF OBJECT_ID('dbo.transactions', 'U') IS NOT NULL DROP TABLE dbo.transactions;
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.games', 'U') IS NOT NULL DROP TABLE dbo.games;
IF OBJECT_ID('dbo.admins', 'U') IS NOT NULL DROP TABLE dbo.admins;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;

-- Create Users table
CREATE TABLE dbo.users (
    id int IDENTITY(1,1) PRIMARY KEY,
    email nvarchar(450) NOT NULL UNIQUE,
    username nvarchar(450) NOT NULL UNIQUE,
    password nvarchar(max) NOT NULL,
    fullName nvarchar(max),
    phoneNumber nvarchar(max),
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE(),
    favoriteGames nvarchar(max),
    totalSpent float NOT NULL DEFAULT 0,
    balance float NOT NULL DEFAULT 1000000
);

-- Create Admins table
CREATE TABLE dbo.admins (
    id int IDENTITY(1,1) PRIMARY KEY,
    username nvarchar(450) NOT NULL UNIQUE,
    password nvarchar(max) NOT NULL,
    role nvarchar(max) NOT NULL DEFAULT 'admin',
    isActive bit NOT NULL DEFAULT 1,
    isOnline bit NOT NULL DEFAULT 0,
    lastLogin datetime2,
    lastSeen datetime2,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE()
);

-- Create Games table
CREATE TABLE dbo.games (
    id nvarchar(450) PRIMARY KEY,
    name nvarchar(max) NOT NULL,
    category nvarchar(max) NOT NULL,
    icon nvarchar(max),
    isActive bit NOT NULL DEFAULT 1,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE()
);

-- Create Orders table
CREATE TABLE dbo.orders (
    id int IDENTITY(1,1) PRIMARY KEY,
    userId int NOT NULL,
    gameId nvarchar(max) NOT NULL,
    gameName nvarchar(max) NOT NULL,
    serviceType nvarchar(max) NOT NULL,
    packageName nvarchar(max) NOT NULL,
    price float NOT NULL,
    status nvarchar(max) NOT NULL DEFAULT 'pending',
    paymentId nvarchar(max),
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES dbo.users(id) ON DELETE CASCADE
);

-- Create Transactions table
CREATE TABLE dbo.transactions (
    id nvarchar(450) PRIMARY KEY,
    userId int NOT NULL,
    type nvarchar(max) NOT NULL,
    gameId nvarchar(max),
    itemId nvarchar(max),
    serviceId nvarchar(max),
    amount float NOT NULL,
    userGameId nvarchar(max),
    email nvarchar(max),
    description nvarchar(max),
    status nvarchar(max) NOT NULL DEFAULT 'pending',
    adminId int,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES dbo.users(id) ON DELETE CASCADE,
    FOREIGN KEY (adminId) REFERENCES dbo.admins(id) ON DELETE SET NULL
);

-- Create Chat Sessions table
CREATE TABLE dbo.chat_sessions (
    id int IDENTITY(1,1) PRIMARY KEY,
    userId int NOT NULL,
    status nvarchar(max) NOT NULL DEFAULT 'active',
    assignedTo int,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    updatedAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES dbo.users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES dbo.admins(id) ON DELETE SET NULL
);

-- Create Chat Messages table
CREATE TABLE dbo.chat_messages (
    id int IDENTITY(1,1) PRIMARY KEY,
    sessionId int NOT NULL,
    content nvarchar(max) NOT NULL,
    isFromUser bit NOT NULL DEFAULT 1,
    adminId int,
    isRead bit NOT NULL DEFAULT 0,
    messageType nvarchar(max) NOT NULL DEFAULT 'text',
    fileUrl nvarchar(max),
    fileName nvarchar(max),
    fileSize int,
    createdAt datetime2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (sessionId) REFERENCES dbo.chat_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (adminId) REFERENCES dbo.admins(id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO dbo.admins (username, password, role, isActive, isOnline, createdAt, updatedAt)
VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 1, 0, GETDATE(), GETDATE()),
('support1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1, 0, GETDATE(), GETDATE()),
('support2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1, 0, GETDATE(), GETDATE());

-- Insert sample games data
INSERT INTO dbo.games (id, name, category, icon, isActive, createdAt, updatedAt)
VALUES 
('mobile-legends', 'Mobile Legends: Bang Bang', 'MOBA', '/images/games/ml.png', 1, GETDATE(), GETDATE()),
('free-fire', 'Free Fire', 'Battle Royale', '/images/games/ff.png', 1, GETDATE(), GETDATE()),
('pubg-mobile', 'PUBG Mobile', 'Battle Royale', '/images/games/pubg.png', 1, GETDATE(), GETDATE()),
('genshin-impact', 'Genshin Impact', 'RPG', '/images/games/genshin.png', 1, GETDATE(), GETDATE()),
('valorant', 'Valorant', 'FPS', '/images/games/valorant.png', 1, GETDATE(), GETDATE()),
('clash-royale', 'Clash Royale', 'Strategy', '/images/games/cr.png', 1, GETDATE(), GETDATE()),
('dota-2', 'Dota 2', 'MOBA', '/images/games/dota2.png', 1, GETDATE(), GETDATE()),
('asphalt-9', 'Asphalt 9: Legends', 'Racing', '/images/games/asphalt9.png', 1, GETDATE(), GETDATE());

-- Create indexes for performance
CREATE INDEX IX_users_email ON dbo.users(email);
CREATE INDEX IX_users_username ON dbo.users(username);
CREATE INDEX IX_orders_userId ON dbo.orders(userId);
CREATE INDEX IX_orders_status ON dbo.orders(status);
CREATE INDEX IX_transactions_userId ON dbo.transactions(userId);
CREATE INDEX IX_transactions_status ON dbo.transactions(status);
CREATE INDEX IX_chat_sessions_userId ON dbo.chat_sessions(userId);
CREATE INDEX IX_chat_sessions_assignedTo ON dbo.chat_sessions(assignedTo);
CREATE INDEX IX_chat_messages_sessionId ON dbo.chat_messages(sessionId);
CREATE INDEX IX_chat_messages_adminId ON dbo.chat_messages(adminId);

-- Create triggers for updatedAt timestamps
-- Users table trigger
IF OBJECT_ID('dbo.tr_users_updatedAt', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_users_updatedAt;
GO
CREATE TRIGGER dbo.tr_users_updatedAt
ON dbo.users
AFTER UPDATE
AS
BEGIN
    UPDATE dbo.users 
    SET updatedAt = GETDATE()
    FROM dbo.users u
    INNER JOIN inserted i ON u.id = i.id
END;
GO

-- Admins table trigger
IF OBJECT_ID('dbo.tr_admins_updatedAt', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_admins_updatedAt;
GO
CREATE TRIGGER dbo.tr_admins_updatedAt
ON dbo.admins
AFTER UPDATE
AS
BEGIN
    UPDATE dbo.admins 
    SET updatedAt = GETDATE()
    FROM dbo.admins a
    INNER JOIN inserted i ON a.id = i.id
END;
GO

-- Games table trigger
IF OBJECT_ID('dbo.tr_games_updatedAt', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_games_updatedAt;
GO
CREATE TRIGGER dbo.tr_games_updatedAt
ON dbo.games
AFTER UPDATE
AS
BEGIN
    UPDATE dbo.games 
    SET updatedAt = GETDATE()
    FROM dbo.games g
    INNER JOIN inserted i ON g.id = i.id
END;
GO

-- Orders table trigger
IF OBJECT_ID('dbo.tr_orders_updatedAt', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_orders_updatedAt;
GO
CREATE TRIGGER dbo.tr_orders_updatedAt
ON dbo.orders
AFTER UPDATE
AS
BEGIN
    UPDATE dbo.orders 
    SET updatedAt = GETDATE()
    FROM dbo.orders o
    INNER JOIN inserted i ON o.id = i.id
END;
GO

-- Transactions table trigger
IF OBJECT_ID('dbo.tr_transactions_updatedAt', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_transactions_updatedAt;
GO
CREATE TRIGGER dbo.tr_transactions_updatedAt
ON dbo.transactions
AFTER UPDATE
AS
BEGIN
    UPDATE dbo.transactions 
    SET updatedAt = GETDATE()
    FROM dbo.transactions t
    INNER JOIN inserted i ON t.id = i.id
END;
GO

-- Chat Sessions table trigger
IF OBJECT_ID('dbo.tr_chat_sessions_updatedAt', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_chat_sessions_updatedAt;
GO
CREATE TRIGGER dbo.tr_chat_sessions_updatedAt
ON dbo.chat_sessions
AFTER UPDATE
AS
BEGIN
    UPDATE dbo.chat_sessions 
    SET updatedAt = GETDATE()
    FROM dbo.chat_sessions cs
    INNER JOIN inserted i ON cs.id = i.id
END;
GO

PRINT 'Database schema setup completed successfully!';
PRINT 'Default admin credentials:';
PRINT 'Username: admin, Password: password';
PRINT 'Username: support1, Password: password';
PRINT 'Username: support2, Password: password'; 