'use client'

import { Clock } from 'lucide-react'

export function VersionBadge() {
  const buildDate = new Date().toISOString().split('T')[0]
  const buildTime = new Date().toISOString().split('T')[1].substring(0, 5)
  
  return (
    <div className="fixed bottom-3 right-3 z-40">
      <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-blue-200/60 border border-white/[0.04]">
        <Clock className="w-3 h-3" />
        <span className="font-mono text-graphite-300">
          v{buildDate.replace(/-/g, '.')}.{buildTime.replace(':', '')}
        </span>
        <span className="text-blue-400/50">|</span>
        <span className="text-emerald-400 font-medium">ESPECIALIZACIONES</span>
      </div>
    </div>
  )
}