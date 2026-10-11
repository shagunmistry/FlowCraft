import React, { useEffect, useState } from 'react'

interface FormStepProps {
  currentStep?: number
  isPublic: boolean
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
}

const FormStep: React.FC<FormStepProps> = ({
  currentStep = 2,
  isPublic,
  setIsPublic,
}) => {
  const [usageData, setUsageData] = useState<{ subscribed: boolean } | null>(
    null,
  )

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch('/api/usage')
        if (response.ok) {
          const data = await response.json()
          setUsageData(data)
        }
      } catch {
        // ignore
      }
    })()
  }, [])

  if (currentStep !== 2) return null

  const canTogglePrivate = usageData?.subscribed || false

  const handleToggle = () => {
    if (!canTogglePrivate) return
    setIsPublic(!isPublic)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-fog">
        <span>Privacy</span>
        {!canTogglePrivate && (
          <span className="ml-auto rounded-sm border border-signal/40 bg-signal/10 px-1.5 py-0.5 text-xs text-signal">
            Pro only
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        disabled={!canTogglePrivate}
        className={`group flex w-full items-center justify-between rounded-sm border px-4 py-4 transition-colors duration-200 ${
          isPublic
            ? 'border-rule bg-graphite text-paper hover:border-signal/40'
            : canTogglePrivate
              ? 'border-signal bg-signal/10 text-signal'
              : 'cursor-not-allowed border-rule bg-graphite/60 text-fog'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-2 w-2 rounded-full ${
              isPublic ? 'bg-signal' : 'bg-fog'
            }`}
          />
          <div className="text-left">
            <div className="text-sm font-medium">
              {isPublic ? 'Public diagram' : 'Private diagram'}
            </div>
            <div className="mt-0.5 font-serif text-lg">
              {isPublic ? 'Visible in gallery' : 'Only you can view'}
            </div>
          </div>
        </div>

        <span
          className={`relative inline-flex h-6 w-11 items-center rounded-sm border transition-colors ${
            isPublic
              ? 'border-signal/60 bg-signal/20'
              : canTogglePrivate
                ? 'border-signal bg-signal/40'
                : 'border-rule bg-graphite'
          }`}
        >
          <span
            className={`absolute inline-block h-4 w-4 rounded-sm bg-signal transition-transform duration-200 ${
              isPublic ? 'translate-x-1' : 'translate-x-6'
            }`}
          />
        </span>
      </button>

      <p className="text-sm leading-relaxed text-paper/60">
        {isPublic
          ? 'It will appear in our public gallery and anyone with the link can view it.'
          : canTogglePrivate
            ? 'Only you can access this diagram.'
            : 'Private diagrams are available on Pro.'}
      </p>

      {!canTogglePrivate && (
        <div className="rounded-sm border border-signal/30 bg-signal/5 p-3">
          <p className="text-sm text-fog">
            Upgrade to{' '}
            <a
              href="/pricing"
              className="text-signal underline decoration-signal/40 underline-offset-2 hover:decoration-signal"
            >
              Pro
            </a>{' '}
            to draft private diagrams
          </p>
        </div>
      )}
    </div>
  )
}

export default FormStep
