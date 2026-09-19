"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type LensPosition = { x: number; y: number }

export type LensProps = {
  /** Magnification factor for the lens. */
  zoomFactor?: number
  /** Diameter of the lens in pixels. */
  lensSize?: number
  /** Static lens position, used when `isStatic` is true. */
  position?: LensPosition
  /** Keep the lens fixed instead of following the pointer. */
  isStatic?: boolean
  /** Externally control the hover state. */
  hovering?: boolean
  /** Image revealed through the lens. */
  imageUrl: string
  /** Alt text for the image surface. */
  imageAlt?: string
  /** Rendered on top of the magnified image, inside the lens. */
  children?: ReactNode
  className?: string
  /** Classes merged onto the lens ring. */
  lensClassName?: string
}

/**
 * Zoom lens. The base layer is the image at rest; on hover a circular lens
 * shows the same image scaled by `zoomFactor`, positioned so the area under
 * the pointer is magnified in place.
 */
export function Lens({
  zoomFactor = 1.5,
  lensSize = 170,
  position = { x: 200, y: 150 },
  isStatic = false,
  hovering,
  imageUrl,
  imageAlt = "",
  children,
  className,
  lensClassName,
}: LensProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [pointer, setPointer] = useState<LensPosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [natural, setNatural] = useState({ width: 0, height: 0 })

  // An external `hovering` value, when provided, wins over internal state.
  const active = hovering ?? isHovering
  const lensPosition = isStatic ? position : pointer

  const measure = () => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setSize({ width: rect.width, height: rect.height })
  }

  /**
   * Read the image's intrinsic size. A cached image can already be `complete`
   * before React attaches `onLoad`, so we check that case explicitly —
   * otherwise the zoom geometry never initialises.
   */
  const syncNatural = () => {
    const el = imageRef.current
    if (!el || !el.complete || !el.naturalWidth) return
    setNatural((prev) =>
      prev.width === el.naturalWidth && prev.height === el.naturalHeight
        ? prev
        : { width: el.naturalWidth, height: el.naturalHeight }
    )
    measure()
  }

  useEffect(() => {
    syncNatural()

    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      measure()
      syncNatural()
    })
    observer.observe(container)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isStatic) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  /**
   * Touch pointers do not fire `pointerleave` when the finger lifts, so the
   * lens would otherwise stay stuck on screen. Mouse pointers keep hovering.
   */
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      setIsHovering(false)
    }
  }

  /**
   * The base image is painted with `object-cover` (scaled to fill, centre
   * cropped). The lens must reproduce that same geometry before zooming,
   * otherwise the magnified copy is stretched relative to what it magnifies.
   */
  const cover = (() => {
    const { width, height } = size
    const { width: iw, height: ih } = natural
    if (!width || !height || !iw || !ih) return null

    const imageAspect = iw / ih
    const boxAspect = width / height

    // Scale to fill, then derive the centre-crop offset.
    const renderWidth = imageAspect > boxAspect ? height * imageAspect : width
    const renderHeight = imageAspect > boxAspect ? height : width / imageAspect

    return {
      renderWidth,
      renderHeight,
      offsetX: (width - renderWidth) / 2,
      offsetY: (height - renderHeight) / 2,
    }
  })()

  const lensBackground = cover
    ? {
        backgroundSize: `${cover.renderWidth * zoomFactor}px ${
          cover.renderHeight * zoomFactor
        }px`,
        backgroundPosition: `${
          lensSize / 2 - (lensPosition.x - cover.offsetX) * zoomFactor
        }px ${
          lensSize / 2 - (lensPosition.y - cover.offsetY) * zoomFactor
        }px`,
      }
    : { backgroundSize: "cover", backgroundPosition: "center" }

  return (
    <div
      ref={containerRef}
      className={cn("group relative cursor-none overflow-hidden", className)}
      onPointerEnter={() => {
        measure()
        setIsHovering(true)
      }}
      onPointerLeave={() => setIsHovering(false)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerDown={() => {
        measure()
        setIsHovering(true)
      }}
    >
      {/* Base layer — the market at rest. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
        onLoad={syncNatural}
      />

      {/* Magnified layer, clipped to a circle that tracks the pointer. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute z-20 rounded-full border border-brass-light/60 shadow-[0_0_0_1px_rgba(13,22,38,0.45),0_18px_40px_-18px_rgba(0,0,0,0.7)] transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0",
          lensClassName
        )}
        style={{
          left: lensPosition.x - lensSize / 2,
          top: lensPosition.y - lensSize / 2,
          width: lensSize,
          height: lensSize,
          backgroundImage: `url(${imageUrl})`,
          backgroundRepeat: "no-repeat",
          ...lensBackground,
        }}
      >
        {/* Glass highlight, so the lens reads as an optical element. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-linear-to-br from-ivory/25 via-transparent to-navy-deep/25"
        />
        <span
          aria-hidden="true"
          className="absolute inset-3 rounded-full ring-1 ring-inset ring-brass-light/25"
        />
        {children}
      </div>
    </div>
  )
}