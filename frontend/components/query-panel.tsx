"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface QueryPanelProps {
  query: string
  setQuery: (query: string) => void
  onSubmit: (query: string) => void
  onExampleClick: (example: string) => void
  isLoading: boolean
}

const examples = [
  "Attendance below 75%",
  "Medical leave issue",
  "Fee refund request",
]

export function QueryPanel({
  query,
  setQuery,
  onSubmit,
  onExampleClick,
  isLoading,
}: QueryPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      onSubmit(query)
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/30">
        Support Ticket
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Describe your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[120px] resize-none rounded-xl border-white/[0.06] bg-white/[0.03] text-[14px] text-white placeholder:text-white/25 focus:border-white/10 focus:ring-0"
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="w-full rounded-xl bg-white py-5 text-[13px] font-medium text-black transition-all duration-200 hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-black/20 border-t-black" />
              Analyzing
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              Create Ticket
            </span>
          )}
        </Button>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
          Examples
        </p>
        <div className="flex flex-col gap-2">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => onExampleClick(example)}
              disabled={isLoading}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-left text-[13px] text-white/60 transition-colors duration-200 hover:border-white/10 hover:bg-white/[0.04] hover:text-white/80 disabled:opacity-40"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
