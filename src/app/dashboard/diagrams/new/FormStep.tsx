import React, { useEffect, useState } from 'react'
import { LockIcon, LockOpenIcon, CrownIcon } from 'lucide-react'

interface FormStepProps {
  currentStep?: number
  isPublic: boolean
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
}

const FormStep: React.FC<FormStepProps> = ({ currentStep = 2, isPublic, setIsPublic }) => {
  const [usageData, setUsageData] = useState<{
    subscribed: boolean
  } | null>(null)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage')
        if (response.ok) {
          const data = await response.json()
          setUsageData(data)
        }
      } catch (error) {
        console.error('Error fetching usage:', error)
      }
    }
    fetchUsage()
  }, [])

  if (currentStep !== 2) return null

  const canTogglePrivate = usageData?.subscribed || false
  const handleToggle = () => {
    if (!canTogglePrivate && !isPublic) {
      // Already public, can't change
      return
    }
    if (!canTogglePrivate && isPublic) {
      // Trying to go private, but not subscribed - show message
      return
    }
    setIsPublic(!isPublic)
  }

  return (
    <div className="space-y-8 rounded-2xl bg-white/80 p-6 backdrop-blur-xl">
      {/* Privacy Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Privacy Settings
          {!canTogglePrivate && (
            <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
              <CrownIcon className="mr-1 h-3 w-3" />
              Pro Only
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={handleToggle}
          disabled={!canTogglePrivate}
          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 transition duration-200 ${
            isPublic
              ? 'border-green-200 bg-green-50 text-green-700'
              : canTogglePrivate
                ? 'border-gray-200 bg-white/50 text-gray-700'
                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isPublic ? (
              <LockOpenIcon className="h-5 w-5" />
            ) : (
              <LockIcon className="h-5 w-5" />
            )}
            <span className="font-medium">
              {isPublic ? 'Public Diagram' : 'Private Diagram'}
            </span>
          </div>
          <div
            className={`flex h-6 w-11 items-center rounded-full transition duration-200 ${
              isPublic ? 'bg-green-500' : canTogglePrivate ? 'bg-gray-200' : 'bg-gray-300'
            }`}
          >
            <span
              className={`relative inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </div>
        </button>
        <p className="text-sm text-gray-500">
          {isPublic
            ? 'It will be showcased in our FlowCraft public gallery and anyone with the link can access this diagram!'
            : canTogglePrivate
              ? 'Only you can access this diagram'
              : 'Private diagrams are available with Pro subscription'}
        </p>
        {!canTogglePrivate && (
          <div className="mt-2 rounded-md bg-yellow-50 p-3 border border-yellow-200">
            <p className="text-xs text-yellow-800">
              Upgrade to{' '}
              <a href="/pricing" className="font-semibold underline hover:text-yellow-900">
                Pro
              </a>{' '}
              to create private diagrams that only you can access.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormStep
