import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getChapterAudioProgress, saveAudioProgress } from '@/lib/storage'

interface AudioPlayerProps {
  chapterId: number
  className?: string
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Chapters that have audio files (2-14)
const AUDIO_CHAPTERS = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

export function AudioPlayer({ chapterId, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  if (!AUDIO_CHAPTERS.has(chapterId)) return null

  const audioSrc = `${import.meta.env.BASE_URL}audio/Chapter_${chapterId}_Audio.m4a`
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Restore saved position on load
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const saved = getChapterAudioProgress(chapterId)

    const handleLoaded = () => {
      setDuration(audio.duration)
      if (saved && saved.currentTime > 0 && saved.currentTime < audio.duration) {
        audio.currentTime = saved.currentTime
        setCurrentTime(saved.currentTime)
      }
    }

    audio.addEventListener('loadedmetadata', handleLoaded)
    return () => audio.removeEventListener('loadedmetadata', handleLoaded)
  }, [chapterId])

  // Time update + periodic save
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      saveAudioProgress(chapterId, audio.duration, audio.duration)
    }

    // Save progress every 5 seconds
    const saveInterval = setInterval(() => {
      if (audio.currentTime > 0 && audio.duration > 0) {
        saveAudioProgress(chapterId, audio.currentTime, audio.duration)
      }
    }, 5000)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      clearInterval(saveInterval)
      // Save on unmount
      if (audio.currentTime > 0 && audio.duration > 0) {
        saveAudioProgress(chapterId, audio.currentTime, audio.duration)
      }
    }
  }, [chapterId, isDragging])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      saveAudioProgress(chapterId, audio.currentTime, audio.duration)
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, chapterId])

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
    setCurrentTime(audio.currentTime)
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(!isMuted)
  }, [isMuted])

  const seekTo = useCallback((clientX: number) => {
    const bar = progressBarRef.current
    const audio = audioRef.current
    if (!bar || !audio || !audio.duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
    setCurrentTime(audio.currentTime)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    seekTo(e.clientX)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [seekTo])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging) seekTo(e.clientX)
  }, [isDragging, seekTo])

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      const audio = audioRef.current
      if (audio) saveAudioProgress(chapterId, audio.currentTime, audio.duration)
    }
  }, [isDragging, chapterId])

  return (
    <div className={cn('card', className)}>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Label + progress % */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-body font-semibold flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-forest" />
          Chapter Audio
        </h3>
        <span className="text-micro text-ink/50">
          {Math.round(percent)}% played
        </span>
      </div>

      {/* Progress bar */}
      <div
        ref={progressBarRef}
        className="relative w-full h-2 bg-slate-700/50 rounded-full cursor-pointer group mb-3"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="h-full bg-forest rounded-full transition-[width] duration-100"
          style={{ width: `${percent}%` }}
        />
        {/* Scrubber thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-forest rounded-full border-2 border-slate-card shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${percent}% - 7px)` }}
        />
      </div>

      {/* Time + controls */}
      <div className="flex items-center justify-between">
        <span className="text-micro text-ink/40 tabular-nums min-w-[80px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => skip(-15)}
            className="p-1.5 rounded hover:bg-forest/15 text-ink/60 hover:text-ink transition-colors"
            title="Back 15s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-forest/20 hover:bg-forest/30 text-forest transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={() => skip(30)}
            className="p-1.5 rounded hover:bg-forest/15 text-ink/60 hover:text-ink transition-colors"
            title="Forward 30s"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded hover:bg-forest/15 text-ink/60 hover:text-ink transition-colors ml-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Spacer to balance layout */}
        <span className="min-w-[80px]" />
      </div>
    </div>
  )
}
