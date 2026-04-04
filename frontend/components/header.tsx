"use client"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-10">
        <div className="flex flex-col">
          <span className="text-[12px] font-light tracking-wider text-white/40">
            UniSupport AI
          </span>
          <span className="text-[10px] font-medium tracking-widest text-emerald-500/50 uppercase mt-0.5">
            AI-powered autonomous support agent
          </span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="h-[5px] w-[5px] rounded-full bg-emerald-500/60" />
          <span className="text-[10px] font-normal tracking-wide text-white/35">System Online</span>
        </div>
      </div>
    </header>
  )
}
