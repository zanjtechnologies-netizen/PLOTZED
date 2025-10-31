import api from './api'

export interface CreateOrderData {
  amount: number
  paymentType: 'booking' | 'token' | 'installment' | 'full'
  bookingId?: string
  listingId?: string
  description?: string
  currency?: string
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description?: string
  image?: string
  handler: (response: any) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

class PaymentService {
  async createOrder(data: CreateOrderData) {
    const response = await api.post('/payments/create-order', data)
    return response.data
  }

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const response = await api.post('/payments/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    })
    return response.data
  }

  async getPayments() {
    const response = await api.get('/payments')
    return response.data
  }

  async getPaymentById(id: string) {
    const response = await api.get(`/payments/${id}`)
    return response.data
  }

  initiateRazorpayCheckout(options: RazorpayOptions) {
    return new Promise((resolve, reject) => {
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'))
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
        resolve(rzp)
      }
      document.body.appendChild(script)
    })
  }
}

export default new PaymentService()