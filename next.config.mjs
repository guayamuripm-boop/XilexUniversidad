import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// Se resuelven aquí, en el build, para que lleguen al bundle como literales.
// Calcularlos dentro de un componente de cliente daría un valor distinto en el
// servidor y en el navegador, que es justo el desajuste de hidratación que ya
// tuvo esta etiqueta una vez.
const BUILD_DATE = new Date().toLocaleDateString('es-VE', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Caracas',
})
const COMMIT = (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_DATE: BUILD_DATE,
    NEXT_PUBLIC_COMMIT_SHA: COMMIT,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
  webpack(config) {
    config.resolve.fallback = { 
      ...config.resolve.fallback, 
      fs: false, 
      net: false, 
      tls: false 
    }
    return config
  },
}

export default nextConfig