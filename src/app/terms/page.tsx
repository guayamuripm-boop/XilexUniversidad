'use client'

import Link from 'next/link'
import { Brain, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
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

        <h1 className="text-3xl font-bold text-white mb-6">T&eacute;rminos de Uso</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-blue-200">
          <p><strong>&Uacute;ltima actualizaci&oacute;n:</strong> 15 de julio de 2026</p>

          <h2 className="text-xl font-semibold text-white">1. Aceptaci&oacute;n de los t&eacute;rminos</h2>
          <p>Al acceder y usar XILEX, aceptas estos t&eacute;rminos de uso. Si no est&aacute;s de acuerdo, no uses la plataforma.</p>

          <h2 className="text-xl font-semibold text-white">2. Descripci&oacute;n del servicio</h2>
          <p>XILEX es una plataforma gratuita de pr&aacute;ctica para ex&aacute;menes de admisi&oacute;n universitaria venezolana. Ofrece bancos de ejercicios propios, simulacros configurables y feedback explicado.</p>

          <h2 className="text-xl font-semibold text-white">3. Uso aceptable</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usar la plataforma &uacute;nicamente para fines educativos personales.</li>
            <li>No intentar acceder a cuentas de otros usuarios.</li>
            <li>No reproducir, distribuir o revender el contenido de la plataforma.</li>
            <li>No realizar actividades que puedan afectar el funcionamiento del servicio.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">4. Propiedad intelectual</h2>
          <p>Todo el contenido de XILEX (ejercicios, explicaciones, dise&ntilde;o) es original y propiedad de la plataforma. Los ejercicios se generan bas&aacute;ndose en patrones oficiales publicados, no son copias de ex&aacute;menes filtrados.</p>

          <h2 className="text-xl font-semibold text-white">5. Limitaci&oacute;n de responsabilidad</h2>
          <p>XILEX se proporciona &quot;tal cual&quot; sin garant&iacute;as de ning&uacute;n tipo. No garantizamos resultados espec&iacute;ficos en ex&aacute;menes de admisi&oacute;n. La plataforma es una herramienta de pr&aacute;ctica, no un sustituto de preparaci&oacute;n formal.</p>

          <h2 className="text-xl font-semibold text-white">6. Cambios en los t&eacute;rminos</h2>
          <p>Nos reservamos el derecho de modificar estos t&eacute;rminos en cualquier momento. Los cambios ser&aacute;n efectivos al publicarse en esta p&aacute;gina.</p>

          <h2 className="text-xl font-semibold text-white">7. Contacto</h2>
          <p>Para preguntas sobre estos t&eacute;rminos, contacta a trav&eacute;s de los canales oficiales de XILEX.</p>
        </div>
      </main>
    </div>
  )
}
