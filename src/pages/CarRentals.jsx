import React from 'react';
import { useNavigate } from 'react-router-dom';

const CAR_RENTALS = [
  {
    id: 'economy',
    name: 'Economy Car',
    category: 'Economy',
    description: 'Perfect for city driving and paved roads. Fuel efficient and easy to park.',
    pricePerDay: 45,
    passengers: 5,
    luggage: 2,
    transmission: 'Manual',
    needsDriver: true,
    image: 'https://picsum.photos/seed/economy-car-road/800/450',
  },
  {
    id: 'compact-suv',
    name: 'Compact SUV',
    category: 'SUV',
    description: 'Comfortable for families with extra space. Suitable for most roads.',
    pricePerDay: 85,
    passengers: 5,
    luggage: 4,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/compact-suv-iceland/800/450',
  },
  {
    id: '4x4-suv',
    name: '4x4 SUV',
    category: '4x4',
    description: 'Recommended for F-roads and highland adventures. All-wheel drive.',
    pricePerDay: 120,
    passengers: 5,
    luggage: 4,
    transmission: 'Automatic',
    needsDriver: true,
    recommended: 'F-roads',
    image: 'https://picsum.photos/seed/4x4-offroad-iceland/800/450',
  },
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    category: 'Luxury',
    description: 'Premium comfort with advanced features. Perfect for business travel.',
    pricePerDay: 150,
    passengers: 5,
    luggage: 3,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/luxury-car-city/800/450',
  },
  {
    id: 'campervan',
    name: 'Campervan',
    category: 'Camper',
    description: 'Sleep and travel in one vehicle. Includes basic camping equipment.',
    pricePerDay: 180,
    passengers: 4,
    luggage: 6,
    transmission: 'Manual',
    needsDriver: true,
    image: 'https://picsum.photos/seed/campervan-camping/800/450',
  },
  {
    id: 'electric',
    name: 'Electric Car',
    category: 'Electric',
    description: 'Eco-friendly with free charging at many locations across Iceland.',
    pricePerDay: 95,
    passengers: 5,
    luggage: 2,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/electric-car-modern/800/450',
  },
];

export default function CarRentals() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Rentals</h1>
      <p className="text-lg text-gray-600 mb-8">
        Choose the perfect vehicle for your Iceland adventure
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAR_RENTALS.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {car.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{car.description}</p>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>👤 Passengers:</span>
                  <span className="font-medium">{car.passengers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🧳 Luggage:</span>
                  <span className="font-medium">{car.luggage} bags</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>⚙️ Transmission:</span>
                  <span className="font-medium">{car.transmission}</span>
                </div>
                {car.recommended && (
                  <div className="flex items-center justify-between text-blue-600">
                    <span>✓ Recommended for:</span>
                    <span className="font-medium">{car.recommended}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${car.pricePerDay}
                  </span>
                  <span className="text-sm text-gray-600">per day</span>
                </div>

                <button
                  onClick={() => navigate(`/car-rentals/${car.id}`)}
                  className="w-full px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  View Details & Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Driving in Iceland
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Minimum age: 20 years (23 for 4x4 vehicles)</li>
          <li>• Valid driver's license required (international license for non-EU)</li>
          <li>• Drive on the right side of the road</li>
          <li>• F-roads require 4x4 vehicles and are closed in winter</li>
          <li>• Insurance options available at checkout</li>
        </ul>
      </div>
    </div>
  );
}
