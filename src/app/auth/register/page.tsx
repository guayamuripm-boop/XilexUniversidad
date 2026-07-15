'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/glass'
import { useAuthStore } from '@/lib/store'
import { Brain, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const UNIVERSITIES = [
  { code: 'simadi', name: 'SIMADI (UCV)', description: 'Razonamiento Lógico + Verbal', color: 'red' },
  { code: 'unimet', name: 'UNIMET', description: 'Aptitud Cuantitativa + Verbal', color: 'blue' },
  { code: 'usb', name: 'USB', description: 'Habilidades + Conocimientos', color: 'green', disabled: true },
  { code: 'ucab', name: 'UCAB', description: 'Numérica + Verbal (19 carreras)', color: 'yellow', disabled: true },
]

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, setTargetUniversities } = useAuthStore()
  
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (step === 1) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres')
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      if (selectedUniversities.length === 0) {
        setError('Selecciona al menos una universidad objetivo')
        return
      }
      
      setLoading(true)
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              target_universities: selectedUniversities,
            })

          if (profileError) throw profileError

          setUser({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            target_universities: selectedUniversities,
          })
          setTargetUniversities(selectedUniversities)

          if (data.session) {
            router.push('/dashboard')
          } else {
            setSuccess('¡Cuenta creada! Revisa tu email para confirmar tu cuenta. (Revisa también la carpeta de spam)')
            setTimeout(() => router.push('/auth/login'), 5000)
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error al crear la cuenta')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleUniversity = (code: string) => {
    setSelectedUniversities(prev => 
      prev.includes(code)
        ? prev.filter(u => u !== code)
        : [...prev, code]
    )
  }

  const progress = (step / 2) * 100

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Paso {step} de 2
            </span>
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900 dark:text-white">XILEX</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? 'Crear tu cuenta' : 'Elige tus universidades'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {step === 1 
              ? 'Regístrate gratis y accede a práctica ilimitada'
              : 'Selecciona para qué pruebas te preparas (puedes cambiarlo después)'
            }
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8 animate-fade-in">
          {success && (
            <div className="mb-6 flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <GlassInput
                  label="Nombre completo"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Pérez"
                  icon={<User className="w-5 h-5" />}
                  required
                  autoComplete="name"
                  disabled={loading}
                />

                <GlassInput
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  icon={<Mail className="w-5 h-5" />}
                  required
                  autoComplete="email"
                  disabled={loading}
                />

                <GlassInput
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  error={password.length > 0 && password.length < 8 ? 'Mínimo 8 caracteres' : undefined}
                  togglePassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                <GlassInput
                  label="Confirmar contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  error={confirmPassword && password !== confirmPassword ? 'No coinciden' : undefined}
                  togglePassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-3">
                  <label className="label-glass">Universidades objetivo</label>
                  {UNIVERSITIES.map((uni) => (
                    <button
                      key={uni.code}
                      type="button"
                      onClick={() => !uni.disabled && toggleUniversity(uni.code)}
                      disabled={uni.disabled}
                      className={`w-full relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                        selectedUniversities.includes(uni.code)
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-light-border dark:border-dark-border hover:border-primary/50'
                        } ${uni.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${uni.color}-100 dark:bg-${uni.color}-900/30`}>
                        <Brain className={`w-5 h-5 text-${uni.color}-600 dark:text-${uni.color}-400`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">{uni.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{uni.description}</p>
                      </div>
                      {selectedUniversities.includes(uni.code) && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  ))}
                  {selectedUniversities.length === 0 && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 text-center py-2">
                      Selecciona al menos una universidad para continuar
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <GlassButton
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1"
                >
                  Volver
                </GlassButton>
              )}
              <GlassButton
                type="submit"
                className="flex-1"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {step === 1 ? 'Continuando...' : 'Creando cuenta...'}
                  </>
                ) : (
                  step === 1 ? 'Continuar' : 'Crear cuenta gratis'
                )}
              </GlassButton>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {step === 1 
              ? '¿Ya tienes cuenta? '
              : '¿Ya tienes cuenta? '
            }
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </GlassCard>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Al registrarte, aceptas nuestros{' '}
          <Link href="/terms" className="underline hover:text-primary">Términos</Link>{' '}
          y{' '}
          <Link href="/privacy" className="underline hover:text-primary">Política de privacidad</Link>
        </p>
      </div>
    </div>
  )
}