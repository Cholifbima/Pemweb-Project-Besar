#!/bin/bash

echo "Starting DoaIbu Store application..."

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Start the application
echo "Starting application..."
npm start 