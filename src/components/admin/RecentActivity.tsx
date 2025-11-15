// ================================================
// src/components/admin/RecentActivity.tsx - Recent Activity List
// ================================================

import { CalendarCheck, MessageSquare, User } from 'lucide-react'

interface ActivityItem {
  id: string
  status: string
  created_at?: Date
  createdAt?: Date
  user: {
    name: string
    email: string
  }
  plot: {
    title: string
    city: string
  }
}

interface RecentActivityProps {
  items: ActivityItem[]
  type: 'siteVisit' | 'inquiry'
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-purple-100 text-purple-800',
  QUALIFIED: 'bg-orange-100 text-orange-800',
  CONVERTED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
}

export default function RecentActivity({ items, type }: RecentActivityProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.slice(0, 5).map((item) => (
        <div
          key={item.id}
          className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition"
        >
          <div
            className={`p-2 rounded-lg ${
              type === 'siteVisit' ? 'bg-blue-100' : 'bg-purple-100'
            }`}
          >
            {type === 'siteVisit' ? (
              <CalendarCheck className="w-4 h-4 text-blue-600" />
            ) : (
              <MessageSquare className="w-4 h-4 text-purple-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.user.name}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  statusColors[item.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate mt-1">
              {item.plot.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {item.plot.city} •{' '}
              {new Date(item.created_at || item.createdAt!).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
