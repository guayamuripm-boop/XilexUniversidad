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
    color: 'teal'
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
    color: 'blue'
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
    color: 'green'
  },
  {
    icon: Users,
    title: 'Acceso Libre y Gratuito',
    description: 'Cualquier bachiller venezolano puede practicar sin barreras. Democracia educativa real.',
    color: 'purple'
  }
]

const universities = [
  { code: 'simadi', name: 'SIMADI (UCV)', areas: ['Logico', 'Verbal'], status: 'Activo', color: 'teal' },
  { code: 'unimet', name: 'UNIMET', areas: ['Cuantitativo', 'Verbal'], status: 'Activo', color: 'emerald' },
  { code: 'usb', name: 'USB', areas: ['Habilidades', 'Conocimientos'], status: 'Proximamente', color: 'blue' },
  { code: 'ucab', name: 'UCAB', areas: ['Numerica', 'Verbal'], status: 'Proximamente', color: 'purple' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">XILEX</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                Caracteristicas
              </Link>
              <Link href="#universities" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                Universidades
              </Link>
              <Link href="#roadmap" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                Roadmap
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="btn-ghost hidden sm:inline-flex">
                Iniciar sesion
              </Link>
              <Link href="/auth/register" className="btn-primary">
                <Sparkles className="w-4 h-4" />
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Tu practica para <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">admision universitaria</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Banco propio de ejercicios, simulacros configurables y feedback explicado por pregunta.
              Preparate para <strong className="text-gray-900 dark:text-white">SIMADI, UNIMET, USB y UCAB</strong> sin depender de academias cerradas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up">
              <Link href="/auth/register" className="btn-primary text-lg px-8 py-4">
                <Sparkles className="w-5 h-5" />
                Comenzar a practicar gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="btn-outline text-lg px-8 py-4">
                Ver como funciona
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Basado en modelos oficiales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Contenido 100% legal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Sin costo para estudiantes</span>
              </div>
            </div>
          </div>

          {/* Floating cards preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {universities.map((uni, i) => (
              <Link
                key={uni.code}
                href="/practice"
                className="glass card-hover group p-6 relative overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${uni.color}-100 dark:bg-${uni.color}-900/30 flex items-center justify-center`}>
                      <Target className={`w-6 h-6 text-${uni.color}-600 dark:text-${uni.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{uni.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{uni.areas.join(' Â· ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full bg-${uni.color}-100 dark:bg-${uni.color}-900/30 text-${uni.color}-700 dark:text-${uni.color}-300`}>
                      {uni.status === 'active' ? 'Activo' : 'Proximamente'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-200/30 dark:bg-teal-900/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              DiseÃ±ado para que <span className="text-primary">aprendas practicando</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Cada caracteristica nace de la investigacion real sobre como funcionan las pruebas de admision venezolanas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Link
                key={feature.title}
                href="/practice"
                className="glass card-hover p-6 group animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-dark-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Como funciona en <span className="text-primary">3 pasos</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              De cero a listo para el examen en minutos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={step.step} className="relative glass p-8 card-hover animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="absolute -top-3 -right-3 text-6xl font-bold text-primary/10 dark:text-primary/5">{step.step}</div>
                <div className="w-14 h-14 rounded-xl bg-primary-light dark:bg-primary-dark/20 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section id="universities" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Universidades <span className="text-primary">cobertas</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Activas: SIMADI (UCV) y UNIMET. USB y UCAB proximamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universities.map((uni, i) => (
              <Link
                key={uni.code}
                href="/practice"
                className="glass card-hover p-6 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-${uni.color}-100 dark:bg-${uni.color}-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Target className={`w-7 h-7 text-${uni.color}-600 dark:text-${uni.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{uni.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${uni.color}-100 dark:bg-${uni.color}-900/30 text-${uni.color}-700 dark:text-${uni.color}-300`}>
                        {uni.status === 'active' ? 'Activo' : 'Proximamente'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {uni.areas.map(area => (
                        <span key={area} className="px-3 py-1 text-sm bg-gray-100 dark:bg-dark-border rounded-full text-gray-600 dark:text-gray-300">
                          {area}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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
      <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-dark-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Roadmap <span className="text-primary">XILEX</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Construimos en fases, validando cada paso con estudiantes reales
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20" />
            
            <div className="space-y-12">
              {[
                {
                  phase: 'Fase 1',
                  title: 'Fundacion: SIMADI + UNIMET',
                  status: 'En desarrollo',
                  color: 'teal',
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
                  color: 'emerald',
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
                  color: 'blue',
                  items: [
                    'Banco USB: Habilidades + Conocimientos',
                    'Banco UCAB: Numerica + Verbal (19 carreras)',
                    'Mini-lecciones de refuerzo por subtema',
                    'Modo tutor adaptativo con IA',
                    'App movil nativa (iOS/Android)',
                  ]
                },
              ].map((phase, i) => (
                <div key={phase.phase} className="relative flex gap-6 animate-slide-up" style={{ animationDelay: `${i * 200}ms` }}>
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-4 border-${phase.color}-500 bg-white dark:bg-dark-bg`} />
                  </div>
                  <div className="flex-1 glass p-6 card-hover">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-${phase.color}-100 dark:bg-${phase.color}-900/30 text-${phase.color}-700 dark:text-${phase.color}-300`}>
                        {phase.phase}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400">
                        {phase.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className={`w-4 h-4 text-${phase.color}-500 dark:text-${phase.color}-400 flex-shrink-0 mt-0.5`} />
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong p-8 sm:p-12 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-50/50 dark:from-primary/5 dark:to-emerald-900/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Â¿Listo para empezar tu practica?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                Unete a miles de bachilleres que se preparan con XILEX. Gratis, abierto y hecho para ti.
              </p>
              <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 inline-flex">
                <Sparkles className="w-5 h-5" />
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">XILEX</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                Sistema de practica para pruebas de admision universitaria venezolana. Banco propio, simulacros configurables, feedback explicado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Universidades</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/practice" className="hover:text-primary transition-colors">SIMADI (UCV)</Link></li>
                <li><Link href="/practice" className="hover:text-primary transition-colors">UNIMET</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors opacity-50">USB (proximamente)</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors opacity-50">UCAB (proximamente)</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-primary transition-colors">Documentacion</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Modelos oficiales</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Preguntas frecuentes</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contacto</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-light-border dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              2025 XILEX. Construido para bachilleres venezolanos.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Hecho con corazon en Venezuela</span>
              <span>Â·</span>
              <span>Basado en modelos oficiales publicados</span>
            </div>
          </div>
</div>
      </footer>
    </div>
  )
}
