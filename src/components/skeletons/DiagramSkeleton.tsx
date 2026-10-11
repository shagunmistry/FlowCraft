export default function DiagramSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading diagram"
      className="relative flex h-full min-h-[400px] w-full items-center justify-center overflow-hidden rounded-sm border border-rule bg-ink"
    >
      {/* dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgb(var(--color-signal) / 0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* scanline */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-40 animate-scan bg-gradient-to-r from-transparent via-signal/10 to-transparent" />

      <div className="relative flex flex-col items-center gap-4">
        <svg
          viewBox="0 0 48 48"
          className="h-12 w-12 animate-spin"
          style={{ animationDuration: '3s' }}
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            style={{ stroke: 'rgb(var(--color-signal))' }}
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          <circle cx="24" cy="2" r="2" style={{ fill: 'rgb(var(--color-signal))' }} />
        </svg>
        <p className="text-sm text-fog">Loading diagram</p>
      </div>
    </div>
  )
}
