'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ClearCachePage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const clearCache = async () => {
    setLoading(true);
    setStatus('Clearing cache...');

    try {
      const response = await fetch('/api/cache/clear', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setStatus('✅ Cache cleared successfully!');
        setTimeout(() => {
          window.location.href = '/properties';
        }, 2000);
      } else {
        setStatus('❌ Failed to clear cache: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      setStatus('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCacheStats = async () => {
    setLoading(true);
    setStatus('Getting cache stats...');

    try {
      const response = await fetch('/api/cache/clear');
      const data = await response.json();

      if (data.success) {
        const stats = data.data.stats;
        setStatus(`📊 Cache Stats:
- Total Keys: ${stats.keyCount}
- Plot Keys: ${stats.plotKeys}
- User Keys: ${stats.userKeys}
- Search Keys: ${stats.searchKeys}`);
      }
    } catch (error: any) {
      setStatus('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Cache Management
          </h1>

          <p className="text-gray-600 mb-8">
            Clear the Redis cache to ensure fresh data is loaded. This is useful after database updates or when experiencing stale data issues.
          </p>

          <div className="space-y-4">
            <button
              onClick={getCacheStats}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Get Cache Stats'}
            </button>

            <button
              onClick={clearCache}
              disabled={loading}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Clearing...' : 'Clear All Cache'}
            </button>

            <Link
              href="/properties"
              className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-center transition-colors"
            >
              Go to Properties
            </Link>
          </div>

          {status && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{status}</pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ When to clear cache:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• After adding new plots to the database</li>
              <li>• When properties page shows 0 results but plots exist</li>
              <li>• After updating plot status or details</li>
              <li>• When experiencing stale data issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
