"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Warm bakehouse footage: hands folding dough, a slow crust bake, flour
 * catching morning light. Loops seamlessly.
 */
const VIDEO_URL =
  "https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/knead.mp4"

/**
 * Ambient hero background: a breathing video plate, a bottom-only blur that
 * keeps the warm tones rich (no dark gradient), and a crust-brown glow
 * rising from the base.
 *
 * Scoped to the hero with `absolute` rather than `fixed`: on a scrolling page
 * a fixed plate would keep decoding behind sections that fully cover it.
 */
export function HeroVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Some browsers reject the initial play promise until metadata arrives.
    const tryPlay = () => {
      void video.play().catch(() => undefined)
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setReady(true)
      tryPlay()
      return
    }

    video.addEventListener("loadeddata", () => {
      setReady(true)
      tryPlay()
    })
    video.addEventListener("canplay", tryPlay)

    return () => {
      video.removeEventListener("canplay", tryPlay)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden bg-[#0d0a07]"
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`hero-video-drift size-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Bottom-only blur. No dark gradient, so the warm tones stay rich. */}
      <div className="hero-blur-bottom" />

      {/* Crust-brown glow rising from the base. */}
      <div className="hero-crumb-scrim" />
    </div>
  )
}