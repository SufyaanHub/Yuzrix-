"use client"

import { useEffect, useRef, useState } from "react"
import { Clock, Compass, TrendingDown, TrendingUp } from "lucide-react"

import { CircularGallery } from "@/components/circular-gallery"

const pricingProblems = [
  {
    number: "01",
    icon: TrendingUp,
    title: "Priced too high",
    description:
      "Customers may choose a cheaper listing nearby before they ever taste the difference.",
  },
  {
    number: "02",
    icon: TrendingDown,
    title: "Priced too low",
    description:
      "You may be leaving margin on every order without realising it.",
  },
  {
    number: "03",
    icon: Compass,
    title: "Missing local context",
    description:
      "Your costs tell you what you need to earn — not what nearby customers are already comparing.",
  },
  {
    number: "04",
    icon: Clock,
    title: "Research takes time",
    description:
      "Checking menus, listings and WhatsApp posts one by one is slow, and hard to trust.",
  },
]

const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=85",
    alt: "Decorated chocolate cake",
    label: "Celebration cake",
  },
  {
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=85",
    alt: "Assorted glazed doughnuts",
    label: "Doughnuts",
  },
  {
    src: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=85",
    alt: "Fresh bakery croissants",
    label: "Pastries",
  },
  {
    src: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=600&q=85",
    alt: "Layered cake with fresh fruit",
    label: "Custom cake",
  },
  {
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=600&q=85",
    alt: "Cupcakes with colourful frosting",
    label: "Cupcakes",
  },
  {
    src: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=85",
    alt: "Freshly baked cookies",
    label: "Cookies",
  },
]

export function PricingProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  return (
    <section
      ref={sectionRef}
      id="pricing-problem"
      aria-labelledby="pricing-confidence-heading"
      data-visible={isVisible}
      className="pricing-problem-section relative overflow-hidden border-t border-navy/10 bg-ivory-deep px-5 py-16 sm:px-10 sm:py-20 md:px-14 lg:py-24"
    >
      <div aria-hidden="true" className="problem-blueprint absolute inset-0" />
      <div aria-hidden="true" className="problem-orb problem-orb-one" />
      <div aria-hidden="true" className="problem-orb problem-orb-two" />

      <div className="relative mx-auto max-w-7xl">
        <div className="problem-reveal grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-brass-deep uppercase">
              <span className="h-px w-10 bg-brass/45" />
              The pricing problem
            </p>
            <h2
              id="pricing-confidence-heading"
              className="mt-6 max-w-4xl font-serif text-4xl leading-[1.02] font-normal tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-[4.6rem]"
            >
              Are your prices right for your market?
            </h2>
          </div>

          <div className="border-l border-navy/15 pl-6 sm:pl-8">
            <p className="text-base leading-relaxed font-medium text-ink">
              Knowing your costs is only half the picture.
            </p>
            <p className="mt-3 text-sm leading-7 text-ink/60 sm:text-[15px]">
              To price with confidence, you also need to know what comparable
              businesses in Varanasi are charging for the same thing.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <div className="problem-reveal problem-visual relative flex min-h-128 items-center overflow-hidden rounded-[1.75rem] border border-navy/10 bg-ivory/75 p-3 shadow-[0_30px_80px_-50px_rgba(20,24,31,0.55)] backdrop-blur-xl sm:min-h-144 sm:p-5">
            <div className="absolute top-6 left-6 z-20 sm:top-8 sm:left-8">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-brass-deep uppercase">
                Products around you
              </p>
              <p className="mt-2 max-w-48 text-xs leading-5 text-ink/50">
                Hover to pause. Every product sits inside a local market.
              </p>
            </div>

            <CircularGallery
              items={galleryItems}
              radius={158}
              duration={24}
              pauseOnHover
            />
          </div>

          {/* No content-start here: rows stretch so the four cards always
              match the height of the gallery panel beside them. */}
          <div className="grid gap-3 sm:grid-cols-2">
            {pricingProblems.map((problem, index) => {
              const Icon = problem.icon

              return (
                <article
                  key={problem.number}
                  className="problem-card problem-reveal group relative flex flex-col overflow-hidden rounded-2xl border border-navy/12 bg-ivory p-6 shadow-[0_20px_45px_-40px_rgba(20,24,31,0.5)] transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brass/45 hover:shadow-[0_28px_60px_-40px_rgba(20,24,31,0.6)] sm:p-8"
                  style={{ transitionDelay: `${180 + index * 85}ms` }}
                >
                  {/* Brass rail that draws in on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-5 left-0 w-px origin-center scale-y-0 bg-linear-to-b from-transparent via-brass to-transparent transition-transform duration-500 group-hover:scale-y-100"
                  />

                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-brass/25 bg-brass/10 text-brass-deep transition-colors duration-300 group-hover:border-brass/45 group-hover:bg-brass/15">
                      <Icon className="size-4.5" strokeWidth={1.75} />
                    </span>
                    <span className="font-serif text-sm tracking-widest text-brass-deep/60 transition-colors duration-300 group-hover:text-brass-deep">
                      {problem.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-medium tracking-tight text-navy">
                    {problem.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-ink/55">
                    {problem.description}
                  </p>
                  {/* Absorbs any leftover height so content stays top-aligned. */}
                  <span aria-hidden="true" className="flex-1" />
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
