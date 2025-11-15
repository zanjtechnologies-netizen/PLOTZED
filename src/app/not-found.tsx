// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page not found
          </h2>
          
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to homepage
          </Link>
          
          <Link
            href="/properties"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse properties
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Need help?{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}