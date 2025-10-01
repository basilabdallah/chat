'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void
  onCancel: () => void
}

export default function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    startRecording()
    return () => {
      stopRecording()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Set up audio context for visualization
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)
      
      // Start visualization
      visualize()
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      onCancel()
    }
  }

  const visualize = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!analyserRef.current) return
      
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / bufferLength
      setAudioLevel(average / 255)
      
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const handleSend = () => {
    stopRecording()
    
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      onRecordingComplete(audioBlob, duration)
    }
  }

  const handleCancel = () => {
    stopRecording()
    onCancel()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl p-6 border-2 border-primary-500"
    >
      <div className="flex items-center gap-4">
        {/* Audio Visualization */}
        <div className="flex items-center gap-1">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary-500 rounded-full"
              animate={{
                height: isRecording && !isPaused
                  ? `${Math.max(4, audioLevel * 40 + Math.random() * 10)}px`
                  : '4px',
              }}
              transition={{
                duration: 0.1,
                delay: i * 0.02,
              }}
            />
          ))}
        </div>

        {/* Duration */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isRecording && !isPaused && (
              <motion.div
                className="w-3 h-3 bg-error-500 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            <span className="text-lg font-mono font-semibold text-neutral-900">
              {formatDuration(duration)}
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            {isRecording && !isPaused ? 'Recording...' : 'Paused'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="p-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-smooth"
            title="Cancel"
          >
            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="p-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-smooth"
            title="Send voice message"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
