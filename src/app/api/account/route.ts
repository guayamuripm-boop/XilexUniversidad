import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Permanently deletes the signed-in user's account.
 *
 * `supabase.auth.admin.deleteUser()` requires the service-role key, which can
 * never be shipped to the browser. The settings page used to call it directly
 * from a client component with the anon key, so "Eliminar cuenta" always failed
 * with a 403 while telling the user their password was wrong.
 *
 * The password is re-checked here before deleting; every dependent row is
 * removed by the ON DELETE CASCADE from public.users -> auth.users.
 */
export async function DELETE(request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json(
      { error: 'Borrado de cuenta no configurado en el servidor' },
      { status: 501 }
    )
  }

  let password: string
  try {
    ({ password } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
  }

  if (!password) {
    return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { error: passwordError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  })

  if (passwordError) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 403 })
  }

  const admin = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    console.error('Error deleting user:', deleteError)
    return NextResponse.json({ error: 'No se pudo eliminar la cuenta' }, { status: 500 })
  }

  await supabase.auth.signOut()

  return NextResponse.json({ ok: true })
}
