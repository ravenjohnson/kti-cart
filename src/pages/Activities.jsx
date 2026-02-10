import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Minimal browse data — full data lives in ActivityDetail.jsx
const ACTIVITIES = [
  {
    id: 'glacier-hike-solheimajokull',
    name: 'HEY - Glacier Hike on Sólheimajökull Glacier',
    operator: 'HEY',
    location: 'Sólheimajáleiguvegur, Vík',
    region: 'South Iceland',
    duration: '4 hours',
    difficulty: 'MODERATE',
    shortDescription: 'A thrilling 4-hour glacier hike on Sólheimajökull, designed for medium to hard difficulty adventure seekers.',
    price: 115,
    minAge: 12,
    image: 'https://picsum.photos/seed/glacier-hike/800/450',
  },
  {
    id: 'silfra-snorkeling',
    name: 'DIVE.IS - Snorkeling in Silfra Fissure',
    operator: 'DIVE.IS',
    location: 'Þingvellir National Park',
    region: 'West Iceland',
    duration: '3 hours',
    difficulty: 'EASY',
    shortDescription: 'Snorkel between the North American and Eurasian tectonic plates in Silfra\'s crystal-clear glacial water.',
    price: 130,
    minAge: 12,
    image: 'https://picsum.photos/seed/silfra-snorkeling/800/450',
  },
  {
    id: 'ice-cave-exploration',
    name: 'Extreme Iceland - Blue Ice Cave Exploration',
    operator: 'Extreme Iceland',
    location: 'Jökulsárlón Glacier Lagoon',
    region: 'South Iceland',
    duration: '5 hours',
    difficulty: 'EASY',
    shortDescription: 'Step inside the mesmerising blue ice caves of Vatnajökull glacier with an expert guide.',
    price: 150,
    minAge: 8,
    image: 'https://picsum.photos/seed/ice-cave-tour/800/450',
  },
  {
    id: 'whale-watching-husavik',
    name: 'North Sailing - Whale Watching from Húsavík',
    operator: 'North Sailing',
    location: 'Húsavík Harbour',
    region: 'North Iceland',
    duration: '3 hours',
    difficulty: 'EASY',
    shortDescription: 'Sail from the whale watching capital of Iceland to spot humpbacks, minkes, and dolphins.',
    price: 85,
    minAge: 0,
    image: 'https://picsum.photos/seed/whale-watching/800/450',
  },
  {
    id: 'northern-lights-hunt',
    name: 'Arctic Adventures - Northern Lights Jeep Hunt',
    operator: 'Arctic Adventures',
    location: 'Reykjavík departure',
    region: 'Reykjavík & surroundings',
    duration: '4 hours',
    difficulty: 'EASY',
    shortDescription: 'Chase the aurora borealis across the Icelandic countryside in a comfortable 4x4.',
    price: 75,
    minAge: 0,
    image: 'https://picsum.photos/seed/northern-lights-hunt/800/450',
  },
  {
    id: 'horseback-riding',
    name: 'Íshestar - Horseback Riding through Lava Fields',
    operator: 'Íshestar',
    location: 'Hafnarfjörður',
    region: 'Capital Region',
    duration: '2 hours',
    difficulty: 'EASY',
    shortDescription: 'Ride the unique Icelandic horse through ancient lava fields just 20 minutes from Reykjavík.',
    price: 90,
    minAge: 6,
    image: 'https://picsum.photos/seed/horseback-riding-iceland/800/450',
  },
];

const DIFFICULTY_STYLE = {
  EASY: 'bg-green-100 text-green-700',
  MODERATE: 'bg-yellow-100 text-yellow-700',
  HARD: 'bg-red-100 text-red-700',
};

export default function Activities() {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities & Experiences</h1>
      <p className="text-gray-600 mb-6">
        Day tours and activities across Iceland. Select an activity to see full details and available dates.
      </p>

      {/* Date filter — UI only */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setDateFrom('')}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear
        </button>
        {dateFrom && (
          <p className="text-xs text-gray-500 self-center">Showing all activities — select an activity to check availability.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  📍 {activity.region}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {activity.operator}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  ⏱ {activity.duration}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_STYLE[activity.difficulty] || ''}`}>
                  {activity.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.shortDescription}</p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">${activity.price}</span>
                  <span className="text-sm text-gray-500">/person</span>
                </div>
                {activity.minAge > 0 && (
                  <span className="text-xs text-gray-500">Min age: {activity.minAge}+</span>
                )}
              </div>

              <button
                onClick={() => navigate(`/activities/${activity.id}`)}
                className="mt-4 w-full py-2 px-4 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                View Details & Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
