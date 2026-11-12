'use client'

import { useRef, useState } from 'react'
import CtaButton from './CtaButton'
import { track } from '@/lib/analytics'

/**
 * Plays the start of a reel on the website (the same file the app plays, no
 * extra copy), then pauses and hands over to the app for the rest. Nothing
 * downloads until the visitor taps play (preload="none"), so the page stays
 * fast and costs no bandwidth for people who only read.
 */
export default function WatchPlayer({
  id,
  src,
  poster,
  title,
  previewSec,
}: {
  id: string
  src: string
  poster: string
  title: string
  previewSec: number
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'idle' | 'playing' | 'ended'>('idle')

  const start = () => {
    const v = ref.current
    if (!v) return
    if (state === 'ended') v.currentTime = 0
    v.play().catch(() => {})
    setState('playing')
    track('Web Reel Preview Play', { video_id: id })
  }

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[24px] bg-black">
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={state === 'playing'}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          if (state === 'playing' && v.currentTime >= previewSec) {
            v.pause()
            setState('ended')
            track('Web Reel Preview End', { video_id: id, seconds: previewSec })
          }
        }}
        className="h-full w-full object-cover"
        aria-label={title}
      />
      {state === 'idle' && (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          aria-label={`Play the first ${previewSec} seconds of ${title}`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-black shadow-lg">▶</span>
        </button>
      )}
      {state === 'ended' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 p-6 text-center text-white">
          <p className="font-serif text-[22px] leading-tight">Watch the rest on Qrio</p>
          <p className="text-[14px] text-white/75">The full reel, plus thousands more that make you smarter. Free on Android.</p>
          <CtaButton location="watch" />
          <button type="button" onClick={start} className="text-[13px] text-white/70 underline underline-offset-2">
            Replay the preview
          </button>
        </div>
      )}
    </div>
  )
}
