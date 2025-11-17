// ================================================
// src/app/admin/analytics/page.tsx - Analytics Dashboard
// ================================================

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { BarChart3, TrendingUp, Users, Building2, Eye } from 'lucide-react'

async function getAnalyticsData() {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/analytics?period=30`,
      {
        cache: 'no-store',
        headers: {
          'Cookie': cookieHeader,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch analytics data')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Analytics data fetch error:', error)
    return null
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            {data.period} performance insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg" defaultValue="30">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 365 days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Site Visits</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.overview.totalSiteVisits}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {data.growth.siteVisits.growthRate}
                </span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.overview.totalPlots}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {data.overview.activePlots} active
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.overview.totalUsers}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {data.growth.users.growthRate}
                </span>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.overview.conversionRate}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Inquiry to visit
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Site Visits Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Site Visits by Status
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {data.siteVisits.byStatus.map((item: any) => (
            <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-600 mt-1">{item.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Properties */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Top Performing Properties
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Site Visits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.plots.topPerforming.slice(0, 5).map((plot: any) => (
                <tr key={plot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{plot.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{plot.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{(plot.price / 10000000).toFixed(2)} Cr
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-blue-600">
                      {plot.siteVisitsCount}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Properties by City */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Properties by City
          </h2>
          <div className="space-y-4">
            {data.plots.byCity.slice(0, 8).map((item: any) => (
              <div key={item.city} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.city}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / data.plots.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Inquiries Status
          </h2>
          <div className="space-y-4">
            {data.inquiries.byStatus.map((item: any) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.status}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / data.inquiries.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold">{data.growth.siteVisits.growthRate}</div>
            <div className="text-sm opacity-90 mt-1">Site Visit Growth</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{data.growth.users.growthRate}</div>
            <div className="text-sm opacity-90 mt-1">User Growth</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{data.inquiries.conversionRate}</div>
            <div className="text-sm opacity-90 mt-1">Conversion Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{data.plots.active}</div>
            <div className="text-sm opacity-90 mt-1">Active Listings</div>
          </div>
        </div>
      </div>
    </div>
  )
}
