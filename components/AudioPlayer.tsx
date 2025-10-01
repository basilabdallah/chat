'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AudioPlayerProps {
  audioUrl: string
  duration?: number
}

export default function AudioPlayer({ audioUrl, duration: initialDuration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(initialDuration || 0)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-3 bg-primary-50 rounded-xl p-3 min-w-[280px]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-smooth disabled:opacity-50"
      >
        {isLoading ? (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Waveform/Progress */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-primary-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${progress}%, #bae6fd ${progress}%, #bae6fd 100%)`,
            }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between text-xs text-neutral-600 mt-1">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Speed Control (optional) */}
      <button
        onClick={() => {
          if (!audioRef.current) return
          const speeds = [1, 1.25, 1.5, 1.75, 2]
          const currentSpeed = audioRef.current.playbackRate
          const currentIndex = speeds.indexOf(currentSpeed)
          const nextIndex = (currentIndex + 1) % speeds.length
          audioRef.current.playbackRate = speeds[nextIndex]
        }}
        className="flex-shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-100 transition-smooth"
        title="Playback speed"
      >
        {audioRef.current?.playbackRate || 1}x
      </button>
    </div>
  )
}
