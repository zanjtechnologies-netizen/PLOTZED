export const dynamic = 'force-dynamic'
export const revalidate = 0

// ================================================
// src/app/admin/inquiries/page.tsx - Inquiries Management
// ================================================

import { MessageSquare, User, Mail, Phone, MapPin, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import InquiryActions from '@/components/admin/InquiryActions'
import InquiryStatusFilter from '@/components/admin/InquiryStatusFilter'
import { prisma } from '@/lib/prisma'

const statusIcons: Record<string, any> = {
  NEW: AlertCircle,
  CONTACTED: MessageSquare,
  QUALIFIED: Clock,
  CONVERTED: CheckCircle,
  CLOSED: XCircle,
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800 border-blue-200',
  CONTACTED: 'bg-purple-100 text-purple-800 border-purple-200',
  QUALIFIED: 'bg-orange-100 text-orange-800 border-orange-200',
  CONVERTED: 'bg-green-100 text-green-800 border-green-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
}

async function getInquiriesData(status?: string) {
  try {
    // Fetch data directly from database (more efficient than HTTP fetch)
    // Build filter conditions
    const whereConditions: any = {}
    if (status && ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED'].includes(status)) {
      whereConditions.status = status
    }

    // Get statistics
    const [
      totalInquiries,
      newInquiries,
      contactedInquiries,
      convertedInquiries,
    ] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      prisma.inquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.inquiry.count({ where: { status: 'CONVERTED' } }),
    ])

    // Get inquiries with user and plot details (with optional filtering)
    const inquiries = await prisma.inquiry.findMany({
      where: whereConditions,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        plot: {
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
            price: true,
          },
        },
      },
    })

    return {
      stats: {
        total: totalInquiries,
        new: newInquiries,
        contacted: contactedInquiries,
        converted: convertedInquiries,
      },
      inquiries,
    }
  } catch (error) {
    console.error('Inquiries fetch error:', error)
    return { inquiries: [], stats: { total: 0, new: 0, contacted: 0, converted: 0 } }
  }
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const data = await getInquiriesData(params.status)
  // Filter out inquiries with missing user or plot data (in case of deleted records)
  const inquiries = (data.inquiries || []).filter((i): i is typeof i & { user: NonNullable<typeof i.user>, plot: NonNullable<typeof i.plot> } => i.user !== null && i.plot !== null)
  const stats = data.stats || { total: 0, new: 0, contacted: 0, converted: 0 }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries and leads</p>
        </div>
        <InquiryStatusFilter currentStatus={params.status} />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Inquiries</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
          <div className="text-sm text-blue-700">New</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">{stats.contacted}</div>
          <div className="text-sm text-purple-700">Contacted</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">{stats.converted}</div>
          <div className="text-sm text-green-700">Converted</div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {inquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No inquiries found</p>
            </div>
          ) : (
            inquiries.map((inquiry: any) => {
              const StatusIcon = statusIcons[inquiry.status]
              return (
                <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Property Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inquiry.plot.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[inquiry.status]
                          }`}
                        >
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {inquiry.status}
                        </span>
                      </div>

                      {/* Inquiry Message */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Message</div>
                        <p className="text-sm text-gray-900">{inquiry.message}</p>
                      </div>

                      {/* Customer Info Grid */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {inquiry.user.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {inquiry.user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {inquiry.user.phone || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {inquiry.plot.city}, {inquiry.plot.state}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="mt-3 text-xs text-gray-500">
                        Received {new Date(inquiry.created_at).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Actions */}
                    <InquiryActions inquiryId={inquiry.id} status={inquiry.status} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
