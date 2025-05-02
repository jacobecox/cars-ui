'use client';

import { useEffect, useState } from 'react';

interface BucketResponse {
  status: string;
  message: string;
  error?: string;
}

export default function BucketPage() {
  const [bucketStatus, setBucketStatus] = useState<BucketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBucketConnection = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bucket`);
        if (!response.ok) {
          throw new Error('Failed to fetch bucket status');
        }
        const data = await response.json();
        setBucketStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkBucketConnection();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
        <div className="text-black text-xl">Checking S3 bucket connection...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
        <div className="text-black text-xl">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">S3 Bucket Connection Status</h1>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-black">Status:</span>
            <span className={`font-medium ${bucketStatus?.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {bucketStatus?.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-black">Message:</span>
            <span className="text-black">{bucketStatus?.message}</span>
          </div>
          {bucketStatus?.error && (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-black">Error:</span>
              <span className="text-red-600">{bucketStatus.error}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 