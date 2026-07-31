'use client'

import Link from 'next/link'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { 
  BookOpen, Target, Zap, Brain, Trophy, Users,
  ArrowRight, CheckCircle2, Shield, Sparkles
} from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'Banco propio', desc: 'Ejercicios originales por universidad, área y subtema. No copiamos exámenes filtrados.', color: 'primary' },
  { icon: Target, title: 'Simulacros configurables', desc: 'Practica por universidad o mixto. Tú eliges el enfoque y la cantidad de preguntas.', color: 'accent-sky' },
  { icon: Brain, title: 'Feedback explicado', desc: 'Cada respuesta trae su explicación detallada. Aprendes del error, no solo si acertaste.', color: 'accent-emerald' },
  { icon: Zap, title: 'Medición por subtema', desc: 'Sigue tu progreso en acentuación, silogismos, analogías y mucho más.', color: 'accent-amber' },
  { icon: Shield, title: 'Base legal sólida', desc: 'Contenido basado en los modelos oficiales publicados por UCV, USB, UNIMET y UCAB.', color: 'primary' },
  { icon: Users, title: 'Acceso libre', desc: 'Cualquier bachiller venezolano puede practicar sin barreras.', color: 'accent-violet' },
]

// Las cuatro tienen banco de preguntas cargado y áreas configuradas en la base.
const universities = [
  { code: 'simadi', name: 'SIMADI (UCV)', areas: ['Lógico', 'Verbal', 'Especialización'], active: true },
  { code: 'unimet', name: 'UNIMET', areas: ['Cuantitativo', 'Verbal'], active: true },
  { code: 'usb', name: 'USB', areas: ['Habilidades', 'Conocimientos'], active: true },
  { code: 'ucab', name: 'UCAB', areas: ['Verbal', 'Numérica', 'Lógico'], active: true },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06] rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-accent-sky flex items-center justify-center shadow-glow-sm">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">XILEX</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'Características', id: 'caracteristicas' },
                { label: 'Universidades', id: 'universidades' },
                { label: 'Roadmap', id: 'roadmap' },
              ].map(t => (
                <Link key={t.id} href={`#${t.id}`} className="text-sm font-medium text-blue-300/60 hover:text-white transition-colors">
                  {t.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/auth/login" className="btn-ghost text-sm hidden sm:inline-flex">Iniciar sesión</Link>
              <Link href="/auth/register" className="btn-primary text-sm !px-4 !py-2">
                <Sparkles className="w-4 h-4" /> Empezar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle mb-6 text-sm text-blue-200/70">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              Fase 1 en desarrollo
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Tu práctica para{' '}
              <span className="bg-gradient-to-r from-primary via-accent-sky to-primary bg-clip-text text-transparent">
                admisión universitaria
              </span>
            </h1>
            <p className="text-base sm:text-xl text-blue-200/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Banco propio de ejercicios, simulacros configurables y feedback explicado.
              Prepárate para <strong className="text-white">SIMADI, UNIMET, USB y UCAB</strong> sin depender de academias.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 animate-slide-up">
              <Link href="/auth/register" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                <Sparkles className="w-5 h-5" />
                Comenzar gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                Ver cómo funciona
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-blue-300/40">
              {['Basado en modelos oficiales', 'Contenido 100% legal', 'Sin costo'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary/50" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* University cards */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {universities.map((uni, i) => (
              <Link key={uni.code} href="/practice"
                className="glass glass-glow p-4 sm:p-5 relative overflow-hidden animate-slide-up group rounded-3xl"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{uni.name}</h3>
                      <p className="text-xs text-blue-300/40 truncate">{uni.areas.join(' · ')}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    uni.active ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-white/[0.04] text-blue-300/40'
                  }`}>
                    {uni.active ? 'Activo' : 'Próximamente'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-sky/[0.03] rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Features */}
      <section id="caracteristicas" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Diseñado para que <span className="text-primary">aprendas practicando</span>
            </h2>
            <p className="text-base sm:text-lg text-blue-200/50 max-w-2xl mx-auto">
              Cada característica nace de la investigación real sobre las pruebas de admisión
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="glass glass-glow p-5 sm:p-6 group animate-slide-up rounded-3xl"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-blue-200/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Cómo funciona en <span className="text-primary">3 pasos</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { step: '01', title: 'Elige tu objetivo', desc: 'Selecciona universidad, áreas y cantidad de preguntas.', icon: Target },
              { step: '02', title: 'Practica con feedback', desc: 'Responde y recibe la explicación inmediata de cada pregunta.', icon: Brain },
              { step: '03', title: 'Analiza tu progreso', desc: 'Mira tu desempeño por subtema e identifica tus puntos débiles.', icon: Trophy },
            ].map((s, i) => (
              <div key={s.step} className="relative glass p-6 sm:p-8 glass-glow animate-slide-up rounded-3xl"
                style={{ animationDelay: `${i * 120}ms` }}>
                <div className="absolute -top-2 -right-2 text-5xl sm:text-6xl font-bold text-primary/[0.06]">{s.step}</div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-blue-200/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities */}
      <section id="universidades" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Universidades <span className="text-primary">cubiertas</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {universities.map(uni => (
              <Link key={uni.code} href="/practice" className="glass glass-glow p-5 sm:p-6 group rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{uni.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        uni.active ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-white/[0.04] text-blue-300/40'
                      }`}>
                        {uni.active ? 'Activo' : 'Próximamente'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {uni.areas.map(a => (
                        <span key={a} className="px-2.5 py-1 text-xs bg-white/[0.04] border border-white/[0.06] rounded-full text-blue-200/50">{a}</span>
                      ))}
                    </div>
                    <p className="text-sm text-blue-300/30">
                      {uni.code === 'simadi' && 'Razonamiento lógico y verbal, más el bloque de especialización por cluster.'}
                      {/* Cifras del Manual de Información General de la PDU:
                          50 preguntas por prueba, 75 min la cuantitativa y 60 la verbal. */}
                      {uni.code === 'unimet' && 'Aptitud cuantitativa y verbal. 100 preguntas, 135 min. Resta 1/3 por error.'}
                      {uni.code === 'usb' && 'Habilidades y conocimientos. 100 preguntas, 120 min.'}
                      {uni.code === 'ucab' && 'Verbal, numérica y lógico. 100 preguntas, 120 min.'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Roadmap <span className="text-primary">XILEX</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-primary/[0.05]" />
            <div className="space-y-8 sm:space-y-10">
              {[
                // El estado de cada fase refleja lo que hay cargado en la base,
                // no el plan original: anunciar como "futuro" un banco que ya
                // existe hace que la página contradiga a la propia aplicación.
                { phase: 'Fase 1', title: 'Fundación: SIMADI y UNIMET', status: 'Disponible',
                  items: ['Banco de lógico y verbal (SIMADI)', 'Banco de cuantitativo y verbal (UNIMET), alineado con las categorías del manual de la PDU', 'Simulacros por universidad y mixtos', 'Feedback con explicación en cada pregunta', 'Panel de progreso por subtema'] },
                { phase: 'Fase 2', title: 'SIMADI: área de conocimiento', status: 'En desarrollo',
                  items: ['Clusters de Salud, Ciencia y Tecnología, y Sociales ya practicables', 'Cluster de Agro y Mar pendiente de contenido', 'Simulacro completo de tres bloques', 'Índice de corte estimado'] },
                { phase: 'Fase 3', title: 'USB, UCAB y modo tutor', status: 'Parcial',
                  items: ['Banco USB: habilidades y conocimientos (disponible)', 'Banco UCAB: verbal, numérica y lógico (disponible)', 'Ampliar ambos bancos al tamaño del de UNIMET', 'Mini-lecciones de refuerzo', 'Modo tutor adaptativo'] },
              ].map((p, i) => (
                <div key={p.phase} className="relative flex gap-4 sm:gap-6 animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-[3px] border-primary bg-deep-950" />
                  </div>
                  <div className="flex-1 glass p-5 sm:p-6 glass-glow rounded-3xl">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">{p.phase}</span>
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/[0.04] border border-white/[0.06] text-blue-300/40">{p.status}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{p.title}</h3>
                    <ul className="space-y-2">
                      {p.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-blue-200/50">
                          <CheckCircle2 className="w-4 h-4 text-primary/50 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong p-8 sm:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] to-accent-sky/[0.04]" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">¿Listo para practicar?</h2>
              <p className="text-base sm:text-lg text-blue-200/50 mb-8 max-w-xl mx-auto">
                Gratis, abierto y hecho para bachilleres venezolanos.
              </p>
              <Link href="/auth/register" className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 inline-flex">
                <Sparkles className="w-5 h-5" />
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 px-4 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent-sky flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">XILEX</span>
              </Link>
              <p className="text-sm text-blue-300/30 max-w-xs">Práctica para la admisión universitaria venezolana.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Universidades</h4>
              <ul className="space-y-2 text-sm text-blue-300/40">
                {/* Las cuatro son practicables; USB y UCAB aparecían atenuadas
                    y sin enlace, contradiciendo las tarjetas de más arriba. */}
                {['SIMADI', 'UNIMET', 'USB', 'UCAB'].map(u => (
                  <li key={u}>
                    <Link href="/practice" className="hover:text-primary transition-colors">{u}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-blue-300/40">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Términos</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/[0.06] text-center text-xs text-blue-300/20">
            {/* Literal a propósito: `new Date()` en una página prerenderizada
                difiere entre el build y el cliente y provoca un desajuste de
                hidratación al cambiar el año. */}
            <p>© 2026 XILEX. Hecho con corazón en Venezuela.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
