-- ==============================================
-- Fix Azure SQL Database Access - V2 (Handle Conflicts)
-- Run this in Azure Portal → SQL databases → doaibustore-db → Query editor  
-- ==============================================

PRINT '=== Starting database access fix ===';

-- Step 1: Check current state
PRINT 'Step 1: Checking current database users...';
SELECT 
    dp.name AS principal_name,
    dp.type_desc AS type,
    r.name AS role_name,
    dp.create_date
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name IN ('doaibustore-sv-admin', 'dbo')
ORDER BY dp.name;

-- Step 2: Drop existing user if exists (to clean up conflicts)
PRINT 'Step 2: Cleaning up existing user...';
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'doaibustore-sv-admin')
BEGIN
    -- Remove from all roles first
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @roleName NVARCHAR(128);
    
    DECLARE role_cursor CURSOR FOR
    SELECT r.name
    FROM sys.database_principals dp
    JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
    JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
    WHERE dp.name = 'doaibustore-sv-admin';
    
    OPEN role_cursor;
    FETCH NEXT FROM role_cursor INTO @roleName;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql = 'ALTER ROLE [' + @roleName + '] DROP MEMBER [doaibustore-sv-admin];';
        PRINT 'Removing from role: ' + @roleName;
        EXEC sp_executesql @sql;
        FETCH NEXT FROM role_cursor INTO @roleName;
    END;
    
    CLOSE role_cursor;
    DEALLOCATE role_cursor;
    
    -- Now drop the user
    DROP USER [doaibustore-sv-admin];
    PRINT 'Dropped existing user: doaibustore-sv-admin';
END
ELSE
BEGIN
    PRINT 'No existing user found.';
END

-- Step 3: Create user from existing login (login should already exist)
PRINT 'Step 3: Creating user from login...';
BEGIN TRY
    CREATE USER [doaibustore-sv-admin] FROM LOGIN [doaibustore-sv-admin];
    PRINT 'Successfully created user: doaibustore-sv-admin';
END TRY
BEGIN CATCH
    PRINT 'Error creating user: ' + ERROR_MESSAGE();
    
    -- If login doesn't exist, we need to create it at server level
    -- But we can't do that from database level, so we'll note it
    PRINT 'NOTE: If login does not exist, run this at SERVER level (master database):';
    PRINT 'CREATE LOGIN [doaibustore-sv-admin] WITH PASSWORD = ''ganteng#123'';';
    
    -- Try to create user without login (orphaned user) as fallback
    BEGIN TRY
        CREATE USER [doaibustore-sv-admin] WITHOUT LOGIN;
        PRINT 'Created orphaned user as fallback: doaibustore-sv-admin';
    END TRY
    BEGIN CATCH
        PRINT 'Could not create user: ' + ERROR_MESSAGE();
    END CATCH
END CATCH

-- Step 4: Grant permissions if user exists
PRINT 'Step 4: Granting permissions...';
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'doaibustore-sv-admin')
BEGIN
    BEGIN TRY
        ALTER ROLE db_owner ADD MEMBER [doaibustore-sv-admin];
        PRINT 'Granted db_owner role';
    END TRY
    BEGIN CATCH
        PRINT 'Error granting db_owner: ' + ERROR_MESSAGE();
    END CATCH
    
    BEGIN TRY
        GRANT CONNECT TO [doaibustore-sv-admin];
        GRANT CREATE TABLE TO [doaibustore-sv-admin];
        GRANT CREATE PROCEDURE TO [doaibustore-sv-admin];
        GRANT CREATE FUNCTION TO [doaibustore-sv-admin];
        PRINT 'Granted additional permissions';
    END TRY
    BEGIN CATCH
        PRINT 'Error granting additional permissions: ' + ERROR_MESSAGE();
    END CATCH
END
ELSE
BEGIN
    PRINT 'User does not exist, skipping permissions.';
END

-- Step 5: Final verification
PRINT 'Step 5: Final verification...';
SELECT 
    'FINAL STATE' as Status,
    dp.name AS principal_name,
    dp.type_desc AS type,
    r.name AS role_name
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name = 'doaibustore-sv-admin';

PRINT '=== Database access fix completed ===';

-- ==============================================
-- IF THE ABOVE DOESN'T WORK, RUN THIS AT SERVER LEVEL (master database):
-- ==============================================
/*
USE master;
GO

-- Create or alter login at server level
IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'doaibustore-sv-admin')
BEGIN
    CREATE LOGIN [doaibustore-sv-admin] WITH PASSWORD = 'ganteng#123';
    PRINT 'Created server login: doaibustore-sv-admin';
END
ELSE
BEGIN
    ALTER LOGIN [doaibustore-sv-admin] WITH PASSWORD = 'ganteng#123';
    PRINT 'Updated server login password: doaibustore-sv-admin';
END

-- Then switch back to your database and re-run the user creation part
*/ 