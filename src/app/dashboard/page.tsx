// ================================================
// src/app/dashboard/page.tsx - User Dashboard
// ================================================

import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { SiteVisitStatus } from '@prisma/client'
import SiteVisitCard from '@/components/dashboard/SiteVisitCard'

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

  // Fetch user data with site visits and inquiries
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
      inquiries: {
        include: {
          plots: {
            select: {
              title: true,
              price: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Welcome Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">Manage your property journey from your dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming Visits</h3>
            <p className="text-4xl font-bold text-blue-600 mb-1">
              {upcomingVisits.length}
            </p>
            <p className="text-xs text-gray-500">Scheduled appointments</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Site Visits</h3>
            <p className="text-4xl font-bold text-purple-600 mb-1">
              {user?.site_visits.length || 0}
            </p>
            <p className="text-xs text-gray-500">Property viewings</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Inquiries</h3>
            <p className="text-4xl font-bold text-amber-600 mb-1">
              {user?.inquiries.length || 0}
            </p>
            <p className="text-xs text-gray-500">Consultation requests</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${user?.kyc_verified ? 'bg-green-50' : 'bg-orange-50'}`}>
                <svg className={`w-6 h-6 ${user?.kyc_verified ? 'text-green-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">KYC Status</h3>
            <p className="text-2xl sm:text-3xl font-bold mb-1">
              {user?.kyc_verified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-orange-600">Pending</span>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {user?.kyc_verified ? 'Your account is verified' : 'Verification pending'}
            </p>
          </div>
        </div>

        {/* Upcoming Site Visits */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Upcoming Site Visits
            </h2>
          </div>
          {upcomingVisits.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 text-lg">No upcoming visits scheduled.</p>
              <Link
                href="/properties"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {upcomingVisits.map((visit: SiteVisitWithPlot) => (
                <SiteVisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          )}
        </div>

        {/* Past Site Visits */}
        {pastVisits.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Past Site Visits
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {pastVisits.map((visit: SiteVisitWithPlot) => {
                const visitDate = new Date(visit.visit_date)
                const statusColors: Record<SiteVisitStatus, string> = {
                  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                  CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
                  RESCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
                  COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200',
                  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
                }

                return (
                  <div
                    key={visit.id}
                    className="border border-gray-200 bg-gray-50/50 rounded-xl p-4 sm:p-5 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{visit.plots.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{visit.plots.city}, {visit.plots.state}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {visitDate.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {visit.visit_time}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border self-start ${statusColors[visit.status as SiteVisitStatus]}`}>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Consultation Requests / Inquiries */}
        {user?.inquiries && user.inquiries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Consultation Requests
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {user.inquiries.map((inquiry: any) => {
                const createdDate = new Date(inquiry.created_at)
                const statusColors = {
                  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                  CONTACTED: 'bg-blue-50 text-blue-700 border-blue-200',
                  RESOLVED: 'bg-green-50 text-green-700 border-green-200',
                  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
                }

                return (
                  <div
                    key={inquiry.id}
                    className="border border-gray-200 bg-amber-50/30 rounded-xl p-4 sm:p-5 hover:bg-amber-50/50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <div className="flex-1">
                        {inquiry.plots ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <h3 className="font-semibold text-gray-900">{inquiry.plots.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{inquiry.plots.city}, {inquiry.plots.state}</p>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <h3 className="font-semibold text-gray-900">General Consultation</h3>
                          </div>
                        )}

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{inquiry.message}</p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {createdDate.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {inquiry.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {inquiry.phone}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border self-start ${statusColors[inquiry.status as keyof typeof statusColors] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {inquiry.status || 'PENDING'}
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
