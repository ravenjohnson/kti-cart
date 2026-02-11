import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar, { FilterField, PillSelect, ICELAND_REGIONS } from '../components/FilterBar';

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
    // Filter fields
    category: 'Adventure',
    durationCategory: 'Half-day',
    timeOfDay: 'Morning',
    indoor: false,
    availableDates: ['2025-06-10', '2025-06-11', '2025-06-12', '2025-06-17', '2025-06-18', '2025-07-01', '2025-07-02'],
    maxParticipants: 12,
  },
  {
    id: 'silfra-snorkeling',
    name: 'DIVE.IS - Snorkeling in Silfra Fissure',
    operator: 'DIVE.IS',
    location: 'Þingvellir National Park',
    region: 'West Iceland',
    duration: '3 hours',
    difficulty: 'EASY',
    shortDescription: "Snorkel between the North American and Eurasian tectonic plates in Silfra's crystal-clear glacial water.",
    price: 130,
    minAge: 12,
    image: 'https://picsum.photos/seed/silfra-snorkeling/800/450',
    category: 'Adventure',
    durationCategory: 'Half-day',
    timeOfDay: 'Morning',
    indoor: false,
    availableDates: ['2025-06-05', '2025-06-06', '2025-06-19', '2025-06-20', '2025-07-03', '2025-07-04'],
    maxParticipants: 10,
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
    category: 'Nature',
    durationCategory: 'Half-day',
    timeOfDay: 'Afternoon',
    indoor: false,
    availableDates: ['2025-01-08', '2025-01-09', '2025-01-15', '2025-02-05', '2025-02-06', '2025-11-12', '2025-11-13'],
    maxParticipants: 15,
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
    category: 'Nature',
    durationCategory: 'Half-day',
    timeOfDay: 'Morning',
    indoor: false,
    availableDates: ['2025-05-20', '2025-05-21', '2025-06-03', '2025-06-04', '2025-07-15', '2025-07-16', '2025-08-05'],
    maxParticipants: 40,
  },
  {
    id: 'northern-lights-hunt',
    name: 'Arctic Adventures - Northern Lights Jeep Hunt',
    operator: 'Arctic Adventures',
    location: 'Reykjavík departure',
    region: 'Reykjavík',
    duration: '4 hours',
    difficulty: 'EASY',
    shortDescription: 'Chase the aurora borealis across the Icelandic countryside in a comfortable 4x4.',
    price: 75,
    minAge: 0,
    image: 'https://picsum.photos/seed/northern-lights-hunt/800/450',
    category: 'Nature',
    durationCategory: 'Half-day',
    timeOfDay: 'Evening',
    indoor: false,
    availableDates: ['2025-10-10', '2025-10-11', '2025-11-07', '2025-11-08', '2025-12-05', '2025-12-06'],
    maxParticipants: 8,
  },
  {
    id: 'horseback-riding',
    name: 'Íshestar - Horseback Riding through Lava Fields',
    operator: 'Íshestar',
    location: 'Hafnarfjörður',
    region: 'Reykjavík',
    duration: '2 hours',
    difficulty: 'EASY',
    shortDescription: 'Ride the unique Icelandic horse through ancient lava fields just 20 minutes from Reykjavík.',
    price: 90,
    minAge: 6,
    image: 'https://picsum.photos/seed/horseback-riding-iceland/800/450',
    category: 'Family',
    durationCategory: 'Short',
    timeOfDay: 'Morning',
    indoor: false,
    availableDates: ['2025-06-07', '2025-06-08', '2025-06-14', '2025-06-15', '2025-07-05', '2025-07-06', '2025-08-02'],
    maxParticipants: 20,
  },
  {
    id: 'geothermal-cooking',
    name: 'Food & Fun - Geothermal Bread Baking & Hot Springs',
    operator: 'Food & Fun',
    location: 'Hveragerði',
    region: 'South Iceland',
    duration: '3 hours',
    difficulty: 'EASY',
    shortDescription: 'Bake traditional Icelandic rye bread in geothermal earth and soak in natural hot springs.',
    price: 65,
    minAge: 0,
    image: 'https://picsum.photos/seed/geothermal-cooking/800/450',
    category: 'Culture',
    durationCategory: 'Half-day',
    timeOfDay: 'Afternoon',
    indoor: false,
    availableDates: ['2025-06-14', '2025-06-21', '2025-07-05', '2025-07-12', '2025-08-02', '2025-08-09'],
    maxParticipants: 16,
  },
  {
    id: 'lava-tunnel',
    name: 'Lava Centre - Raufarhólshellir Lava Tunnel Tour',
    operator: 'Lava Centre',
    location: 'Hveragerðisvegur',
    region: 'South Iceland',
    duration: '1.5 hours',
    difficulty: 'EASY',
    shortDescription: "Walk through one of Iceland's longest and most accessible lava tubes formed during a volcanic eruption 5,200 years ago.",
    price: 45,
    minAge: 0,
    image: 'https://picsum.photos/seed/lava-tunnel-iceland/800/450',
    category: 'Nature',
    durationCategory: 'Short',
    timeOfDay: 'Morning',
    indoor: true,
    availableDates: ['2025-06-01', '2025-06-02', '2025-06-08', '2025-06-09', '2025-07-06', '2025-07-07', '2025-08-03'],
    maxParticipants: 20,
  },
  {
    id: 'kayaking-east-fjords',
    name: 'East Fjords Kayaking — Sea Caves & Puffins',
    operator: 'Local Guides East',
    location: 'Djúpivogur',
    region: 'East Iceland',
    duration: '6 hours',
    difficulty: 'MODERATE',
    shortDescription: 'Paddle through dramatic east fjord sea caves and spot Atlantic puffins on a full-day guided kayak.',
    price: 110,
    minAge: 14,
    image: 'https://picsum.photos/seed/kayaking-eastfjords/800/450',
    category: 'Adventure',
    durationCategory: 'Full-day',
    timeOfDay: 'Morning',
    indoor: false,
    availableDates: ['2025-07-10', '2025-07-11', '2025-07-17', '2025-07-18', '2025-08-07', '2025-08-08'],
    maxParticipants: 8,
  },
  {
    id: 'yoga-hot-spring',
    name: 'Pure Iceland - Sunrise Yoga & Private Hot Spring',
    operator: 'Pure Iceland',
    location: 'Landmannalaugar',
    region: 'South Iceland',
    duration: '2 hours',
    difficulty: 'EASY',
    shortDescription: 'Begin the day with a guided yoga session on volcanic terrain, followed by a soak in a natural hot spring.',
    price: 80,
    minAge: 16,
    image: 'https://picsum.photos/seed/yoga-hotspring-iceland/800/450',
    category: 'Wellness',
    durationCategory: 'Short',
    timeOfDay: 'Morning',
    indoor: false,
    availableDates: ['2025-07-08', '2025-07-09', '2025-07-15', '2025-07-22', '2025-08-05', '2025-08-12'],
    maxParticipants: 10,
  },
];

