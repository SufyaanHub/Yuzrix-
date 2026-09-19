"use client"

import Image from "next/image"
import type { CSSProperties } from "react"

type GalleryItem = {
  src: string
  alt: string
  label: string
}

type CircularGalleryProps = {
  items: GalleryItem[]
  radius?: number
  duration?: number
  direction?: "normal" | "reverse"
  pauseOnHover?: boolean
}

type GalleryStyle = CSSProperties & {
  "--gallery-radius": string
  "--gallery-duration": string
  "--gallery-direction": "normal" | "reverse"
}

type ItemStyle = CSSProperties & {
  "--gallery-angle": string
  "--gallery-counter-angle": string
}

export function CircularGallery({
  items,
  radius = 158,
  duration = 22,
  direction = "normal",
  pauseOnHover = true,
}: CircularGalleryProps) {
  const galleryStyle: GalleryStyle = {
    "--gallery-radius": `${radius}px`,
    "--gallery-duration": `${duration}s`,
    "--gallery-direction": direction,
  }

  return (
    <div
      className="circular-gallery relative mx-auto aspect-square w-full max-w-[32rem]"
      data-pause-on-hover={pauseOnHover}
      style={galleryStyle}
      aria-label="Examples of products that can be compared in a local price audit"
    >
      <div className="circular-gallery-spinner absolute inset-0">
        {items.map((item, index) => {
          const itemStyle: ItemStyle = {
            "--gallery-angle": `${(360 / items.length) * index}deg`,
            "--gallery-counter-angle": `${(-360 / items.length) * index}deg`,
          }

          return (
            <figure
              key={item.src}
              className="circular-gallery-item absolute top-1/2 left-1/2 m-0"
              style={itemStyle}
            >
              <div className="circular-gallery-card relative h-36 w-28 overflow-hidden rounded-2xl border-4 border-ivory bg-ivory shadow-[0_18px_38px_-18px_rgba(13,22,38,0.55)] sm:h-40 sm:w-32">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <figcaption className="absolute inset-x-2 bottom-2 rounded-lg bg-navy/75 px-2 py-1.5 text-center text-[9px] font-medium tracking-[0.08em] text-ivory uppercase backdrop-blur-sm">
                  {item.label}
                </figcaption>
              </div>
            </figure>
          )
        })}
      </div>

      <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex size-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-brass/25 bg-ivory/90 text-center shadow-[0_18px_45px_-25px_rgba(13,22,38,0.5)] backdrop-blur-xl sm:size-36">
        <span className="text-[9px] font-semibold tracking-[0.2em] text-brass-deep uppercase">
          Your local
        </span>
        <span className="mt-1 font-serif text-2xl leading-none text-navy sm:text-3xl">
          market
        </span>
        <span className="mt-2 size-1.5 rounded-full bg-brass" />
      </div>
    </div>
  )
}
