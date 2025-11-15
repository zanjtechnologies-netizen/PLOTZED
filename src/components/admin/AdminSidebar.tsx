// ================================================
// src/components/admin/AdminSidebar.tsx - Admin Sidebar Navigation
// ================================================

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  CalendarCheck,
  MessageSquare,
  Users,
  Settings,
  FileText,
  TrendingUp,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Properties',
    href: '/admin/properties',
    icon: Building2,
  },
  {
    name: 'Site Visits',
    href: '/admin/site-visits',
    icon: CalendarCheck,
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-8 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Quick Stats
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Active Listings</span>
            <span className="font-semibold text-gray-900">18</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Pending Visits</span>
            <span className="font-semibold text-blue-600">3</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">New Inquiries</span>
            <span className="font-semibold text-green-600">5</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
