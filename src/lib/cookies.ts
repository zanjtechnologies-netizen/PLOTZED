// Cookie utility functions for managing consent and preferences

export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface CookieConsent {
  necessary: boolean; // Always true - required for site functionality
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: number;
}

export interface CookieInfo {
  name: string;
  category: CookieCategory;
  description: string;
  duration: string;
  type: 'first-party' | 'third-party';
  provider: string;
}

// List of cookies used on the site
export const COOKIE_LIST: CookieInfo[] = [
  // Necessary (First-Party)
  {
    name: 'cookie_consent',
    category: 'necessary',
    description: 'Stores your cookie consent preferences',
    duration: '1 year',
    type: 'first-party',
    provider: 'Plotzed',
  },
  {
    name: 'next-auth.session-token',
    category: 'necessary',
    description: 'Authentication session token',
    duration: 'Session',
    type: 'first-party',
    provider: 'Plotzed',
  },
  {
    name: 'next-auth.csrf-token',
    category: 'necessary',
    description: 'Security token to prevent CSRF attacks',
    duration: 'Session',
    type: 'first-party',
    provider: 'Plotzed',
  },
  {
    name: 'next-auth.callback-url',
    category: 'necessary',
    description: 'Stores the callback URL after authentication',
    duration: 'Session',
    type: 'first-party',
    provider: 'Plotzed',
  },

  // Preferences (First-Party)
  {
    name: 'theme',
    category: 'preferences',
    description: 'Stores your preferred theme (light/dark)',
    duration: '1 year',
    type: 'first-party',
    provider: 'Plotzed',
  },
  {
    name: 'language',
    category: 'preferences',
    description: 'Stores your preferred language',
    duration: '1 year',
    type: 'first-party',
    provider: 'Plotzed',
  },
  {
    name: 'favorites',
    category: 'preferences',
    description: 'Stores your favorited properties',
    duration: '1 year',
    type: 'first-party',
    provider: 'Plotzed',
  },

  // Analytics (Third-Party)
  {
    name: '_ga',
    category: 'analytics',
    description: 'Google Analytics - Used to distinguish users',
    duration: '2 years',
    type: 'third-party',
    provider: 'Google',
  },
  {
    name: '_ga_*',
    category: 'analytics',
    description: 'Google Analytics - Used to persist session state',
    duration: '2 years',
    type: 'third-party',
    provider: 'Google',
  },
  {
    name: '_gid',
    category: 'analytics',
    description: 'Google Analytics - Used to distinguish users',
    duration: '24 hours',
    type: 'third-party',
    provider: 'Google',
  },
  {
    name: '_gat',
    category: 'analytics',
    description: 'Google Analytics - Used to throttle request rate',
    duration: '1 minute',
    type: 'third-party',
    provider: 'Google',
  },

  // Marketing (Third-Party)
  {
    name: '_fbp',
    category: 'marketing',
    description: 'Facebook Pixel - Used for ad targeting and measurement',
    duration: '3 months',
    type: 'third-party',
    provider: 'Meta (Facebook)',
  },
  {
    name: '_fbc',
    category: 'marketing',
    description: 'Facebook Click ID - Tracks ad click information',
    duration: '3 months',
    type: 'third-party',
    provider: 'Meta (Facebook)',
  },
  {
    name: 'IDE',
    category: 'marketing',
    description: 'Google Ads - Used for conversion tracking',
    duration: '1 year',
    type: 'third-party',
    provider: 'Google',
  },
];

const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

// Default consent (only necessary cookies)
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: 0,
};

// Get cookie by name
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

// Set cookie
export function setCookie(
  name: string,
  value: string,
  days: number = CONSENT_EXPIRY_DAYS,
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax'
): void {
  if (typeof document === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const secure = window.location.protocol === 'https:' ? ';Secure' : '';

  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=${sameSite}${secure}`;
}

// Delete cookie
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Get consent from cookie
export function getConsent(): CookieConsent | null {
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  if (!consentCookie) return null;

  try {
    return JSON.parse(consentCookie) as CookieConsent;
  } catch {
    return null;
  }
}

// Save consent to cookie
export function saveConsent(consent: Omit<CookieConsent, 'necessary' | 'timestamp'>): void {
  const fullConsent: CookieConsent = {
    ...consent,
    necessary: true, // Always required
    timestamp: Date.now(),
  };

  setCookie(CONSENT_COOKIE_NAME, JSON.stringify(fullConsent));

  // Apply consent immediately
  applyConsent(fullConsent);
}

// Accept all cookies
export function acceptAllCookies(): void {
  saveConsent({
    analytics: true,
    marketing: true,
    preferences: true,
  });
}

// Reject all optional cookies
export function rejectAllCookies(): void {
  saveConsent({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Delete any existing optional cookies
  deleteOptionalCookies();
}

// Delete optional cookies based on category
export function deleteOptionalCookies(): void {
  const consent = getConsent();
  if (!consent) return;

  COOKIE_LIST.forEach((cookie) => {
    if (cookie.category !== 'necessary') {
      if (!consent[cookie.category]) {
        // Handle wildcard cookie names (e.g., _ga_*)
        if (cookie.name.includes('*')) {
          const prefix = cookie.name.replace('*', '');
          document.cookie.split(';').forEach((c) => {
            const name = c.trim().split('=')[0];
            if (name.startsWith(prefix)) {
              deleteCookie(name);
            }
          });
        } else {
          deleteCookie(cookie.name);
        }
      }
    }
  });
}

// Apply consent (load/unload scripts)
export function applyConsent(consent: CookieConsent): void {
  // Google Analytics
  if (consent.analytics && typeof window !== 'undefined') {
    loadGoogleAnalytics();
  }

  // Facebook Pixel
  if (consent.marketing && typeof window !== 'undefined') {
    loadFacebookPixel();
  }

  // Delete cookies for disabled categories
  if (!consent.analytics || !consent.marketing) {
    deleteOptionalCookies();
  }
}

// Load Google Analytics
function loadGoogleAnalytics(): void {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  if (!GA_ID || document.getElementById('ga-script')) return;

  // Load gtag.js
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_ID);
}

// Load Facebook Pixel
function loadFacebookPixel(): void {
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!FB_PIXEL_ID || document.getElementById('fb-pixel-script')) return;

  // Facebook Pixel Code
  const script = document.createElement('script');
  script.id = 'fb-pixel-script';
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
}

// Check if consent has been given (for any category)
export function hasConsent(): boolean {
  return getConsent() !== null;
}

// Check if a specific category is consented
export function hasCategoryConsent(category: CookieCategory): boolean {
  const consent = getConsent();
  if (!consent) return category === 'necessary';
  return consent[category];
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
  }
}
