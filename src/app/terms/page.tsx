'use client'

import Link from 'next/link'
import { Brain, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">XILEX</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-white mb-6">Términos de Uso</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-graphite-300">
          <p><strong>Última actualización:</strong> 15 de julio de 2026</p>

          <h2 className="text-xl font-semibold text-white">1. Aceptación de los términos</h2>
          <p>Al acceder y usar XILEX, aceptas estos términos de uso. Si no estás de acuerdo, no uses la plataforma.</p>

          <h2 className="text-xl font-semibold text-white">2. Descripción del servicio</h2>
          <p>XILEX es una plataforma gratuita de práctica para exámenes de admisión universitaria venezolana. Ofrece bancos de ejercicios propios, simulacros configurables y feedback explicado.</p>

          <h2 className="text-xl font-semibold text-white">3. Uso aceptable</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usar la plataforma únicamente para fines educativos personales.</li>
            <li>No intentar acceder a cuentas de otros usuarios.</li>
            <li>No reproducir, distribuir o revender el contenido de la plataforma.</li>
            <li>No realizar actividades que puedan afectar el funcionamiento del servicio.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">4. Propiedad intelectual</h2>
          <p>Todo el contenido de XILEX (ejercicios, explicaciones, diseño) es original y propiedad de la plataforma. Los ejercicios se generan basándose en patrones oficiales publicados, no son copias de exámenes filtrados.</p>

          <h2 className="text-xl font-semibold text-white">5. Limitación de responsabilidad</h2>
          <p>XILEX se proporcion &quot;tal cual&quot; sin garantías de ningún tipo. No garantizamos resultados específicos en exámenes de admisión. La plataforma es una herramienta de práctica, no un sustituto de preparación formal.</p>

          <h2 className="text-xl font-semibold text-white">6. Cambios en los términos</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos al publicarse en esta página.</p>

          <h2 className="text-xl font-semibold text-white">7. Contacto</h2>
          <p>Para preguntas sobre estos términos, contacta a través de los canales oficiales de XILEX.</p>
        </div>
      </main>
    </div>
  )
}
