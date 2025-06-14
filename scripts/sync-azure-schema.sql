-- Check if balance column exists and add it if not
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

-- Verify the schema
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
ORDER BY ORDINAL_POSITION;

-- Update existing users to have balance if they don't
UPDATE users SET balance = 1000000.0 WHERE balance IS NULL OR balance = 0; 