// ================================================
// src/components/admin/InquiryActions.tsx
// Client component for inquiry action buttons
// ================================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface InquiryActionsProps {
  inquiryId: string
  status: string
  onActionComplete?: () => void
}

export default function InquiryActions({
  inquiryId,
  status,
  onActionComplete,
}: InquiryActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async (newStatus: string, adminNotes?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
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
        alert('Inquiry updated successfully!')
        router.refresh()
        if (onActionComplete) {
          onActionComplete()
        }
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating inquiry:', error)
      alert('Failed to update inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkContacted = () => {
    if (confirm('Mark this inquiry as contacted?')) {
      handleStatusUpdate('CONTACTED')
    }
  }

  const handleMarkQualified = () => {
    const notes = prompt('Add any notes about qualification (optional):')
    if (confirm('Mark this inquiry as qualified?')) {
      handleStatusUpdate('QUALIFIED', notes || undefined)
    }
  }

  const handleMarkConverted = () => {
    if (confirm('Mark this inquiry as converted? This indicates the customer has made a purchase.')) {
      handleStatusUpdate('CONVERTED')
    }
  }

  const handleClose = () => {
    const reason = prompt('Enter reason for closing (optional):')
    if (confirm('Are you sure you want to close this inquiry?')) {
      handleStatusUpdate('CLOSED', reason || undefined)
    }
  }

  return (
    <div className="flex flex-col space-y-2 ml-6">
      {status === 'NEW' && (
        <>
          <button
            onClick={handleMarkContacted}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Mark Contacted'}
          </button>
          <button
            onClick={handleMarkQualified}
            disabled={loading}
            className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark Qualified
          </button>
        </>
      )}

      {status === 'CONTACTED' && (
        <>
          <button
            onClick={handleMarkQualified}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Mark Qualified'}
          </button>
          <button
            onClick={handleMarkConverted}
            disabled={loading}
            className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark Converted
          </button>
        </>
      )}

      {status === 'QUALIFIED' && (
        <button
          onClick={handleMarkConverted}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Mark Converted'}
        </button>
      )}

      <button
        onClick={() => router.push(`/admin/inquiries/${inquiryId}`)}
        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
      >
        View Details
      </button>

      {status !== 'CLOSED' && status !== 'CONVERTED' && (
        <button
          onClick={handleClose}
          disabled={loading}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close
        </button>
      )}
    </div>
  )
}
