import React from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy tour package data
const TOURS = [
  {
    id: 'south-coast',
    name: '4-day Guided South Coast Package',
    description: 'Explore Iceland\'s stunning south coast with all accommodations and activities included',
    days: 4,
    pricePerPerson: 450,
    image: 'https://picsum.photos/seed/south-coast-iceland/800/450',
    includedActivities: [
      { name: 'Waterfall Tour', requiresShoeSize: true },
      { name: 'Black Sand Beach Visit', requiresShoeSize: false },
      { name: 'Glacier Walk', requiresShoeSize: true },
    ],
    included: [
      '3 nights accommodation',
      'All transportation',
      'Professional guide',
      'Listed activities',
    ],
  },
  {
    id: 'golden-circle',
    name: '5-day Golden Circle Adventure',
    description: 'Complete Golden Circle experience with geysers, waterfalls, and hot springs',
    days: 5,
    pricePerPerson: 520,
    image: 'https://picsum.photos/seed/golden-circle-tour/800/450',
    includedActivities: [
      { name: 'Geysir Visit', requiresShoeSize: false },
      { name: 'Gullfoss Waterfall', requiresShoeSize: false },
      { name: 'Secret Lagoon', requiresShoeSize: false },
    ],
    included: [
      '4 nights accommodation',
      'All transportation',
      'Professional guide',
      'Listed activities',
      'Some meals',
    ],
  },
  {
    id: 'ring-road',
    name: '7-day Ring Road Expedition',
    description: 'Circle the entire island visiting all major attractions',
    days: 7,
    pricePerPerson: 890,
    image: 'https://picsum.photos/seed/ring-road-iceland/800/450',
    includedActivities: [
      { name: 'Multiple Glacier Hikes', requiresShoeSize: true },
      { name: 'Whale Watching', requiresShoeSize: false },
      { name: 'Diamond Beach Visit', requiresShoeSize: false },
    ],
    included: [
      '6 nights accommodation',
      'All transportation',
      'Professional guide',
      'All listed activities',
      'Most meals',
    ],
  },
  {
    id: 'northern-lights',
    name: '3-day Northern Lights Package',
    description: 'Winter special focusing on northern lights and ice caves',
    days: 3,
    pricePerPerson: 380,
    image: 'https://picsum.photos/seed/northern-lights-iceland/800/450',
    includedActivities: [
      { name: 'Northern Lights Hunt', requiresShoeSize: false },
      { name: 'Ice Cave Tour', requiresShoeSize: true },
    ],
    included: [
      '2 nights accommodation',
      'All transportation',
      'Professional guide',
      'Listed activities',
    ],
  },
  {
    id: 'west-fjords',
    name: '5-day West Fjords Explorer',
    description: 'Remote wilderness and dramatic cliffs of the Westfjords peninsula',
    days: 5,
    pricePerPerson: 610,
    image: 'https://picsum.photos/seed/westfjords-iceland/800/450',
    includedActivities: [
      { name: 'Sea Kayaking', requiresShoeSize: false },
      { name: 'Dynjandi Waterfall Hike', requiresShoeSize: true },
      { name: 'Arctic Fox Centre Visit', requiresShoeSize: false },
    ],
    included: [
      '4 nights accommodation',
      'All transportation',
      'Professional guide',
      'Listed activities',
      'Breakfast daily',
    ],
  },
  {
    id: 'snæfellsnes',
    name: '4-day Snæfellsnes Peninsula',
    description: 'Discover the mystical glacier volcano and dramatic lava coastline',
    days: 4,
    pricePerPerson: 490,
    image: 'https://picsum.photos/seed/snaefellsnes-iceland/800/450',
    includedActivities: [
      { name: 'Glacier Walk on Snæfellsjökull', requiresShoeSize: true },
      { name: 'Lava Tube Exploration', requiresShoeSize: false },
      { name: 'Whale Watching from Grundarfjörður', requiresShoeSize: false },
    ],
    included: [
      '3 nights accommodation',
      'All transportation',
      'Professional guide',
      'Listed activities',
    ],
  },
];

export default function Tours() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tour Packages</h1>
      <p className="text-gray-600 mb-8">
        Multi-day guided tours with accommodations and activities included.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TOURS.map((tour) => (
          <div
            key={tour.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {tour.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">📅 {tour.days} days</p>
              <p className="text-gray-600 text-sm mb-4">{tour.description}</p>

              {/* Included Activities */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Included Activities:
                </h4>
                <ul className="space-y-1">
                  {tour.includedActivities.map((activity, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2">•</span>
                      {activity.name}
                      {activity.requiresShoeSize && (
                        <span className="ml-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          Requires shoe size
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's Included */}
              {/* <div className="mb-4 bg-gray-50 rounded p-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  What's Included:
                </h4>
                <ul className="space-y-1">
                  {tour.included.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div> */}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${tour.pricePerPerson}
                  </span>
                  <span className="text-sm text-gray-600">/person</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/tours/${tour.id}`)}
                className="w-full py-2 px-4 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                View Details & Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          💡 <strong>Note:</strong> Tour packages include accommodations and activities.
          Default booking is for 2 participants. You can customize during checkout.
        </p>
      </div>
    </div>
  );
}
