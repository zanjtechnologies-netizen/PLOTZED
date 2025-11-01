// ================================================
// src/app/dashboard/page.tsx - User Dashboard
// ================================================

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        include: {
          plot: {
            select: {
              title: true,
              price: true,
              images: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        take: 5,
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Welcome back, {user?.name}!
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-blue-600">
              {user?.bookings.length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Saved Properties</h3>
            <p className="text-3xl font-bold text-blue-600">
              {user?.saved_plots.length || 0}
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

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
          {user?.bookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {user?.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.plot.title}</h3>
                    <p className="text-sm text-gray-600">
                      Status: {booking.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹
                      {booking.booking_amount
                        .toNumber()
                        .toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
