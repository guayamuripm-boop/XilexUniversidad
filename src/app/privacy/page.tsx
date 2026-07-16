'use client'

import Link from 'next/link'
import { Brain, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold text-white mb-6">Política de Privacidad</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-graphite-300">
          <p><strong>Última actualización:</strong> 15 de julio de 2026</p>

          <h2 className="text-xl font-semibold text-white">1. Información que recopilamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Información de cuenta:</strong> Correo electrónico y nombre para crear tu cuenta.</li>
            <li><strong>Datos de uso:</strong> Respuestas a preguntas, tiempo por pregunta, y progreso en simulacros.</li>
            <li><strong>Información técnica:</strong> Tipo de navegador y dispositivo (datos anónimos de uso).</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">2. Cómo usamos tu información</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Para provideerte acceso a la plataforma y sus funciones.</li>
            <li>Para calcular tu progreso y estadísticas de rendimiento.</li>
            <li>Para mejorar la calidad de los ejercicios y explicaciones.</li>
            <li>Para enviarte notificaciones sobre tu cuenta (solo si las activas).</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">3. Compartir información</h2>
          <p>No vendemos ni compartimos tu información personal con terceros. Tus datos de uso son privados y solo tú puedes ver tu progreso detallado.</p>

          <h2 className="text-xl font-semibold text-white">4. Seguridad</h2>
          <p>Usamos Supabase como plataforma de base de datos, que incluye autenticación segura y cifrado de datos. Sin embargo, ningún sistema es 100% seguro.</p>

          <h2 className="text-xl font-semibold text-white">5. Cookies</h2>
          <p>XILEX usa cookies necesarias para el funcionamiento de la sesión. No usamos cookies de rastreo publicitario.</p>

          <h2 className="text-xl font-semibold text-white">6. Tus derechos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Puedes eliminar tu cuenta en cualquier momento desde la configuración.</li>
            <li>Puedes solicitar una copia de tus datos personales.</li>
            <li>Puedes solicitar la eliminación de tus datos.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">7. Cambios en esta política</h2>
          <p>Podemos actualizar esta política periódicamente. Los cambios serán publicados en esta página con la fecha de actualización.</p>

          <h2 className="text-xl font-semibold text-white">8. Contacto</h2>
          <p>Para preguntas sobre privacidad, contacta a través de los canales oficiales de XILEX.</p>
        </div>
      </main>
    </div>
  )
}
