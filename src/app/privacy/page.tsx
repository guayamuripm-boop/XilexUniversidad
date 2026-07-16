'use client'

import Link from 'next/link'
import { Brain, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold text-white mb-6">Pol&iacute;tica de Privacidad</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-blue-200">
          <p><strong>&Uacute;ltima actualizaci&oacute;n:</strong> 15 de julio de 2026</p>

          <h2 className="text-xl font-semibold text-white">1. Informaci&oacute;n que recopilamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Informaci&oacute;n de cuenta:</strong> Correo electr&oacute;nico y nombre para crear tu cuenta.</li>
            <li><strong>Datos de uso:</strong> Respuestas a preguntas, tiempo por pregunta, y progreso en simulacros.</li>
            <li><strong>Informaci&oacute;n t&eacute;cnica:</strong> Tipo de navegador y dispositivo (datos an&oacute;nimos de uso).</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">2. C&oacute;mo usamos tu informaci&oacute;n</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Para proporcionarte acceso a la plataforma y sus funciones.</li>
            <li>Para calcular tu progreso y estad&iacute;sticas de rendimiento.</li>
            <li>Para mejorar la calidad de los ejercicios y explicaciones.</li>
            <li>Para enviarte notificaciones sobre tu cuenta (solo si las activas).</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">3. Compartir informaci&oacute;n</h2>
          <p>No vendemos ni compartimos tu informaci&oacute;n personal con terceros. Tus datos de uso son privados y solo t&uacute; puedes ver tu progreso detallado.</p>

          <h2 className="text-xl font-semibold text-white">4. Seguridad</h2>
          <p>Usamos Supabase como plataforma de base de datos, que incluye autenticaci&oacute;n segura y cifrado de datos. Sin embargo, ning&uacute;n sistema es 100% seguro.</p>

          <h2 className="text-xl font-semibold text-white">5. Cookies</h2>
          <p>XILEX usa cookies necesarias para el funcionamiento de la sesi&oacute;n. No usamos cookies de rastreo publicitario.</p>

          <h2 className="text-xl font-semibold text-white">6. Tus derechos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Puedes eliminar tu cuenta en cualquier momento desde la configuraci&oacute;n.</li>
            <li>Puedes solicitar una copia de tus datos personales.</li>
            <li>Puedes solicitar la eliminaci&oacute;n de tus datos.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">7. Cambios en esta pol&iacute;tica</h2>
          <p>Podemos actualizar esta pol&iacute;tica peri&oacute;dicamente. Los cambios ser&aacute;n publicados en esta p&aacute;gina con la fecha de actualizaci&oacute;n.</p>

          <h2 className="text-xl font-semibold text-white">8. Contacto</h2>
          <p>Para preguntas sobre privacidad, contacta a trav&eacute;s de los canales oficiales de XILEX.</p>
        </div>
      </main>
    </div>
  )
}
