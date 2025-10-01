import { useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useChatStore } from '@/store/useChatStore'
import { useAuthStore } from '@/store/useAuthStore'
import { MessageWithProfile, RoomWithDetails, Profile } from '@/types'
import toast from 'react-hot-toast'

export function useChat() {
  const { user } = useAuthStore()
  const {
    rooms,
    currentRoom,
    messages,
    typingUsers,
    setRooms,
    setCurrentRoom,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    addTypingUser,
    removeTypingUser,
  } = useChatStore()

  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('room_members')
        .select(`
          room_id,
          rooms (
            *,
            room_members (
              *,
              profile:profiles (*)
            )
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const roomsData = data
        .map((rm) => rm.rooms)
        .filter(Boolean) as any[]

      setRooms(roomsData)
    } catch (error: any) {
      console.error('Error fetching rooms:', error)
      toast.error('Failed to load rooms')
    }
  }, [user, setRooms])

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profile:profiles (*),
          reactions (
            *,
            profile:profiles (*)
          ),
          reply_to_message:messages!messages_reply_to_fkey (
            *,
            profile:profiles (*)
          )
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const messagesData = (data || []).map((msg) => ({
        ...msg,
        reply_to_message: msg.reply_to_message || undefined,
      })) as MessageWithProfile[]

      setMessages(messagesData)
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    }
  }, [setMessages])

  // Send message
  const sendMessage = async (content: string, replyTo?: string) => {
    if (!user || !currentRoom || !content.trim()) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: currentRoom.id,
          user_id: user.id,
          content: content.trim(),
          reply_to: replyTo || null,
        })
        .select(`
          *,
          profile:profiles (*),
          reactions (
            *,
            profile:profiles (*)
          )
        `)
        .single()

      if (error) throw error

      // Clear typing indicator
      await clearTypingIndicator()
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  // Edit message
  const editMessage = async (messageId: string, newContent: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          content: newContent,
          is_edited: true,
        })
        .eq('id', messageId)
        .eq('user_id', user.id)

      if (error) throw error
      toast.success('Message updated')
    } catch (error: any) {
      console.error('Error editing message:', error)
      toast.error('Failed to edit message')
    }
  }

  // Delete message
  const deleteMessageAction = async (messageId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          is_deleted: true,
          content: 'Message deleted',
        })
        .eq('id', messageId)
        .eq('user_id', user.id)

      if (error) throw error
      toast.success('Message deleted')
    } catch (error: any) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  // Add reaction
  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })

      if (error) throw error
    } catch (error: any) {
      console.error('Error adding reaction:', error)
      toast.error('Failed to add reaction')
    }
  }

  // Remove reaction
  const removeReaction = async (messageId: string, emoji: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)

      if (error) throw error
    } catch (error: any) {
      console.error('Error removing reaction:', error)
    }
  }

  // Set typing indicator
  const setTypingIndicator = async () => {
    if (!user || !currentRoom) return

    try {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Upsert typing indicator
      await supabase
        .from('typing_indicators')
        .upsert({
          room_id: currentRoom.id,
          user_id: user.id,
        })

      // Auto-clear after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        clearTypingIndicator()
      }, 3000)
    } catch (error: any) {
      console.error('Error setting typing indicator:', error)
    }
  }

  // Clear typing indicator
  const clearTypingIndicator = async () => {
    if (!user || !currentRoom) return

    try {
      await supabase
        .from('typing_indicators')
        .delete()
        .eq('room_id', currentRoom.id)
        .eq('user_id', user.id)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    } catch (error: any) {
      console.error('Error clearing typing indicator:', error)
    }
  }

  // Create room
  const createRoom = async (name: string, description: string, isPrivate: boolean = false) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name,
          description,
          is_private: isPrivate,
          created_by: user.id,
          type: 'group',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Room created successfully')
      await fetchRooms()
      return data
    } catch (error: any) {
      console.error('Error creating room:', error)
      toast.error('Failed to create room')
      throw error
    }
  }

  // Join room
  const joinRoom = async (roomId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('room_members')
        .insert({
          room_id: roomId,
          user_id: user.id,
          role: 'member',
        })

      if (error) throw error

      toast.success('Joined room successfully')
      await fetchRooms()
    } catch (error: any) {
      console.error('Error joining room:', error)
      toast.error('Failed to join room')
    }
  }

  // Leave room
  const leaveRoom = async (roomId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('room_members')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Left room successfully')
      await fetchRooms()
      if (currentRoom?.id === roomId) {
        setCurrentRoom(null)
      }
    } catch (error: any) {
      console.error('Error leaving room:', error)
      toast.error('Failed to leave room')
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new as any
          
          // Fetch complete message with profile and reactions
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              profile:profiles (*),
              reactions (
                *,
                profile:profiles (*)
              )
            `)
            .eq('id', newMessage.id)
            .single()

          if (data && data.room_id === currentRoom?.id) {
            addMessage(data as MessageWithProfile)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const updatedMessage = payload.new as any
          if (updatedMessage.room_id === currentRoom?.id) {
            updateMessage(updatedMessage.id, updatedMessage)
          }
        }
      )
      .subscribe()

    // Subscribe to reactions
    const reactionsChannel = supabase
      .channel('reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions',
        },
        async () => {
          // Refetch messages to update reactions
          if (currentRoom) {
            await fetchMessages(currentRoom.id)
          }
        }
      )
      .subscribe()

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel('typing')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
        },
        async (payload) => {
          if (payload.new && (payload.new as any).room_id === currentRoom?.id) {
            const userId = (payload.new as any).user_id
            if (userId !== user.id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

              if (profile) {
                addTypingUser(profile as Profile)
                
                // Auto-remove after 3 seconds
                setTimeout(() => {
                  removeTypingUser(userId)
                }, 3000)
              }
            }
          }
          
          if (payload.old && payload.eventType === 'DELETE') {
            removeTypingUser((payload.old as any).user_id)
          }
        }
      )
      .subscribe()

    return () => {
      messagesChannel.unsubscribe()
      reactionsChannel.unsubscribe()
      typingChannel.unsubscribe()
    }
  }, [user, currentRoom])

  // Fetch initial data
  useEffect(() => {
    if (user) {
      fetchRooms()
    }
  }, [user, fetchRooms])

  // Fetch messages when room changes
  useEffect(() => {
    if (currentRoom) {
      fetchMessages(currentRoom.id)
    } else {
      setMessages([])
    }
  }, [currentRoom, fetchMessages])

  return {
    rooms,
    currentRoom,
    messages,
    typingUsers,
    setCurrentRoom,
    sendMessage,
    editMessage,
    deleteMessage: deleteMessageAction,
    addReaction,
    removeReaction,
    setTypingIndicator,
    clearTypingIndicator,
    createRoom,
    joinRoom,
    leaveRoom,
    fetchRooms,
  }
}
