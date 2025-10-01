'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import toast from 'react-hot-toast'

interface FileUploaderProps {
  onFileUploaded: (fileUrl: string, fileName: string, fileSize: number, fileType: string) => void
  onCancel: () => void
}

export default function FileUploader({ onFileUploaded, onCancel }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB')
      return
    }

    setSelectedFile(file)
    
    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadFile = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, selectedFile)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName)

      // Determine file type
      let fileType = 'file'
      if (selectedFile.type.startsWith('image/')) fileType = 'image'
      else if (selectedFile.type.startsWith('audio/')) fileType = 'audio'
      else if (selectedFile.type.startsWith('video/')) fileType = 'video'

      onFileUploaded(publicUrl, selectedFile.name, selectedFile.size, fileType)
      toast.success('File uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
    if (file.type.startsWith('audio/')) {
      return (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    }
    if (file.type.startsWith('video/')) {
      return (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    }
    return (
      <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-neutral-900 mb-4">Upload File</h3>

        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-smooth ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
            }`}
          >
            <svg
              className="w-16 h-16 mx-auto mb-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg font-medium text-neutral-900 mb-2">
              {isDragging ? 'Drop file here' : 'Drag & drop file here'}
            </p>
            <p className="text-sm text-neutral-500 mb-4">or click to browse</p>
            <p className="text-xs text-neutral-400">Max file size: 50MB</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0])
                }
              }}
            />
          </div>
        ) : (
          <div>
            {/* File Preview */}
            <div className="bg-neutral-50 rounded-xl p-4 mb-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="flex justify-center py-4">
                  {getFileIcon(selectedFile)}
                </div>
              )}
              
              <div className="text-center">
                <p className="font-medium text-neutral-900 truncate">{selectedFile.name}</p>
                <p className="text-sm text-neutral-500 mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-neutral-600 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPreview(null)
                }}
                disabled={isUploading}
                className="flex-1 btn-secondary disabled:opacity-50"
              >
                Change File
              </button>
              <button
                onClick={uploadFile}
                disabled={isUploading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload & Send'}
              </button>
            </div>
          </div>
        )}

        {!selectedFile && (
          <button
            onClick={onCancel}
            className="w-full mt-4 py-2 text-neutral-600 hover:text-neutral-900 transition-smooth"
          >
            Cancel
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}
