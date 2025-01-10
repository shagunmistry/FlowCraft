import React, { useState } from 'react'
import { LockIcon, LockOpenIcon } from 'lucide-react'

const FormStep = ({ currentStep = 2 }) => {
  const [isPublic, setIsPublic] = useState(true)

  if (currentStep !== 2) return null

  return (
    <div className="space-y-8 rounded-2xl bg-white/80 p-6 backdrop-blur-xl">
      {/* Title Input */}
      <div className="space-y-2">
        <label
          htmlFor="diagram-title"
          className="text-sm font-medium text-gray-700"
        >
          Diagram Title
        </label>
        <div className="group relative">
          <input
            type="text"
            name="diagram-title"
            id="diagram-title"
            placeholder="Enter a title for your diagram"
            className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 text-base text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label
          htmlFor="diagram-description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <div className="group relative">
          <textarea
            rows={6}
            name="diagram-description"
            id="diagram-description"
            placeholder="Describe your diagram..."
            className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 text-base text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Privacy Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Privacy Settings
        </label>
        <button
          onClick={() => setIsPublic(!isPublic)}
          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 transition duration-200 ${
            isPublic
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white/50 text-gray-700'
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
              isPublic ? 'bg-green-500' : 'bg-gray-200'
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
            : 'Only you can access this diagram'}
        </p>
      </div>
    </div>
  )
}

export default FormStep
