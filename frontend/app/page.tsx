"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    router.prefetch("/dashboard")
  }, [router])

  const handleLaunch = () => {
    setIsNavigating(true)
    router.push("/dashboard")
  }

  return (
    <div className={`relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-emerald-500/30 transition-opacity duration-150 ${isNavigating ? 'opacity-0' : 'opacity-100'}`}>
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
        <span className="text-xl font-semibold tracking-wide text-white/90">UniSupport AI</span>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
          <span className="text-sm font-medium tracking-wide text-white/40">System Online</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <section className="flex flex-col items-center justify-center text-center">
          <div
            className={`transition-all duration-1000 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="mb-6 text-balance text-6xl font-semibold tracking-tight sm:text-7xl lg:text-[5.5rem] leading-[1.1] text-white">
              AI-Powered
              <br />
              <span className="text-white/60">University Support System</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-pretty text-xl font-light leading-relaxed text-white/50">
              Instant academic decisions, CRT issue resolution, and policy-based support powered by AI
            </p>

            <Button
              onClick={handleLaunch}
              disabled={isNavigating}
              className="group mt-6 rounded-xl bg-white px-8 py-6 text-lg font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              {isNavigating ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-[2px] border-black/20 border-t-black" />
                  Loading...
                </span>
              ) : (
                <>
                  Launch Dashboard
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section
          className={`mt-32 transition-all delay-300 duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid gap-6 sm:grid-cols-3">
            <FeatureCard
              title="Academic Policy Decisions"
              description="Automated attendance, leave, and university rule handling"
            />
            <FeatureCard
              title="CRT Issue Resolution"
              description="Handles coding issues, assessments, deadlines, and platform errors"
            />
            <FeatureCard
              title="Explainable AI"
              description="Provides decisions with confidence score and reasoning"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] p-8 transition-all duration-500 hover:border-white/[0.08] hover:bg-white/[0.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <h3 className="mb-3 text-xl font-semibold tracking-wide text-white/90">{title}</h3>
      <p className="text-base leading-relaxed text-white/40 font-light">{description}</p>
    </div>
  )
}
