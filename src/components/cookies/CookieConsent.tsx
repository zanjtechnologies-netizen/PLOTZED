'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Settings, Shield, BarChart3, Megaphone } from 'lucide-react';
import {
  hasConsent,
  getConsent,
  acceptAllCookies,
  rejectAllCookies,
  saveConsent,
  applyConsent,
  type CookieConsent as CookieConsentType,
  type CookieCategory,
} from '@/lib/cookies';

interface CategoryToggleProps {
  category: CookieCategory;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  disabled?: boolean;
  onChange: (enabled: boolean) => void;
}

function CategoryToggle({
  category,
  label,
  description,
  icon,
  enabled,
  disabled = false,
  onChange,
}: CategoryToggleProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#112250] flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-semibold text-gray-900">{label}</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              disabled={disabled}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#006DB8] transition-colors ${
                disabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : enabled
                  ? 'bg-[#006DB8]'
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        {disabled && (
          <p className="text-xs text-gray-500 mt-1 italic">Required for site functionality</p>
        )}
      </div>
    </div>
  );
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already consented
    if (!hasConsent()) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      // Apply existing consent
      const existingConsent = getConsent();
      if (existingConsent) {
        applyConsent(existingConsent);
        setPreferences({
          necessary: true,
          analytics: existingConsent.analytics,
          marketing: existingConsent.marketing,
          preferences: existingConsent.preferences,
        });
      }
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      preferences: preferences.preferences,
    });
    setShowSettings(false);
    setIsVisible(false);
  };

  const updatePreference = (category: keyof typeof preferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [category]: value }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Main Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#112250] flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-[#D8B893]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    We Value Your Privacy
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    We use cookies to enhance your browsing experience, serve personalized content,
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{' '}
                    <Link href="/cookie-policy" className="text-[#006DB8] hover:underline">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-[#112250] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a3470] transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 border-2 border-[#112250] text-[#112250] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Cookie className="w-6 h-6 text-[#112250]" />
                <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-gray-600 text-sm mb-6">
                Manage your cookie preferences below. You can enable or disable different
                categories of cookies. Note that disabling some cookies may affect your experience.
              </p>

              <CategoryToggle
                category="necessary"
                label="Necessary Cookies"
                description="Essential for the website to function properly. These cannot be disabled."
                icon={<Shield className="w-5 h-5" />}
                enabled={preferences.necessary}
                disabled={true}
                onChange={() => {}}
              />

              <CategoryToggle
                category="preferences"
                label="Preference Cookies"
                description="Remember your settings and preferences for a better experience."
                icon={<Settings className="w-5 h-5" />}
                enabled={preferences.preferences}
                onChange={(v) => updatePreference('preferences', v)}
              />

              <CategoryToggle
                category="analytics"
                label="Analytics Cookies"
                description="Help us understand how visitors interact with our website."
                icon={<BarChart3 className="w-5 h-5" />}
                enabled={preferences.analytics}
                onChange={(v) => updatePreference('analytics', v)}
              />

              <CategoryToggle
                category="marketing"
                label="Marketing Cookies"
                description="Used to deliver personalized advertisements and track ad performance."
                icon={<Megaphone className="w-5 h-5" />}
                enabled={preferences.marketing}
                onChange={(v) => updatePreference('marketing', v)}
              />
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleRejectAll}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-[#112250] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a3470] transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-[#006DB8] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#005a99] transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
