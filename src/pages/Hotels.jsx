import React, { useState } from 'react';
import { useCart } from '../CartContext';

// Dummy hotel data
const HOTELS = [
  {
    name: 'Reykjavík Hotel',
    location: 'Reykjavík',
    description: 'Modern hotel in the heart of Reykjavík with breakfast included',
    pricePerNight: 150,
    image: 'https://picsum.photos/seed/reykjavik-hotel/800/450',
  },
  {
    name: 'Northern Lights Lodge',
    location: 'Akureyri',
    description: 'Cozy lodge perfect for northern lights viewing',
    pricePerNight: 180,
    image: 'https://picsum.photos/seed/lodge-aurora/800/450',
  },
  {
    name: 'Golden Circle Inn',
    location: 'Selfoss',
    description: 'Convenient location near Golden Circle attractions',
    pricePerNight: 120,
    image: 'https://picsum.photos/seed/golden-circle-inn/800/450',
  },
  {
    name: 'Blue Lagoon Resort',
    location: 'Grindavík',
    description: 'Luxury resort with Blue Lagoon access included',
    pricePerNight: 300,
    image: 'https://picsum.photos/seed/blue-lagoon-resort/800/450',
  },
];

export default function Hotels() {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState(new Set());

  const handleAddToCart = (hotel) => {
    const cartItem = {
      type: 'hotel',
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      image: hotel.image,
      nights: 2, // Default
      checkIn: '2025-06-15', // Default
      checkOut: '2025-06-17', // Default
      rooms: 1, // Default
      guestsPerRoom: 2, // Default
      pricePerNight: hotel.pricePerNight,
      needsInfo: true,
    };

    addToCart(cartItem);
    setAddedItems(new Set(addedItems).add(hotel.name));

    // Reset after 2 seconds
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(hotel.name);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotels in Iceland</h1>
      <p className="text-gray-600 mb-8">
        Choose your accommodation. You can customize dates and guests during checkout.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOTELS.map((hotel, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {hotel.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">📍 {hotel.location}</p>
              <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${hotel.pricePerNight}
                  </span>
                  <span className="text-sm text-gray-600">/night</span>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(hotel)}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  addedItems.has(hotel.name)
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {addedItems.has(hotel.name) ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          💡 <strong>Note:</strong> Default booking is 2 nights for 2 guests. You can
          customize dates, number of rooms, and guests during checkout.
        </p>
      </div>
    </div>
  );
}
