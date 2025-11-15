// ================================================
// src/components/admin/SiteVisitActions.tsx
// Client component for site visit action buttons
// ================================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SiteVisitActionsProps {
  visitId: string
  status: string
  onActionComplete?: () => void
}

export default function SiteVisitActions({
  visitId,
  status,
  onActionComplete,
}: SiteVisitActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  const handleStatusUpdate = async (newStatus: string, adminNotes?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/site-visits/${visitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminNotes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Show success message
        alert('Site visit updated successfully!')

        // Refresh the page data
        router.refresh()

        // Call optional callback
        if (onActionComplete) {
          onActionComplete()
        }
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating site visit:', error)
      alert('Failed to update site visit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (confirm('Confirm this site visit?')) {
      handleStatusUpdate('CONFIRMED')
    }
  }

  const handleMarkComplete = () => {
    if (confirm('Mark this site visit as completed?')) {
      handleStatusUpdate('COMPLETED')
    }
  }

  const handleCancel = () => {
    const reason = prompt('Enter cancellation reason (optional):')
    if (confirm('Are you sure you want to cancel this site visit?')) {
      handleStatusUpdate('CANCELLED', reason || undefined)
    }
  }

  const handleSendReminder = async () => {
    // This would send a reminder email
    alert('Reminder email sent! (Feature to be implemented)')
  }

  return (
    <div className="flex flex-col space-y-2 ml-6">
      {status === 'PENDING' && (
        <>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
          <button
            onClick={() => setShowRescheduleModal(true)}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reschedule
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </>
      )}

      {status === 'CONFIRMED' && (
        <>
          <button
            onClick={handleMarkComplete}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Mark Complete'}
          </button>
          <button
            onClick={handleSendReminder}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Reminder
          </button>
        </>
      )}

      <button
        onClick={() => router.push(`/admin/site-visits/${visitId}`)}
        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
      >
        View Details
      </button>

      {showRescheduleModal && (
        <RescheduleModal
          visitId={visitId}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={() => {
            setShowRescheduleModal(false)
            router.refresh()
            if (onActionComplete) {
              onActionComplete()
            }
          }}
        />
      )}
    </div>
  )
}

// Simple Reschedule Modal Component
function RescheduleModal({
  visitId,
  onClose,
  onSuccess,
}: {
  visitId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    visit_date: '',
    visit_time: '',
    admin_notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/site-visits/${visitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visit_date: new Date(formData.visit_date).toISOString(),
          visit_time: formData.visit_time,
          admin_notes: formData.admin_notes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Site visit rescheduled successfully!')
        onSuccess()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error rescheduling:', error)
      alert('Failed to reschedule. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Reschedule Site Visit</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Date
            </label>
            <input
              type="date"
              required
              value={formData.visit_date}
              onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Time
            </label>
            <select
              required
              value={formData.visit_time}
              onChange={(e) => setFormData({ ...formData, visit_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.admin_notes}
              onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Reason for rescheduling..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Reschedule'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
