export const dynamic = 'force-dynamic'
export const revalidate = 0

// ================================================
// src/app/admin/users/page.tsx - Users Management
// ================================================

import UsersClient from '@/components/admin/UsersClient'

async function getUsersData() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/users`, {
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
    },
  })

  if (!response.ok) {
    return { users: [], stats: { total: 0, customers: 0, admins: 0, verified: 0 } }
  }

  const data = await response.json()
  return data.data
}

export default async function UsersPage() {
  const data = await getUsersData()
  const users = data.users || []
  const stats = data.stats || { total: 0, customers: 0, admins: 0, verified: 0 }

  return <UsersClient users={users} stats={stats} />
}
