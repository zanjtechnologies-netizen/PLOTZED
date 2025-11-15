// ================================================
// src/app/admin/layout.tsx - Admin Layout with Navigation
// ================================================

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  // Redirect if not admin
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader user={session.user} />

      <div className="flex">
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
