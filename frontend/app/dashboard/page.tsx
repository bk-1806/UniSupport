"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { QueryPanel } from "@/components/query-panel"
import { ResponsePanel } from "@/components/response-panel"
import { InsightsPanel } from "@/components/insights-panel"
import { RecommendedActions } from "@/components/recommended-actions"

export interface AIResponse {
  ticketId: string
  decision: "Resolved" | "Escalated to Admin" | "Needs Review" | "Closed"
  confidence: number
  response: string
  intent: string
  emotion: string
  priority: "high" | "medium" | "low"
  explanation: string
  actions: string[]
}

export default function Dashboard() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<AIResponse | null>(null)
  const [ticketHistory, setTicketHistory] = useState<AIResponse[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleSubmit = async (submittedQuery: string) => {
    setIsLoading(true)
    setResponse(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: submittedQuery }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch response")
      }

      const data = await res.json()
      const newTicketId = "TKT-" + Date.now()
      const rawDecision = (data.decision || "").toLowerCase()
      let parsedDecision: AIResponse["decision"] = "Needs Review"
      if (rawDecision.includes("approve") || rawDecision.includes("eligible")) parsedDecision = "Resolved"
      else if (rawDecision.includes("escalate")) parsedDecision = "Escalated to Admin"
      else if (rawDecision.includes("reject") || rawDecision.includes("block")) parsedDecision = "Closed"
      else if (rawDecision.includes("document") || rawDecision.includes("review")) parsedDecision = "Needs Review"

      const rawPriority = (data.priority || "").toLowerCase()
      let parsedPriority: AIResponse["priority"] = "low"
      if (rawPriority.includes("high")) parsedPriority = "high"
      else if (rawPriority.includes("medium")) parsedPriority = "medium"

      const rawConfidence = String(data.confidence || "85").replace(/[^0-9]/g, "")
      const parsedConfidence = parseInt(rawConfidence, 10)

      const newResponse: AIResponse = {
        ticketId: newTicketId,
        decision: parsedDecision,
        confidence: parsedConfidence || 85,
        response: data.answer || "No response provided.",
        intent: data.intent || "General Query",
        emotion: data.emotion || "Neutral",
        priority: parsedPriority,
        explanation: data.explanation || "Analyzed by AI Helpdesk",
        actions: data.action ? [data.action] : ["Follow university guidelines"],
      }
      setResponse(newResponse)
      setTicketHistory(prev => [newResponse, ...prev].slice(0, 3))
      setQuery("") // Reset input immediately
    } catch (error) {
      const fallbackResponse: AIResponse = {
        ticketId: "TKT-ERROR",
        decision: "Needs Review",
        confidence: 0,
        response: "An error occurred while connecting to the AI Helpdesk backend. Please ensure the backend server is running.",
        intent: "Error",
        emotion: "Neutral",
        priority: "high",
        explanation: "Backend connection failed. The AI engine is unreachable.",
        actions: ["Fix backend server issues", "Check network connection"],
      }
      setResponse(fallbackResponse)
      setTicketHistory(prev => [fallbackResponse, ...prev].slice(0, 3))
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    handleSubmit(example)
  }

  return (
    <div className={`min-h-screen bg-[#0a0a0a] transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      <main className="mx-auto max-w-[1600px] px-10 py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Query Panel - Left */}
          <div className="lg:col-span-3 space-y-6">
            <QueryPanel
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              onExampleClick={handleExampleClick}
              isLoading={isLoading}
            />
            {ticketHistory.length > 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-white/30">
                  Recent Tickets
                </p>
                <div className="space-y-3">
                  {ticketHistory.map((t, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 transition-colors hover:bg-white/[0.02]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium tracking-wider text-white/50">{t.ticketId}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          t.decision === "Resolved" ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" :
                          t.decision === "Closed" ? "border-white/10 text-white/70 bg-white/5" :
                          "border-amber-500/20 text-amber-400 bg-amber-500/10"
                        }`}>
                          {t.decision}
                        </span>
                      </div>
                      <p className="text-[12px] leading-relaxed text-white/70 line-clamp-2">{t.response}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Response Panel - Center (Main Focus) */}
          <div className="lg:col-span-6">
            <ResponsePanel response={response} isLoading={isLoading} />
          </div>
          
          {/* Insights Panel - Right */}
          <div className="lg:col-span-3">
            <InsightsPanel response={response} isLoading={isLoading} />
          </div>
        </div>
        
        {/* Recommended Actions - Bottom */}
        <div className="mt-10">
          <RecommendedActions response={response} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}
