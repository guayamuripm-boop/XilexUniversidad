import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = { 
  className: 'font-inter',
  variable: '--font-inter',
}

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
  themeColor: '#0f1117',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-graphite-950 text-graphite-200">
        {children}
      </body>
    </html>
  )
}
