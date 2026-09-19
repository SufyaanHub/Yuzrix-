const footerLinks = [
  { label: "The problem", href: "#pricing-problem" },
  { label: "What you get", href: "#what-you-get" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
]

/**
 * Compact closing footer. Kept deliberately small and quiet — it sits under
 * the contact panel and only needs to restate the brand, the navigation and
 * the honest positioning (concierge service, not automated monitoring).
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-navy/10 bg-ivory px-5 py-9 sm:px-10 sm:py-10 md:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        {/* Brand */}
        <div className="max-w-sm">
          <p className="font-serif text-xl leading-none font-normal tracking-tight text-navy">
            Yuzrix
          </p>
          <p className="mt-2.5 text-xs leading-5 text-ink/65">
            Price intelligence for home bakers and cloud kitchens. A
            concierge research service, based in Varanasi.
          </p>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-2.5"
        >
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium tracking-wide text-navy/70 transition-colors duration-200 hover:text-brass-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Small print */}
        <div className="flex flex-col gap-2 lg:items-end">
          <a
            href="mailto:hello@yuzrix.in"
            className="text-xs font-medium text-brass-deep transition-colors duration-200 hover:text-navy"
          >
            hello@yuzrix.in
          </a>
          <p className="text-xs text-ink/65">
            © {year} Yuzrix · Varanasi, India
          </p>
        </div>
      </div>
    </footer>
  )
}