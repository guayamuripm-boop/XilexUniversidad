import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { VersionBadge } from '@/components/VersionBadge'

// Previously a hand-rolled `{ className, variable }` object, which put the raw
// string "--font-inter" in the html class list and loaded no font at all, so
// tailwind's `font-sans` (var(--font-inter)) always fell through to system-ui.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'XILEX - Práctica SIMADI, UNIMET, USB, UCAB',
  description: 'Sistema de práctica para pruebas de admisión universitaria venezolana. Banco propio de ejercicios, simulacros configurables y feedback explicado.',
  keywords: ['SIMADI', 'UNIMET', 'USB', 'UCAB', 'admisión universitaria', 'bachillerato', 'práctica'],
  authors: [{ name: 'XILEX Team' }],
  openGraph: {
    title: 'XILEX - Tu práctica para admisión universitaria',
    description: 'Prepárate para SIMADI, UNIMET, USB y UCAB con ejercicios propios y feedback explicado.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a1929',
  width: 'device-width',
  initialScale: 1,
  // maximumScale/userScalable were locked to 1/false, which blocks pinch-zoom.
  // Students read dense question text on phones; they must be able to zoom.
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased dark`} suppressHydrationWarning>
      {/* Background and text colours live in globals.css; the previous
          bg-graphite-950 / text-graphite-200 classes referenced a palette that
          does not exist in tailwind.config.js and generated no CSS. */}
      <body className="min-h-screen">
        {children}
        <VersionBadge />
      </body>
    </html>
  )
}
