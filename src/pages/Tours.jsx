import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar, { FilterField, PillSelect, ICELAND_REGIONS } from '../components/FilterBar';

const TOURS = [
  {
    id: 'south-coast',
    name: '4-day Guided South Coast Package',
    description: "Explore Iceland's stunning south coast with all accommodations and activities included",
    days: 4,
    pricePerPerson: 450,
    image: 'https://picsum.photos/seed/south-coast-iceland/800/450',
    includedActivities: [
      { name: 'Waterfall Tour', requiresShoeSize: true },
      { name: 'Black Sand Beach Visit', requiresShoeSize: false },
      { name: 'Glacier Walk', requiresShoeSize: true },
    ],
    included: ['3 nights accommodation', 'All transportation', 'Professional guide', 'Listed activities'],
    // Filter fields
    regions: ['South Iceland', 'Reykjavík'],
    experiences: ['Glacier'],
    tourType: 'Guided',
    availableDates: ['2025-06-10', '2025-06-17', '2025-06-24', '2025-07-01', '2025-07-08'],
    maxTravelers: 12,
    difficulty: 'Moderate',
    themes: ['Nature', 'Adventure'],
    seasons: ['Summer'],
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
    included: ['4 nights accommodation', 'All transportation', 'Professional guide', 'Listed activities', 'Some meals'],
    regions: ['South Iceland', 'West Iceland'],
    experiences: ['Hot Springs'],
    tourType: 'Guided',
    availableDates: ['2025-06-12', '2025-06-19', '2025-07-03', '2025-07-10', '2025-08-07'],
    maxTravelers: 15,
    difficulty: 'Easy',
    themes: ['Nature', 'Culture'],
    seasons: ['Summer', 'Winter'],
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
    included: ['6 nights accommodation', 'Car rental (CDW included)', 'Detailed route book & GPS', 'All road tolls'],
    regions: ['South Iceland', 'East Iceland', 'North Iceland', 'Akureyri'],
    experiences: ['Glacier', 'Whale Watching', 'Northern Lights'],
    tourType: 'Self-drive',
    availableDates: ['2025-06-07', '2025-06-28', '2025-07-19', '2025-08-09'],
    maxTravelers: 10,
    difficulty: 'Moderate',
    themes: ['Nature', 'Adventure'],
    seasons: ['Summer'],
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
    included: ['2 nights accommodation', 'All transportation', 'Professional guide', 'Listed activities'],
    regions: ['South Iceland', 'East Iceland'],
    experiences: ['Northern Lights', 'Ice Cave'],
    tourType: 'Guided',
    availableDates: ['2025-01-10', '2025-01-17', '2025-02-07', '2025-11-14', '2025-12-05'],
    maxTravelers: 8,
    difficulty: 'Easy',
    themes: ['Nature'],
    seasons: ['Winter'],
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
    included: ['4 nights accommodation', 'All transportation', 'Professional guide', 'Listed activities', 'Breakfast daily'],
    regions: ['West Fjords', 'West Iceland'],
    experiences: ['Kayaking'],
    tourType: 'Guided',
    availableDates: ['2025-06-15', '2025-06-29', '2025-07-13', '2025-07-27'],
    maxTravelers: 8,
    difficulty: 'Challenging',
    themes: ['Nature', 'Adventure'],
    seasons: ['Summer'],
  },
  {
    id: 'snaefellsnes',
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
    included: ['3 nights accommodation', 'All transportation', 'Professional guide', 'Listed activities'],
    regions: ['West Iceland'],
    experiences: ['Glacier', 'Whale Watching', 'Volcanic'],
    tourType: 'Guided',
    availableDates: ['2025-05-10', '2025-05-24', '2025-06-07', '2025-07-05', '2025-09-06'],
    maxTravelers: 12,
    difficulty: 'Moderate',
    themes: ['Nature', 'Adventure'],
    seasons: ['Summer', 'Winter'],
  },
  {
    id: 'highland-self-drive',
    name: '3-day Highland Self-Drive',
    description: 'Navigate the F-roads to the remote highlands — volcanoes, hot springs, and solitude',
    days: 3,
    pricePerPerson: 320,
    image: 'https://picsum.photos/seed/iceland-highlands-road/800/450',
    includedActivities: [
      { name: 'Landmannalaugar Hot Springs', requiresShoeSize: false },
      { name: 'Laugavegur Trail Preview', requiresShoeSize: true },
    ],
    included: ['2 nights mountain hut', 'Detailed route guide', 'Emergency contact'],
    regions: ['South Iceland', 'North Iceland'],
    experiences: ['Hot Springs', 'Volcanic'],
    tourType: 'Self-drive',
    availableDates: ['2025-07-05', '2025-07-12', '2025-07-19', '2025-08-02', '2025-08-09'],
    maxTravelers: 6,
    difficulty: 'Challenging',
    themes: ['Nature', 'Adventure'],
    seasons: ['Summer'],
  },
  {
    id: 'private-reykjavik-culture',
    name: '2-day Private Reykjavík Culture Tour',
    description: 'A bespoke cultural experience of Reykjavík — museums, cuisine, and local insider access',
    days: 2,
    pricePerPerson: 550,
    image: 'https://picsum.photos/seed/reykjavik-culture-city/800/450',
    includedActivities: [
      { name: 'National Museum Visit', requiresShoeSize: false },
      { name: 'Food Tour of the Old Harbour', requiresShoeSize: false },
    ],
    included: ['1 night boutique hotel', 'Private guide', 'All activities', 'Welcome dinner'],
    regions: ['Reykjavík'],
    experiences: [],
    tourType: 'Private',
    availableDates: ['2025-05-01', '2025-05-08', '2025-06-05', '2025-07-03', '2025-08-21', '2025-11-06', '2025-12-04'],
    maxTravelers: 4,
    difficulty: 'Easy',
    themes: ['Culture', 'Wellness'],
    seasons: ['Summer', 'Winter'],
  },
];

