-- Setup Azure SQL Database for DoaIbu Store
-- Run this script in Azure SQL Database to create the required tables

-- Create users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE [users] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [email] NVARCHAR(255) NOT NULL UNIQUE,
        [username] NVARCHAR(255) NOT NULL UNIQUE,
        [password] NVARCHAR(255) NOT NULL,
        [fullName] NVARCHAR(255) NULL,
        [phoneNumber] NVARCHAR(255) NULL,
        [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [favoriteGames] NVARCHAR(MAX) NULL,
        [totalSpent] FLOAT NOT NULL DEFAULT 0,
        [balance] FLOAT NOT NULL DEFAULT 1000000
    );
    PRINT 'Table [users] created successfully';
END
ELSE
BEGIN
    PRINT 'Table [users] already exists';
END

-- Create orders table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='orders' AND xtype='U')
BEGIN
    CREATE TABLE [orders] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [userId] INT NOT NULL,
        [gameId] NVARCHAR(255) NOT NULL,
        [gameName] NVARCHAR(255) NOT NULL,
        [serviceType] NVARCHAR(255) NOT NULL,
        [packageName] NVARCHAR(255) NOT NULL,
        [price] FLOAT NOT NULL,
        [status] NVARCHAR(255) NOT NULL DEFAULT 'pending',
        [paymentId] NVARCHAR(255) NULL,
        [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY ([userId]) REFERENCES [users]([id])
    );
    PRINT 'Table [orders] created successfully';
END
ELSE
BEGIN
    PRINT 'Table [orders] already exists';
END

-- Create transactions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='transactions' AND xtype='U')
BEGIN
    CREATE TABLE [transactions] (
        [id] NVARCHAR(255) PRIMARY KEY,
        [userId] INT NOT NULL,
        [type] NVARCHAR(255) NOT NULL,
        [gameId] NVARCHAR(255) NOT NULL,
        [itemId] NVARCHAR(255) NULL,
        [serviceId] NVARCHAR(255) NULL,
        [amount] FLOAT NOT NULL,
        [userGameId] NVARCHAR(255) NOT NULL,
        [email] NVARCHAR(255) NOT NULL,
        [status] NVARCHAR(255) NOT NULL DEFAULT 'pending',
        [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY ([userId]) REFERENCES [users]([id])
    );
    PRINT 'Table [transactions] created successfully';
END
ELSE
BEGIN
    PRINT 'Table [transactions] already exists';
END

-- Create games table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='games' AND xtype='U')
BEGIN
    CREATE TABLE [games] (
        [id] NVARCHAR(255) PRIMARY KEY,
        [name] NVARCHAR(255) NOT NULL,
        [category] NVARCHAR(255) NOT NULL,
        [icon] NVARCHAR(255) NULL,
        [isActive] BIT NOT NULL DEFAULT 1,
        [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
    PRINT 'Table [games] created successfully';
END
ELSE
BEGIN
    PRINT 'Table [games] already exists';
END

-- Add balance column to users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'balance')
BEGIN
    ALTER TABLE [users] ADD [balance] FLOAT NOT NULL DEFAULT 1000000;
    PRINT 'Column [balance] added to [users] table';
END
ELSE
BEGIN
    PRINT 'Column [balance] already exists in [users] table';
END

-- Create test user if not exists
IF NOT EXISTS (SELECT * FROM [users] WHERE [email] = 'cholifnewbima@gmail.com')
BEGIN
    INSERT INTO [users] ([email], [username], [password], [fullName], [phoneNumber], [balance])
    VALUES (
        'cholifnewbima@gmail.com',
        'Bimaa',
        '$2b$10$example.hash.here', -- You need to hash this properly
        'Bika',
        '11691',
        1000000
    );
    PRINT 'Test user created successfully';
END
ELSE
BEGIN
    PRINT 'Test user already exists';
END

PRINT 'Azure SQL Database setup completed successfully!'; 