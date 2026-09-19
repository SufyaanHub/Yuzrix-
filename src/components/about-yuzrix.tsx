"use client"

import { useEffect, useRef, useState } from "react"

const values = [
  {
    number: "01",
    title: "Start where it matters",
    description:
      "Home bakers and cloud kitchens first. Cakes and prepared food are easy to compare, so the model can be proven before it is scaled.",
  },
  {
    number: "02",
    title: "Explain, do not just display",
    description:
      "A price on its own is only information. We add the local context and a recommendation, so it becomes something you can act on.",
  },
  {
    number: "03",
    title: "Speak plainly",
    description:
      "No dashboards to learn and no jargon. If a business owner cannot understand the insight, we have not finished the work.",
  },
  {
    number: "04",
    title: "Earn the recommendation",
    description:
      "We only suggest what we can support with real local comparisons — and say so when the data does not justify a change.",
  },
]

/** Same mark as the navbar, so the panel reads as part of the brand. */
function LogoMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="size-5 text-brass-light"
    >
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z" />
      <path d="M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z" />
      <path d="M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  )
}

export function AboutYuzrix() {
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
      id="about"
      aria-labelledby="about-heading"
      data-visible={isVisible}
      className="about-section relative overflow-hidden bg-ivory px-5 py-16 sm:px-10 sm:py-20 md:px-14 lg:py-24"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          {/* Inverted quote panel — navy on the ivory page. */}
          <div className="about-panel about-reveal relative overflow-hidden rounded-[1.75rem] bg-navy px-7 py-9 sm:px-9 sm:py-11">
            <div
              aria-hidden="true"
              className="about-panel-glow absolute inset-0"
            />
            {/* Oversized ghost quote mark, echoing the serif display type. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 right-4 font-serif text-[11rem] leading-none text-brass-light/9 select-none sm:text-[13rem]"
            >
              &rdquo;
            </span>
            {/* Brass edge that lights up on hover. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-brass-light/70 to-transparent"
            />

            <div className="relative flex flex-col">
              <div className="flex items-center justify-between gap-4">
                <p className="flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.22em] text-brass-light uppercase">
                  <LogoMark />
                  About Yuzrix
                </p>
                <span className="flex items-center gap-2 rounded-full border border-brass-light/25 bg-brass-light/8 px-3 py-1.5 text-[10px] font-medium text-ivory/70">
                  <span className="size-1.5 rounded-full bg-brass-light" />
                  Varanasi
                </span>
              </div>

              {/* Quote sits directly under the header — the panel hugs its
                  content instead of stretching to the ledger height. */}
              <div className="py-7 sm:py-9">
                <blockquote>
                  <p className="font-serif text-[1.6rem] leading-[1.28] text-ivory sm:text-[1.9rem] md:text-[2.1rem] lg:text-[1.6rem] xl:text-[2.05rem]">
                    <span className="text-brass-light">&ldquo;</span>
                    Large companies have market research teams. Small local
                    businesses have a hunch.
                    <span className="text-brass-light">&rdquo;</span>
                  </p>
                </blockquote>

                <div className="mt-7 flex items-center gap-3 border-t border-ivory/10 pt-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brass-light/30 bg-brass-light/10 font-serif text-sm text-brass-light">
                    Y
                  </span>
                  <span className="text-sm leading-tight">
                    <span className="block font-medium text-ivory">
                      Yuzrix
                    </span>
                    <span className="block text-ivory/50">
                      Price intelligence · est. 2026
                    </span>
                  </span>
                </div>

                {/* What we actually compare, so the panel carries substance. */}
                <div className="mt-7">
                  <p className="text-[10px] font-medium tracking-[0.18em] text-brass-light/70 uppercase">
                    What we compare
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                    {[
                      "Celebration cakes",
                      "Cupcakes",
                      "Cookies",
                      "Cheesecakes",
                      "Tiffin boxes",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-1.5 text-xs text-ivory/60"
                      >
                        <span
                          aria-hidden="true"
                          className="size-1 rounded-full bg-brass-light/70"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-8 text-sm leading-6 text-ivory/55">
                Yuzrix exists to make useful market intelligence accessible to
                small businesses — starting with the ones already selling
                great food around you.
              </p>
            </div>
          </div>

          {/* Numbered operating-values ledger. */}
          <div>
            <div className="about-reveal">
              <h2
                id="about-heading"
                className="max-w-2xl font-serif text-3xl leading-[1.1] font-normal tracking-tight text-navy sm:text-4xl md:text-[2.75rem]"
              >
                We close the gap between a hunch and a decision.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ink/60 sm:text-[15px]">
                Large companies have access to pricing teams and competitive
                intelligence. Small local businesses often do not. We are
                making that kind of insight simpler to reach — beginning with
                food businesses, and eventually local and rural SMEs across
                India and beyond.
              </p>
            </div>

            <ul className="mt-10 divide-y divide-navy/10 border-t border-navy/10">
              {values.map((value, index) => (
                <li
                  key={value.number}
                  className="about-value about-reveal group flex gap-5 py-5 sm:gap-7 sm:py-6"
                  style={{ transitionDelay: `${140 + index * 90}ms` }}
                >
                  <span className="shrink-0 font-serif text-sm text-brass-deep/70 transition-colors duration-300 group-hover:text-brass-deep">
                    {value.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg leading-snug text-navy sm:text-xl">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink/55">
                      {value.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}