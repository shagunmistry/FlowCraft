/**
 * Fetches all entries from the `feedback` and `support` Supabase tables
 * for analysis. Run with:
 *   pnpm dlx tsx scripts/fetch-feedback-support.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PRIVATE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_PRIVATE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

async function fetchAll(table: string) {
  let { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (error && /created_at/.test(error.message)) {
    ;({ data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' }))
  }

  if (error) {
    console.error(`[${table}] error:`, error.message)
    return { table, error: error.message, rows: [] as any[] }
  }
  return { table, count: count ?? data?.length ?? 0, rows: data ?? [] }
}

;(async () => {
  const [feedback, support] = await Promise.all([
    fetchAll('feedback'),
    fetchAll('support'),
  ])

  const summarize = (r: any) => {
    if (r.error) return `  ERROR: ${r.error}`
    if (!r.rows.length) return '  (no rows)'
    const cols = Object.keys(r.rows[0])
    return [
      `  count: ${r.count}`,
      `  columns: ${cols.join(', ')}`,
      `  newest: ${r.rows[0].created_at ?? '(no created_at)'}`,
      `  oldest: ${r.rows[r.rows.length - 1].created_at ?? '(no created_at)'}`,
    ].join('\n')
  }

  console.log('=== feedback ===')
  console.log(summarize(feedback))
  console.log('\n=== support ===')
  console.log(summarize(support))

  const outDir = path.resolve(__dirname, '../tmp')
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'feedback-support-dump.json')
  fs.writeFileSync(outPath, JSON.stringify({ feedback, support }, null, 2))
  console.log(`\nFull dump written to: ${outPath}`)

  console.log('\n--- feedback rows (first 5) ---')
  console.log(JSON.stringify(feedback.rows.slice(0, 5), null, 2))
  console.log('\n--- support rows (first 5) ---')
  console.log(JSON.stringify(support.rows.slice(0, 5), null, 2))
})()
