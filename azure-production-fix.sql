-- Azure Production Database Fix Script
-- Run these commands one by one in Azure Query Editor

-- Step 1: Check if balance column exists
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'balance';

-- Step 2: Add balance column if it doesn't exist
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'balance'
)
BEGIN
    ALTER TABLE users ADD balance FLOAT NOT NULL DEFAULT 1000000.0;
    PRINT 'Balance column added successfully';
END
ELSE
BEGIN
    PRINT 'Balance column already exists';
END

-- Step 3: Update existing users to have demo balance
UPDATE users 
SET balance = 1000000.0 
WHERE balance IS NULL OR balance = 0;

-- Step 4: Verify the changes
SELECT id, username, email, balance, createdAt 
FROM users 
ORDER BY createdAt DESC; 