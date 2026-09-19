"use client"

import { useEffect, useState } from "react"

const navigation = [
  { label: "The problem", href: "#pricing-problem" },
  { label: "What you get", href: "#what-you-get" },
  { label: "Free 5-item audit", href: "#request-audit" },
]

function LogoMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="size-6 text-navy"
    >
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z" />
      <path d="M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z" />
      <path d="M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  )
}

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
        className="mx-auto grid max-w-[1440px] grid-cols-2 items-center px-6 py-4 transition-[padding] duration-300 sm:px-10 sm:py-5 md:grid-cols-3 md:px-14"
      >
        <a
          href="#"
          aria-label="Yuzrix home"
          className="flex w-fit items-center gap-2.5"
        >
          <LogoMark />
          <span className="font-serif text-lg tracking-tight text-navy">
            Yuzrix
          </span>
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
          href="#request-audit"
          className="justify-self-end rounded-lg bg-navy px-5 py-2.5 text-sm font-medium whitespace-nowrap text-ivory transition-colors duration-200 hover:bg-navy-deep"
        >
          Request an audit
        </a>
      </nav>
    </header>
  )
}
