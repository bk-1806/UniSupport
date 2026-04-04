"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import type { AIResponse } from "@/app/dashboard/page"

interface ResponsePanelProps {
  response: AIResponse | null
  isLoading: boolean
}

const thinkingSteps = [
  { text: "Analyzing request", delay: 0 },
  { text: "Detecting intent", delay: 600 },
  { text: "Checking policies", delay: 1200 },
  { text: "Reviewing records", delay: 1800 },
  { text: "Generating decision", delay: 2200 },
]

const decisionConfig: Record<string, any> = {
  Resolved: {
    gradient: "from-emerald-950/50 to-emerald-950/20",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
  Closed: {
    gradient: "from-neutral-800/50 to-neutral-900/30",
    border: "border-white/10",
    text: "text-white/70",
    glow: "shadow-white/5",
  },
  "Escalated to Admin": {
    gradient: "from-amber-950/50 to-amber-950/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/10",
  },
  "Needs Review": {
    gradient: "from-amber-950/50 to-amber-950/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/10",
  },
}

export function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (isLoading) {
      setCurrentStep(0)
      setCompletedSteps([])
      
      thinkingSteps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentStep(index)
          if (index > 0) {
            setCompletedSteps(prev => [...prev, index - 1])
          }
        }, step.delay)
      })
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10">
        <div className="relative mb-10">
          <div className="h-16 w-16 rounded-full border border-white/10 bg-white/[0.03]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 animate-pulse rounded-full bg-white/60" />
          </div>
        </div>

        <div className="w-full max-w-[220px] space-y-3">
          {thinkingSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                index <= currentStep ? "opacity-100" : "opacity-20"
              }`}
            >
              <div className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
                completedSteps.includes(index)
                  ? "bg-emerald-500/20"
                  : index === currentStep
                  ? "border border-white/20"
                  : "border border-white/10"
              }`}>
                {completedSteps.includes(index) ? (
                  <Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
                ) : index === currentStep ? (
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
                ) : null}
              </div>
              <span className={`text-[13px] transition-colors duration-300 ${
                index === currentStep ? "text-white/80" : "text-white/40"
              }`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10">
        <div className="mb-6 h-16 w-16 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
        <p className="text-[15px] font-medium text-white/80">Ticket System</p>
        <p className="mt-2 max-w-[240px] text-center text-[13px] leading-relaxed text-white/40">
          Create a new ticket to receive an AI-powered autonomous resolution
        </p>
      </div>
    )
  }

  const config = decisionConfig[response.decision]

  return (
    <div className="animate-in fade-in rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 duration-300">
      <div className="mb-6 flex items-center justify-between border-b border-white/[0.06] pb-4">
        <span className="text-[11px] font-medium text-white/40">TICKET DETAILS</span>
        <span className="rounded-md bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-white/60">
          Ticket ID: {response.ticketId || "TKT-N/A"}
        </span>
      </div>

      {/* Decision Card */}
      <div className={`mb-8 rounded-2xl border ${config.border} bg-gradient-to-b ${config.gradient} p-8 shadow-2xl ${config.glow}`}>
        <div className="flex flex-col items-center text-center">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
            Ticket Status
          </p>
          <p className={`text-3xl font-semibold tracking-tight ${config.text}`}>
            {response.decision}
          </p>
          {(response.decision === "Escalated to Admin" || response.decision === "Needs Review") && (
             <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5">
               <p className="text-[12px] font-medium text-amber-400/90">This issue requires manual review.</p>
             </div>
          )}
        </div>

        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
              Confidence
            </span>
            <span className="text-lg font-semibold tabular-nums text-white">{response.confidence}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-white/30 via-white/50 to-white/70 transition-all duration-1000 ease-out"
              style={{ width: `${response.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Response */}
      <div className="mb-6">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
          AI Resolution
        </p>
        <p className="text-[14px] leading-[1.7] text-white/70">{response.response}</p>
      </div>

      {/* Expandable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors duration-200 hover:bg-white/[0.04]"
      >
        <span className="text-[12px] font-medium text-white/50">
          Detailed Explanation
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-white/30" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/30" />
        )}
      </button>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-1 mt-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 duration-200">
          <p className="text-[13px] leading-[1.7] text-white/50">
            {response.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
