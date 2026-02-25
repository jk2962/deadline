const H = 60 * 60 * 1000
const D = 24 * H

export const THRESHOLDS = {
  CALM:     D,        // > 24h  → green
  AWARE:    6 * H,    // > 6h   → yellow
  URGENT:   H,        // > 1h   → orange
  CRITICAL: 15 * 60 * 1000  // > 15min → red (below = alarm / pulse)
}

export function getUrgency(deadline, now) {
  const diff = deadline - now
  if (diff < 0)                      return 'overdue'
  if (diff > THRESHOLDS.CALM)        return 'calm'
  if (diff > THRESHOLDS.AWARE)       return 'aware'
  if (diff > THRESHOLDS.URGENT)      return 'urgent'
  if (diff > THRESHOLDS.CRITICAL)    return 'critical'
  return 'alarm'
}

function formatDuration(ms) {
  const totalSecs = Math.floor(Math.abs(ms) / 1000)
  const s = totalSecs % 60
  const m = Math.floor(totalSecs / 60) % 60
  const h = Math.floor(totalSecs / 3600) % 24
  const d = Math.floor(totalSecs / 86400)

  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatCountdown(deadline, now) {
  const diff = deadline - now
  if (diff < 0) return `OVERDUE +${formatDuration(diff)}`
  return formatDuration(diff)
}

export function formatDeadline(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
