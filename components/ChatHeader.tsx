'use client'

import { useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/store/useAuthStore'

export default function ChatHeader() {
  const { currentRoom, leaveRoom } = useChat()
  const { user } = useAuthStore()
  const [showRoomInfo, setShowRoomInfo] = useState(false)

  if (!currentRoom) {
    return (
      <div className="h-16 border-b border-neutral-200 bg-white flex items-center justify-center">
        <p className="text-neutral-500">Select a room to start chatting</p>
      </div>
    )
  }

  const memberCount = currentRoom.room_members?.length || 0
  const onlineCount = currentRoom.room_members?.filter(
    (member) => member.profile.status === 'online'
  ).length || 0

  return (
    <>
      <div className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {currentRoom.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">{currentRoom.name}</h2>
            <p className="text-sm text-neutral-500">
              {memberCount} member{memberCount !== 1 ? 's' : ''} · {onlineCount} online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoomInfo(true)}
            className="btn-icon text-neutral-600"
            title="Room info"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Room Info Modal */}
      {showRoomInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slide-in-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Room Info</h2>
              <button
                onClick={() => setShowRoomInfo(false)}
                className="btn-icon text-neutral-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-semibold text-2xl">
                    {currentRoom.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900">{currentRoom.name}</h3>
                  <p className="text-sm text-neutral-500 capitalize">{currentRoom.type} room</p>
                </div>
              </div>

              {currentRoom.description && (
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-1">Description</h4>
                  <p className="text-sm text-neutral-600">{currentRoom.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">
                  Members ({memberCount})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentRoom.room_members?.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {member.profile.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900">
                          {member.profile.display_name || member.profile.username}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            member.profile.status === 'online' ? 'bg-success-500' :
                            member.profile.status === 'away' ? 'bg-warning-500' :
                            member.profile.status === 'busy' ? 'bg-error-500' :
                            'bg-neutral-400'
                          }`} />
                          <span className="text-xs text-neutral-500 capitalize">
                            {member.profile.status}
                          </span>
                        </div>
                      </div>
                      {member.role !== 'member' && (
                        <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-lg capitalize">
                          {member.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  leaveRoom(currentRoom.id)
                  setShowRoomInfo(false)
                }}
                className="w-full py-2 text-error-600 hover:bg-error-50 rounded-xl transition-smooth"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
