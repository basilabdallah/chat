'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import EmojiPicker from 'emoji-picker-react'
import { AnimatePresence } from 'framer-motion'
import VoiceRecorder from './VoiceRecorder'
import FileUploader from './FileUploader'
import toast from 'react-hot-toast'

export default function MessageInput() {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [showFileUploader, setShowFileUploader] = useState(false)
  const { sendMessage, setTypingIndicator, clearTypingIndicator, currentRoom } = useChat()
  const { user } = useAuthStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      await sendMessage(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }

    // Typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    setTypingIndicator()
    
    typingTimeoutRef.current = setTimeout(() => {
      clearTypingIndicator()
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      clearTypingIndicator()
    }
  }, [])

  const handleVoiceRecordingComplete = async (audioBlob: Blob, duration: number) => {
    if (!user || !currentRoom) return

    try {
      // Upload audio file
      const fileName = `${user.id}/${Date.now()}.webm`
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, audioBlob)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName)

      // Send as audio message
      await supabase
        .from('messages')
        .insert({
          room_id: currentRoom.id,
          user_id: user.id,
          content: 'Voice message',
          type: 'audio',
          file_url: publicUrl,
          file_name: 'voice-message.webm',
          file_size: audioBlob.size,
        })

      setShowVoiceRecorder(false)
      toast.success('Voice message sent!')
    } catch (error: any) {
      console.error('Error sending voice message:', error)
      toast.error('Failed to send voice message')
    }
  }

  const handleFileUploaded = async (fileUrl: string, fileName: string, fileSize: number, fileType: string) => {
    if (!user || !currentRoom) return

    try {
      await supabase
        .from('messages')
        .insert({
          room_id: currentRoom.id,
          user_id: user.id,
          content: fileName,
          type: fileType as any,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
        })

      setShowFileUploader(false)
    } catch (error: any) {
      console.error('Error sending file:', error)
      toast.error('Failed to send file')
    }
  }

  return (
    <div className="border-t border-neutral-200 p-4 bg-white">
      {/* Voice Recorder */}
      <AnimatePresence>
        {showVoiceRecorder && (
          <div className="mb-4">
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecordingComplete}
              onCancel={() => setShowVoiceRecorder(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* File Uploader Modal */}
      <AnimatePresence>
        {showFileUploader && (
          <FileUploader
            onFileUploaded={handleFileUploaded}
            onCancel={() => setShowFileUploader(false)}
          />
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex gap-2">
          {/* Emoji Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="btn-icon text-neutral-600"
              title="Add emoji"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 left-0 z-10">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setMessage((prev) => prev + emojiData.emoji)
                    setShowEmojiPicker(false)
                    textareaRef.current?.focus()
                  }}
                />
              </div>
            )}
          </div>

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => setShowFileUploader(true)}
            className="btn-icon text-neutral-600"
            title="Attach file"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Voice Message Button */}
          <button
            type="button"
            onClick={() => setShowVoiceRecorder(true)}
            className="btn-icon text-neutral-600"
            title="Record voice message"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full px-4 py-3 pr-12 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 resize-none transition-smooth"
            rows={1}
            style={{ maxHeight: '150px' }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex-shrink-0"
          title="Send message"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      <p className="text-xs text-neutral-500 mt-2">
        Press <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded">Enter</kbd> to send, 
        <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded ml-1">Shift + Enter</kbd> for new line
      </p>
    </div>
  )
}
