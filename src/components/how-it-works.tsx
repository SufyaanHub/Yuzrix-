"use client"

import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Lens } from "@/components/lens"

const steps = [
  {
    number: "01",
    title: "Tell us what you sell",
    description:
      "Share your product, the portion size, and what you currently charge.",
  },
  {
    number: "02",
    title: "We research your market",
    description:
      "We look at comparable products from nearby businesses in Varanasi.",
  },
  {
    number: "03",
    title: "You get a recommendation",
    description:
      "One clear price audit — the local range, where you sit, and what to consider next.",
  },
]

export function HowItWorks() {
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
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      data-visible={isVisible}
      className="how-it-works-section relative overflow-hidden bg-navy px-5 py-16 sm:px-10 sm:py-20 md:px-14 lg:py-24"
    >
      <div aria-hidden="true" className="how-glow absolute inset-0" />

      <div className="relative mx-auto max-w-7xl">
        <div className="how-reveal grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-brass-light uppercase">
              <span className="h-px w-10 bg-brass-light/45" />
              How it works
            </p>
            <h2
              id="how-it-works-heading"
              className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] font-normal tracking-tight text-ivory sm:text-5xl md:text-6xl"
            >
              Three simple steps.
            </h2>
          </div>

          <p className="text-sm leading-7 text-ivory/55 sm:text-[15px]">
            No forms to fight through and nothing to configure. Tell us what
            you sell, and we take it from there.
          </p>
        </div>

        {/* Steps and lens share one panel: the method on the left, the
            magnified market on the right. */}
        <div className="how-reveal mt-12 grid overflow-hidden rounded-2xl bg-navy-deep/60 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="flex flex-col p-7 sm:p-9 lg:p-10">
            <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-brass-light uppercase">
              <span className="h-px w-8 bg-brass-light/45" />
              Look closer
            </p>
            <h3 className="mt-5 font-serif text-2xl leading-snug text-ivory sm:text-3xl">
              A single price tells you almost nothing.
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-ivory/55">
              One cake at one price is unremarkable on its own — the useful
              part is what sits around it. Here is how we build that picture.
            </p>

            <ol className="mt-8 space-y-6 border-t border-ivory/10 pt-8 sm:mt-9 sm:space-y-7">
              {steps.map((step, index) => (
                <li
                  key={step.number}
                  className="group flex gap-4 sm:gap-5"
                  style={{ transitionDelay: `${120 + index * 90}ms` }}
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-brass-light/25 bg-brass-light/8 font-serif text-xs tracking-widest text-brass-light transition-colors duration-300 group-hover:border-brass-light/50">
                    {step.number}
                  </span>
                  <div>
                    <h4 className="text-[15px] leading-snug font-medium tracking-tight text-ivory sm:text-base">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-6 text-ivory/50">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-72 sm:h-96 lg:h-auto lg:min-h-full">
            <Lens
              imageUrl="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=85"
              imageAlt="Decorated chocolate truffle cake, shown in the market"
              zoomFactor={1.9}
              lensSize={190}
              className="size-full"
            />
            {/* Vignette so the image settles into the navy panel. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-deep/70 via-transparent to-navy-deep/25"
            />
            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-ivory/15 bg-navy-deep/80 px-3 py-1.5 text-[10px] font-medium text-ivory/70 backdrop-blur-sm">
              Chocolate truffle cake · ₹650
            </span>
            <p className="pointer-events-none absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-ivory/15 bg-navy-deep/80 px-3 py-1.5 text-[10px] text-ivory/60 backdrop-blur-sm">
              <Search className="size-3" strokeWidth={1.75} />
              <span className="lg:hidden">Touch to magnify</span>
              <span className="hidden lg:inline">Hover to magnify</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
