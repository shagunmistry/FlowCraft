import { createHash } from 'crypto'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-auth/server'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const MAX_PER_HOUR = 3
const MIN_FILL_MS = 3000

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const str = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

const hashIp = (req: Request) => {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
  if (!ip) return null
  return createHash('sha256')
    .update(`${process.env.SUPPORT_IP_SALT || ''}${ip}`)
    .digest('hex')
}

const verifyTurnstile = async (token: unknown, req: Request) => {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // not configured yet; other layers still apply
  if (typeof token !== 'string' || !token) return false
  const form = new URLSearchParams({ secret, response: token })
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
  if (ip) form.set('remoteip', ip)
  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: form },
  )
  const out = await res.json().catch(() => ({}))
  return out.success === true
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return json({ error: 'Invalid request' }, 400)
    }

    // Honeypot: real users never see or fill this. Pretend success to bots.
    if (typeof body.website === 'string' && body.website.length > 0) {
      return json({ ok: true })
    }
    // Bots submit instantly; humans take a few seconds.
    if (typeof body.startedAt === 'number') {
      const elapsed = Date.now() - body.startedAt
      if (elapsed >= 0 && elapsed < MIN_FILL_MS) return json({ ok: true })
    }

    const supabaseClient = await createClient()
    const { data: userData } = await supabaseClient.auth.getUser()
    const user = userData?.user ?? null

    const firstName = str(body.firstName, 100)
    const lastName = str(body.lastName, 100)
    const message = str(body.message, 5000)
    const email = str(body.email, 254) || user?.email || ''
    const type = str(body.type, 50) || null
    const isRating = body.rating !== undefined && body.rating !== null
    const rating = isRating ? Number(body.rating) : null

    if (message.length < 5 || /^[\d\s\-+().]+$/.test(message)) {
      return json({ error: 'Please enter a message' }, 400)
    }
    if (!isRating) {
      // contact form: name + email are required
      if (!firstName || !lastName) {
        return json({ error: 'Please enter your name' }, 400)
      }
      if (!EMAIL_RE.test(email)) {
        return json({ error: 'Please enter a valid email' }, 400)
      }
      if (!(await verifyTurnstile(body.turnstileToken, req))) {
        return json({ error: 'Captcha verification failed' }, 400)
      }
    } else {
      if (!Number.isInteger(rating) || rating! < 0 || rating! > 5) {
        return json({ error: 'Invalid rating' }, 400)
      }
      if (email && !EMAIL_RE.test(email)) {
        return json({ error: 'Invalid email' }, 400)
      }
    }

    const admin = createAdminClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
      { auth: { persistSession: false } },
    )

    const ipHash = hashIp(req)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Rate limit by IP hash or email, per hour.
    const ors = [ipHash && `ip_hash.eq.${ipHash}`, email && `email.eq.${email}`]
      .filter(Boolean)
      .join(',')
    if (ors) {
      const { count } = await admin
        .from('support')
        .select('id', { count: 'exact', head: true })
        .or(ors)
        .gte('created_at', hourAgo)
      if ((count ?? 0) >= MAX_PER_HOUR) {
        return json({ error: 'Too many requests. Please try later.' }, 429)
      }
    }

    // Drop exact repeats of the same message.
    const { count: dupes } = await admin
      .from('support')
      .select('id', { count: 'exact', head: true })
      .eq('message', message)
      .eq('email', email)
      .gte('created_at', dayAgo)
    if ((dupes ?? 0) > 0) return json({ ok: true })

    const { error } = await admin.from('support').insert([
      {
        firstname: firstName || null,
        lastname: lastName || null,
        email: email || null,
        message,
        type,
        rating,
        user_id: user?.id ?? null,
        ip_hash: ipHash,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error('support insert failed:', error)
      return json({ error: 'Error submitting support request' }, 500)
    }

    return json({ ok: true })
  } catch (error) {
    console.error('support route failed:', error)
    return json({ error: 'Error submitting support request' }, 500)
  }
}
