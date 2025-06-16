-- ==============================================
-- Fix Azure SQL Database Access for DoaIbu Store
-- Run this in Azure Portal → SQL databases → Query editor
-- ==============================================

-- Step 1: Check if user exists and current permissions
SELECT 
    dp.name AS principal_name,
    dp.type_desc AS type,
    r.name AS role_name
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name = 'doaibustore-sv-admin';

-- Step 2: Drop existing user if exists (to recreate fresh)
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'doaibustore-sv-admin')
BEGIN
    DROP USER [doaibustore-sv-admin];
    PRINT 'Dropped existing user: doaibustore-sv-admin';
END

-- Step 3: Check if login exists at server level
-- (This needs to be run at master database level, but we'll note it)
-- USE master;
-- SELECT name FROM sys.sql_logins WHERE name = 'doaibustore-sv-admin';

-- Step 4: Create login at server level (run this in master database)
/*
USE master;
IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'doaibustore-sv-admin')
BEGIN
    CREATE LOGIN [doaibustore-sv-admin] WITH PASSWORD = 'ganteng#123';
    PRINT 'Created login: doaibustore-sv-admin';
END
ELSE
BEGIN
    ALTER LOGIN [doaibustore-sv-admin] WITH PASSWORD = 'ganteng#123';
    PRINT 'Updated password for login: doaibustore-sv-admin';
END
*/

-- Step 5: Create user in current database and grant permissions
-- (Run this in your application database: doaibustore-db)
CREATE USER [doaibustore-sv-admin] FROM LOGIN [doaibustore-sv-admin];
PRINT 'Created user: doaibustore-sv-admin';

-- Step 6: Grant db_owner permissions
ALTER ROLE db_owner ADD MEMBER [doaibustore-sv-admin];
PRINT 'Granted db_owner role to: doaibustore-sv-admin';

-- Step 7: Grant additional permissions if needed
GRANT CONNECT TO [doaibustore-sv-admin];
GRANT CREATE TABLE TO [doaibustore-sv-admin];
GRANT CREATE PROCEDURE TO [doaibustore-sv-admin];
GRANT CREATE FUNCTION TO [doaibustore-sv-admin];
PRINT 'Granted additional permissions to: doaibustore-sv-admin';

-- Step 8: Verify permissions
SELECT 
    dp.name AS principal_name,
    dp.type_desc AS type,
    r.name AS role_name
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name = 'doaibustore-sv-admin';

PRINT 'User setup completed successfully!';

-- ==============================================
-- INSTRUCTIONS:
-- ==============================================
-- 1. Open Azure Portal → SQL databases → doaibustore-db → Query editor
-- 2. Login with server admin account
-- 3. First, run the master database commands (Step 4) by switching to master database
-- 4. Then switch back to doaibustore-db and run Steps 1,2,5,6,7,8
-- 5. Test connection from application
-- ============================================== 