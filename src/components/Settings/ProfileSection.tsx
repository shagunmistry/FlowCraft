'use client'

import React, { useState } from 'react'
import { CalendarDaysIcon, PencilIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Section, Row, Button } from './SettingsUI'

interface UserSettings {
  email: string
  user_id: string
  display_name: string | null
  subscription: {
    plan: string
    subscribed: boolean
    date_subscribed: string | null
    date_cancelled: string | null
  }
  created_at: string
}

function getInitials(displayName: string | null, email: string): string {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }
  return email.charAt(0).toUpperCase()
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ProfileSection({
  settings,
  onSettingsUpdate,
}: {
  settings: UserSettings
  onSettingsUpdate: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(settings.display_name || '')
  const [saving, setSaving] = useState(false)

  const initials = getInitials(settings.display_name, settings.email)

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty')
      return
    }
    if (displayName.trim().length > 50) {
      toast.error('Display name must be 50 characters or less')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')
      toast.success('Display name updated')
      setEditing(false)
      onSettingsUpdate()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update display name')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setDisplayName(settings.display_name || '')
    setEditing(false)
  }

  return (
    <div>
      {/* Avatar + Name Header */}
      <div className="mb-8 flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-signal text-xl font-medium text-ink">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-paper">
            {settings.display_name || settings.email}
          </h2>
          <p className="text-sm text-fog">
            Member since {new Date(settings.created_at).getFullYear()}
          </p>
        </div>
      </div>

      {/* Display Name */}
      <Section title="Profile">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-paper">Display Name</p>
              {!editing && (
                <p className="mt-1 text-sm text-fog">
                  {settings.display_name || 'Not set'}
                </p>
              )}
            </div>
            {!editing && (
              <Button onClick={() => setEditing(true)} variant="outline">
                <PencilIcon className="mr-1.5 inline h-3.5 w-3.5" />
                Edit
              </Button>
            )}
          </div>

          {editing && (
            <div className="mt-3">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                maxLength={50}
                className="w-full rounded-lg border border-rule px-3 py-2 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
                autoFocus
              />
              <p className="mt-1 text-xs text-fog">
                {displayName.length}/50 characters
              </p>
              <div className="mt-3 flex gap-2">
                <Button onClick={handleSave} variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleCancel} variant="secondary" disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Account Details */}
      <Section title="Account Details">
        <Row label="Email" value={settings.email} />
        <Row
          label="User ID"
          value={
            <code className="rounded bg-ink px-2 py-0.5 font-mono text-xs text-fog">
              {settings.user_id}
            </code>
          }
        />
        <Row
          label="Joined"
          value={formatDate(settings.created_at)}
          icon={CalendarDaysIcon}
        />
      </Section>
    </div>
  )
}
