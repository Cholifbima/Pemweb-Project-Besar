-- Simple Database Access Fix
-- Run this in Azure Portal → master database first

USE master;

-- Drop and recreate login
IF EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'doaibustore-sv-admin')
BEGIN
    DROP LOGIN [doaibustore-sv-admin];
    PRINT 'Dropped existing login';
END

CREATE LOGIN [doaibustore-sv-admin] WITH PASSWORD = 'ganteng#123';
PRINT 'Created login: doaibustore-sv-admin';

-- Now switch to your database: doaibustore-db
-- And run the following:

USE [doaibustore-db];

-- Drop existing user if any
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'doaibustore-sv-admin')
BEGIN
    DROP USER [doaibustore-sv-admin];
    PRINT 'Dropped existing user';
END

-- Create user from login
CREATE USER [doaibustore-sv-admin] FROM LOGIN [doaibustore-sv-admin];
PRINT 'Created user: doaibustore-sv-admin';

-- Grant permissions
ALTER ROLE db_owner ADD MEMBER [doaibustore-sv-admin];
GRANT CONNECT TO [doaibustore-sv-admin];
PRINT 'Granted permissions';

-- Verify
SELECT 
    dp.name AS principal_name,
    dp.type_desc AS type,
    r.name AS role_name
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name = 'doaibustore-sv-admin';

PRINT 'Setup completed!'; 