import React, { useState, useMemo } from 'react';
import { useCart } from '../CartContext';
import FilterBar, { FilterField, PillSelect, ICELAND_REGIONS } from '../components/FilterBar';

const HOTELS = [
  {
    id: 'reykjavik-grand',
    name: 'Reykjavík Grand Hotel',
    region: 'Reykjavík',
    location: 'Reykjavík city centre',
    description: 'Modern hotel in the heart of Reykjavík with breakfast included and easy access to all major sights.',
    pricePerNight: 150,
    starRating: 4,
    propertyType: 'Hotel',
    amenities: ['Wi-Fi', 'Breakfast', 'Parking'],
    maxGuestsPerRoom: 3,
    minNights: 1,
    availableDateRanges: [{ start: '2025-05-01', end: '2025-10-31' }],
    image: 'https://picsum.photos/seed/reykjavik-hotel/800/450',
  },
  {
    id: 'northern-lights-lodge',
    name: 'Northern Lights Lodge',
    region: 'Akureyri',
    location: 'Akureyri',
    description: 'Cozy lodge perfect for northern lights viewing, near the capital of North Iceland.',
    pricePerNight: 180,
    starRating: 3,
    propertyType: 'Guesthouse',
    amenities: ['Wi-Fi'],
    maxGuestsPerRoom: 2,
    minNights: 2,
    availableDateRanges: [
      { start: '2025-06-01', end: '2025-08-31' },
      { start: '2025-10-01', end: '2025-03-31' },
    ],
    image: 'https://picsum.photos/seed/lodge-aurora/800/450',
  },
  {
    id: 'golden-circle-inn',
    name: 'Golden Circle Inn',
    region: 'South Iceland',
    location: 'Selfoss',
    description: 'Convenient location near Golden Circle attractions — Geysir, Gullfoss, and Þingvellir.',
    pricePerNight: 120,
    starRating: 3,
    propertyType: 'Guesthouse',
    amenities: ['Wi-Fi', 'Parking'],
    maxGuestsPerRoom: 4,
    minNights: 1,
    availableDateRanges: [{ start: '2025-04-01', end: '2025-10-31' }],
    image: 'https://picsum.photos/seed/golden-circle-inn/800/450',
  },
  {
    id: 'blue-lagoon-resort',
    name: 'Blue Lagoon Retreat',
    region: 'South Iceland',
    location: 'Grindavík',
    description: 'Luxury resort with Blue Lagoon access included. Geothermal spa on your doorstep.',
    pricePerNight: 300,
    starRating: 5,
    propertyType: 'Hotel',
    amenities: ['Wi-Fi', 'Breakfast', 'Parking', 'Pool'],
    maxGuestsPerRoom: 2,
    minNights: 1,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    image: 'https://picsum.photos/seed/blue-lagoon-resort/800/450',
  },
  {
    id: 'keflavik-airport-hotel',
    name: 'Keflavík Gateway Hotel',
    region: 'Keflavík',
    location: 'Near Keflavík International Airport',
    description: 'Ideal for first and last nights. Free shuttle to the airport, 24-hour reception.',
    pricePerNight: 115,
    starRating: 3,
    propertyType: 'Hotel',
    amenities: ['Wi-Fi', 'Parking'],
    maxGuestsPerRoom: 3,
    minNights: 1,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    image: 'https://picsum.photos/seed/keflavik-airport-hotel/800/450',
  },
  {
    id: 'east-fjords-guesthouse',
    name: 'East Fjords Guesthouse',
    region: 'East Iceland',
    location: 'Egilsstaðir',
    description: 'Charming family-run guesthouse overlooking the Lagarfljót lake in the east.',
    pricePerNight: 95,
    starRating: 2,
    propertyType: 'Guesthouse',
    amenities: ['Wi-Fi'],
    maxGuestsPerRoom: 4,
    minNights: 1,
    availableDateRanges: [{ start: '2025-05-01', end: '2025-09-30' }],
    image: 'https://picsum.photos/seed/east-fjords-guesthouse/800/450',
  },
  {
    id: 'westfjords-apartment',
    name: 'West Fjords Harbour Apartments',
    region: 'West Fjords',
    location: 'Ísafjörður',
    description: 'Self-catering apartments with harbour views. Perfect base for exploring the remote Westfjords.',
    pricePerNight: 130,
    starRating: 3,
    propertyType: 'Apartment',
    amenities: ['Wi-Fi', 'Parking'],
    maxGuestsPerRoom: 6,
    minNights: 2,
    availableDateRanges: [{ start: '2025-06-01', end: '2025-08-31' }],
    image: 'https://picsum.photos/seed/westfjords-apartment/800/450',
  },
  {
    id: 'north-iceland-lodge',
    name: 'Lake Mývatn Nature Lodge',
    region: 'North Iceland',
    location: 'Mývatn',
    description: 'Surrounded by volcanic craters and steaming vents. Hot tub with aurora views in winter.',
    pricePerNight: 160,
    starRating: 3,
    propertyType: 'Guesthouse',
    amenities: ['Wi-Fi', 'Breakfast'],
    maxGuestsPerRoom: 2,
    minNights: 2,
    availableDateRanges: [
      { start: '2025-06-01', end: '2025-09-15' },
      { start: '2025-11-01', end: '2026-02-28' },
    ],
    image: 'https://picsum.photos/seed/myvatn-lodge/800/450',
  },
  {
    id: 'reykjavik-downtown-apt',
    name: 'Downtown Reykjavík Apartment',
    region: 'Reykjavík',
    location: 'Reykjavík old town',
    description: 'Stylish self-catering apartment on Laugavegur. Walk everywhere. Free Netflix.',
    pricePerNight: 175,
    starRating: 4,
    propertyType: 'Apartment',
    amenities: ['Wi-Fi'],
    maxGuestsPerRoom: 4,
    minNights: 2,
    availableDateRanges: [{ start: '2025-01-01', end: '2025-12-31' }],
    image: 'https://picsum.photos/seed/reykjavik-downtown-apt/800/450',
  },
];

