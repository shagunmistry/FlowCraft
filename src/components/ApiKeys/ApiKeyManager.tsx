'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  KeyIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import type { ApiKeyListItem, CreateApiKeyRequest, ApiKeyPermission } from '@/types/api-keys'

// --- UI Components ---

const Button = ({
  children,
  onClick,
  variant = 'secondary',
  disabled,
  className,
  icon: Icon,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  disabled?: boolean
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}) => {
  const base =
    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    outline: 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

// --- Main Component ---

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeyListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/api-keys')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch API keys')
      setApiKeys(data.data || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys/${keyId}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete API key')
      toast.success('API key revoked successfully')
      fetchApiKeys()
    } catch (error: any) {
      toast.error(error.message || 'Failed to revoke API key')
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
          <p className="text-sm font-medium text-zinc-500">Loading API keys...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">API Keys</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Use API keys to authenticate requests from the FlowCraft VS Code extension
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          icon={PlusIcon}
        >
          Create Key
        </Button>
      </div>

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <KeyIcon className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
          <h4 className="mb-1 text-sm font-semibold text-zinc-900">No API keys yet</h4>
          <p className="mb-4 text-xs text-zinc-500">
            Create your first API key to start using the FlowCraft API
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="outline"
            icon={PlusIcon}
          >
            Create your first key
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                'rounded-xl border bg-white p-4 shadow-sm transition-all',
                isExpired(apiKey.expires_at)
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-zinc-200 hover:shadow-md'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-zinc-900">{apiKey.name}</h4>
                    {isExpired(apiKey.expires_at) && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Expired
                      </span>
                    )}
                    {!apiKey.is_active && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <code className="rounded bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-600">
                      {apiKey.key_preview}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiKey.key_preview, 'Key preview')}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                    >
                      {copiedKey === apiKey.key_preview ? (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      <span>Created {formatDate(apiKey.created_at)}</span>
                    </div>
                    {apiKey.expires_at && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span
                          className={isExpired(apiKey.expires_at) ? 'text-red-600' : ''}
                        >
                          Expires {formatDate(apiKey.expires_at)}
                        </span>
                      </div>
                    )}
                    {apiKey.last_used_at && (
                      <div className="flex items-center gap-1">
                        <span>Last used {formatDate(apiKey.last_used_at)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {apiKey.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                      >
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteKey(apiKey.id)}
                  className="ml-4 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Revoke API key"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateApiKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchApiKeys}
      />
    </div>
  )
}

// --- Create API Key Modal ---

function CreateApiKeyModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [expiresIn, setExpiresIn] = useState<'30' | '90' | '365' | 'never'>('90')
  const [creating, setCreating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your API key')
      return
    }

    try {
      setCreating(true)

      let expiresAt: string | null = null
      if (expiresIn !== 'never') {
        const date = new Date()
        date.setDate(date.getDate() + parseInt(expiresIn))
        expiresAt = date.toISOString()
      }

      const requestBody: CreateApiKeyRequest = {
        name: name.trim(),
        permissions: ['generate_diagrams', 'read_diagrams'],
        expires_at: expiresAt,
      }

      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create API key')

      setNewKey(data.data.key)
      toast.success('API key created successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const handleCopyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      toast.success('API key copied to clipboard')
    }
  }

  const handleClose = () => {
    setName('')
    setExpiresIn('90')
    setNewKey(null)
    setCopied(false)
    onClose()
    onSuccess()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {!newKey ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900">Create API Key</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Generate a new API key for the FlowCraft VS Code extension
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., VS Code Extension"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Expiration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '30', label: '30 days' },
                      { value: '90', label: '90 days' },
                      { value: '365', label: '1 year' },
                      { value: 'never', label: 'Never' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setExpiresIn(option.value as any)}
                        className={clsx(
                          'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                          expiresIn === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-900">
                    This key will have permissions to generate and read diagrams
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button onClick={handleClose} variant="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  variant="primary"
                  disabled={creating || !name.trim()}
                >
                  {creating ? 'Creating...' : 'Create Key'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900">API Key Created!</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Copy your API key now. You won't be able to see it again.
                </p>
              </div>

              <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">YOUR API KEY</span>
                  <button
                    onClick={handleCopyKey}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-100"
                  >
                    {copied ? (
                      <span className="flex items-center gap-1.5 text-green-600">
                        <CheckIcon className="h-3.5 w-3.5" />
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                        Copy
                      </span>
                    )}
                  </button>
                </div>
                <code className="block break-all font-mono text-sm text-zinc-900">
                  {newKey}
                </code>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 mb-6">
                <p className="text-xs text-amber-900">
                  Make sure to copy your API key now. You won't be able to see it again!
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleClose} variant="primary">
                  Done
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