const EXPERIENCES = [
  'Northern Lights',
  'Whale Watching',
  'Glacier',
  'Hot Springs',
  'Horse Riding',
  'Ice Cave',
  'Snorkeling',
  'Kayaking',
  'Volcanic',
];

const INITIAL_FILTERS = {
  date: '',
  travelers: '1',
  tourType: '',
  experience: '',
  // secondary
  duration: '',
  difficulty: '',
  theme: '',
  maxPrice: '',
  season: '',
};

function filterTours(tours, f) {
  return tours.filter((t) => {
    if (f.tourType && t.tourType !== f.tourType) return false;
    if (f.experience && !(t.experiences || []).includes(f.experience)) return false;
    return true;
  });
}

const TOUR_TYPE_BADGE = {
  Guided: 'bg-blue-50 text-blue-700',
  'Self-drive': 'bg-yellow-50 text-yellow-700',
  Private: 'bg-purple-50 text-purple-700',
};

const DIFFICULTY_BADGE = {
  Easy: 'bg-green-50 text-green-700',
  Moderate: 'bg-yellow-50 text-yellow-700',
  Challenging: 'bg-red-50 text-red-700',
};

export default function Tours() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const set = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }));
  const setE = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const filtered = useMemo(() => filterTours(TOURS, filters), [filters]);
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const moreFiltersActiveCount = [
    filters.duration, filters.difficulty, filters.theme, filters.maxPrice, filters.season,
  ].filter(Boolean).length;

  const moreFiltersPanel = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <FilterField label="Duration">
        <PillSelect
          options={[
            { label: '1–3 days', value: '1-3' },
            { label: '4–7 days', value: '4-7' },
            { label: '8+ days', value: '8+' },
          ]}
          value={filters.duration}
          onChange={set('duration')}
        />
      </FilterField>
      <FilterField label="Difficulty">
        <PillSelect
          options={['Easy', 'Moderate', 'Challenging']}
          value={filters.difficulty}
          onChange={set('difficulty')}
        />
      </FilterField>
      <FilterField label="Theme">
        <PillSelect
          options={['Nature', 'Adventure', 'Culture', 'Wellness']}
          value={filters.theme}
          onChange={set('theme')}
        />
      </FilterField>
      <FilterField label="Max Price ($/person)">
        <input
          type="number"
          min="0"
          placeholder="Any"
          value={filters.maxPrice}
          onChange={setE('maxPrice')}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FilterField>
      <FilterField label="Season">
        <PillSelect
          options={['Summer', 'Winter']}
          value={filters.season}
          onChange={set('season')}
        />
      </FilterField>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tours and Packages</h1>
      <p className="text-gray-600 mb-6">
        Multi-day guided tours with accommodations and activities included.
      </p>

      <FilterBar
        resultCount={filtered.length}
        label="tours"
        hasActiveFilters={hasActiveFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
        moreFiltersActiveCount={moreFiltersActiveCount}
        moreFilters={moreFiltersPanel}
      >
        <FilterField label="When">
          <input
            type="date"
            value={filters.date}
            onChange={setE('date')}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FilterField>

        <FilterField label="Experience">
          <select
            value={filters.experience}
            onChange={setE('experience')}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All experiences</option>
            {EXPERIENCES.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Travelers">
          <input
            type="number"
            min="1"
            max="20"
            placeholder="Any"
            value={filters.travelers}
            onChange={setE('travelers')}
            className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FilterField>

      </FilterBar>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-4">No tours match your filters.</p>
          <button
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => (
            <div
              key={tour.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TOUR_TYPE_BADGE[tour.tourType] || 'bg-gray-100 text-gray-600'}`}>
                    {tour.tourType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_BADGE[tour.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                    {tour.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    📍 {tour.regions[0]}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{tour.name}</h3>
                <p className="text-sm text-gray-500 mb-3">📅 {tour.days} days</p>
                <p className="text-gray-600 text-sm mb-4">{tour.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Included Activities:</h4>
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

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${tour.pricePerPerson}</span>
                    <span className="text-sm text-gray-600">/person</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {tour.seasons.join(' · ')}
                  </span>
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
      )}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          💡 <strong>Note:</strong> Tour packages include accommodations and activities.
          Default booking is for 2 participants. You can customize during checkout.
        </p>
      </div>
    </div>
  );
}
