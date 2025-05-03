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
  new_price: string;
  aftermarket_support: string;
  safety_rating: string;
}

interface CarWithPhoto extends Car {
  photo?: Photo;
}

export default function CarsPage() {
  const [cars, setCars] = useState<CarWithPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cars and photos in parallel
        const [carsResponse, photosResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/photos`)
        ]);

        if (!carsResponse.ok || !photosResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const carsData = await carsResponse.json();
        const photosData = await photosResponse.json();

        // Match photos with cars based on their order
        const carsWithPhotos = carsData.map((car: Car, index: number) => ({
          ...car,
          photo: photosData[index]
        }));

        setCars(carsWithPhotos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
                    <p>${car.new_price}</p>
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
              {car.photo && (
                <div className="w-full max-w-2xl">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${car.photo.url}`}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-auto rounded-lg shadow-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 