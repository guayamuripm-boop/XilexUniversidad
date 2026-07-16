'use client'

import Link from 'next/link'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { 
  BookOpen, 
  Target, 
  Zap, 
  Brain, 
  Trophy, 
  Users,
  ArrowRight,
  CheckCircle2,
  Shield,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Banco Propio de Ejercicios',
    description: 'Ejercicios originales clasificados por universidad, area y subtema. No copiamos examenes filtrados, generamos patrones propios.',
    color: 'primary'
  },
  {
    icon: Target,
    title: 'Simulacros Configurables',
    description: 'Practica por universidad (SIMADI, UNIMET) o mixtos combinando areas equivalentes. Tu eliges el enfoque.',
    color: 'emerald'
  },
  {
    icon: Brain,
    title: 'Feedback Explicado',
    description: 'Cada respuesta incluye explicacion detallada del porque. Aprende del error, no solo ve si acertaste.',
    color: 'primary'
  },
  {
    icon: Zap,
    title: 'Medicion por Subtema',
    description: 'Rastrea tu progreso en Acentuacion, Silogismos, Analogias, Comprension Lectora y mas. No solo un puntaje global.',
    color: 'amber'
  },
  {
    icon: Shield,
    title: 'Base Legal Solida',
    description: 'Contenido basado en modelos oficiales publicados por UCV, USB, UNIMET, UCAB. 100% legitimo y transparente.',
    color: 'emerald'
  },
  {
    icon: Users,
    title: 'Acceso Libre y Gratuito',
    description: 'Cualquier bachiller venezolano puede practicar sin barreras. Democracia educativa real.',
    color: 'violet'
  }
]

