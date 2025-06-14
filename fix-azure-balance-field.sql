-- Fix Azure SQL Database - Add balance field to users table
-- Run this script in Azure SQL Database

-- Check if balance column exists
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'balance'
)
BEGIN
    -- Add balance column with default value 1000000 (1 juta rupiah)
    ALTER TABLE users ADD balance FLOAT NOT NULL DEFAULT 1000000;
    PRINT 'Balance column added successfully';
END
ELSE
BEGIN
    PRINT 'Balance column already exists';
END

-- Update existing users to have balance if they don't have it
UPDATE users 
SET balance = 1000000 
WHERE balance IS NULL OR balance = 0;

-- Verify the changes
SELECT TOP 5 id, username, email, balance, createdAt 
FROM users 
ORDER BY createdAt DESC;

PRINT 'Balance field fix completed successfully!'; 