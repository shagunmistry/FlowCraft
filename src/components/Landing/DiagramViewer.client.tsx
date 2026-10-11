'use client'

import { useState } from 'react'

type Sample = {
  id: string
  label: string
  prompt: string
  caption: string
  svg: React.ReactNode
}

const ink = 'rgb(var(--color-paper))'
const accent = 'rgb(var(--color-signal))'
const surface = 'rgb(var(--color-graphite))'
const line = { stroke: ink, strokeWidth: 1.5, fill: 'none' } as const

function Box({ x, y, w = 150, h = 48, text, hot = false }: { x: number; y: number; w?: number; h?: number; text: string; hot?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={hot ? accent : surface} stroke={hot ? accent : ink} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={15} fill={hot ? '#fff' : ink} fontFamily="inherit">
        {text}
      </text>
    </g>
  )
}

const samples: Sample[] = [
  {
    id: 'flowchart',
    label: 'Flowchart',
    prompt: 'Checkout flow with payment retry and fraud check',
    caption: 'Decision paths and loops, laid out for you.',
    svg: (
      <>
        <Box x={40} y={156} w={120} text="Cart" />
        <Box x={220} y={156} w={140} text="Fraud check" hot />
        <Box x={420} y={60} w={140} text="Charge card" />
        <Box x={420} y={252} w={140} text="Manual review" />
        <Box x={580} y={156} w={110} text="Order placed" />
        <path d="M160 180h60M360 170l60-86M360 190l60 86M560 84l60 72M560 276l60-72" {...line} />
        <path d="M490 108v0M490 60c0-30 120-30 120 0" {...line} strokeDasharray="4 4" />
        <text x={560} y={30} fontSize={13} fill={ink} opacity={0.6}>retry on failure</text>
      </>
    ),
  },
  {
    id: 'mindmap',
    label: 'Mind map',
    prompt: 'Launch plan for a mobile app',
    caption: 'One idea at the center, branches balanced around it.',
    svg: (
      <>
        <path d="M360 180L170 80M360 180L170 280M360 180L550 80M360 180L550 280M170 80L70 50M170 80L70 120M550 280L650 250M550 280L650 320" {...line} />
        <rect x={290} y={152} width={140} height={56} rx={28} fill={accent} />
        <text x={360} y={186} textAnchor="middle" fontSize={16} fill="#fff">App launch</text>
        <Box x={100} y={56} w={140} text="Marketing" />
        <Box x={100} y={256} w={140} text="Product" />
        <Box x={480} y={56} w={140} text="Support" />
        <Box x={480} y={256} w={140} text="Analytics" />
        <text x={20} y={46} fontSize={13} fill={ink}>Landing page</text>
        <text x={20} y={136} fontSize={13} fill={ink}>Press kit</text>
        <text x={600} y={246} fontSize={13} fill={ink}>Funnels</text>
        <text x={600} y={336} fontSize={13} fill={ink}>Retention</text>
      </>
    ),
  },
  {
    id: 'sequence',
    label: 'Sequence',
    prompt: 'User logs in through an auth service',
    caption: 'Who talks to whom, in order.',
    svg: (
      <>
        {[120, 300, 480, 640].map((x, i) => (
          <g key={x}>
            <Box x={x - 60} y={20} w={120} h={40} text={['Browser', 'API', 'Auth', 'Database'][i]} hot={i === 2} />
            <path d={`M${x} 60V340`} stroke={ink} strokeWidth={1} strokeDasharray="4 5" opacity={0.5} />
          </g>
        ))}
        <path d="M120 110H296M300 160H476M480 210H636M636 250H484M480 290H304" {...line} />
        <text x={130} y={102} fontSize={13} fill={ink}>POST /login</text>
        <text x={310} y={152} fontSize={13} fill={ink}>verify(credentials)</text>
        <text x={490} y={202} fontSize={13} fill={ink}>find user</text>
        <text x={500} y={242} fontSize={13} fill={ink}>user record</text>
        <text x={320} y={282} fontSize={13} fill={ink}>session token</text>
      </>
    ),
  },
  {
    id: 'er',
    label: 'Database',
    prompt: 'Customers, orders and products for a shop',
    caption: 'Tables and the relationships between them.',
    svg: (
      <>
        {[
          { x: 40, t: 'customers', r: ['id', 'email', 'name'] },
          { x: 280, t: 'orders', r: ['id', 'customer_id', 'total'], hot: true },
          { x: 520, t: 'products', r: ['id', 'title', 'price'] },
        ].map((t) => (
          <g key={t.t}>
            <rect x={t.x} y={90} width={160} height={150} rx={8} fill={surface} stroke={t.hot ? accent : ink} strokeWidth={t.hot ? 2.5 : 1.5} />
            <text x={t.x + 16} y={120} fontSize={15} fontWeight={600} fill={ink}>{t.t}</text>
            <path d={`M${t.x} 136H${t.x + 160}`} stroke={ink} strokeWidth={1} opacity={0.3} />
            {t.r.map((r, i) => (
              <text key={r} x={t.x + 16} y={166 + i * 28} fontSize={14} fill={ink} opacity={0.8}>{r}</text>
            ))}
          </g>
        ))}
        <path d="M200 165H280M440 165H520" {...line} />
        <text x={214} y={156} fontSize={12} fill={ink}>1 to many</text>
        <text x={452} y={156} fontSize={12} fill={ink}>many</text>
      </>
    ),
  },
  {
    id: 'state',
    label: 'State machine',
    prompt: 'Order status from placed to delivered',
    caption: 'States and the events that move between them.',
    svg: (
      <>
        <circle cx={50} cy={180} r={8} fill={ink} />
        <Box x={100} y={156} w={120} text="Placed" />
        <Box x={290} y={156} w={120} text="Packed" hot />
        <Box x={480} y={156} w={120} text="Shipped" />
        <Box x={290} y={270} w={120} text="Cancelled" />
        <rect x={640} y={156} width={60} height={48} rx={24} fill={surface} stroke={ink} strokeWidth={1.5} />
        <text x={670} y={185} textAnchor="middle" fontSize={13} fill={ink}>Done</text>
        <path d="M58 180H100M220 180H290M410 180H480M600 180H640M350 204V270M160 204C160 250 250 290 290 294" {...line} />
        <text x={228} y={172} fontSize={12} fill={ink}>pay</text>
        <text x={418} y={172} fontSize={12} fill={ink}>ship</text>
      </>
    ),
  },
  {
    id: 'class',
    label: 'Class diagram',
    prompt: 'Payment provider interface with two implementations',
    caption: 'Types, members and inheritance at a glance.',
    svg: (
      <>
        <rect x={240} y={30} width={240} height={110} rx={8} fill={surface} stroke={accent} strokeWidth={2.5} />
        <text x={360} y={60} textAnchor="middle" fontSize={15} fontWeight={600} fill={ink}>PaymentProvider</text>
        <path d="M240 72H480" stroke={ink} strokeWidth={1} opacity={0.3} />
        <text x={256} y={98} fontSize={14} fill={ink} opacity={0.8}>charge(amount)</text>
        <text x={256} y={122} fontSize={14} fill={ink} opacity={0.8}>refund(id)</text>
        {[80, 400].map((x, i) => (
          <g key={x}>
            <rect x={x} y={230} width={240} height={90} rx={8} fill={surface} stroke={ink} strokeWidth={1.5} />
            <text x={x + 120} y={260} textAnchor="middle" fontSize={15} fontWeight={600} fill={ink}>{['StripeProvider', 'PaypalProvider'][i]}</text>
            <path d={`M${x} 272H${x + 240}`} stroke={ink} strokeWidth={1} opacity={0.3} />
            <text x={x + 16} y={298} fontSize={14} fill={ink} opacity={0.8}>apiKey</text>
          </g>
        ))}
        <path d="M200 230V185H360V140M520 230V185H360" {...line} />
        <path d="M350 140l10-16 10 16z" fill={surface} stroke={ink} strokeWidth={1.5} />
      </>
    ),
  },
]

