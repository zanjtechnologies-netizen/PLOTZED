'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  plotId: string;
  plotTitle: string;
  plotCity: string;
}

export default function SiteVisitModal({
  isOpen,
  onClose,
  plotId,
  plotTitle,
  plotCity
}: SiteVisitModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { verifyRecaptcha, isVerifying } = useRecaptcha();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    visitDate: '',
    visitTime: '',
    attendees: 1,
    notes: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if user is logged in
    if (!session) {
      setError('Please log in to book a site visit');
      // Optionally redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    // Validate visit date (must be in the future)
    const selectedDate = new Date(formData.visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Please select a future date for your visit');
      return;
    }

    // Validate phone if provided
    if (formData.contactPhone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.contactPhone.replace(/\D/g, ''))) {
        setError('Please enter a valid 10-digit Indian phone number');
        return;
      }
    }

    setLoading(true);

    try {
      // Verify reCAPTCHA
      const recaptchaResult = await verifyRecaptcha('site_visit_booking');
      if (!recaptchaResult.success) {
        setError(recaptchaResult.error || 'reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }

      // Prepare site visit data
      const siteVisitData = {
        plot_id: plotId,
        visit_date: formData.visitDate,
        visit_time: formData.visitTime,
        attendees: formData.attendees,
        notes: formData.notes || '',
        contact_name: formData.contactName || '',
        contact_phone: formData.contactPhone ? formData.contactPhone.replace(/\D/g, '') : '',
        contact_email: formData.contactEmail || '',
      };

      // Submit to API
      const response = await fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteVisitData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            visitDate: '',
            visitTime: '',
            attendees: 1,
            notes: '',
            contactName: '',
            contactPhone: '',
            contactEmail: '',
          });
          // Optionally redirect to dashboard
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Failed to book site visit');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Time slots
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                      Book a Site Visit
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">{plotTitle}, {plotCity}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Site Visit Booked!</h3>
                    <p className="text-gray-600">Your site visit has been scheduled. Check your dashboard for details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!session && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                        Please log in to book a site visit
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Visit Date *
                        </label>
                        <input
                          type="date"
                          name="visitDate"
                          value={formData.visitDate}
                          onChange={handleChange}
                          required
                          min={minDate}
                          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Visit Time *
                        </label>
                        <select
                          name="visitTime"
                          value={formData.visitTime}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                        >
                          <option value="">Select time</option>
                          {timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Attendees
                      </label>
                      <input
                        type="number"
                        name="attendees"
                        value={formData.attendees}
                        onChange={handleChange}
                        min={1}
                        max={10}
                        className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="Enter contact name"
                        className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="+91 1234567890"
                        className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any special requirements or questions..."
                        className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition resize-none"
                      />
                    </div>

                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || isVerifying || !session}
                      className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading || isVerifying ? 'Booking...' : 'Confirm Site Visit'}
                    </button>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
