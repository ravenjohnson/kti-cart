import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar, { FilterField, PillSelect } from '../components/FilterBar';

const PICKUP_LOCATIONS = ['Keflavík Airport', 'Reykjavík', 'Akureyri'];

const CAR_RENTALS = [
  {
    id: 'economy',
    name: 'Economy Car',
    category: 'Small',
    description: 'Perfect for city driving and paved roads. Fuel efficient and easy to park.',
    pricePerDay: 45,
    passengers: 5,
    luggage: 2,
    transmission: 'Manual',
    needsDriver: true,
    image: 'https://picsum.photos/seed/economy-car-road/800/450',
    // Filter fields
    pickupLocations: ['Keflavík Airport', 'Reykjavík'],
    minDriverAge: 20,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    insurance: 'Basic',
    fuelPolicy: 'Full-to-Full',
  },
  {
    id: 'compact-suv',
    name: 'Compact SUV',
    category: 'Medium',
    description: 'Comfortable for families with extra space. Suitable for most paved roads.',
    pricePerDay: 85,
    passengers: 5,
    luggage: 4,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/compact-suv-iceland/800/450',
    pickupLocations: ['Keflavík Airport', 'Reykjavík', 'Akureyri'],
    minDriverAge: 20,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    insurance: 'Standard',
    fuelPolicy: 'Full-to-Full',
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
    pickupLocations: ['Keflavík Airport', 'Reykjavík', 'Akureyri'],
    minDriverAge: 23,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    insurance: 'Standard',
    fuelPolicy: 'Full-to-Full',
  },
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    category: 'Large',
    description: 'Premium comfort with advanced features. Perfect for business travel.',
    pricePerDay: 150,
    passengers: 5,
    luggage: 3,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/luxury-car-city/800/450',
    pickupLocations: ['Keflavík Airport', 'Reykjavík'],
    minDriverAge: 25,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    insurance: 'Premium',
    fuelPolicy: 'Pre-paid',
  },
  {
    id: 'campervan',
    name: 'Campervan',
    category: 'Large',
    description: 'Sleep and travel in one vehicle. Includes basic camping equipment.',
    pricePerDay: 180,
    passengers: 4,
    luggage: 6,
    transmission: 'Manual',
    needsDriver: true,
    image: 'https://picsum.photos/seed/campervan-camping/800/450',
    pickupLocations: ['Keflavík Airport', 'Reykjavík'],
    minDriverAge: 21,
    availableDateRanges: [{ start: '2025-05-01', end: '2025-09-30' }],
    insurance: 'Standard',
    fuelPolicy: 'Full-to-Full',
  },
  {
    id: 'electric',
    name: 'Electric Car',
    category: 'Small',
    description: 'Eco-friendly with free charging at many locations across Iceland.',
    pricePerDay: 95,
    passengers: 5,
    luggage: 2,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/electric-car-modern/800/450',
    pickupLocations: ['Keflavík Airport', 'Reykjavík'],
    minDriverAge: 20,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    insurance: 'Basic',
    fuelPolicy: 'Electric',
  },
  {
    id: '4x4-large-group',
    name: 'Large 4x4 People Carrier',
    category: '4x4',
    description: 'Fits up to 9 passengers. Ideal for group highland expeditions.',
    pricePerDay: 195,
    passengers: 9,
    luggage: 8,
    transmission: 'Automatic',
    needsDriver: true,
    recommended: 'Group travel & F-roads',
    image: 'https://picsum.photos/seed/4x4-group-carrier/800/450',
    pickupLocations: ['Keflavík Airport', 'Reykjavík'],
    minDriverAge: 23,
    availableDateRanges: [{ start: '2025-05-01', end: '2025-10-31' }],
    insurance: 'Standard',
    fuelPolicy: 'Full-to-Full',
  },
  {
    id: 'akureyri-economy',
    name: 'North Iceland Economy',
    category: 'Small',
    description: 'Budget-friendly pick-up from Akureyri. Great for exploring the north.',
    pricePerDay: 55,
    passengers: 5,
    luggage: 2,
    transmission: 'Manual',
    needsDriver: true,
    image: 'https://picsum.photos/seed/north-iceland-economy/800/450',
    pickupLocations: ['Akureyri'],
    minDriverAge: 20,
    availableDateRanges: [{ start: '2025-06-01', end: '2025-09-30' }],
    insurance: 'Basic',
    fuelPolicy: 'Full-to-Full',
  },
];

