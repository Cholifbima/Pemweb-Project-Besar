'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 80, // Posisi di bawah navigation bar
      }}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(147, 51, 234, 0.4)',
          borderRadius: '16px',
          padding: '16px 24px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          minWidth: '320px',
          textAlign: 'center',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#22c55e',
            boxShadow: '0 20px 25px -5px rgba(34, 197, 94, 0.2), 0 10px 10px -5px rgba(34, 197, 94, 0.1)',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: 'rgba(34, 197, 94, 0.1)',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1)',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: 'rgba(239, 68, 68, 0.1)',
          },
        },
        loading: {
          style: {
            background: 'rgba(147, 51, 234, 0.15)',
            border: '1px solid rgba(147, 51, 234, 0.4)',
            color: '#9333ea',
            boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.2), 0 10px 10px -5px rgba(147, 51, 234, 0.1)',
          },
          iconTheme: {
            primary: '#9333ea',
            secondary: 'rgba(147, 51, 234, 0.1)',
          },
        },
      }}
    />
  )
} 