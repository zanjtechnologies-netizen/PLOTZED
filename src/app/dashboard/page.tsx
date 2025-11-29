// ================================================
// src/app/dashboard/page.tsx - User Dashboard
// ================================================

import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { SiteVisitStatus } from '@prisma/client'

interface SiteVisitWithPlot {
  id: string
  visit_date: Date
  visit_time: string
  attendees: number
  status: SiteVisitStatus
  plots: {
    title: string
    price: any
    images: string[]
    address: string
    city: string
    state: string
  }
}

export const metadata: Metadata = {
  title: 'My Dashboard | Plotzed',
  description: 'View your site visits, bookings, and property inquiries',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Fetch user data with site visits
  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    include: {
      site_visits: {
        include: {
          plots: {
            select: {
              title: true,
              price: true,
              images: true,
              address: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: { visit_date: 'asc' },
      },
    },
  })

  // Separate upcoming and past visits
  const now = new Date()
  const upcomingVisits = user?.site_visits.filter((visit: any) =>
    new Date(visit.visit_date) >= now && visit.status !== 'CANCELLED' && visit.status !== 'COMPLETED'
  ) || []
  const pastVisits = user?.site_visits.filter((visit: any) =>
    new Date(visit.visit_date) < now || visit.status === 'CANCELLED' || visit.status === 'COMPLETED'
  ) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Welcome back, {user?.name}!
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Upcoming Visits</h3>
            <p className="text-3xl font-bold text-blue-600">
              {upcomingVisits.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Site Visits</h3>
            <p className="text-3xl font-bold text-blue-600">
              {user?.site_visits.length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">KYC Status</h3>
            <p className="text-lg font-semibold">
              {user?.kyc_verified ? (
                <span className="text-green-600">✓ Verified</span>
              ) : (
                <span className="text-orange-600">Pending</span>
              )}
            </p>
          </div>
        </div>

        {/* Upcoming Site Visits */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Site Visits</h2>
          {upcomingVisits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No upcoming visits scheduled.</p>
              <Link
                href="/properties"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingVisits.map((visit: SiteVisitWithPlot) => {
                const visitDate = new Date(visit.visit_date)
                const statusColors: Record<SiteVisitStatus, string> = {
                  PENDING: 'bg-yellow-100 text-yellow-800',
                  CONFIRMED: 'bg-green-100 text-green-800',
                  RESCHEDULED: 'bg-blue-100 text-blue-800',
                  COMPLETED: 'bg-gray-100 text-gray-800',
                  CANCELLED: 'bg-red-100 text-red-800',
                }

                return (
                  <div
                    key={visit.id}
                    className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{visit.plots.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{visit.plots.city}, {visit.plots.state}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium">
                            📅 {visitDate.toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="font-medium">🕒 {visit.visit_time}</span>
                          <span className="font-medium">👥 {visit.attendees} {visit.attendees === 1 ? 'person' : 'people'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[visit.status as SiteVisitStatus]}`}>
                          {visit.status}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-600 hover:underline">
                            Reschedule
                          </button>
                          <button className="text-sm text-red-600 hover:underline">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Past Site Visits */}
        {pastVisits.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Past Site Visits</h2>
            <div className="space-y-4">
              {pastVisits.map((visit: SiteVisitWithPlot) => {
                const visitDate = new Date(visit.visit_date)
                const statusColors: Record<SiteVisitStatus, string> = {
                  PENDING: 'bg-yellow-100 text-yellow-800',
                  CONFIRMED: 'bg-green-100 text-green-800',
                  RESCHEDULED: 'bg-blue-100 text-blue-800',
                  COMPLETED: 'bg-gray-100 text-gray-800',
                  CANCELLED: 'bg-red-100 text-red-800',
                }

                return (
                  <div
                    key={visit.id}
                    className="border rounded-lg p-4 opacity-60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{visit.plots.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{visit.plots.city}, {visit.plots.state}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            📅 {visitDate.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span>🕒 {visit.visit_time}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[visit.status as SiteVisitStatus]}`}>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
