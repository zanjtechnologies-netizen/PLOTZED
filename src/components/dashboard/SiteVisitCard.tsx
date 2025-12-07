'use client'

import { useState } from 'react'
import { SiteVisitStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface SiteVisitCardProps {
  visit: {
    id: string
    visit_date: Date
    visit_time: string
    attendees: number
    status: SiteVisitStatus
    plots: {
      title: string
      city: string
      state: string
    }
  }
}

export default function SiteVisitCard({ visit }: SiteVisitCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const visitDate = new Date(visit.visit_date)

  const statusColors: Record<SiteVisitStatus, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
    RESCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
    COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this site visit?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/site-visits/${visit.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to cancel site visit')
      }
    } catch (error) {
      console.error('Error cancelling visit:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReschedule = () => {
    setShowRescheduleModal(true)
  }

  const submitReschedule = async (newDate: string, newTime: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/site-visits/${visit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visit_date: newDate,
          visit_time: newTime,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setShowRescheduleModal(false)
        router.refresh()
      } else {
        alert(result.error || 'Failed to reschedule site visit')
      }
    } catch (error) {
      console.error('Error rescheduling visit:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1">
              {visit.plots.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {visit.plots.city}, {visit.plots.state}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium text-gray-700">
                  {visitDate.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium text-gray-700">{visit.visit_time}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-medium text-gray-700">
                  {visit.attendees} {visit.attendees === 1 ? 'person' : 'people'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold border ${
                statusColors[visit.status as SiteVisitStatus]
              }`}
            >
              {visit.status}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleReschedule}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reschedule
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          onClose={() => setShowRescheduleModal(false)}
          onSubmit={submitReschedule}
          loading={loading}
          currentDate={visitDate.toISOString().split('T')[0]}
          currentTime={visit.visit_time}
        />
      )}
    </>
  )
}

// Reschedule Modal Component
function RescheduleModal({
  onClose,
  onSubmit,
  loading,
  currentDate,
  currentTime,
}: {
  onClose: () => void
  onSubmit: (date: string, time: string) => void
  loading: boolean
  currentDate: string
  currentTime: string
}) {
  const [newDate, setNewDate] = useState(currentDate)
  const [newTime, setNewTime] = useState(currentTime)

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(newDate, newTime)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Reschedule Visit</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={minDate}
              required
              className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
              className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
            >
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
