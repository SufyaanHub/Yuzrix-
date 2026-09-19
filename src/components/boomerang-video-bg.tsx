"use client"

import { useEffect, useRef, useState } from "react"

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4"

type FrameCallback = (
  now: DOMHighResTimeStamp,
  metadata: VideoFrameCallbackMetadata
) => void

type VideoWithFrameCallbacks = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: FrameCallback) => number
  cancelVideoFrameCallback?: (handle: number) => void
}

function drawFrameCover(
  context: CanvasRenderingContext2D,
  frame: HTMLCanvasElement,
  width: number,
  height: number
) {
  const sourceRatio = frame.width / frame.height
  const targetRatio = width / height

  let sourceX = 0
  let sourceY = 0
  let sourceWidth = frame.width
  let sourceHeight = frame.height

  if (sourceRatio > targetRatio) {
    sourceWidth = frame.height * targetRatio
    sourceX = (frame.width - sourceWidth) / 2
  } else {
    sourceHeight = frame.width / targetRatio
    sourceY = (frame.height - sourceHeight) / 2
  }

  context.drawImage(
    frame,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height
  )
}

export function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [framesReady, setFramesReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current as VideoWithFrameCallbacks | null
    const displayCanvas = canvasRef.current

    if (!video || !displayCanvas) return

    const frames: HTMLCanvasElement[] = []
    let active = true
    let captureHandle: number | undefined
    let captureAnimationFrame: number | undefined
    let playbackAnimationFrame: number | undefined
    let lastCapturedTime = -1
    let frameIndex = 0
    let direction = 1
    let lastPlaybackTime = 0
    let captureFailed = false

    const captureFrame = () => {
      if (
        !active ||
        video.ended ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        return
      }

      if (video.currentTime !== lastCapturedTime && video.videoWidth > 0) {
        const width = Math.min(960, video.videoWidth)
        const height = Math.round(
          (width / video.videoWidth) * video.videoHeight
        )
        const frame = document.createElement("canvas")
        frame.width = width
        frame.height = height

        try {
          frame.getContext("2d")?.drawImage(video, 0, 0, width, height)
          frames.push(frame)
          lastCapturedTime = video.currentTime
        } catch {
          captureFailed = true
          return
        }
      }

      scheduleCapture()
    }

    const scheduleCapture = () => {
      if (!active || captureFailed) return

      if (video.requestVideoFrameCallback) {
        captureHandle = video.requestVideoFrameCallback(captureFrame)
      } else {
        captureAnimationFrame = window.requestAnimationFrame(captureFrame)
      }
    }

    const paintFrame = (frame: HTMLCanvasElement) => {
      const bounds = displayCanvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(bounds.width * pixelRatio))
      const height = Math.max(1, Math.round(bounds.height * pixelRatio))

      if (displayCanvas.width !== width || displayCanvas.height !== height) {
        displayCanvas.width = width
        displayCanvas.height = height
      }

      const context = displayCanvas.getContext("2d")
      if (!context) return

      drawFrameCover(context, frame, width, height)
    }

    const playBoomerang = (time: number) => {
      if (!active || frames.length === 0) return

      if (time - lastPlaybackTime >= 1000 / 30) {
        paintFrame(frames[frameIndex])
        lastPlaybackTime = time

        if (frames.length > 1) {
          if (frameIndex >= frames.length - 1) direction = -1
          if (frameIndex <= 0) direction = 1
          frameIndex += direction
        }
      }

      playbackAnimationFrame = window.requestAnimationFrame(playBoomerang)
    }

    const startVideo = () => {
      if (!active) return
      void video.play().catch(() => undefined)
      scheduleCapture()
    }

    const finishCapture = () => {
      if (!active) return

      if (captureHandle !== undefined && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(captureHandle)
      }
      if (captureAnimationFrame !== undefined) {
        window.cancelAnimationFrame(captureAnimationFrame)
      }

      if (frames.length > 0 && !captureFailed) {
        paintFrame(frames[0])
        setFramesReady(true)
        playbackAnimationFrame = window.requestAnimationFrame(playBoomerang)
      } else {
        video.loop = true
        video.currentTime = 0
        void video.play().catch(() => undefined)
      }
    }

    video.addEventListener("loadeddata", startVideo, { once: true })
    video.addEventListener("ended", finishCapture, { once: true })

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startVideo()
    }

    return () => {
      active = false
      video.removeEventListener("loadeddata", startVideo)
      video.removeEventListener("ended", finishCapture)

      if (captureHandle !== undefined && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(captureHandle)
      }
      if (captureAnimationFrame !== undefined) {
        window.cancelAnimationFrame(captureAnimationFrame)
      }
      if (playbackAnimationFrame !== undefined) {
        window.cancelAnimationFrame(playbackAnimationFrame)
      }

      for (const frame of frames) {
        frame.width = 0
        frame.height = 0
      }
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 origin-top scale-[1.15] overflow-hidden"
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="h-full w-full object-cover object-top"
        style={{ display: framesReady ? "none" : "block" }}
      />
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover object-top"
        style={{ display: framesReady ? "block" : "none" }}
      />
    </div>
  )
}
