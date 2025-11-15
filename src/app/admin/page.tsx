// ================================================
// src/app/admin/page.tsx - Main Admin Dashboard
// ================================================

import {
  Building2,
  CalendarCheck,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'
import RecentActivity from '@/components/admin/RecentActivity'

async function getDashboardData() {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/dashboard`, {
      cache: 'no-store',
      headers: {
        'Cookie': cookieHeader,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return null
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const stats = data?.stats || {
    plots: { total: 0, available: 0, booked: 0, sold: 0 },
    customers: 0,
    siteVisits: 0,
    pendingSiteVisits: 0,
    pendingInquiries: 0,
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={stats.plots.total}
          icon={Building2}
          trend={'+12%'}
          trendUp={true}
          subtitle={`${stats.plots.available} available`}
          color="blue"
        />

        <StatsCard
          title="Site Visits"
          value={stats.siteVisits}
          icon={CalendarCheck}
          trend={'+8%'}
          trendUp={true}
          subtitle={`${stats.pendingSiteVisits} pending`}
          color="green"
        />

        <StatsCard
          title="Inquiries"
          value={stats.pendingInquiries}
          icon={MessageSquare}
          trend={'+23%'}
          trendUp={true}
          subtitle="New this week"
          color="purple"
        />

        <StatsCard
          title="Total Customers"
          value={stats.customers}
          icon={Users}
          trend={'+5%'}
          trendUp={true}
          subtitle="Active users"
          color="orange"
        />
      </div>

      {/* Property Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{stats.plots.available}</div>
            <div className="text-sm text-gray-600 mt-1">Available</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{stats.plots.booked}</div>
            <div className="text-sm text-gray-600 mt-1">Booked</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-600">{stats.plots.sold}</div>
            <div className="text-sm text-gray-600 mt-1">Sold</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Site Visits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Site Visits</h2>
            <a href="/admin/site-visits" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </a>
          </div>
          <RecentActivity
            items={data?.recentSiteVisits || []}
            type="siteVisit"
          />
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
            <a href="/admin/inquiries" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </a>
          </div>
          <RecentActivity
            items={data?.recentInquiries || []}
            type="inquiry"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/properties?action=new"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition"
          >
            <Building2 className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Add Property</span>
          </a>
          <a
            href="/admin/site-visits?status=PENDING"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition"
          >
            <CalendarCheck className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Review Visits</span>
          </a>
          <a
            href="/admin/inquiries?status=NEW"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">View Inquiries</span>
          </a>
          <a
            href="/admin/analytics"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition"
          >
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Analytics</span>
          </a>
        </div>
      </div>
    </div>
  )
}
