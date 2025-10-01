export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          status: 'online' | 'away' | 'busy' | 'offline'
          last_seen: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          status?: 'online' | 'away' | 'busy' | 'offline'
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          status?: 'online' | 'away' | 'busy' | 'offline'
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'direct' | 'group' | 'channel'
          avatar_url: string | null
          created_by: string | null
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: 'direct' | 'group' | 'channel'
          avatar_url?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'direct' | 'group' | 'channel'
          avatar_url?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      room_members: {
        Row: {
          id: string
          room_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          is_muted: boolean
          joined_at: string
          last_read_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          is_muted?: boolean
          joined_at?: string
          last_read_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          is_muted?: boolean
          joined_at?: string
          last_read_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          content: string
          type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system'
          file_url: string | null
          file_name: string | null
          file_size: number | null
          reply_to: string | null
          is_edited: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id?: string | null
          content: string
          type?: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          reply_to?: string | null
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          content?: string
          type?: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          reply_to?: string | null
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      typing_indicators: {
        Row: {
          id: string
          room_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          created_at?: string
        }
      }
      read_receipts: {
        Row: {
          id: string
          message_id: string
          user_id: string
          read_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          read_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          read_at?: string
        }
      }
    }
  }
}
