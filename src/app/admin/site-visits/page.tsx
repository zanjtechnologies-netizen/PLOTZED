export const dynamic = 'force-dynamic'
export const revalidate = 0

// ================================================
// src/app/admin/site-visits/page.tsx - Site Visits Management
// ================================================

import { Calendar, User, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import SiteVisitActions from '@/components/admin/SiteVisitActions'
import StatusFilter from '@/components/admin/StatusFilter'

const statusIcons: Record<string, any> = {
  PENDING: AlertCircle,
  CONFIRMED: CheckCircle,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
  RESCHEDULED: AlertCircle,
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  RESCHEDULED: 'bg-purple-100 text-purple-800 border-purple-200',
}

async function getSiteVisits(status?: string) {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

    const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/site-visits`)
    if (status) {
      url.searchParams.set('status', status)
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Cookie': cookieHeader,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch site visits')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Site visits fetch error:', error)
    return null
  }
}

export default async function SiteVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const data = await getSiteVisits(params.status)

  const siteVisits = data?.siteVisits || []
  const stats = data?.stats || {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    RESCHEDULED: 0,
  }

  const totalVisits = Object.values(stats).reduce((acc: number, val) => acc + (val as number), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Visits</h1>
          <p className="text-gray-600 mt-2">Manage all property site visit requests</p>
        </div>
        <StatusFilter currentStatus={params.status} />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{totalVisits}</div>
          <div className="text-sm text-gray-600">Total Visits</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-900">{stats.PENDING}</div>
          <div className="text-sm text-yellow-700">Pending</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">{stats.CONFIRMED}</div>
          <div className="text-sm text-blue-700">Confirmed</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">{stats.COMPLETED}</div>
          <div className="text-sm text-green-700">Completed</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">{stats.RESCHEDULED}</div>
          <div className="text-sm text-purple-700">Rescheduled</div>
        </div>
      </div>

      {/* Site Visits List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {siteVisits.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No site visits found</p>
            <p className="text-sm mt-1">
              {params.status ? `No ${params.status.toLowerCase()} site visits at the moment.` : 'No site visits have been scheduled yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {siteVisits.map((visit: any) => {
              const StatusIcon = statusIcons[visit.status]
              return (
                <div key={visit.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Property Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {visit.plot.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[visit.status]
                          }`}
                        >
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {visit.status}
                        </span>
                      </div>

                      {/* Visit Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(visit.visit_date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {visit.visit_time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {visit.user.name} ({visit.attendees} people)
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {visit.plot.city}, {visit.plot.state}
                        </div>
                      </div>

                      {/* Customer Contact */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Customer Contact</div>
                        <div className="text-sm text-gray-900">
                          {visit.user.email} • {visit.user.phone || 'No phone'}
                        </div>
                      </div>

                      {/* Admin Notes */}
                      {visit.admin_notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xs text-blue-600 mb-1">Admin Notes</div>
                          <div className="text-sm text-gray-900">{visit.admin_notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <SiteVisitActions visitId={visit.id} status={visit.status} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
