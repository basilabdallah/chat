import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Room = Database['public']['Tables']['rooms']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type RoomMember = Database['public']['Tables']['room_members']['Row']
export type Reaction = Database['public']['Tables']['reactions']['Row']
export type TypingIndicator = Database['public']['Tables']['typing_indicators']['Row']
export type ReadReceipt = Database['public']['Tables']['read_receipts']['Row']

export interface MessageWithProfile extends Message {
  profile: Profile | null
  reactions: (Reaction & { profile: Profile })[]
  reply_to_message?: Message & { profile: Profile | null }
}

export interface RoomWithDetails extends Room {
  room_members: (RoomMember & { profile: Profile })[]
  last_message?: MessageWithProfile
  unread_count?: number
}
