"use client"

import type { AIResponse } from "@/app/dashboard/page"

interface RecommendedActionsProps {
  response: AIResponse | null
  isLoading: boolean
}

export function RecommendedActions({ response, isLoading }: RecommendedActionsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
          Recommended Actions
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    )
  }

  if (!response) {
    return null
  }

  return (
    <div className="animate-in fade-in rounded-2xl border border-white/[0.05] bg-white/[0.015] p-8 duration-300">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
          Recommended Actions
        </p>
        <span className="text-[10px] tracking-wide text-white/20">
          {response.actions.length} steps
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {response.actions.map((action, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.035]"
          >
            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-[11px] font-medium text-white/40">
              {index + 1}
            </div>
            <p className="text-[13px] leading-[1.6] text-white/55">
              {action}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
