export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex gap-3">
      <span className="text-warning text-lg leading-none shrink-0">⚠</span>
      <p className="text-xs text-warning/90 leading-relaxed">{children}</p>
    </div>
  )
}
