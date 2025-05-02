'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [apiResponse, setApiResponse] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL || '');
        const data = await response.text();
        setApiResponse(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiResponse('Error loading data');
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm text-black">
        <h1 className="text-3xl mb-8 text-center">{apiResponse}</h1>
        <p className="text-xl text-black text-center">Change the route to &apos;/cars&apos; to see some cars</p>
      </div>
    </main>
  );
}
