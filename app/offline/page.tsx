"use client"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-orange-100 p-4 rounded-full w-fit mx-auto mb-6">
            <svg className="h-12 w-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">You're Offline</h1>

          <p className="text-gray-600 mb-6">HealthWise works offline too! You can still:</p>

          <ul className="text-left text-gray-700 space-y-2 mb-6">
            <li>• Record voice messages for consultations</li>
            <li>• Access cached health education content</li>
            <li>• View your saved appointments</li>
            <li>• Use emergency contact features</li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 text-sm">Your data will automatically sync when connection is restored.</p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
