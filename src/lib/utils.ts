import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Countdown display: `m:ss`, or `h:mm:ss` once past an hour. Never negative. */
export function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getMasteryColor(level: string): string {
  const colors: Record<string, string> = {
    novice: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    learning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    proficient: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    mastered: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return colors[level] || colors.novice
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[difficulty] || colors.medium
}

export function getUniversityColor(code: string): string {
  const colors: Record<string, string> = {
    simadi: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    unimet: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    usb: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ucab: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }
  return colors[code] || colors.simadi
}

/**
 * Solid badge/tile background for a university.
 *
 * Kept separate from `getUniversityColor` (a light/dark text+bg pair): callers
 * used to derive this by string-replacing "text-" inside that pair, which only
 * replaced the first match and produced two conflicting background classes.
 */
export function getUniversityAccent(code: string): string {
  const colors: Record<string, string> = {
    simadi: 'bg-red-500/80',
    unimet: 'bg-blue-500/80',
    usb: 'bg-green-500/80',
    ucab: 'bg-amber-500/80',
  }
  return colors[code] || 'bg-primary/80'
}

export function getUniversityName(code: string): string {
  const names: Record<string, string> = {
    simadi: 'SIMADI (UCV)',
    unimet: 'UNIMET',
    usb: 'USB',
    ucab: 'UCAB',
  }
  return names[code] || code.toUpperCase()
}