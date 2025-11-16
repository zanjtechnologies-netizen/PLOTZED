// ================================================
// src/components/admin/UserModal.tsx
// Modal for editing user details
// ================================================

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Shield, CheckCircle, XCircle } from 'lucide-react'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onSuccess?: () => void
}

export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    role: 'CUSTOMER',
    email_verified: false,
    kyc_verified: false,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || 'CUSTOMER',
        email_verified: user.email_verified || false,
        kyc_verified: user.kyc_verified || false,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('User updated successfully!')
        router.refresh()
        if (onSuccess) {
          onSuccess()
        }
        onClose()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="space-y-1">
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            {user.phone && <div className="text-sm text-gray-600">{user.phone}</div>}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 inline mr-1" />
              User Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              disabled={user.role === 'ADMIN'}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
            {user.role === 'ADMIN' && (
              <p className="text-xs text-gray-500 mt-1">
                Admin role cannot be changed for security reasons
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.email_verified}
                onChange={(e) =>
                  setFormData({ ...formData, email_verified: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                Email Verified
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.kyc_verified}
                onChange={(e) =>
                  setFormData({ ...formData, kyc_verified: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                KYC Verified
              </span>
            </label>
          </div>

          {/* User Statistics */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">User Statistics</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-blue-900 font-semibold">
                  {user._count?.site_visits || 0}
                </div>
                <div className="text-blue-600 text-xs">Site Visits</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-purple-900 font-semibold">
                  {user._count?.inquiries || 0}
                </div>
                <div className="text-purple-600 text-xs">Inquiries</div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
