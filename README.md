# XILEX

Sistema de práctica para las pruebas de admisión universitaria venezolanas:
**SIMADI (UCV)**, **UNIMET**, **USB** y **UCAB**. Banco propio de ejercicios,
simulacros configurables con temporizador, feedback explicado y seguimiento de
progreso por subtema.

Next.js 14 (App Router) + Supabase (Postgres, Auth, RLS) + Tailwind.

---

## Puesta en marcha

```bash
cd xilex-app
npm install
cp .env.example .env.local     # y rellena los valores
npm run dev                    # http://localhost:3000
```

### Variables de entorno

| Variable | Dónde se usa | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | cliente y servidor | sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | cliente y servidor | sí |
| `SUPABASE_SERVICE_ROLE_KEY` | solo servidor (`/api/account`, seeders) | para borrar cuentas y sembrar |
| `NEXT_PUBLIC_BUILD_ID` | sello de versión en la esquina | no |

> `SUPABASE_SERVICE_ROLE_KEY` **nunca** debe llevar el prefijo `NEXT_PUBLIC_`:
> saltaría todas las políticas RLS desde el navegador.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción |
| `npm run lint` | ESLint (config de Next) |
| `npm run typecheck` | `tsc --noEmit` |

---

## Base de datos

El esquema vive en `supabase/`. Orden de aplicación sobre un proyecto nuevo:

1. `schema.sql` — tablas, RLS, funciones base y datos de referencia.
2. `add_usb_ucab_areas_subtopics.sql` — áreas y subtemas de USB y UCAB.
3. `schema_extensions_especializaciones.sql` — área `especializacion`, tabla
   `question_clusters` y columna `users.target_clusters`.
4. `migrations/20260722213605_grant_question_clusters.sql`
5. **`migrations/20260727000000_fix_functions_and_triggers.sql`** — correcciones
   de `get_random_questions`, `get_user_streak` y el trigger de perfiles.
   Ver [AUDITORIA.md](../AUDITORIA.md).
6. El resto de `migrations/` por orden de fecha. La última crea el subtema
   `comprension` en USB/Habilidades y UCAB/Verbal, que el paso 2 declaraba pero
   que nunca llegó a existir en la base.

Se aplican pegándolos en el **SQL Editor** de Supabase, o con la CLI. La CLI
necesita la contraseña de la base (Dashboard → Project Settings → Database);
sin ella falla con `Connect to your database by setting the env var correctly:
SUPABASE_DB_PASSWORD`:

```powershell
npx supabase link --project-ref <ref>
$env:SUPABASE_DB_PASSWORD = '<tu-password>'
npx supabase db push
```

### Cargar el banco de preguntas

```bash
node supabase/seed_questions.js            # simulacro: no escribe nada
node supabase/seed_questions.js --apply    # carga lo que falte
```

Lee los CSV de `../banco/`, los mapea a la taxonomía real de la base y marca
cada fila con `source_reference = 'banco:<lote>:<id>'`. Es idempotente:
reejecutarlo no duplica nada. Para revertir una carga:

```sql
DELETE FROM questions WHERE source_reference LIKE 'banco:%';
```

---

## Estructura

```
src/
  app/
    page.tsx                 landing
    auth/                    login, registro, recuperación, callback OAuth
    api/account/route.ts     borrado de cuenta (requiere service role)
    dashboard/               resumen, actividad reciente, fortalezas/debilidades
    metodos/                 centro de estudio: métodos, tips y mnemotecnias (público)
    entrenamiento/           práctica sin cronómetro, con pistas y reintentos
    practice/                configurador de simulacros
    simulacrum/[id]/         examen en curso + pantalla de resultados
    simulacrums/             historial
    progress/                analítica por subtema
    settings/                perfil, universidades, cluster SIMADI, datos
  components/
    ui/glass.tsx             sistema de componentes "glass"
    ExplicacionReforzada.tsx explicación de la pregunta + método del subtema
  lib/
    metodos.ts               métodos, tips, mnemotecnias y política de respuesta
    store.ts                 estado zustand (simulacro, auth, UI)
    useSession.ts            resolución de sesión + carga de perfil
    supabase/                clientes de navegador y servidor
    utils.ts                 formateo y helpers de color
  middleware.ts              refresco de sesión + protección de rutas
supabase/
  schema.sql, seed_*.sql, migrations/
  seed_questions.js          cargador del banco desde CSV
```

### Cómo funciona un simulacro

1. `/practice` elige universidad, áreas y número de preguntas, y llama a la RPC
   `get_random_questions`. Si se incluye el área **especialización**, sus
   preguntas se piden aparte, filtradas por los clusters del usuario: aplicar
   ese filtro a toda la consulta descartaría lógico y verbal, que no tienen
   filas en `question_clusters`.
2. Se crea la fila en `simulacrums` con `status = 'in_progress'` y `started_at`.
   El temporizador se deriva siempre de `started_at + time_limit_minutes`, no de
   un contador en memoria, para que sobreviva a recargas y a la limitación de
   timers en pestañas de fondo.
3. Cada respuesta se guarda en `simulacrum_questions` al instante.
4. Al finalizar (o al agotarse el tiempo) se calculan `score`, `correct_count`,
   `incorrect_count` y `unanswered_count`, y se actualiza `user_progress` por
   subtema mediante la RPC `update_user_progress`.

### Estado del banco

| Universidad / área | Preguntas |
|---|---|
| simadi/logico | 203 |
| simadi/verbal | 163 |
| simadi/especializacion | 105 |
| unimet/cuantitativo | 342 |
| unimet/verbal | 284 |
| usb/conocimientos | 96 |
| usb/habilidades | 55 |
| ucab/logico | 57 |
| ucab/numerica | 54 |
| ucab/verbal | 52 |
| **Total** | **1411** |

Preguntas nuevas de SIMADI, USB o UCAB: editar `banco/lote10_src.js` y regenerar
con `node banco/build_lote10.js`. El validador comprueba, entre otras cosas, que
el subtema exista **en esa área de esa universidad** — sin eso, `seed_questions.js`
descarta la fila con un aviso y la pregunta nunca llega a la base.

Clusters de especialización SIMADI: `salud` (45), `ciencia_tecnologia` (35),
`sociales_humanidades` (25). **`agro_mar` no tiene preguntas todavía** y aparece
deshabilitado en Configuración.

---

## Despliegue

Vercel, con `vercel.json` ya configurado. Define las tres variables de entorno
en el proyecto de Vercel; `SUPABASE_SERVICE_ROLE_KEY` solo como variable de
servidor.
