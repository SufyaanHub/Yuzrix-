import { ArrowRight } from "lucide-react"

import { AboutYuzrix } from "@/components/about-yuzrix"
import { AssistantWidget } from "@/components/assistant-widget"
import { ContactYuzrix } from "@/components/contact-yuzrix"
import { HeroVideoBg } from "@/components/hero-video-bg"
import { HowItWorks } from "@/components/how-it-works"
import { PricingProblemSection } from "@/components/pricing-problem-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { WhatYouGetMarquee } from "@/components/what-you-get-marquee"

/** Mirrors the four points of the concierge price audit. */
const deliverables = [
  { number: "01", label: "Local price comparison" },
  { number: "02", label: "Where your price stands" },
  { number: "03", label: "One clear recommendation" },
]

function InfoPanel() {
  return (
    <div className="w-full max-w-5xl px-4 sm:px-6">
      <div className="info-panel-card border border-b-0 border-navy/12 bg-ivory/92 px-5 pt-8 pb-0 shadow-[0_-20px_60px_-40px_rgba(20,24,31,0.45)] backdrop-blur-sm sm:px-8 sm:pt-12 md:px-12 md:pt-16">
        <div className="info-panel-grid grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-brass-deep uppercase">
              What you get
            </p>
            <h2 className="mt-3 font-serif text-2xl leading-tight font-normal tracking-tight text-navy sm:text-3xl md:text-4xl">
              A read on your <br className="hidden sm:block" /> local market
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-ink/65 md:text-[15px]">
            Every audit compares your product with similar ones nearby, then
            tells you plainly where you stand and what to consider next.
          </p>
        </div>

        <div className="info-divider mt-6 h-px w-full bg-navy/12 sm:mt-8 md:mt-10" />

        <div
          id="audit-deliverables"
          className="info-features grid gap-2 py-2 sm:grid-cols-3 sm:gap-3 sm:py-3"
        >
          {deliverables.map((feature) => (
            <a
              key={feature.number}
              href="#what-you-get"
              className="group flex cursor-pointer items-center justify-between bg-ivory-deep px-4 py-3.5 text-sm text-ink transition-all duration-200 hover:bg-ivory-deep/70 sm:px-6 sm:py-4"
            >
              <span>
                <span className="text-brass-deep/70">{feature.number}</span>
                <span className="mx-2 text-ink/25">/</span>
                <span className="font-medium">{feature.label}</span>
              </span>
              <ArrowRight className="size-4 text-ink/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brass-deep" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-ivory">
      <SiteNavbar />

      <section className="relative flex min-h-screen flex-col items-center overflow-hidden sm:h-screen">
        <HeroVideoBg />
        <div aria-hidden="true" className="hero-veil absolute inset-0 z-1" />

        <div className="hero-copy relative z-10 flex flex-col items-center px-4 pt-24 text-center sm:px-6 sm:pt-26 md:pt-32">
          <p className="mb-5 flex items-center gap-3 text-[10px] font-medium tracking-[0.16em] text-brass-deep uppercase sm:text-[11px] sm:tracking-[0.22em]">
            <span className="h-px w-8 bg-brass/50" />
            Varanasi · Home bakers &amp; kitchens
          </p>
          <h1 className="hero-heading font-serif text-4xl leading-[1.1] font-normal tracking-tighter text-navy sm:text-5xl md:text-7xl lg:text-8xl">
            Know what your
            <br />
            market charges.
          </h1>
          <p className="hero-subcopy mt-5 max-w-sm text-sm leading-relaxed text-ink/70 sm:mt-6 sm:max-w-md md:mt-8 md:text-base">
            You tell us what you sell. We research what similar businesses
            nearby are charging, and help you understand what to do about your
            price.
          </p>
          <a
            id="request-audit"
            href="#contact"
            className="hero-demo mt-6 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-ivory transition-colors duration-200 hover:bg-navy-deep sm:mt-8 sm:px-8 sm:py-3.5 md:mt-10"
          >
            Claim your free audit
          </a>
        </div>

        <div className="relative z-10 mt-auto flex w-full justify-center">
          <InfoPanel />
        </div>
      </section>

      <PricingProblemSection />

      <HowItWorks />

      <WhatYouGetMarquee />

      <AboutYuzrix />

      <ContactYuzrix />

      <SiteFooter />

      {/* Floating LLM assistant. Rendered last so it sits above every
          section without affecting the existing layout. */}
      <AssistantWidget />
    </main>
  )
}
