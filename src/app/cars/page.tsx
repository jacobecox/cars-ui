'use client';

import { useEffect, useState } from 'react';

interface Photo {
  key: string;
  url: string;
}

interface Car {
  id: number;
  make: string;
  model: string;
  first_year_produced: number;
  new_price: number;
  aftermarket_support: string;
  safety_rating: string;
  photos: Photo[];
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`);
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
        <div className="text-black text-xl">Loading cars...</div>
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
    <main className="flex min-h-screen flex-col items-center p-24 bg-white">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-black">Available Cars</h1>
        <div className="grid grid-cols-1 gap-12">
          {cars.map((car) => (
            <div key={car.id} className="flex flex-col items-center">
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mb-4">
                <h2 className="text-2xl font-bold text-black mb-2">{car.make} {car.model}</h2>
                <div className="grid grid-cols-2 gap-4 text-black">
                  <div>
                    <p className="font-semibold">First Year Produced:</p>
                    <p>{car.first_year_produced}</p>
                  </div>
                  <div>
                    <p className="font-semibold">New Price:</p>
                    <p>${car.new_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Aftermarket Support:</p>
                    <p className="capitalize">{car.aftermarket_support}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Safety Rating:</p>
                    <p className="capitalize">{car.safety_rating}</p>
                  </div>
                </div>
              </div>
              {car.photos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={car.photos[0].url} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full max-w-2xl rounded-lg shadow-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 