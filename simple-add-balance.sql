-- SIMPLE SCRIPT: Add balance column to users table
-- Run each command one by one in Azure SQL Database Query Editor

-- 1. First, check current table structure
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users'
ORDER BY ORDINAL_POSITION;

-- 2. Add balance column (run this if balance column doesn't exist)
ALTER TABLE users ADD balance FLOAT;

-- 3. Set default value for existing users
UPDATE users SET balance = 1000000 WHERE balance IS NULL;

-- 4. Set default constraint for new users
ALTER TABLE users ADD CONSTRAINT DF_users_balance DEFAULT 1000000 FOR balance;

-- 5. Verify the result
SELECT id, username, email, balance FROM users; 