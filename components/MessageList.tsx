'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/store/useAuthStore'
import { MessageWithProfile } from '@/types'
import { formatDistanceToNow, format } from 'date-fns'
import Image from 'next/image'
import EmojiPicker from 'emoji-picker-react'

export default function MessageList() {
  const { messages, typingUsers, addReaction, removeReaction, editMessage, deleteMessage } = useChat()
  const { user } = useAuthStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg">No messages yet</p>
          <p className="text-sm text-neutral-400 mt-1">Start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.user_id === user?.id}
          onAddReaction={addReaction}
          onRemoveReaction={removeReaction}
          onEdit={editMessage}
          onDelete={deleteMessage}
        />
      ))}

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <div className="flex gap-1">
            <div className="typing-dot w-2 h-2 bg-neutral-400 rounded-full" />
            <div className="typing-dot w-2 h-2 bg-neutral-400 rounded-full" />
            <div className="typing-dot w-2 h-2 bg-neutral-400 rounded-full" />
          </div>
          <span>
            {typingUsers.map((u) => u.display_name || u.username).join(', ')}{' '}
            {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

interface MessageBubbleProps {
  message: MessageWithProfile
  isOwn: boolean
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
}

function MessageBubble({ message, isOwn, onAddReaction, onRemoveReaction, onEdit, onDelete }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const { user } = useAuthStore()

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent)
      setIsEditing(false)
    }
  }

  const handleReactionClick = (emoji: string) => {
    const userReaction = message.reactions?.find(
      (r) => r.user_id === user?.id && r.emoji === emoji
    )
    if (userReaction) {
      onRemoveReaction(message.id, emoji)
    } else {
      onAddReaction(message.id, emoji)
    }
  }

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = []
    }
    acc[reaction.emoji].push(reaction)
    return acc
  }, {} as Record<string, typeof message.reactions>)

  return (
    <div
      className={`flex gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isOwn && (
        <div className="flex-shrink-0">
          {message.profile?.avatar_url ? (
            <Image
              src={message.profile.avatar_url}
              alt={message.profile.username}
              width={36}
              height={36}
              className="rounded-xl"
            />
          ) : (
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {message.profile?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`flex-1 max-w-xl ${isOwn ? 'flex flex-col items-end' : ''}`}>
        {/* Message Header */}
        {!isOwn && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-sm text-neutral-900">
              {message.profile?.display_name || message.profile?.username}
            </span>
            <span className="text-xs text-neutral-500">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Message Content */}
        <div className="relative">
          {isEditing ? (
            <div className="bg-white rounded-2xl p-3 border border-neutral-300">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full resize-none border-0 focus:ring-0 text-sm"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm rounded-lg hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`message-bubble rounded-2xl px-4 py-2 ${
                isOwn
                  ? 'bg-primary-500 text-white'
                  : message.is_deleted
                  ? 'bg-neutral-100 text-neutral-500 italic'
                  : 'bg-white border border-neutral-200 text-neutral-900'
              }`}
            >
              {message.is_deleted ? (
                <span className="text-sm">{message.content}</span>
              ) : (
                <>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  {message.is_edited && (
                    <span className={`text-xs ${isOwn ? 'text-primary-200' : 'text-neutral-500'} ml-2`}>
                      (edited)
                    </span>
                  )}
                </>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && !isEditing && !message.is_deleted && (
            <div
              className={`absolute top-0 flex gap-1 ${
                isOwn ? 'right-full mr-2' : 'left-full ml-2'
              } bg-white rounded-xl border border-neutral-200 p-1 opacity-0 group-hover:opacity-100 transition-smooth`}
            >
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="btn-icon text-neutral-600"
                title="Add reaction"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {isOwn && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-icon text-neutral-600"
                    title="Edit message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(message.id)}
                    className="btn-icon text-error-600"
                    title="Delete message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute top-full mt-2 z-10">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  onAddReaction(message.id, emojiData.emoji)
                  setShowEmojiPicker(false)
                }}
              />
            </div>
          )}
        </div>

        {/* Reactions */}
        {groupedReactions && Object.keys(groupedReactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(groupedReactions).map(([emoji, reactions]) => {
              const hasUserReacted = reactions.some((r) => r.user_id === user?.id)
              return (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-smooth ${
                    hasUserReacted
                      ? 'bg-primary-100 border border-primary-300'
                      : 'bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  <span>{emoji}</span>
                  <span className="text-xs text-neutral-600">{reactions.length}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Timestamp for own messages */}
        {isOwn && (
          <span className="text-xs text-neutral-500 mt-1">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  )
}