const AMENITY_OPTIONS = ['Wi-Fi', 'Breakfast', 'Parking', 'Pool'];

const INITIAL_FILTERS = {
  checkIn: '',
  checkOut: '',
  region: '',
  adults: '',
  children: '',
  rooms: '',
  // secondary
  maxPrice: '',
  starRating: '',
  propertyType: '',
  amenities: [],
};

function filterHotels(hotels) {
  return hotels;
}

const STAR_DISPLAY = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

const PROPERTY_BADGE = {
  Hotel: 'bg-blue-50 text-blue-700',
  Guesthouse: 'bg-green-50 text-green-700',
  Apartment: 'bg-purple-50 text-purple-700',
};

export default function Hotels() {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState(new Set());
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const set = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }));
  const setE = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const toggleAmenity = (amenity) => {
    setFilters((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  const filtered = useMemo(() => filterHotels(HOTELS), []);
  const hasActiveFilters =
    Object.entries(filters).some(([k, v]) => k !== 'amenities' && v !== '') ||
    filters.amenities.length > 0;
  const moreFiltersActiveCount = [
    filters.maxPrice, filters.starRating, filters.propertyType,
  ].filter(Boolean).length + (filters.amenities.length > 0 ? 1 : 0);

  const handleAddToCart = (hotel) => {
    const cartItem = {
      type: 'hotel',
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      image: hotel.image,
      nights: 2,
      checkIn: filters.checkIn || '2025-06-15',
      checkOut: filters.checkOut || '2025-06-17',
      rooms: Number(filters.rooms) || 1,
      guestsPerRoom: Math.max(Number(filters.adults) || 2, 1),
      pricePerNight: hotel.pricePerNight,
      needsInfo: true,
    };
    addToCart(cartItem);
    setAddedItems(new Set(addedItems).add(hotel.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const s = new Set(prev);
        s.delete(hotel.id);
        return s;
      });
    }, 2000);
  };

  const moreFiltersPanel = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <FilterField label="Max Price ($/night)">
        <input
          type="number"
          min="0"
          placeholder="Any"
          value={filters.maxPrice}
          onChange={setE('maxPrice')}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FilterField>
      <FilterField label="Min Star Rating">
        <PillSelect
          options={[
            { label: '2+', value: '2' },
            { label: '3+', value: '3' },
            { label: '4+', value: '4' },
            { label: '5', value: '5' },
          ]}
          value={filters.starRating}
          onChange={set('starRating')}
        />
      </FilterField>
      <FilterField label="Property Type">
        <PillSelect
          options={['Hotel', 'Guesthouse', 'Apartment']}
          value={filters.propertyType}
          onChange={set('propertyType')}
        />
      </FilterField>
      <FilterField label="Amenities">
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                filters.amenities.includes(a)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </FilterField>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotels in Iceland</h1>
      <p className="text-gray-600 mb-6">
        Choose your accommodation. You can customise dates and guests during checkout.
      </p>

      <FilterBar
        resultCount={filtered.length}
        label="hotels"
        hasActiveFilters={hasActiveFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
        moreFiltersActiveCount={moreFiltersActiveCount}
        moreFilters={moreFiltersPanel}
      >
        <FilterField label="When">
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={filters.checkIn}
              onChange={setE('checkIn')}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={filters.checkOut}
              onChange={setE('checkOut')}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </FilterField>

        <FilterField label="Where">
          <select
            value={filters.region}
            onChange={setE('region')}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All regions</option>
            {ICELAND_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Travelers">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-0.5">Adults</span>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="2"
                value={filters.adults}
                onChange={setE('adults')}
                className="w-16 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-0.5">Children</span>
              <input
                type="number"
                min="0"
                max="10"
                placeholder="0"
                value={filters.children}
                onChange={setE('children')}
                className="w-16 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-0.5">Rooms</span>
              <input
                type="number"
                min="1"
                max="5"
                placeholder="1"
                value={filters.rooms}
                onChange={setE('rooms')}
                className="w-16 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </FilterField>
      </FilterBar>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-4">No hotels match your filters.</p>
          <button
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PROPERTY_BADGE[hotel.propertyType] || 'bg-gray-100 text-gray-600'}`}>
                    {hotel.propertyType}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {STAR_DISPLAY(hotel.starRating)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    📍 {hotel.region}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{hotel.location}</p>
                <p className="text-gray-600 text-sm mb-3">{hotel.description}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {hotel.amenities.map((a) => (
                    <span key={a} className="px-2 py-0.5 text-xs bg-gray-50 border border-gray-200 rounded text-gray-600">
                      {a}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  Up to {hotel.maxGuestsPerRoom} guests/room · min {hotel.minNights} night{hotel.minNights > 1 ? 's' : ''}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${hotel.pricePerNight}</span>
                    <span className="text-sm text-gray-600">/night</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(hotel)}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    addedItems.has(hotel.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {addedItems.has(hotel.id) ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          💡 <strong>Note:</strong> Default booking is 2 nights for 2 guests. You can
          customise dates, number of rooms, and guests during checkout.
        </p>
      </div>
    </div>
  );
}
