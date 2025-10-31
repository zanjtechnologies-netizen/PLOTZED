import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import paymentService from '@/services/payment.service'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

interface PaymentFormProps {
  amount: number
  listingId?: string
  bookingId?: string
  paymentType: 'booking' | 'token' | 'installment' | 'full'
  onSuccess?: () => void
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  listingId,
  bookingId,
  paymentType,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handlePayment = async () => {
    try {
      setLoading(true)

      // Create order
      const orderData = await paymentService.createOrder({
        amount,
        paymentType,
        listingId,
        bookingId,
        description: `${paymentType} payment for property`,
      })

      // Initialize Razorpay
      await paymentService.initiateRazorpayCheckout({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: 'Plotzed Real Estate',
        description: `${paymentType} payment`,
        image: '/logo.png',
        handler: async (response: any) => {
          try {
            // Verify payment
            const result = await paymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )

            if (result.success) {
              toast.success('Payment successful!')
              onSuccess?.()
              navigate('/payment-success', { state: { payment: result.payment } })
            }
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#0ea5e9',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast.info('Payment cancelled')
          },
        },
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment')
      setLoading(false)
    }
  }

  return (
    <div className="payment-form">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Payment Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Payment Type:</span>
            <span className="font-semibold capitalize">{paymentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-lg">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Secure payment powered by Razorpay
      </p>
    </div>
  )
}