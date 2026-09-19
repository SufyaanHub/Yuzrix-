"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { PathMarquee } from "@/components/path-marquee"
import { cn } from "@/lib/utils"

type Position = "below" | "in" | "above"

type FoodItem = {
  name: string
  size: string
  price: string
  /** Local market range for comparable products. */
  range: string
  position: Position
  photo: string
  alt: string
}

/**
 * Comparable local products. Each card carries what the audit delivers: the
 * local range, the going rate, and where a price sits inside it.
 */
const foodItems: FoodItem[] = [
  {
    name: "Chocolate truffle cake",
    size: "500g · Celebration",
    price: "₹650",
    range: "₹550 – ₹700",
    position: "in",
    photo:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    alt: "Decorated chocolate truffle cake",
  },
  {
    name: "Red velvet cupcakes",
    size: "Box of 6",
    price: "₹480",
    range: "₹520 – ₹640",
    position: "below",
    photo:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=400&q=80",
    alt: "Red velvet cupcakes with frosting",
  },
  {
    name: "Butterscotch cake",
    size: "500g · Classic",
    price: "₹720",
    range: "₹560 – ₹710",
    position: "above",
    photo:
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=400&q=80",
    alt: "Layered butterscotch cake",
  },
  {
    name: "Assorted cookies",
    size: "250g · Gift box",
    price: "₹320",
    range: "₹300 – ₹390",
    position: "in",
    photo:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80",
    alt: "Assorted freshly baked cookies",
  },
  {
    name: "Baked cheesecake",
    size: "500g · New York",
    price: "₹840",
    range: "₹700 – ₹860",
    position: "in",
    photo:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80",
    alt: "Baked cheesecake slice",
  },
]

const positionMeta: Record<
  Position,
  { label: string; className: string; dot: string }
> = {
  below: {
    label: "Below range",
    className: "text-range-below-on-dark",
    dot: "bg-range-below",
  },
  in: {
    label: "In range",
    className: "text-range-in-on-dark",
    dot: "bg-range-in",
  },
  above: {
    label: "Above range",
    className: "text-range-above-on-dark",
    dot: "bg-range-above",
  },
}

/**
 * Zigzag wave with three full periods, drawn in a 0–1200 × 0–300 space so
 * speed stays consistent. Starts and ends at the same height with matching
 * tangents, so the marquee loops seamlessly.
 */
const WAVE_PATH =
  "M 0 150 C 50 105, 150 105, 200 150 C 250 195, 350 195, 400 150 C 450 105, 550 105, 600 150 C 650 195, 750 195, 800 150 C 850 105, 950 105, 1000 150 C 1050 195, 1150 195, 1200 150"

export function WhatYouGetMarquee() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsVisible(true)
        observer.disconnect()
      },
      { threshold: 0.12 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Narrow screens show fewer cards so the strip never crowds.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const update = () => setIsCompact(query.matches)

    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  const visibleItems = isCompact ? foodItems.slice(0, 3) : foodItems

  return (
    <section
      ref={sectionRef}
      id="what-you-get"
      aria-labelledby="deliverables-heading"
      data-visible={isVisible}
      className="deliverables-section relative overflow-hidden bg-ivory px-5 py-12 text-navy sm:px-10 sm:py-16 md:px-14 lg:py-20"
    >
      <div aria-hidden="true" className="deliverables-glow absolute inset-0" />

      <div className="relative mx-auto max-w-7xl">
        <div className="deliverables-reveal grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-brass-light uppercase">
              <span className="h-px w-10 bg-brass-light/45" />
              What you get
            </p>
            <h2
              id="deliverables-heading"
              className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] font-normal tracking-tight text-navy sm:text-5xl md:text-6xl"
            >
              See where every price lands.
            </h2>
          </div>

          <div className="border-l border-navy/15 pl-6 sm:pl-8">
            <p className="text-base leading-relaxed font-medium text-navy">
              Your product, set beside comparable ones nearby.
            </p>
            <p className="mt-3 text-sm leading-7 text-ink/60 sm:text-[15px]">
              Every card carries a local range and the going rate, so you can
              see at a glance where each price sits — and what to consider
              doing about yours.
            </p>
          </div>
        </div>

        {/* Caption sits outside the stage so a card can never cover it. */}
        <div className="deliverables-reveal mt-8 flex items-end justify-between gap-4 sm:mt-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-brass-deep uppercase">
              Sample price audit
            </p>
            <p className="mt-2 text-xs leading-5 text-ink/50">
              Comparable products around you
            </p>
          </div>
          <p className="hidden text-xs text-ink/45 sm:block">
            Drag the strip · Hover to slow down
          </p>
        </div>

        {/* Drag the strip, or hover a card to slow it down. */}
        <div className="deliverables-reveal deliverables-stage relative mt-4">
          <PathMarquee
            path={WAVE_PATH}
            viewBox="0 0 1200 300"
            responsive
            showPath
            baseVelocity={70}
            repeat={1}
            draggable
            grabCursor
            slowdownOnHover
            slowDownFactor={0.2}
            className="h-60 text-brass/40 sm:h-72"
          >
            {visibleItems.map((item) => {
              const meta = positionMeta[item.position]

              return (
                <article
                  key={item.name}
                  className="group w-24 overflow-hidden rounded-lg border border-navy/10 bg-navy shadow-[0_18px_34px_-22px_rgba(13,22,38,0.5)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-22px_rgba(13,22,38,0.65)] sm:w-28 sm:rounded-xl lg:w-40"
                >
                  <div className="relative aspect-3/2 overflow-hidden bg-navy">
                    <Image
                      src={item.photo}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 96px, (max-width: 1023px) 112px, 160px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-2 sm:p-2.5">
                    {/* Two lines are reserved so every card stays the same height. */}
                    <h3 className="line-clamp-2 min-h-6 text-[10px] leading-tight font-medium text-ivory-deep sm:min-h-7 sm:text-[11px] lg:min-h-8 lg:text-[12px]">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[8px] text-ivory-deep sm:text-[9px] lg:text-[10px]">
                      {item.size}
                    </p>

                    {/* Range stacks under the price until cards are wide enough. */}
                    <div className="mt-1.5 flex flex-col lg:mt-2 lg:flex-row lg:items-baseline lg:gap-1.5">
                      <span className="text-xs leading-none font-semibold text-ivory-deep sm:text-sm lg:text-[15px]">
                        {item.price}
                      </span>
                      <span className="mt-0.5 truncate text-[8px] text-ivory-deep sm:mt-1 sm:text-[9px] lg:mt-0 lg:text-[10px]">
                        <span className="hidden lg:inline">in </span>
                        {item.range}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "mt-1.5 flex items-center gap-1 text-[8px] leading-none font-medium sm:text-[9px] lg:text-[10px]",
                        meta.className
                      )}
                    >
                      <span
                        className={cn("size-1 rounded-full sm:size-1.5", meta.dot)}
                        aria-hidden="true"
                      />
                      {meta.label}
                    </span>
                  </div>
                </article>
              )
            })}
          </PathMarquee>
        </div>

        <div className="deliverables-reveal mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-7">
          <p className="text-[10px] tracking-[0.18em] text-ink/45 uppercase">
            Where each price sits
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {(["below", "in", "above"] as Position[]).map((key) => (
              <span
                key={key}
                className="flex items-center gap-1.5 text-[10px] text-navy uppercase"
              >
                <span
                  className={cn("size-1.5 rounded-full", positionMeta[key].dot)}
                  aria-hidden="true"
                />
                {positionMeta[key].label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
