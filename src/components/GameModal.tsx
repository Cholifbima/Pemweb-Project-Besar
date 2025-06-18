'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Star, TrendingUp, Zap } from 'lucide-react'

interface TopUpItem {
  id: string
  name: string
  amount: number
  price: number
  bonus?: number
  isPopular?: boolean
}

interface BoostService {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: string
  features: string[]
  isPopular?: boolean
}

interface Game {
  id: string
  name: string
  category: string
  description?: string
  publisher?: string
  rating: number
  isPopular: boolean
  hasTopUp: boolean
  hasBoost: boolean
  topUpItems: TopUpItem[]
  boostServices: BoostService[]
  icon?: string
  banner?: string
}

interface GameModalProps {
  game?: Game | null
  isOpen: boolean
  onClose: () => void
  onSave: (gameData: any) => void
}

export default function GameModal({ game, isOpen, onClose, onSave }: GameModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'topup',
    description: '',
    publisher: '',
    rating: 4.5,
    isPopular: false,
    hasTopUp: true,
    hasBoost: false,
    icon: '',
    banner: ''
  })

  const [topUpItems, setTopUpItems] = useState<TopUpItem[]>([])
  const [boostServices, setBoostServices] = useState<BoostService[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)

  useEffect(() => {
    if (game) {
      // Edit mode
      setFormData({
        id: game.id,
        name: game.name,
        category: game.category,
        description: game.description || '',
        publisher: game.publisher || '',
        rating: game.rating,
        isPopular: game.isPopular,
        hasTopUp: game.hasTopUp,
        hasBoost: game.hasBoost,
        icon: game.icon || '',
        banner: game.banner || ''
      })
      setTopUpItems(game.topUpItems || [])
      setBoostServices(game.boostServices || [])
    } else {
      // Create mode
      resetForm()
    }
  }, [game, isOpen])

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      category: 'topup',
      description: '',
      publisher: '',
      rating: 4.5,
      isPopular: false,
      hasTopUp: true,
      hasBoost: false,
      icon: '',
      banner: ''
    })
    setTopUpItems([])
    setBoostServices([])
    setErrors({})
    setIconFile(null)
    setIconPreview(null)
    setUploadingIcon(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-update category based on hasTopUp and hasBoost
    if (field === 'hasTopUp' || field === 'hasBoost') {
      const newFormData = { ...formData, [field]: value }
      if (newFormData.hasTopUp && newFormData.hasBoost) {
        setFormData(prev => ({ ...prev, [field]: value, category: 'both' }))
      } else if (newFormData.hasTopUp) {
        setFormData(prev => ({ ...prev, [field]: value, category: 'topup' }))
      } else if (newFormData.hasBoost) {
        setFormData(prev => ({ ...prev, [field]: value, category: 'boost' }))
      }
    }
  }

  const addTopUpItem = () => {
    const newItem: TopUpItem = {
      id: `topup-${Date.now()}`,
      name: '',
      amount: 0,
      price: 0,
      bonus: 0,
      isPopular: false
    }
    setTopUpItems(prev => [...prev, newItem])
  }

  const updateTopUpItem = (index: number, field: keyof TopUpItem, value: any) => {
    setTopUpItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const removeTopUpItem = (index: number) => {
    setTopUpItems(prev => prev.filter((_, i) => i !== index))
  }

  const addBoostService = () => {
    const newService: BoostService = {
      id: `boost-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      estimatedTime: '',
      features: [''],
      isPopular: false
    }
    setBoostServices(prev => [...prev, newService])
  }

  const updateBoostService = (index: number, field: keyof BoostService, value: any) => {
    setBoostServices(prev => prev.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    ))
  }

  const removeBoostService = (index: number) => {
    setBoostServices(prev => prev.filter((_, i) => i !== index))
  }

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadIcon = async () => {
    if (!iconFile || !formData.id) return

    setUploadingIcon(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', iconFile)
      formDataUpload.append('gameId', formData.id)

      const response = await fetch('/api/dev/games/upload-icon', {
        method: 'POST',
        body: formDataUpload
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({ ...prev, icon: result.iconUrl }))
        setIconFile(null)
        setIconPreview(null)
        alert('Icon berhasil diupload!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Gagal upload icon')
    } finally {
      setUploadingIcon(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.id.trim()) newErrors.id = 'Game ID wajib diisi'
    if (!formData.name.trim()) newErrors.name = 'Nama game wajib diisi'
    if (!formData.publisher.trim()) newErrors.publisher = 'Publisher wajib diisi'
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating harus antara 1-5'

    if (formData.hasTopUp && topUpItems.length === 0) {
      newErrors.topUpItems = 'Minimal 1 item top-up diperlukan'
    }

    if (formData.hasBoost && boostServices.length === 0) {
      newErrors.boostServices = 'Minimal 1 service boost diperlukan'
    }

    // Validate top-up items
    topUpItems.forEach((item, index) => {
      if (!item.name.trim()) newErrors[`topup-${index}-name`] = 'Nama item wajib diisi'
      if (item.amount <= 0) newErrors[`topup-${index}-amount`] = 'Amount harus > 0'
      if (item.price <= 0) newErrors[`topup-${index}-price`] = 'Harga harus > 0'
    })

    // Validate boost services
    boostServices.forEach((service, index) => {
      if (!service.name.trim()) newErrors[`boost-${index}-name`] = 'Nama service wajib diisi'
      if (!service.description.trim()) newErrors[`boost-${index}-description`] = 'Deskripsi wajib diisi'
      if (service.price <= 0) newErrors[`boost-${index}-price`] = 'Harga harus > 0'
      if (!service.estimatedTime.trim()) newErrors[`boost-${index}-time`] = 'Estimasi waktu wajib diisi'
      if (service.features.filter(f => f.trim()).length === 0) {
        newErrors[`boost-${index}-features`] = 'Minimal 1 fitur diperlukan'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const gameData = {
      ...formData,
      topUpItems,
      boostServices
    }

    onSave(gameData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {game ? 'Edit Game' : 'Tambah Game Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game ID *
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="e.g., mobile-legends"
                disabled={!!game}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              {errors.id && <p className="text-red-400 text-xs mt-1">{errors.id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama Game *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Mobile Legends"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Publisher *
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => handleInputChange('publisher', e.target.value)}
                placeholder="e.g., Moonton"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.publisher && <p className="text-red-400 text-xs mt-1">{errors.publisher}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating (1-5) *
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi singkat tentang game..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Icon Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon Game
            </label>
            <div className="space-y-4">
              {/* Current Icon */}
              {formData.icon && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Icon saat ini:</p>
                  <img 
                    src={formData.icon} 
                    alt="Current icon" 
                    className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}

              {/* Upload New Icon */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  {iconPreview ? (
                    <div className="space-y-3">
                      <img 
                        src={iconPreview} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg mx-auto border border-gray-600"
                      />
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={uploadIcon}
                          disabled={uploadingIcon || !formData.id}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                        >
                          {uploadingIcon ? 'Uploading...' : 'Upload Icon'}
                        </button>
                        <button
                          onClick={() => {setIconFile(null); setIconPreview(null)}}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                      {!formData.id && (
                        <p className="text-yellow-400 text-xs">Simpan game terlebih dahulu untuk upload icon</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconFileChange}
                        className="hidden"
                        id="icon-upload"
                      />
                      <label
                        htmlFor="icon-upload"
                        className="cursor-pointer inline-flex flex-col items-center"
                      >
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                          <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-400">Klik untuk upload icon</span>
                        <span className="text-xs text-gray-500">PNG, JPG, WebP (Max 5MB)</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Jenis Layanan *
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.hasTopUp}
                  onChange={(e) => handleInputChange('hasTopUp', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-white">Top Up</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.hasBoost}
                  onChange={(e) => handleInputChange('hasBoost', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-white">Joki/Boost</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-white">Game Popular</span>
                </div>
              </label>
            </div>
          </div>

          {/* Top Up Items */}
          {formData.hasTopUp && (
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  Item Top Up
                </h3>
                <button
                  onClick={addTopUpItem}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Item
                </button>
              </div>

              {topUpItems.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  Belum ada item top-up. Klik "Tambah Item" untuk menambahkan.
                </p>
              )}

              <div className="space-y-4">
                {topUpItems.map((item, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white font-medium">Item #{index + 1}</h4>
                      <button
                        onClick={() => removeTopUpItem(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Nama Item *</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateTopUpItem(index, 'name', e.target.value)}
                          placeholder="e.g., 86 Diamonds"
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        {errors[`topup-${index}-name`] && (
                          <p className="text-red-400 text-xs mt-1">{errors[`topup-${index}-name`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Amount *</label>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateTopUpItem(index, 'amount', parseInt(e.target.value) || 0)}
                          placeholder="86"
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        {errors[`topup-${index}-amount`] && (
                          <p className="text-red-400 text-xs mt-1">{errors[`topup-${index}-amount`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Harga (IDR) *</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateTopUpItem(index, 'price', parseInt(e.target.value) || 0)}
                          placeholder="20000"
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        {errors[`topup-${index}-price`] && (
                          <p className="text-red-400 text-xs mt-1">{errors[`topup-${index}-price`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Bonus</label>
                        <input
                          type="number"
                          value={item.bonus || 0}
                          onChange={(e) => updateTopUpItem(index, 'bonus', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={item.isPopular || false}
                          onChange={(e) => updateTopUpItem(index, 'isPopular', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">Item Popular</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {errors.topUpItems && (
                <p className="text-red-400 text-sm mt-2">{errors.topUpItems}</p>
              )}
            </div>
          )}

          {/* Boost Services */}
          {formData.hasBoost && (
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                  Layanan Joki/Boost
                </h3>
                <button
                  onClick={addBoostService}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Service
                </button>
              </div>

              {boostServices.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  Belum ada layanan boost. Klik "Tambah Service" untuk menambahkan.
                </p>
              )}

              <div className="space-y-6">
                {boostServices.map((service, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white font-medium">Service #{index + 1}</h4>
                      <button
                        onClick={() => setBoostServices(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Nama Service *</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateBoostService(index, 'name', e.target.value)}
                          placeholder="e.g., Rank Boost"
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        {errors[`boost-${index}-name`] && (
                          <p className="text-red-400 text-xs mt-1">{errors[`boost-${index}-name`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Harga (IDR) *</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => updateBoostService(index, 'price', parseInt(e.target.value) || 0)}
                          placeholder="150000"
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        {errors[`boost-${index}-price`] && (
                          <p className="text-red-400 text-xs mt-1">{errors[`boost-${index}-price`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Estimasi Waktu *</label>
                        <input
                          type="text"
                          value={service.estimatedTime}
                          onChange={(e) => updateBoostService(index, 'estimatedTime', e.target.value)}
                          placeholder="3-7 hari"
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        {errors[`boost-${index}-time`] && (
                          <p className="text-red-400 text-xs mt-1">{errors[`boost-${index}-time`]}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs text-gray-400 mb-1">Deskripsi *</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateBoostService(index, 'description', e.target.value)}
                        placeholder="Deskripsi detail tentang layanan ini..."
                        rows={2}
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                      />
                      {errors[`boost-${index}-description`] && (
                        <p className="text-red-400 text-xs mt-1">{errors[`boost-${index}-description`]}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs text-gray-400">Fitur-fitur *</label>
                        <button
                          onClick={() => setBoostServices(prev => prev.map((s, i) => 
                            i === index ? { ...s, features: [...s.features, ''] } : s
                          ))}
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Tambah Fitur
                        </button>
                      </div>

                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => setBoostServices(prev => prev.map((s, i) => 
                                i === index ? {
                                  ...s,
                                  features: s.features.map((f, j) => j === featureIndex ? e.target.value : f)
                                } : s
                              ))}
                              placeholder="e.g., Win Rate 90%+"
                              className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-blue-500"
                            />
                            {service.features.length > 1 && (
                              <button
                                onClick={(e) => setBoostServices(prev => prev.map((s, i) => 
                                  i === index ? {
                                    ...s,
                                    features: s.features.filter((_, j) => j !== featureIndex)
                                  } : s
                                ))}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {errors[`boost-${index}-features`] && (
                        <p className="text-red-400 text-xs mt-1">{errors[`boost-${index}-features`]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {errors.boostServices && (
                <p className="text-red-400 text-sm mt-2">{errors.boostServices}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {game ? 'Update Game' : 'Simpan Game'}
          </button>
        </div>
      </div>
    </div>
  )
} 