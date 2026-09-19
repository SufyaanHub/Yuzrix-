"use client"

import { Clock, Mail, MapPin, Send } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"

import { cn } from "@/lib/utils"

/**
 * Routing desks, mirroring the "reach the right desk" pattern.
 * TODO: replace these with Yuzrix's real addresses before launch.
 */
const desks = [
  {
    label: "Start a price audit",
    detail: "Send your product list and we begin the research.",
    email: "audit@yuzrix.in",
    initials: "PA",
  },
  {
    label: "Ask a question",
    detail: "Not sure where to begin? Tell us what you sell.",
    email: "hello@yuzrix.in",
    initials: "HQ",
  },
  {
    label: "Partner with us",
    detail: "Bakers' groups, cloud kitchen operators and suppliers.",
    email: "partners@yuzrix.in",
    initials: "PT",
  },
]

const enquiryTypes = [
  "Free 5-item price audit",
  "Question about my price",
  "Partnership",
  "Something else",
]

type FormState = {
  name: string
  email: string
  business: string
  enquiry: string
  message: string
  agreed: boolean
}

const emptyForm: FormState = {
  name: "",
  email: "",
  business: "",
  enquiry: enquiryTypes[0],
  message: "",
  agreed: false,
}

type Errors = Partial<Record<keyof FormState, string>>