export default function DiagramViewer() {
  const [active, setActive] = useState(samples[0].id)
  const current = samples.find((s) => s.id === active) ?? samples[0]

  return (
    <div>
      <div role="tablist" aria-label="Diagram types" className="flex flex-wrap gap-x-6 gap-y-2">
        {samples.map((s) => (
          <button
            key={s.id}
            role="tab"
            id={`tab-${s.id}`}
            aria-selected={active === s.id}
            aria-controls="diagram-panel"
            onClick={() => setActive(s.id)}
            className={`border-b-2 pb-1 text-[15px] transition-colors ${
              active === s.id
                ? 'border-signal text-paper'
                : 'border-transparent text-fog hover:text-paper'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="diagram-panel"
        aria-labelledby={`tab-${current.id}`}
        className="mt-5 overflow-hidden rounded-2xl border border-rule bg-graphite shadow-[0_24px_60px_-30px_rgba(16,18,22,0.25)]"
      >
        <svg
          viewBox="0 0 720 360"
          role="img"
          aria-label={`${current.label} example: ${current.prompt}`}
          className="block h-auto w-full"
          fontFamily="Satoshi, ui-sans-serif, system-ui, sans-serif"
        >
          {current.svg}
        </svg>
        <div className="flex flex-col gap-1 border-t border-rule px-5 py-4 text-sm sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-paper">
            <span className="text-fog">Prompt: </span>
            {current.prompt}
          </p>
          <p className="text-fog">{current.caption}</p>
        </div>
      </div>
    </div>
  )
}