const INITIAL_FILTERS = {
  date: '',
  travelers: '1',
  region: '',
  category: '',
  // secondary
  timeOfDay: '',
  durationCategory: '',
  difficulty: '',
  setting: '',
  minAge: '',
};

function filterActivities(activities) {
  return activities;
}

const DIFFICULTY_STYLE = {
  EASY: 'bg-green-100 text-green-700',
  MODERATE: 'bg-yellow-100 text-yellow-700',
  HARD: 'bg-red-100 text-red-700',
};

const CATEGORY_STYLE = {
  Adventure: 'bg-orange-50 text-orange-700',
  Nature: 'bg-green-50 text-green-700',
  Culture: 'bg-purple-50 text-purple-700',
  Wellness: 'bg-teal-50 text-teal-700',
  Family: 'bg-blue-50 text-blue-700',
};

export default function Activities() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const set = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }));
  const setE = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const filtered = useMemo(() => filterActivities(ACTIVITIES), []);
  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
  const moreFiltersActiveCount = [
    filters.timeOfDay, filters.durationCategory, filters.difficulty, filters.setting, filters.minAge,
  ].filter((v) => v !== '').length;

  // Region list scoped to regions present in the activity data
  const availableRegions = [...new Set(ACTIVITIES.map((a) => a.region))].filter((r) =>
    ICELAND_REGIONS.includes(r),
  );

  const moreFiltersPanel = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <FilterField label="Time of Day">
        <PillSelect
          options={['Morning', 'Afternoon', 'Evening']}
          value={filters.timeOfDay}
          onChange={set('timeOfDay')}
        />
      </FilterField>
      <FilterField label="Duration">
        <PillSelect
          options={['Short', 'Half-day', 'Full-day']}
          value={filters.durationCategory}
          onChange={set('durationCategory')}
        />
      </FilterField>
      <FilterField label="Difficulty">
        <PillSelect
          options={[
            { label: 'Easy', value: 'EASY' },
            { label: 'Moderate', value: 'MODERATE' },
            { label: 'Hard', value: 'HARD' },
          ]}
          value={filters.difficulty}
          onChange={set('difficulty')}
        />
      </FilterField>
      <FilterField label="Setting">
        <PillSelect
          options={['Indoor', 'Outdoor']}
          value={filters.setting}
          onChange={set('setting')}
        />
      </FilterField>
      <FilterField label="Max min. age">
        <input
          type="number"
          min="0"
          max="18"
          placeholder="Any"
          value={filters.minAge}
          onChange={setE('minAge')}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FilterField>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities & Experiences</h1>
      <p className="text-gray-600 mb-6">
        Day tours and activities across Iceland. Select an activity to see full details and available dates.
      </p>

      <FilterBar
        resultCount={filtered.length}
        label="activities"
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

        <FilterField label="Where">
          <select
            value={filters.region}
            onChange={setE('region')}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All regions</option>
            {availableRegions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Travelers">
          <input
            type="number"
            min="1"
            max="50"
            placeholder="Any"
            value={filters.travelers}
            onChange={setE('travelers')}
            className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FilterField>

      </FilterBar>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-4">No activities match your filters.</p>
          <button
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((activity) => (
            <div
              key={activity.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLE[activity.category] || 'bg-gray-100 text-gray-600'}`}>
                    {activity.category}
                  </span>
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
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {activity.indoor ? 'Indoor' : 'Outdoor'} · {activity.timeOfDay}
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
      )}
    </div>
  );
}
