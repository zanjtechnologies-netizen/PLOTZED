// ================================================
// src/components/forms/SiteVisitForm.tsx - Site Visit Request Form
// ================================================

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface SiteVisitFormProps {
  plotId: string
  plotTitle: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function SiteVisitForm({
  plotId,
  plotTitle,
  onSuccess,
  onCancel,
}: SiteVisitFormProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    visitDate: '',
    visitTime: '10:00 AM',
    attendees: 1,
    notes: '',
    // Optional contact overrides
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Get maximum date (3 months from now)
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload: any = {
        plot_id: plotId,
        visit_date: formData.visitDate,
        visit_time: formData.visitTime,
        attendees: formData.attendees,
        notes: formData.notes || undefined,
      }

      // Add optional contact fields if provided
      if (formData.contactName) payload.contact_name = formData.contactName
      if (formData.contactPhone) payload.contact_phone = formData.contactPhone
      if (formData.contactEmail) payload.contact_email = formData.contactEmail

      const response = await fetch('/api/site-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        // Success!
        if (onSuccess) {
          onSuccess()
        }
        // Reset form
        setFormData({
          visitDate: '',
          visitTime: '10:00 AM',
          attendees: 1,
          notes: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
        })
        setShowAdvanced(false)
      } else {
        setError(data.error?.message || 'Failed to submit site visit request')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plot Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-1">Property</h3>
        <p className="text-gray-600">{plotTitle}</p>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-1">Your Details</h3>
          <p className="text-gray-600">{session.user.name}</p>
          <p className="text-gray-600 text-sm">{session.user.email}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Visit Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Visit Date *
        </label>
        <input
          type="date"
          value={formData.visitDate}
          onChange={(e) =>
            setFormData({ ...formData, visitDate: e.target.value })
          }
          min={minDate}
          max={maxDateStr}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Select a date between tomorrow and {new Date(maxDateStr).toLocaleDateString()}
        </p>
      </div>

      {/* Visit Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Time *
        </label>
        <select
          value={formData.visitTime}
          onChange={(e) =>
            setFormData({ ...formData, visitTime: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Our team will confirm the exact time based on availability
        </p>
      </div>

      {/* Number of Attendees */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of People *
        </label>
        <input
          type="number"
          value={formData.attendees}
          onChange={(e) =>
            setFormData({
              ...formData,
              attendees: parseInt(e.target.value) || 1,
            })
          }
          min="1"
          max="10"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          How many people will be visiting? (Maximum 10)
        </p>
      </div>

      {/* Advanced Options Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Options (Optional Contact Details)
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <p className="text-sm text-gray-600 mb-3">
            Override your account details for this visit (optional)
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) =>
                setFormData({ ...formData, contactName: e.target.value })
              }
              placeholder="Leave blank to use your account name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              placeholder="Leave blank to use your account phone"
              pattern="[6-9]\d{9}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Format: 10-digit Indian mobile number</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              placeholder="Leave blank to use your account email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests or Questions (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData({
              ...formData,
              notes: e.target.value,
            })
          }
          rows={4}
          maxLength={500}
          placeholder="Any specific requirements or questions you'd like to discuss during the visit..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 characters</p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Request Site Visit'}
        </button>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex">
          <svg
            className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>You'll receive a confirmation email immediately</li>
              <li>Our team will contact you within 24 hours to confirm the visit</li>
              <li>You'll get a reminder 24 hours before your scheduled visit</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  )
}
