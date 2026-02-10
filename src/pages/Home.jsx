import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Iceland
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Book your perfect Icelandic adventure. Mix and match hotels, activities, and tours.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/tours"
          className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="h-40 overflow-hidden">
            <img
              src="https://picsum.photos/seed/iceland-tours/800/400"
              alt="Tours"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
              Tours
            </h2>
            <p className="text-gray-600 text-sm">
              Multi-day guided packages with included activities
            </p>
            <div className="mt-4 text-blue-600 font-medium text-sm">
              Browse tours →
            </div>
          </div>
        </Link>

        <Link
          to="/activities"
          className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="h-40 overflow-hidden">
            <img
              src="https://picsum.photos/seed/iceland-activities/800/400"
              alt="Activities"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
              Activities
            </h2>
            <p className="text-gray-600 text-sm">
              Experience glacier hikes, snorkeling, and more
            </p>
            <div className="mt-4 text-blue-600 font-medium text-sm">
              Browse activities →
            </div>
          </div>
        </Link>

        <Link
          to="/hotels"
          className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="h-40 overflow-hidden">
            <img
              src="https://picsum.photos/seed/iceland-hotels/800/400"
              alt="Hotels"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
              Hotels
            </h2>
            <p className="text-gray-600 text-sm">
              Find comfortable accommodations across Iceland
            </p>
            <div className="mt-4 text-blue-600 font-medium text-sm">
              Browse hotels →
            </div>
          </div>
        </Link>

        <Link
          to="/car-rentals"
          className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="h-40 overflow-hidden">
            <img
              src="https://picsum.photos/seed/iceland-car-rentals/800/400"
              alt="Car Rentals"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
              Car Rentals
            </h2>
            <p className="text-gray-600 text-sm">
              Rent the perfect vehicle for your Iceland adventure
            </p>
            <div className="mt-4 text-blue-600 font-medium text-sm">
              Browse cars →
            </div>
          </div>
        </Link>
      </div>

      {/* Featured Info */}
      <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Why Book with Us?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold text-gray-900 mb-1">Mix & Match</div>
            <p className="text-sm text-gray-600">
              Combine hotels, activities, and tours in one booking
            </p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-1">Flexible Dates</div>
            <p className="text-sm text-gray-600">
              Choose your preferred dates and times
            </p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-1">Single Checkout</div>
            <p className="text-sm text-gray-600">
              Pay once for your entire Iceland adventure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
