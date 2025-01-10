import React from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

const StepIndicator = ({ status, step }: { status: string; step: any }) => {
  if (status === 'complete') {
    return (
      <motion.div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Check className="h-4 w-4" />
      </motion.div>
    )
  }

  if (status === 'current') {
    return (
      <motion.div
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-500 shadow-md ring-2 ring-blue-500"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <span className="text-sm font-medium">{step.id}</span>
        <motion.div
          className="absolute -inset-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    )
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400">
      <span className="text-sm font-medium">{step.id}</span>
    </div>
  )
}

const ProgressStepper = ({ steps }: { steps: any[] }) => {
  return (
    <nav
      aria-label="Progress"
      className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="overflow-hidden rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-xl">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={`relative flex items-center ${
                stepIdx !== steps.length - 1 ? 'w-full' : 'w-auto'
              }`}
            >
              <div className="flex items-center">
                <StepIndicator status={step.status} step={step} />
                <motion.span
                  className={`ml-3 text-sm font-medium ${
                    step.status === 'complete'
                      ? 'text-gray-900'
                      : step.status === 'current'
                        ? 'text-blue-500'
                        : 'text-gray-500'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {step.name}
                </motion.span>
              </div>

              {stepIdx !== steps.length - 1 && (
                <div className="relative ml-4 flex-1">
                  <motion.div
                    className="absolute inset-y-0 left-0 flex w-full items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div
                      className={`h-0.5 w-full ${
                        step.status === 'complete'
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      {step.status === 'complete' && (
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Progress indicator */}
        <div className="mt-4 hidden border-t border-gray-100 pt-4 sm:block">
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {steps.filter((step) => step.status === 'complete').length} of{' '}
              {steps.length} complete
            </span>
            <span>
              {steps.find((step) => step.status === 'current')?.name ||
                'Complete'}
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(steps.filter((step) => step.status === 'complete').length / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default ProgressStepper