const INITIAL_FILTERS = {
  pickupDate: '',
  dropoffDate: '',
  location: '',
  driverAge: '',
  // secondary
  category: '',
  transmission: '',
  insurance: '',
  fuelPolicy: '',
};

function isDateInRanges(dateStr, ranges) {
  return ranges.some((r) => dateStr >= r.start && dateStr <= r.end);
}

function filterCars(cars, f) {
  return cars.filter((c) => {
    if (f.location && !c.pickupLocations.includes(f.location)) return false;


    if (f.category && c.category !== f.category) return false;
    if (f.transmission && c.transmission !== f.transmission) return false;
    if (f.insurance && c.insurance !== f.insurance) return false;
    if (f.fuelPolicy && c.fuelPolicy !== f.fuelPolicy) return false;
    return true;
  });
}

const CATEGORY_BADGE = {
  Small: 'bg-green-50 text-green-700',
  Medium: 'bg-blue-50 text-blue-700',
  Large: 'bg-orange-50 text-orange-700',
  '4x4': 'bg-red-50 text-red-700',
};

export default function CarRentals() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const set = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }));
  const setE = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const filtered = useMemo(() => filterCars(CAR_RENTALS, filters), [filters]);
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const moreFiltersActiveCount = [
    filters.category, filters.transmission, filters.insurance, filters.fuelPolicy,
  ].filter(Boolean).length;

  const moreFiltersPanel = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <FilterField label="Category">
        <PillSelect
          options={['Small', 'Medium', 'Large', '4x4']}
          value={filters.category}
          onChange={set('category')}
        />
      </FilterField>
      <FilterField label="Transmission">
        <PillSelect
          options={['Automatic', 'Manual']}
          value={filters.transmission}
          onChange={set('transmission')}
        />
      </FilterField>
      <FilterField label="Insurance">
        <PillSelect
          options={['Basic', 'Standard', 'Premium']}
          value={filters.insurance}
          onChange={set('insurance')}
        />
      </FilterField>
      <FilterField label="Fuel Policy">
        <PillSelect
          options={['Full-to-Full', 'Pre-paid', 'Electric']}
          value={filters.fuelPolicy}
          onChange={set('fuelPolicy')}
        />
      </FilterField>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Rentals</h1>
      <p className="text-lg text-gray-600 mb-6">
        Choose the perfect vehicle for your Iceland adventure
      </p>

      <FilterBar
        resultCount={filtered.length}
        label="vehicles"
        hasActiveFilters={hasActiveFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
        moreFiltersActiveCount={moreFiltersActiveCount}
        moreFilters={moreFiltersPanel}
      >
        <FilterField label="When">
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={filters.pickupDate}
              onChange={setE('pickupDate')}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={filters.dropoffDate}
              onChange={setE('dropoffDate')}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </FilterField>

        <FilterField label="Where">
          <select
            value={filters.location}
            onChange={setE('location')}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All locations</option>
            {PICKUP_LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </FilterField>

      </FilterBar>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-4">No vehicles match your filters.</p>
          <button
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BADGE[car.category] || 'bg-gray-100 text-gray-600'}`}>
                    {car.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    ⚙️ {car.transmission}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Age {car.minDriverAge}+
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
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
                    <span>📍 Pick up:</span>
                    <span className="font-medium text-xs text-right">{car.pickupLocations.join(', ')}</span>
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
                    <span className="text-2xl font-bold text-gray-900">${car.pricePerDay}</span>
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
      )}

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Driving in Iceland</h2>
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
