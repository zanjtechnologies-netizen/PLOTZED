'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'left' | 'right';
}

export default function WhatsAppButton({
  phoneNumber = '+917708594263', // Plotzed Real Estate phone number
  message = 'Hi, I\'m interested in your premium plots. Please share more details.',
  position = 'left',
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show button after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip briefly after button appears
      setTimeout(() => {
        setShowTooltip(true);
        // Hide tooltip after 3 seconds
        setTimeout(() => setShowTooltip(false), 3000);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    // Remove any non-digit characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Detect if mobile or desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Use appropriate WhatsApp URL
    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Hide tooltip after click
    setShowTooltip(false);
  };

  const positionClasses = position === 'left'
    ? 'left-6 sm:left-6'
    : 'right-6 sm:right-6';

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div
        className={`fixed bottom-[180px] sm:bottom-56 ${positionClasses} z-50 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 w-max max-w-[200px] animate-fade-in-tooltip">
            <div
              className="relative px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#0C1A3D' }}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" style={{ color: '#D8B893' }} />
                <span>Chat with us on WhatsApp!</span>
              </div>
              {/* Tooltip arrow */}
              <div
                className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #0C1A3D',
                }}
              />
            </div>
          </div>
        )}

        {/* Main WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl animate-pulse-slow"
          style={{
            backgroundColor: '#25D366', // WhatsApp green
          }}
          aria-label="Chat on WhatsApp"
        >
          {/* WhatsApp Icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-300 group-hover:rotate-12"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Notification Dot (optional - shows new messages indicator) */}
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: '#D8B893' }}
          />
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: '#D8B893' }}
          />
        </button>

        {/* Ripple Effect on Hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div
            className="absolute inset-0 rounded-full animate-ping-slow"
            style={{ backgroundColor: 'rgba(37, 211, 102, 0.3)' }}
          />
        </div>
      </div>
    </>
  );
}
