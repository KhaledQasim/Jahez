'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roomId = params.roomId as string;

  useEffect(() => {
    if (roomId) {
      // Simulate joining the room
      setTimeout(() => {
        setIsJoining(false);
        // In a real app, you would connect to WebSocket here
        // and redirect to the main page with room context
        router.push(`/?room=${roomId}`);
      }, 2000);
    } else {
      setError('Invalid room ID');
      setIsJoining(false);
    }
  }, [roomId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        {isJoining ? (
          <>
            <div className="text-green-500 text-6xl mb-4">🔄</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Joining Group Order</h1>
            <p className="text-gray-600 mb-4">Connecting to room: {roomId}</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          </>
        ) : (
          <>
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Successfully Joined!</h1>
            <p className="text-gray-600 mb-4">You&apos;re now part of the group order</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-700">
                You can now add items to the shared cart and see what others are ordering in real-time.
              </p>
            </div>
            <button
              onClick={() => router.push(`/?room=${roomId}`)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Start Ordering
            </button>
          </>
        )}
      </div>
    </div>
  );
} 