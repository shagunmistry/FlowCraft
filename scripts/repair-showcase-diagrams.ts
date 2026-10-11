/**
 * Repairs public showcase diagrams whose stored Mermaid code does not parse.
 *
 * scripts/data/showcase-diagram-repairs.json holds { id, title, old_data, new_data }
 * for each diagram. Every new_data was parsed AND rendered with the app's
 * Mermaid version after passing through sanitizeMermaid.
 *
 * Safety:
 *  - Dry-run by default. Pass --apply to write.
 *  - A row is only touched if its current `data` still equals `old_data`
 *    (rows edited since the audit are skipped).
 *  - The previous values are saved to scripts/data/showcase-repairs-backup-*.json
 *    before any write, so the run can be undone with --restore <file>.
 *  - Only the `data` column is written.
 *
 * Needs a service-role key (the anon key cannot read or write other users' rows).
 * flowcraft-api/.env has SUPABASE_SERVICE_ROLE_KEY; it is read from the environment only.
 *
 *   npx tsx --env-file=../flowcraft-api/.env scripts/repair-showcase-diagrams.ts                 # dry-run
 *   npx tsx --env-file=../flowcraft-api/.env scripts/repair-showcase-diagrams.ts --apply         # write
 *   npx tsx --env-file=../flowcraft-api/.env scripts/repair-showcase-diagrams.ts --apply --limit 5
 *   npx tsx --env-file=../flowcraft-api/.env scripts/repair-showcase-diagrams.ts --restore scripts/data/showcase-repairs-backup-<ts>.json
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type Repair = { id: string; title: string; old_data: string; new_data: string }

const url = process.env.SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_PRIVATE_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const limitIdx = args.indexOf('--limit')
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : Infinity
const restoreIdx = args.indexOf('--restore')
const supabase = createClient(url, key)
const dataDir = join(__dirname, 'data')

async function fetchCurrent(ids: string[]) {
  const rows = new Map<string, string>()
  for (let i = 0; i < ids.length; i += 50) {
    const { data, error } = await supabase
      .from('diagrams')
      .select('id, data')
      .in('id', ids.slice(i, i + 50))
    if (error) {
      console.error('Read failed:', error.message)
      process.exit(1)
    }
    for (const r of data ?? []) rows.set(r.id, r.data)
  }
  return rows
}

async function write(id: string, data: string) {
  const { data: updated, error } = await supabase
    .from('diagrams')
    .update({ data })
    .eq('id', id)
    .select('id')
  if (error) return `error: ${error.message}`
  if (!updated || updated.length === 0) return 'no row updated (RLS or missing row)'
  return null
}

;(async () => {
  if (restoreIdx >= 0) {
    const backup: { id: string; data: string }[] = JSON.parse(
      readFileSync(args[restoreIdx + 1], 'utf8'),
    )
    let failed = 0
    for (const b of backup) {
      const err = await write(b.id, b.data)
      if (err) {
        failed++
        console.error(`restore ${b.id}: ${err}`)
      }
    }
    console.log(`Restored ${backup.length - failed}/${backup.length} rows.`)
    return
  }

  const repairs: Repair[] = JSON.parse(
    readFileSync(join(dataDir, 'showcase-diagram-repairs.json'), 'utf8'),
  )
  const current = await fetchCurrent(repairs.map((r) => r.id))

  const todo: Repair[] = []
  let missing = 0
  let changed = 0
  let already = 0
  for (const r of repairs) {
    const now = current.get(r.id)
    if (now === undefined) missing++
    else if (now === r.new_data) already++
    else if (now !== r.old_data) changed++
    else todo.push(r)
  }
  const batch = todo.slice(0, limit)

  console.log(`Repairs listed:        ${repairs.length}`)
  console.log(`  ready to write:      ${todo.length}`)
  console.log(`  already repaired:    ${already}`)
  console.log(`  changed since audit: ${changed} (skipped)`)
  console.log(`  row not found:       ${missing} (skipped)`)

  if (!apply) {
    console.log('\nDry run. Pass --apply to write.')
    return
  }
  if (batch.length === 0) return

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = join(dataDir, `showcase-repairs-backup-${stamp}.json`)
  writeFileSync(
    backupPath,
    JSON.stringify(batch.map((r) => ({ id: r.id, data: r.old_data })), null, 1),
  )
  console.log(`\nBackup written: ${backupPath}`)

  let ok = 0
  for (const r of batch) {
    const err = await write(r.id, r.new_data)
    if (err) {
      console.error(`FAILED ${r.id} (${r.title}): ${err}`)
      console.error('Stopping after first failure. Check the key has write access.')
      break
    }
    ok++
  }
  console.log(`Updated ${ok}/${batch.length} rows.`)
})()
