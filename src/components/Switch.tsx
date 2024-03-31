import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { cn } from '@/lib/utils'

export default function SwitchButton({
  enabled,
  setEnabled,
  message,
}: {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  message: string
}) {
  return (
    <Switch.Group as="div" className="mt-4 flex items-center justify-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={cn(
          enabled ? 'bg-pink-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          )}
        />
      </Switch>
      <Switch.Label as="span" className="text-md ml-3">
        {message}
      </Switch.Label>
    </Switch.Group>
  )
}
