import { BlobServiceClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'

// Azure Blob Storage Configuration
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!

// Create Blob Service Client
export const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)

// Container names
export const CONTAINERS = {
  CHAT_FILES: 'chat-files',
  PROGRESS_FILES: 'progress-files'
}

// Initialize containers
export async function initializeContainers() {
  try {
    for (const containerName of Object.values(CONTAINERS)) {
      const containerClient = blobServiceClient.getContainerClient(containerName)
      await containerClient.createIfNotExists({
        access: 'blob'
      })
    }
    console.log('✅ Azure Blob containers initialized')
  } catch (error) {
    console.error('❌ Error initializing containers:', error)
  }
}

// Upload file to blob storage
export async function uploadFileToBlob(
  file: Buffer, 
  fileName: string, 
  containerName: string = CONTAINERS.CHAT_FILES,
  contentType: string = 'application/octet-stream'
): Promise<string> {
  try {
    const fileId = uuidv4()
    const blobName = `${fileId}-${fileName}`
    
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: contentType
      }
    })
    
    return blockBlobClient.url
  } catch (error) {
    console.error('❌ Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

// Simple SAS URL generation (basic version without complex imports)
export function generateSASUrl(blobUrl: string, permissions: string = 'r'): string {
  try {
    // For now, return the original URL
    // In production, you would implement proper SAS token generation
    return blobUrl
  } catch (error) {
    console.error('❌ Error generating SAS URL:', error)
    return blobUrl
  }
}

// Azure SignalR Configuration
export const SIGNALR_CONFIG = {
  connectionString: process.env.AZURE_SIGNALR_CONNECTION_STRING!,
  hubName: 'chatHub'
}

// Get file type icon
export function getFileTypeIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '🖼️'
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'xls':
    case 'xlsx':
      return '📊'
    case 'zip':
    case 'rar':
    case '7z':
      return '📦'
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎥'
    case 'mp3':
    case 'wav':
    case 'flac':
      return '🎵'
    default:
      return '📎'
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 