export function ContactYuzrix() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsVisible(true)
        observer.disconnect()
      },
      { threshold: 0.1 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (state: FormState): Errors => {
    const next: Errors = {}

    if (!state.name.trim()) next.name = "Please tell us your name."
    if (!state.email.trim()) {
      next.email = "Please add an email so we can reply."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.email.trim())) {
      next.email = "That email does not look right."
    }
    if (!state.message.trim()) {
      next.message = "Tell us what you sell, even briefly."
    }
    if (!state.agreed) next.agreed = "Please accept the privacy note."

    return next
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // TODO: wire this to a real endpoint (form service, email, or API route).
    setSent(true)
  }

  const inputClass =
    "w-full rounded-lg border border-navy/15 bg-ivory-deep/70 px-3.5 py-2.5 text-sm text-navy transition-colors duration-200 outline-none placeholder:text-ink/65 focus:border-brass-deep/60 focus:bg-ivory-deep"

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      data-visible={isVisible}
      className="contact-section relative overflow-hidden bg-navy px-5 py-12 sm:px-10 sm:py-16 md:px-14 lg:py-20"
    >
      <div aria-hidden="true" className="contact-glow absolute inset-0" />

      <div className="relative mx-auto max-w-7xl">
        <div className="contact-reveal max-w-3xl">
          <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-brass-light uppercase">
            <span className="h-px w-10 bg-brass-light/45" />
            Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-5 font-serif text-3xl leading-[1.05] font-normal tracking-tight text-ivory sm:text-4xl md:text-5xl"
          >
            Reach the right desk, first time.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ivory/55 sm:text-[15px]">
            Tell us what you sell and what you charge. We will research
            comparable prices in your local market and come back with a clear
            read — starting with a free 5-item audit.
          </p>
        </div>

        <div className="mt-9 grid gap-8 lg:mt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Routing desks and practical details. */}
          <div className="contact-reveal space-y-5">
            <div className="space-y-1">
              {desks.map((desk, index) => (
                <a
                  key={desk.email}
                  href={`mailto:${desk.email}`}
                  className="group flex items-start gap-3.5 rounded-xl border border-transparent p-3 transition-[background-color,border-color] duration-300 hover:border-ivory/12 hover:bg-navy-deep/50"
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brass-light/25 bg-brass-light/10 font-serif text-[11px] tracking-widest text-brass-light">
                    {desk.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium tracking-tight text-ivory">
                      {desk.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-ivory/45">
                      {desk.detail}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-brass-light/80">
                      <Mail className="size-3" strokeWidth={1.75} />
                      {desk.email}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="grid gap-4 border-t border-ivory/10 pt-6 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-brass-light uppercase">
                  <MapPin className="size-3.5" strokeWidth={1.75} />
                  Find us
                </p>
                {/* TODO: confirm the real address. */}
                <p className="mt-2 text-sm leading-6 text-ivory/60">
                  Varanasi, Uttar Pradesh
                  <br />
                  India
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-brass-light uppercase">
                  <Clock className="size-3.5" strokeWidth={1.75} />
                  Talk to us
                </p>
                <p className="mt-2 text-sm leading-6 text-ivory/60">
                  Replies within one working day
                  <br />
                  9am – 6pm, Mon to Sat
                </p>
              </div>
            </div>
          </div>

          {/* Enquiry form on a light panel so it reads as the primary action. */}
          <div className="contact-reveal rounded-2xl border border-ivory/15 bg-ivory p-5 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)] sm:p-7">
            {sent ? (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <span className="flex size-12 items-center justify-center rounded-full border border-brass/30 bg-brass/10">
                  <Send className="size-5 text-brass-deep" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-navy">
                  Thank you — we have your note.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-ink/70">
                  We will reply to{" "}
                  <span className="font-medium text-brass-deep">
                    {form.email}
                  </span>{" "}
                  within one working day with next steps for your free audit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm)
                    setSent(false)
                  }}
                  className="mt-6 rounded-lg border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy transition-colors duration-200 hover:border-brass-deep/50 hover:text-brass-deep"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl text-navy sm:text-2xl">
                    Or fill in the form and we&rsquo;ll reach out.
                  </h3>
                  <p className="mt-1.5 text-xs text-ink/65">
                    No account needed. It takes about a minute.
                  </p>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-medium text-navy/75"
                    >
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      aria-invalid={!!errors.name}
                      placeholder="Your name"
                      className={cn(
                        inputClass,
                        errors.name && "border-range-above/60"
                      )}
                    />
                    {errors.name ? (
                      <p className="mt-1.5 text-[11px] text-range-above-on-light">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-medium text-navy/75"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      placeholder="you@example.com"
                      className={cn(
                        inputClass,
                        errors.email && "border-range-above/60"
                      )}
                    />
                    {errors.email ? (
                      <p className="mt-1.5 text-[11px] text-range-above-on-light">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-business"
                      className="mb-1.5 block text-xs font-medium text-navy/75"
                    >
                      Business name{" "}
                      <span className="text-ink/55">(optional)</span>
                    </label>
                    <input
                      id="contact-business"
                      name="business"
                      value={form.business}
                      onChange={(e) => update("business", e.target.value)}
                      placeholder="Your kitchen or bakery"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-enquiry"
                      className="mb-1.5 block text-xs font-medium text-navy/75"
                    >
                      Type of enquiry
                    </label>
                    <select
                      id="contact-enquiry"
                      name="enquiry"
                      value={form.enquiry}
                      onChange={(e) => update("enquiry", e.target.value)}
                      className={cn(inputClass, "appearance-none")}
                    >
                      {enquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-medium text-navy/75"
                  >
                    What do you sell, and what do you charge?
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    placeholder="e.g. 500g chocolate cake at ₹600, plus cupcakes and cookies"
                    className={cn(
                      inputClass,
                      "resize-none",
                      errors.message && "border-range-above/60"
                    )}
                  />
                  {errors.message ? (
                    <p className="mt-1.5 text-[11px] text-range-above-on-light">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={form.agreed}
                      onChange={(e) => update("agreed", e.target.checked)}
                      aria-invalid={!!errors.agreed}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brass-deep"
                    />
                    <span className="text-xs leading-5 text-ink/65">
                      I agree that Yuzrix may use these details to reply about
                      my enquiry. We do not share them with anyone else.
                    </span>
                  </label>
                  {errors.agreed ? (
                    <p className="mt-1.5 text-[11px] text-range-above-on-light">
                      {errors.agreed}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-ivory transition-colors duration-200 hover:bg-navy-deep sm:w-auto sm:px-8"
                >
                  Send message
                  <Send className="size-3.5" strokeWidth={2} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}