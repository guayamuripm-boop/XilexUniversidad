import { Clock } from 'lucide-react'

/**
 * Build stamp shown in the corner.
 *
 * This used to call `new Date()` during render in a client component, so the
 * server-rendered timestamp never matched the client's and React logged a
 * hydration mismatch on every page — and the "version" was really just the
 * current clock. It is now evaluated once, at build time, on the server.
 */
const BUILD_STAMP =
  process.env.NEXT_PUBLIC_BUILD_ID ??
  new Date().toISOString().slice(0, 16).replace('T', ' ')

export function VersionBadge() {
  return (
    <div className="fixed bottom-3 right-3 z-40 pointer-events-none">
      <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-blue-200/60 border border-white/[0.04]">
        <Clock className="w-3 h-3" />
        <span className="font-mono">build {BUILD_STAMP}</span>
      </div>
    </div>
  )
}
