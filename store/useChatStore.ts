import { create } from 'zustand'
import { RoomWithDetails, MessageWithProfile, Profile } from '@/types'

interface ChatState {
  rooms: RoomWithDetails[]
  currentRoom: RoomWithDetails | null
  messages: MessageWithProfile[]
  typingUsers: Profile[]
  setRooms: (rooms: RoomWithDetails[]) => void
  setCurrentRoom: (room: RoomWithDetails | null) => void
  setMessages: (messages: MessageWithProfile[]) => void
  addMessage: (message: MessageWithProfile) => void
  updateMessage: (messageId: string, updates: Partial<MessageWithProfile>) => void
  deleteMessage: (messageId: string) => void
  setTypingUsers: (users: Profile[]) => void
  addTypingUser: (user: Profile) => void
  removeTypingUser: (userId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  currentRoom: null,
  messages: [],
  typingUsers: [],
  
  setRooms: (rooms) => set({ rooms }),
  
  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  
  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    })),
  
  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, is_deleted: true, content: 'Message deleted' } : msg
      ),
    })),
  
  setTypingUsers: (users) => set({ typingUsers: users }),
  
  addTypingUser: (user) =>
    set((state) => {
      if (state.typingUsers.find((u) => u.id === user.id)) {
        return state
      }
      return { typingUsers: [...state.typingUsers, user] }
    }),
  
  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u.id !== userId),
    })),
}))
