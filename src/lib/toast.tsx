import toast from 'react-hot-toast'

// Track active toasts to prevent spam
let activeToasts = new Set<string>()

// Custom toast component with close button
const ToastWithClose = ({ 
  message, 
  toastId,
  type = 'default'
}: { 
  message: string
  toastId: string
  type?: 'success' | 'error' | 'loading' | 'default'
}) => {
  const handleClose = () => {
    toast.dismiss(toastId)
    activeToasts.delete(message)
  }

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      paddingRight: '8px'
    }}>
      <div style={{ 
        paddingRight: '24px',
        lineHeight: '1.4'
      }}>
        {message}
      </div>
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          opacity: 0.8,
          padding: '0',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          lineHeight: '1',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.8'
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        title="Tutup notifikasi"
      >
        ×
      </button>
    </div>
  )
}

// Anti-spam toast functions
export const showToast = {
  success: (message: string) => {
    toast.dismiss()
    activeToasts.clear()
    
    if (activeToasts.has(message)) return
    
    activeToasts.add(message)
    const toastId = toast.success(
      (t) => <ToastWithClose message={message} toastId={t.id} type="success" />,
      {
        id: message,
        duration: 3000,
      }
    )
    
    setTimeout(() => {
      activeToasts.delete(message)
    }, 3000)
    
    return toastId
  },

  error: (message: string) => {
    toast.dismiss()
    activeToasts.clear()
    
    if (activeToasts.has(message)) return
    
    activeToasts.add(message)
    const toastId = toast.error(
      (t) => <ToastWithClose message={message} toastId={t.id} type="error" />,
      {
        id: message,
        duration: 5000,
      }
    )
    
    setTimeout(() => {
      activeToasts.delete(message)
    }, 5000)
    
    return toastId
  },

  loading: (message: string) => {
    toast.dismiss()
    activeToasts.clear()
    
    if (activeToasts.has(message)) return
    
    activeToasts.add(message)
    const toastId = toast.loading(
      (t) => <ToastWithClose message={message} toastId={t.id} type="loading" />,
      {
        id: message,
      }
    )
    
    return toastId
  },

  default: (message: string) => {
    toast.dismiss()
    activeToasts.clear()
    
    if (activeToasts.has(message)) return
    
    activeToasts.add(message)
    const toastId = toast(
      (t) => <ToastWithClose message={message} toastId={t.id} type="default" />,
      {
        id: message,
        duration: 4000,
      }
    )
    
    setTimeout(() => {
      activeToasts.delete(message)
    }, 4000)
    
    return toastId
  },

  dismiss: () => {
    toast.dismiss()
    activeToasts.clear()
  }
} 