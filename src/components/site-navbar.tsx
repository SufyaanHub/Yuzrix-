"use client"

import { useEffect, useState } from "react"

const navigation = [
  { label: "The problem", href: "#pricing-problem" },
  { label: "What you get", href: "#what-you-get" },
  { label: "Contact", href: "#contact" },
]

/**
 * `yuzrix-logo.png` is a cleaned crop of the supplied artwork: the tiny
 * tagline ("Smarter Prices. Stronger Kitchens.") is erased because it turns
 * to mush below ~60px, and the transparent padding is trimmed so the mark
 * reads clearly at navbar size.
 */
const LOGO_ASPECT = 456 / 202

export function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateNavbar = () => setIsScrolled(window.scrollY > 24)

    updateNavbar()
    window.addEventListener("scroll", updateNavbar, { passive: true })
    return () => window.removeEventListener("scroll", updateNavbar)
  }, [])

  return (
    <header
      data-scrolled={isScrolled}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        isScrolled
          ? "border-navy/10 bg-ivory/82 shadow-[0_12px_36px_-24px_rgba(13,22,38,0.45)] backdrop-blur-xl"
          : "border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto grid max-w-360 grid-cols-2 items-center px-6 py-4 transition-[padding] duration-300 sm:px-10 sm:py-5 md:grid-cols-3 md:px-14"
      >
        <a
          href="#"
          aria-label="Yuzrix home"
          className="flex w-fit items-center"
        >
          {/* The wordmark is baked into the artwork, so no text label here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/yuzrix-logo.png"
            alt="Yuzrix"
            width={456}
            height={202}
            className="h-10 w-auto sm:h-11 md:h-12"
            style={{ aspectRatio: String(LOGO_ASPECT) }}
          />
        </a>

        <div className="hidden items-center justify-center gap-7 md:flex lg:gap-9">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm whitespace-nowrap text-ink/70 transition-colors duration-200 hover:text-brass-deep"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="justify-self-end rounded-lg bg-navy px-5 py-2.5 text-sm font-medium whitespace-nowrap text-ivory transition-colors duration-200 hover:bg-navy-deep"
        >
          Get a free audit
        </a>
      </nav>
    </header>
  )
}
