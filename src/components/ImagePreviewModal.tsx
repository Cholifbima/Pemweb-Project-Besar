import React from 'react'

interface ImagePreviewModalProps {
  url: string
  onClose: () => void
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center" onClick={onClose}>
      <div className="max-w-full max-h-full p-4" onClick={(e) => e.stopPropagation()}>
        <img src={url} alt="Preview" className="object-contain max-h-[90vh] max-w-[90vw] rounded-lg" />
      </div>
    </div>
  )
}

export default ImagePreviewModal 