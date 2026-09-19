"use client"

import { useEffect, useRef, useState } from "react"

import { CircularGallery } from "@/components/circular-gallery"

const pricingProblems = [
  {
    number: "01",
    title: "Priced too high",
    description:
      "Customers may choose a cheaper listing nearby before they ever taste the difference.",
  },
  {
    number: "02",
    title: "Priced too low",
    description:
      "You may be leaving margin on every order without realising it.",
  },
  {
    number: "03",
    title: "Missing local context",
    description:
      "Your costs tell you what you need to earn. They cannot tell you what nearby customers are already comparing.",
  },
  {
    number: "04",
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
      className="pricing-problem-section relative overflow-hidden border-t border-navy/10 bg-ivory-deep px-5 py-24 sm:px-10 sm:py-32 md:px-14 lg:py-36"
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
              className="mt-7 max-w-4xl font-serif text-4xl leading-[1.02] font-normal tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-[4.6rem]"
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

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
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

          <div className="grid gap-3 sm:grid-cols-2">
            {pricingProblems.map((problem, index) => (
              <article
                key={problem.number}
                className="problem-card problem-reveal group relative min-h-56 overflow-hidden rounded-3xl border border-navy/10 bg-ivory/70 p-6 backdrop-blur-lg transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brass/35 hover:bg-ivory hover:shadow-[0_24px_55px_-40px_rgba(20,24,31,0.6)] sm:p-7"
                style={{ transitionDelay: `${180 + index * 85}ms` }}
              >
                <span className="absolute top-3 right-5 font-serif text-7xl leading-none text-brass/10 transition-colors duration-300 group-hover:text-brass/20">
                  {problem.number}
                </span>
                <div className="relative flex h-full flex-col">
                  <span className="flex size-8 items-center justify-center rounded-full border border-brass/25 bg-brass/10 text-[10px] font-semibold text-brass-deep">
                    {problem.number}
                  </span>
                  <h3 className="mt-auto pt-8 text-lg font-medium tracking-tight text-navy">
                    {problem.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/55">
                    {problem.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