const universities = [
  { code: 'simadi', name: 'SIMADI (UCV)', areas: ['Logico', 'Verbal'], status: 'Activo' },
  { code: 'unimet', name: 'UNIMET', areas: ['Cuantitativo', 'Verbal'], status: 'Activo' },
  { code: 'usb', name: 'USB', areas: ['Habilidades', 'Conocimientos'], status: 'Proximamente' },
  { code: 'ucab', name: 'UCAB', areas: ['Numerica', 'Verbal'], status: 'Proximamente' },
]

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
  emerald: { bg: 'bg-accent-emerald/10', text: 'text-accent-emerald', icon: 'text-accent-emerald' },
  amber: { bg: 'bg-accent-amber/10', text: 'text-accent-amber', icon: 'text-accent-amber' },
  violet: { bg: 'bg-accent-violet/10', text: 'text-accent-violet', icon: 'text-accent-violet' },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,180,216,0.3)]">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">XILEX</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium text-graphite-400 hover:text-white transition-colors">
                Caracteristicas
              </Link>
              <Link href="#universities" className="text-sm font-medium text-graphite-400 hover:text-white transition-colors">
                Universidades
              </Link>
              <Link href="#roadmap" className="text-sm font-medium text-graphite-400 hover:text-white transition-colors">
                Roadmap
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="btn-ghost hidden sm:inline-flex text-sm">
                Iniciar sesion
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                <Sparkles className="w-4 h-4" />
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle mb-6 text-sm text-graphite-300">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              Fase 1 en desarrollo
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Tu practica para{' '}
              <span className="bg-gradient-to-r from-primary via-primary-400 to-accent-emerald bg-clip-text text-transparent">
                admision universitaria
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-graphite-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Banco propio de ejercicios, simulacros configurables y feedback explicado por pregunta.
              Preparate para <strong className="text-white">SIMADI, UNIMET, USB y UCAB</strong> sin depender de academias cerradas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 animate-slide-up">
              <Link href="/auth/register" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                <Sparkles className="w-5 h-5" />
                Comenzar a practicar gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                Ver como funciona
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-graphite-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary/60" />
                <span>Basado en modelos oficiales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary/60" />
                <span>Contenido 100% legal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary/60" />
                <span>Sin costo para estudiantes</span>
              </div>
            </div>
          </div>

          {/* Floating cards preview */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {universities.map((uni, i) => (
              <Link
                key={uni.code}
                href="/practice"
                className="glass glass-glow p-4 sm:p-5 relative overflow-hidden animate-slide-up group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{uni.name}</h3>
                      <p className="text-xs text-graphite-500 truncate">{uni.areas.join(' · ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      uni.status === 'Activo' 
                        ? 'bg-accent-emerald/10 text-accent-emerald' 
                        : 'bg-graphite-800 text-graphite-500'
                    }`}>
                      {uni.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-graphite-600 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-emerald/[0.03] rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Diseñado para que <span className="text-primary">aprendas practicando</span>
            </h2>
            <p className="text-base sm:text-lg text-graphite-400 max-w-2xl mx-auto">
              Cada caracteristica nace de la investigacion real sobre como funcionan las pruebas de admision venezolanas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature, i) => {
              const colors = colorMap[feature.color] || colorMap.primary
              return (
                <div
                  key={feature.title}
                  className="glass glass-glow p-5 sm:p-6 group animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-graphite-400 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Como funciona en <span className="text-primary">3 pasos</span>
            </h2>
            <p className="text-base sm:text-lg text-graphite-400 max-w-2xl mx-auto">
              De cero a listo para el examen en minutos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                step: '01',
                title: 'Elige tu objetivo',
                description: 'Selecciona SIMADI, UNIMET o modo mixto. Define que areas quieres practicar y cuantas preguntas.',
                icon: Target,
              },
              {
                step: '02',
                title: 'Practica con feedback',
                description: 'Responde preguntas con explicacion inmediata. Aprende el porque de cada respuesta, no solo si acertaste.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Analiza tu progreso',
                description: 'Ve tu desempeno por subtema: Acentuacion, Silogismos, Analogias, Comprension. Identifica tus puntos debiles exactos.',
                icon: Trophy,
              },
            ].map((step, i) => (
              <div key={step.step} className="relative glass p-6 sm:p-8 glass-glow animate-slide-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="absolute -top-2 -right-2 text-5xl sm:text-6xl font-bold text-primary/[0.06]">{step.step}</div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-graphite-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section id="universities" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Universidades <span className="text-primary">cobertas</span>
            </h2>
            <p className="text-base sm:text-lg text-graphite-400 max-w-2xl mx-auto">
              Activas: SIMADI (UCV) y UNIMET. USB y UCAB proximamente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {universities.map((uni) => (
              <Link
                key={uni.code}
                href="/practice"
                className="glass glass-glow p-5 sm:p-6 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{uni.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        uni.status === 'Activo' 
                          ? 'bg-accent-emerald/10 text-accent-emerald' 
                          : 'bg-graphite-800 text-graphite-500'
                      }`}>
                        {uni.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {uni.areas.map(area => (
                        <span key={area} className="px-2.5 py-1 text-xs bg-white/[0.04] border border-white/[0.06] rounded-full text-graphite-400">
                          {area}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-graphite-500">
                      {uni.code === 'simadi' && 'Razonamiento logico y verbal comun a todas las carreras. 60 preguntas, 90 min.'}
                      {uni.code === 'unimet' && 'Aptitud Cuantitativa + Verbal. 90 preguntas. Indice 75% prueba + 25% notas.'}
                      {uni.code === 'usb' && 'Proximamente: Habilidades + Conocimientos. Examen unico para carreras largas.'}
                      {uni.code === 'ucab' && 'Proximamente: Prueba de Conocimientos comun a 19 carreras y 5 TSU.'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Roadmap <span className="text-primary">XILEX</span>
            </h2>
            <p className="text-base sm:text-lg text-graphite-400 max-w-2xl mx-auto">
              Construimos en fases, validando cada paso con estudiantes reales
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-primary/[0.05]" />
            
            <div className="space-y-8 sm:space-y-10">
              {[
                {
                  phase: 'Fase 1',
                  title: 'Fundacion: SIMADI + UNIMET',
                  status: 'En desarrollo',
                  items: [
                    'Banco completo: Razonamiento Logico + Verbal (SIMADI)',
                    'Banco completo: Aptitud Cuantitativa + Verbal (UNIMET)',
                    'Simulacros por universidad y mixtos',
                    'Feedback con explicacion por pregunta',
                    'Dashboard de progreso por subtema',
                    'Autenticacion y perfiles de usuario',
                  ]
                },
                {
                  phase: 'Fase 2',
                  title: 'SIMADI Area de Conocimiento',
                  status: 'Planificado',
                  items: [
                    '4 Clusters: Salud, Agro/Mar, Ciencia/Tec, Sociales',
                    'Contenido diferenciado por cluster de carrera',
                    'Simulacros completos SIMADI (3 bloques)',
                    'Indice de corte estimado por carrera',
                  ]
                },
                {
                  phase: 'Fase 3',
                  title: 'USB + UCAB + Modo Tutor',
                  status: 'Futuro',
                  items: [
                    'Banco USB: Habilidades + Conocimientos',
                    'Banco UCAB: Numerica + Verbal (19 carreras)',
                    'Mini-lecciones de refuerzo por subtema',
                    'Modo tutor adaptativo con IA',
                    'App movil nativa (iOS/Android)',
                  ]
                },
              ].map((phase, i) => (
                <div key={phase.phase} className="relative flex gap-4 sm:gap-6 animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-[3px] border-primary bg-graphite-950" />
                  </div>
                  <div className="flex-1 glass p-5 sm:p-6 glass-glow">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                        {phase.phase}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/[0.04] border border-white/[0.06] text-graphite-500">
                        {phase.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-graphite-400">
                          <CheckCircle2 className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
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

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong p-8 sm:p-12 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                ¿Listo para empezar tu practica?
              </h2>
              <p className="text-base sm:text-lg text-graphite-400 mb-8 max-w-xl mx-auto">
                Unete a miles de bachilleres que se preparan con XILEX. Gratis, abierto y hecho para ti.
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
      <footer className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">XILEX</span>
              </Link>
              <p className="text-sm text-graphite-500 max-w-xs">
                Sistema de practica para pruebas de admision universitaria venezolana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Universidades</h4>
              <ul className="space-y-2 text-sm text-graphite-500">
                <li><Link href="/practice" className="hover:text-primary transition-colors">SIMADI (UCV)</Link></li>
                <li><Link href="/practice" className="hover:text-primary transition-colors">UNIMET</Link></li>
                <li><span className="opacity-40">USB (proximamente)</span></li>
                <li><span className="opacity-40">UCAB (proximamente)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Recursos</h4>
              <ul className="space-y-2 text-sm text-graphite-500">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terminos</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Contacto</h4>
              <ul className="space-y-2 text-sm text-graphite-500">
                <li><span>GitHub</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-graphite-600">
            <p>2025 XILEX. Construido para bachilleres venezolanos.</p>
            <p>Hecho con corazon en Venezuela · Basado en modelos oficiales</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
