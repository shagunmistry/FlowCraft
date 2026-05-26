/**
 * Cleans up the `feedback` table:
 *  1) Deletes rows where the feedback text is junk (<=3 chars after trim)
 *     AND new_features is empty/short.
 *  2) Backfills `contact_email` for follow-up rows by resolving `user_id`
 *     against auth.users.
 *
 * Dry-run by default. Pass --apply to commit changes.
 *
 *   npx tsx --env-file=.env scripts/cleanup-feedback.ts          # dry-run
 *   npx tsx --env-file=.env scripts/cleanup-feedback.ts --apply  # commit
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PRIVATE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_PRIVATE_KEY')
  process.exit(1)
}

const apply = process.argv.includes('--apply')
const supabase = createClient(url, key)

const JUNK_FEEDBACK_MAX = 3
const JUNK_FEATURES_MAX = 3

;(async () => {
  const { data: rows, error } = await supabase
    .from('feedback')
    .select('id, feedback, new_features, follow_up, email, user_id, contact_email')

  if (error) {
    console.error('Failed to read feedback:', error.message)
    process.exit(1)
  }

  const all = rows ?? []
  const junk = all.filter((r) => {
    const fb = (r.feedback ?? '').trim()
    const nf = (r.new_features ?? '').trim()
    return fb.length <= JUNK_FEEDBACK_MAX && nf.length <= JUNK_FEATURES_MAX
  })

  console.log(`Total rows: ${all.length}`)
  console.log(`Junk rows (feedback<=${JUNK_FEEDBACK_MAX} AND new_features<=${JUNK_FEATURES_MAX}): ${junk.length}`)
  if (junk.length) {
    console.log('Sample junk:', junk.slice(0, 5).map((r) => ({ id: r.id, feedback: r.feedback })))
  }

  // Find rows still missing contact_email but with a resolvable user_id
  const needsEmail = all.filter(
    (r) => r.follow_up && !r.contact_email && (r.user_id || r.email),
  )
  console.log(`Follow-up rows missing contact_email: ${needsEmail.length}`)

  if (!apply) {
    console.log('\nDry run. Pass --apply to commit.')
    return
  }

  // 1) Delete junk
  if (junk.length) {
    const ids = junk.map((r) => r.id)
    const { error: delErr } = await supabase
      .from('feedback')
      .delete()
      .in('id', ids)
    if (delErr) {
      console.error('Delete failed:', delErr.message)
    } else {
      console.log(`Deleted ${ids.length} junk rows.`)
    }
  }

  // 2) Backfill contact_email
  let resolved = 0
  for (const row of needsEmail) {
    const uid = (row.user_id ?? row.email) as string
    try {
      const { data, error: uErr } = await supabase.auth.admin.getUserById(uid)
      if (uErr || !data?.user?.email) continue
      const { error: upErr } = await supabase
        .from('feedback')
        .update({ contact_email: data.user.email, user_id: uid })
        .eq('id', row.id)
      if (!upErr) resolved += 1
    } catch (e) {
      // skip non-UUID values etc.
    }
  }
  console.log(`Backfilled contact_email for ${resolved} rows.`)
})()
