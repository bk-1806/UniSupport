"use client"

import { Crosshair, Activity, Circle } from "lucide-react"
import type { AIResponse } from "@/app/dashboard/page"

interface InsightsPanelProps {
  response: AIResponse | null
  isLoading: boolean
}

const priorityConfig = {
  high: { label: "High", dot: "bg-red-400" },
  medium: { label: "Medium", dot: "bg-amber-400" },
  low: { label: "Low", dot: "bg-emerald-400" },
}

export function InsightsPanel({ response, isLoading }: InsightsPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
          Insights
        </p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/[0.04]" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-12 rounded bg-white/[0.04]" />
                  <div className="h-3 w-20 rounded bg-white/[0.06]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="space-y-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
          Insights
        </p>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <div className="mb-3 h-10 w-10 rounded-lg border border-white/[0.06] bg-white/[0.02]" />
          <p className="text-[12px] text-white/30">
            Insights appear after analysis
          </p>
        </div>
      </div>
    )
  }

  const priority = priorityConfig[response.priority]

  const insights = [
    { icon: Crosshair, label: "Intent", value: response.intent },
    { icon: Activity, label: "Emotion", value: response.emotion },
    { icon: Circle, label: "Priority", value: priority.label, dot: priority.dot },
  ]

  return (
    <div className="animate-in fade-in space-y-4 duration-300">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
        Insights
      </p>
      
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors duration-200 hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <insight.icon className="h-4 w-4 text-white/40" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/25">
                  {insight.label}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  {insight.dot && (
                    <div className={`h-1.5 w-1.5 rounded-full ${insight.dot}`} />
                  )}
                  <p className="truncate text-[13px] font-medium text-white/80">
                    {insight.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
