'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Section, Button } from './SettingsUI'

export default function AccountSection({
  onDelete,
}: {
  onDelete: () => Promise<void>
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <Section title="Danger Zone">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <h4 className="text-sm font-semibold text-paper">
                Delete Account
              </h4>
              <p className="mt-1 text-sm text-fog">
                Permanently delete your account and all associated data,
                including diagrams, API keys, and subscription information. This
                action cannot be undone.
              </p>

              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Account
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"
                >
                  <p className="mb-3 text-sm font-medium text-red-900">
                    Are you sure? This action is permanent and cannot be undone.
                    All your data will be lost.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setShowConfirm(false)}
                      variant="secondary"
                      disabled={deleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={deleting}
                      variant="danger"
                      className="border-transparent bg-red-600 text-white hover:bg-red-700"
                    >
                      {deleting ? 'Deleting...' : 'Confirm Delete'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
