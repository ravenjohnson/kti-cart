import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';

// ============================================================================
// DUMMY TOUR DATA
// ============================================================================

const TOUR_DATA = {
  'ring-road': {
    id: 'ring-road',
    title: '7-day Ring Road Expedition',
    image: 'https://picsum.photos/seed/ring-road-iceland/1200/500',
    tourType: 'self_drive',
    durationDays: 7,
    durationNights: 6,
    season: { startDate: '2025-05-01', endDate: '2025-09-30' },
    priceFrom: 890,
    highlights: [
      'Drive the legendary Ring Road (Route 1) — the full circle of Iceland',
      'Walk behind Seljalandsfoss waterfall and stand below Skógafoss',
      'Watch icebergs drift at Jökulsárlón Glacier Lagoon',
      'Explore volcanic craters and geothermal wonders at Lake Mývatn',
      'Spot puffins, Arctic foxes, and humpback whales in season',
      'Experience the midnight sun — 24 hours of light in summer',
    ],
    included: [
      '6 nights accommodation (guesthouse / hotel)',
      'Compact SUV car rental (CDW included)',
      'Detailed self-drive road book & GPS route',
      'Welcome pack with maps and local tips',
      '24/7 emergency assistance hotline',
      'Ferry tickets where applicable',
      'All road and bridge tolls',
      'Free cancellation up to 14 days',
    ],
    extraIncluded: [
      'Airport pickup on Day 1',
      'Airport dropoff on Day 7',
    ],
    notIncluded: [
      'Flights to / from Iceland',
      'Travel insurance (strongly recommended)',
      'Meals and drinks',
      'Activity entrance fees',
      'Fuel costs',
      'Personal expenses',
    ],
    bringWithYou: [
      'Waterproof jacket & trousers',
      'Sturdy hiking boots',
      'Swimwear (for hot springs)',
      'Camera or phone with good camera',
      'Sunscreen (24 h daylight in summer)',
      'Cash (some remote areas are card-free)',
    ],
    conditions: {
      cancellation:
        'Free cancellation up to 14 days before departure. 50% refund for cancellations 7–14 days before. No refund within 7 days of departure.',
      importantInfo:
        'F-roads (highland tracks) require a 4x4 vehicle and are not included in the base package. Minimum driver age is 20 years. A valid driving licence is required. Speed limits must be strictly observed.',
      terms:
        'Booking confirmation is sent within 24 hours. Final payment is due 30 days before departure. All prices are per person based on double occupancy unless otherwise stated.',
    },
    availabilityLabels: ['Self-drive', 'Guided (on request)', 'Private'],
    preferences: {
      travelStyle: ['Adventure', 'Nature', 'Road Trip'],
      wayOfTravel: ['Self-drive', 'Small group'],
      interests: ['Waterfalls', 'Glaciers', 'Hot Springs', 'Wildlife', 'Photography'],
      regions: ['South Iceland', 'East Iceland', 'North Iceland', 'West Iceland'],
      durationTag: '7 days',
    },
    route: {
      numberOfStays: 6,
      stops: [
        { name: 'Reykjavík', nights: 1 },
        { name: 'South Coast (Vík)', nights: 1 },
        { name: 'Jökulsárlón', nights: 1 },
        { name: 'East Fjords', nights: 1 },
        { name: 'Mývatn', nights: 1 },
        { name: 'Snæfellsnes', nights: 1, optional: true },
        { name: 'Reykjavík (departure)', nights: 0 },
      ],
    },
    accommodationsByStop: [
      {
        stopName: 'Reykjavík',
        options: [
          { name: 'Reykjavík City Hotel', stars: 3, description: 'Central location near the main attractions.', roomTypes: ['Double', 'Twin', 'Single'] },
          { name: 'Fosshotel Reykjavík', stars: 4, description: 'Modern design hotel with harbour views.', roomTypes: ['Double', 'Twin', 'Family'] },
        ],
      },
      {
        stopName: 'South Coast (Vík)',
        options: [
          { name: 'Vík Guesthouse', stars: 2, description: 'Cosy rooms a short walk from the black sand beach.', roomTypes: ['Double', 'Twin'] },
        ],
      },
      {
        stopName: 'Jökulsárlón',
        options: [
          { name: 'Glacier Lagoon Hotel', stars: 3, description: 'Steps from the glacier lagoon — fall asleep to icebergs.', roomTypes: ['Double', 'Family'] },
        ],
      },
      {
        stopName: 'East Fjords',
        options: [
          { name: 'Fjords Retreat', stars: 2, description: 'Scenic fjordside setting with mountain views.', roomTypes: ['Double', 'Twin'] },
        ],
      },
      {
        stopName: 'Mývatn',
        options: [
          { name: 'Mývatn Guesthouse', stars: 2, description: 'Comfortable rooms close to the geothermal fields.', roomTypes: ['Double', 'Twin', 'Single'] },
        ],
      },
      {
        stopName: 'Snæfellsnes',
        options: [
          { name: 'Snæfellsnes Lodge', stars: 3, description: 'Panoramic glacier views, hot tub on site.', roomTypes: ['Double', 'Twin'] },
        ],
      },
    ],
    transport: {
      level: 'required',
      allowedCarCategories: ['Compact SUV', '4x4 SUV', 'Large 4x4'],
      durationMode: 'all_days',
      note: '4x4 vehicle strongly recommended for the full route. Some sections and all optional highland detours require 4x4 clearance.',
    },
    departures: [
      { date: '2025-05-10', times: ['08:00'] },
      { date: '2025-05-24', times: ['08:00'] },
      { date: '2025-06-07', times: ['08:00', '10:00'] },
      { date: '2025-06-21', times: ['08:00'] },
      { date: '2025-07-05', times: ['08:00', '10:00'] },
      { date: '2025-07-19', times: ['08:00'] },
      { date: '2025-08-02', times: ['08:00'] },
      { date: '2025-08-16', times: ['08:00'] },
      { date: '2025-09-06', times: ['09:00'] },
      { date: '2025-09-20', times: ['09:00'] },
    ],
    itinerary: [
      {
        dayNumber: 1, title: 'Arrival & Reykjavík',
        description: 'Arrive at Keflavík International Airport. Collect your rental car and drive to Reykjavík. Explore Hallgrímskirkja church, the old harbour area, and the colourful streets of the capital.',
        activities: [
          { title: 'Airport car collection', included: true },
          { title: 'Hallgrímskirkja Church', included: true, duration: '1 hr' },
          { title: 'Reykjavík harbour walk', included: true, duration: '1–2 hrs' },
          { title: 'Whale watching tour', included: false, duration: '3 hrs', time: '13:00' },
        ],
        overnightStop: 'Reykjavík',
      },
      {
        dayNumber: 2, title: 'Golden Circle',
        description: 'Þingvellir National Park, Geysir geothermal area with the spouting Strokkur, and the thundering Gullfoss waterfall — the classic trio done at your own pace.',
        activities: [
          { title: 'Þingvellir National Park', included: true, duration: '2 hrs' },
          { title: 'Geysir & Strokkur', included: true, duration: '1.5 hrs' },
          { title: 'Gullfoss Waterfall', included: true, duration: '1 hr' },
          { title: 'Secret Lagoon hot spring', included: false, duration: '2 hrs' },
        ],
        overnightStop: 'South Coast (Vík)',
      },
      {
        dayNumber: 3, title: 'South Coast Waterfalls',
        description: 'Walk behind the curtain of Seljalandsfoss, photograph the mighty Skógafoss, then step onto the jet-black sands of Reynisfjara beach beneath dramatic basalt columns.',
        activities: [
          { title: 'Seljalandsfoss Waterfall', included: true, duration: '45 min' },
          { title: 'Skógafoss Waterfall', included: true, duration: '45 min' },
          { title: 'Reynisfjara Black Sand Beach', included: true, duration: '1 hr' },
          { title: 'Horse riding on the beach', included: false, duration: '2 hrs' },
        ],
        overnightStop: 'South Coast (Vík)',
      },
      {
        dayNumber: 4, title: 'Glacier Lagoon & Diamond Beach',
        description: 'Icebergs calve from Breiðamerkurjökull and drift slowly through Jökulsárlón lagoon. Just across the road, "Diamond Beach" glitters with ice chunks on black sand.',
        activities: [
          { title: 'Jökulsárlón Glacier Lagoon', included: true, duration: '2 hrs' },
          { title: 'Diamond Beach', included: true, duration: '1 hr' },
          { title: 'Amphibian boat tour', included: false, duration: '45 min', time: '10:00' },
          { title: 'Zodiac glacier tour', included: false, duration: '1 hr', time: '14:00' },
        ],
        overnightStop: 'Jökulsárlón',
      },
      {
        dayNumber: 5, title: 'East Fjords',
        description: 'Winding cliff roads reveal one dramatic fjord after another. Stop in the charming village of Seyðisfjörður and keep your eyes peeled for nesting puffins in season.',
        activities: [
          { title: 'Scenic East Fjords drive', included: true },
          { title: 'Seyðisfjörður village', included: true, duration: '2 hrs' },
          { title: 'Puffin watching (seasonal)', included: true, duration: '1 hr' },
        ],
        overnightStop: 'East Fjords',
      },
      {
        dayNumber: 6, title: 'Lake Mývatn & Northern Wonders',
        description: 'Explore one of Iceland\'s most otherworldly landscapes — pseudocraters, boiling mud pools, lava pillars, and the milky-blue Mývatn Nature Baths.',
        activities: [
          { title: 'Dettifoss Waterfall', included: true, duration: '1.5 hrs' },
          { title: 'Mývatn volcanic landscape', included: true, duration: '2 hrs' },
          { title: 'Mývatn Nature Baths', included: false, duration: '2 hrs', time: '17:00' },
          { title: 'Whale watching (Húsavík)', included: false, duration: '3 hrs', time: '09:00' },
        ],
        overnightStop: 'Mývatn',
      },
      {
        dayNumber: 7, title: 'Snæfellsnes & Return',
        description: 'Optional scenic detour through the Snæfellsnes Peninsula, crowned by the mystical Snæfellsjökull glacier. Then head to Keflavík to return your car and catch your flight.',
        activities: [
          { title: 'Snæfellsjökull glacier view', included: false, duration: '3 hrs' },
          { title: 'Car return at Keflavík', included: true },
        ],
        overnightStop: null,
      },
    ],
    media: { images: [
      'https://picsum.photos/seed/rr-mountain/600/400',
      'https://picsum.photos/seed/rr-waterfall/600/400',
      'https://picsum.photos/seed/rr-glacier/600/400',
      'https://picsum.photos/seed/rr-volcano/600/400',
      'https://picsum.photos/seed/rr-ocean/600/400',
      'https://picsum.photos/seed/rr-sunset/600/400',
      'https://picsum.photos/seed/rr-bird/600/400',
      'https://picsum.photos/seed/rr-landscape/600/400',
      'https://picsum.photos/seed/rr-dawn/600/400',
      'https://picsum.photos/seed/rr-peak/600/400',
    ] },
    extrasByCategory: [
      {
        category: 'Activities',
        products: [
          { title: 'Glacier Hike', description: 'Walk on a glacier with a certified guide. All equipment provided.', price: 89, pricingUnit: 'per_person' },
          { title: 'Northern Lights Tour', description: 'Guided minibus tour to chase the best aurora viewing spots.', price: 65, pricingUnit: 'per_person' },
          { title: 'Horse Riding', description: '2-hour ride on Icelandic horses through dramatic lava fields.', price: 120, pricingUnit: 'per_person' },
        ],
      },
      {
        category: 'Meals',
        products: [
          { title: 'Half Board', description: 'Breakfast and dinner included at each accommodation stop.', price: 85, pricingUnit: 'per_person' },
          { title: 'Full Board', description: 'All meals included throughout the entire tour.', price: 140, pricingUnit: 'per_person' },
        ],
      },
      {
        category: 'Upgrades',
        products: [
          { title: 'Hotel Upgrade', description: 'Upgrade all stays to 4-star hotels for extra comfort.', price: 250, pricingUnit: 'per_person' },
          { title: '4x4 Vehicle Upgrade', description: 'Full-size 4x4 for F-road and highland access.', price: 35, pricingUnit: 'per_day' },
        ],
      },
    ],
  },

  'south-coast': {
    id: 'south-coast',
    title: '4-day Guided South Coast Package',
    image: 'https://picsum.photos/seed/south-coast-iceland/1200/500',
    tourType: 'guided',
    durationDays: 4,
    durationNights: 3,
    season: { startDate: '2025-04-01', endDate: '2025-10-31' },
    priceFrom: 450,
    highlights: [
      'Walk behind Seljalandsfoss waterfall',
      'See the black sand beaches of Reynisfjara',
      'Guided glacier walk on Sólheimajökull',
    ],
    included: ['3 nights accommodation', 'All transportation', 'Professional guide', 'Listed activities'],
    extraIncluded: [],
    notIncluded: ['Flights', 'Meals', 'Travel insurance'],
    bringWithYou: ['Waterproof jacket', 'Hiking boots', 'Warm layers'],
    conditions: {
      cancellation: 'Free cancellation up to 7 days before. No refund within 7 days.',
      importantInfo: 'Moderate fitness required for glacier walk.',
      terms: 'Final payment due 14 days before departure.',
    },
    availabilityLabels: ['Guided'],
    preferences: {
      travelStyle: ['Guided', 'Nature'],
      wayOfTravel: ['Group tour'],
      interests: ['Waterfalls', 'Glaciers'],
      regions: ['South Iceland'],
    },
    route: {
      numberOfStays: 3,
      stops: [
        { name: 'Reykjavík', nights: 1 },
        { name: 'South Coast', nights: 2 },
        { name: 'Reykjavík (return)', nights: 0 },
      ],
    },
    accommodationsByStop: [],
    transport: { level: 'optional', allowedCarCategories: 'all', note: 'Transport included in guided tour.' },
    departures: [
      { date: '2025-05-05', times: ['09:00'] },
      { date: '2025-06-02', times: ['09:00'] },
      { date: '2025-07-07', times: ['09:00'] },
    ],
    itinerary: [
      { dayNumber: 1, title: 'Reykjavík & Departure', description: 'Meet your guide and head south.', activities: [], overnightStop: 'Reykjavík' },
      { dayNumber: 2, title: 'Waterfalls', description: 'Seljalandsfoss and Skógafoss.', activities: [], overnightStop: 'South Coast' },
      { dayNumber: 3, title: 'Glacier & Beach', description: 'Glacier walk and Reynisfjara.', activities: [], overnightStop: 'South Coast' },
      { dayNumber: 4, title: 'Return', description: 'Drive back to Reykjavík.', activities: [], overnightStop: null },
    ],
    media: { images: [
      'https://picsum.photos/seed/sc-waterfall/600/400',
      'https://picsum.photos/seed/sc-glacier/600/400',
      'https://picsum.photos/seed/sc-beach/600/400',
      'https://picsum.photos/seed/sc-coast/600/400',
    ] },
    extrasByCategory: [],
  },

  'golden-circle': {
    id: 'golden-circle',
    title: '5-day Golden Circle Adventure',
    image: 'https://picsum.photos/seed/golden-circle-tour/1200/500',
    tourType: 'guided',
    durationDays: 5,
    durationNights: 4,
    season: { startDate: '2025-03-01', endDate: '2025-11-30' },
    priceFrom: 520,
    highlights: [
      'Geysir erupts every 5–8 minutes — catch it perfectly',
      'Stand at the rift between the Eurasian and North American plates',
      'Bathe in the Secret Lagoon geothermal pool',
    ],
    included: ['4 nights accommodation', 'All transportation', 'Professional guide', 'Some meals'],
    extraIncluded: [],
    notIncluded: ['Flights', 'Travel insurance'],
    bringWithYou: ['Warm layers', 'Camera', 'Swimwear'],
    conditions: {
      cancellation: 'Free cancellation up to 10 days before.',
      importantInfo: 'Suitable for all fitness levels.',
      terms: 'Prices based on double occupancy.',
    },
    availabilityLabels: ['Guided', 'Private'],
    preferences: {
      travelStyle: ['Guided', 'Comfort'],
      wayOfTravel: ['Group tour'],
      interests: ['Geysers', 'Hot Springs', 'History'],
      regions: ['South Iceland', 'West Iceland'],
    },
    route: {
      numberOfStays: 4,
      stops: [
        { name: 'Reykjavík', nights: 2 },
        { name: 'Golden Circle area', nights: 2 },
        { name: 'Reykjavík (return)', nights: 0 },
      ],
    },
    accommodationsByStop: [],
    transport: { level: 'optional', allowedCarCategories: 'all', note: 'Minibus transport included.' },
    departures: [
      { date: '2025-04-14', times: ['09:00'] },
      { date: '2025-05-12', times: ['09:00'] },
    ],
    itinerary: [
      { dayNumber: 1, title: 'Arrival', description: 'Check in and orientation.', activities: [], overnightStop: 'Reykjavík' },
      { dayNumber: 2, title: 'Þingvellir', description: 'UNESCO World Heritage site.', activities: [], overnightStop: 'Reykjavík' },
      { dayNumber: 3, title: 'Geysir & Gullfoss', description: 'The geothermal wonders.', activities: [], overnightStop: 'Golden Circle area' },
      { dayNumber: 4, title: 'Secret Lagoon', description: 'Relax in geothermal waters.', activities: [], overnightStop: 'Golden Circle area' },
      { dayNumber: 5, title: 'Return', description: 'Back to Reykjavík.', activities: [], overnightStop: null },
    ],
    media: { images: [
      'https://picsum.photos/seed/gc-geyser/600/400',
      'https://picsum.photos/seed/gc-waterfall/600/400',
      'https://picsum.photos/seed/gc-lagoon/600/400',
      'https://picsum.photos/seed/gc-mountain/600/400',
    ] },
    extrasByCategory: [],
  },

  'northern-lights': {
    id: 'northern-lights',
    title: '3-day Northern Lights Package',
    image: 'https://picsum.photos/seed/northern-lights-iceland/1200/500',
    tourType: 'guided',
    durationDays: 3,
    durationNights: 2,
    season: { startDate: '2025-09-15', endDate: '2026-03-31' },
    priceFrom: 380,
    highlights: [
      'Expert guides take you to the darkest aurora-viewing spots',
      'Explore an ice cave inside a glacier',
      'Small group — maximum 12 people',
    ],
    included: ['2 nights accommodation', 'All transportation', 'Professional guide', 'Ice cave tour'],
    extraIncluded: [],
    notIncluded: ['Flights', 'Meals', 'Travel insurance'],
    bringWithYou: ['Very warm jacket', 'Thermals', 'Gloves & hat', 'Camera with manual mode'],
    conditions: {
      cancellation: 'Aurora sightings cannot be guaranteed. No refund for weather-related issues.',
      importantInfo: 'Ice cave tours depend on glacier safety conditions.',
      terms: 'Winter tour — temperatures can drop to −15°C.',
    },
    availabilityLabels: ['Guided'],
    preferences: {
      travelStyle: ['Winter', 'Adventure'],
      wayOfTravel: ['Small group'],
      interests: ['Northern Lights', 'Ice Caves', 'Photography'],
      regions: ['South Iceland'],
    },
    route: {
      numberOfStays: 2,
      stops: [
        { name: 'Reykjavík', nights: 1 },
        { name: 'South Iceland', nights: 1 },
        { name: 'Reykjavík (return)', nights: 0 },
      ],
    },
    accommodationsByStop: [],
    transport: { level: 'optional', allowedCarCategories: 'all', note: 'Super jeep transport included.' },
    departures: [
      { date: '2025-10-04', times: ['18:00'] },
      { date: '2025-11-01', times: ['17:00'] },
      { date: '2025-12-06', times: ['16:00'] },
    ],
    itinerary: [
      { dayNumber: 1, title: 'Arrival & Aurora Hunt', description: 'Arrive and hunt for the northern lights.', activities: [], overnightStop: 'Reykjavík' },
      { dayNumber: 2, title: 'Ice Cave & Glacier', description: 'Explore Vatnajökull ice cave.', activities: [], overnightStop: 'South Iceland' },
      { dayNumber: 3, title: 'Return', description: 'Return to Reykjavík.', activities: [], overnightStop: null },
    ],
    media: { images: [
      'https://picsum.photos/seed/nl-aurora/600/400',
      'https://picsum.photos/seed/nl-icecave/600/400',
      'https://picsum.photos/seed/nl-glacier/600/400',
      'https://picsum.photos/seed/nl-winter/600/400',
    ] },
    extrasByCategory: [],
  },
};

// ============================================================================
// SHARED HELPERS
// ============================================================================

function ShowMore({ items, limit = 6, renderItem }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, limit);
  const hidden = items.length - limit;

  return (
    <div>
      <ul className="space-y-2">
        {visible.map((item, i) => renderItem(item, i))}
      </ul>
      {items.length > limit && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {expanded ? 'Show less ▲' : `Show ${hidden} more ▼`}
        </button>
      )}
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left font-medium text-gray-900 hover:text-blue-600"
      >
        <span>{title}</span>
        <span className="text-gray-400 text-sm ml-4">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="pb-4 text-sm text-gray-700 leading-relaxed">{children}</div>}
    </div>
  );
}

// ============================================================================
// 1. HERO
// ============================================================================

function TourHero({ tour, onAddToCart, added }) {
  const [saved, setSaved] = useState(false);
  const isGuided = tour.tourType === 'guided';

  const formatDate = (d) => {
    if (!d) return '';
    const [, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m,10)-1]} ${parseInt(day,10)}`;
  };

  return (
    <div>
      {/* Cover */}
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isGuided ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {isGuided ? 'Guided tour' : 'Self-drive'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              {tour.durationDays} days / {tour.durationNights} nights
            </span>
            {tour.season && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                {formatDate(tour.season.startDate)} – {formatDate(tour.season.endDate)}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{tour.title}</h1>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            from <span className="text-blue-600">${tour.priceFrom}</span>
            <span className="text-base font-normal text-gray-500"> / person</span>
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <button
            onClick={onAddToCart}
            className={`px-6 py-3 rounded-md font-medium transition-colors text-white ${added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`border px-6 py-3 rounded-md font-medium transition-colors ${saved ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {saved ? '♥ Saved' : '♡ Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. KEY INFO BLOCKS
// ============================================================================

function TourKeyInfo({ tour }) {
  const cards = [];

  if (tour.included?.length) {
    cards.push(
      <div key="included" className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-green-600 font-semibold mb-2">✓ What's included</div>
        <ul className="space-y-1 text-sm text-gray-700">
          {tour.included.slice(0, 3).map((item, i) => <li key={i}>• {item}</li>)}
          {tour.included.length > 3 && <li className="text-gray-400">+ {tour.included.length - 3} more…</li>}
        </ul>
      </div>
    );
  }

  if (tour.notIncluded?.length) {
    cards.push(
      <div key="not-included" className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-red-500 font-semibold mb-2">✗ Not included</div>
        <ul className="space-y-1 text-sm text-gray-700">
          {tour.notIncluded.slice(0, 3).map((item, i) => <li key={i}>• {item}</li>)}
          {tour.notIncluded.length > 3 && <li className="text-gray-400">+ {tour.notIncluded.length - 3} more…</li>}
        </ul>
      </div>
    );
  }

  if (tour.bringWithYou?.length) {
    cards.push(
      <div key="bring" className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-gray-700 font-semibold mb-2">🎒 Bring with you</div>
        <ul className="space-y-1 text-sm text-gray-700">
          {tour.bringWithYou.slice(0, 3).map((item, i) => <li key={i}>• {item}</li>)}
          {tour.bringWithYou.length > 3 && <li className="text-gray-400">+ {tour.bringWithYou.length - 3} more…</li>}
        </ul>
      </div>
    );
  }

  if (tour.conditions?.cancellation) {
    cards.push(
      <div key="cancel" className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-gray-700 font-semibold mb-2">🕐 Cancellation</div>
        <p className="text-sm text-gray-700">{tour.conditions.cancellation.split('.')[0]}.</p>
      </div>
    );
  }

  if (tour.availabilityLabels?.length) {
    cards.push(
      <div key="avail" className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-gray-700 font-semibold mb-2">📋 Available as</div>
        <div className="flex flex-wrap gap-1">
          {tour.availabilityLabels.map((label, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{label}</span>
          ))}
        </div>
      </div>
    );
  }

  if (!cards.length) return null;

  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards}
      </div>
    </section>
  );
}

// ============================================================================
// 3. HIGHLIGHTS
// ============================================================================

function TourHighlights({ highlights }) {
  if (!highlights?.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Highlights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {highlights.map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-yellow-400 text-lg shrink-0">★</span>
            <p className="text-sm text-gray-800">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 4. INCLUSIONS
// ============================================================================

function TourInclusions({ included, extraIncluded, notIncluded }) {
  const hasAny = included?.length || extraIncluded?.length || notIncluded?.length;
  if (!hasAny) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Included & Not Included</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Included */}
        {(included?.length || extraIncluded?.length) ? (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-green-700">What's included</h3>
            {included?.length ? (
              <ShowMore
                items={included}
                limit={6}
                renderItem={(item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                )}
              />
            ) : null}
            {extraIncluded?.length ? (
              <div className="mt-4 pl-4 border-l-2 border-dashed border-green-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Also included</p>
                <ul className="space-y-2">
                  {extraIncluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Not Included */}
        {notIncluded?.length ? (
          <div>
            <h3 className="font-semibold text-red-600 mb-3">Not included</h3>
            <ShowMore
              items={notIncluded}
              limit={6}
              renderItem={(item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                  {item}
                </li>
              )}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

// ============================================================================
// 5. BRING WITH YOU
// ============================================================================

function TourBringWithYou({ items }) {
  if (!items?.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Bring</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center shrink-0 text-xs text-gray-400">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ============================================================================
// 6. CONDITIONS
// ============================================================================

function TourConditions({ conditions }) {
  if (!conditions) return null;
  const hasAny = conditions.cancellation || conditions.importantInfo || conditions.terms;
  if (!hasAny) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Conditions</h2>
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {conditions.cancellation && (
          <Accordion title="Cancellation policy" defaultOpen={true}>
            {conditions.cancellation}
          </Accordion>
        )}
        {conditions.importantInfo && (
          <Accordion title="Important information">
            {conditions.importantInfo}
          </Accordion>
        )}
        {conditions.terms && (
          <Accordion title="Terms & Conditions">
            {conditions.terms}
          </Accordion>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// 7. PREFERENCES
// ============================================================================

function TourPreferences({ preferences }) {
  if (!preferences) return null;

  const groups = [
    { key: 'travelStyle',  label: 'Travel style',    color: 'bg-blue-100 text-blue-700' },
    { key: 'wayOfTravel',  label: 'Way of travel',   color: 'bg-purple-100 text-purple-700' },
    { key: 'interests',    label: 'Interests',        color: 'bg-green-100 text-green-700' },
    { key: 'regions',      label: 'Regions',          color: 'bg-orange-100 text-orange-700' },
  ];

  const hasDurationTag = !!preferences.durationTag;
  const hasAnyGroup = groups.some(g => preferences[g.key]?.length) || hasDurationTag;
  if (!hasAnyGroup) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags & Preferences</h2>
      <div className="space-y-4">
        {groups.map(({ key, label, color }) =>
          preferences[key]?.length ? (
            <div key={key} className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-500 w-24 shrink-0">{label}</span>
              <div className="flex flex-wrap gap-2">
                {preferences[key].map((tag, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>{tag}</span>
                ))}
              </div>
            </div>
          ) : null
        )}
        {hasDurationTag && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500 w-24 shrink-0">Duration</span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">{preferences.durationTag}</span>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// 8. ROUTE
// ============================================================================

function TourRoute({ route }) {
  if (!route?.stops?.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Route & Stays</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="relative">
          {route.stops.map((stop, i) => {
            const isLast = i === route.stops.length - 1;
            return (
              <div key={i} className="flex items-start gap-4 relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-gray-200" style={{ height: 'calc(100% - 4px)' }} />
                )}
                {/* Dot */}
                <div className={`w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center z-10 ${
                  stop.nights === 0 ? 'bg-gray-300' : stop.optional ? 'border-2 border-dashed border-blue-400 bg-white' : 'bg-blue-600'
                }`}>
                  {stop.nights === 0 && <span className="text-gray-500 text-xs">✈</span>}
                </div>
                <div className="pb-6 flex-1 flex items-center justify-between">
                  <span className="font-medium text-gray-900">{stop.name}</span>
                  <div className="flex items-center gap-2">
                    {stop.optional && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-200">Optional</span>
                    )}
                    {stop.nights === 0 ? (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Departure</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {stop.nights} night{stop.nights !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 9. ACCOMMODATIONS
// ============================================================================

function TourAccommodations({ accommodationsByStop }) {
  if (!accommodationsByStop?.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Where You'll Stay</h2>
      <div className="space-y-6">
        {accommodationsByStop.map((stop, i) => (
          <div key={i}>
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">{stop.stopName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stop.options.map((opt, j) => (
                <div key={j} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-gray-900">{opt.name}</span>
                    {opt.stars && (
                      <span className="text-yellow-400 text-xs shrink-0 ml-2">{'★'.repeat(opt.stars)}</span>
                    )}
                  </div>
                  {opt.description && <p className="text-sm text-gray-600 mb-2">{opt.description}</p>}
                  {opt.roomTypes?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {opt.roomTypes.map((rt, k) => (
                        <span key={k} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{rt}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 10. TRANSPORT
// ============================================================================

function TourTransport({ transport }) {
  if (!transport) return null;

  const levelConfig = {
    optional:    { label: 'Optional',    cls: 'bg-gray-100 text-gray-700' },
    recommended: { label: 'Recommended', cls: 'bg-yellow-100 text-yellow-700' },
    required:    { label: 'Required',    cls: 'bg-red-100 text-red-700' },
  };
  const cfg = levelConfig[transport.level] || levelConfig.optional;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Transport</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Car rental:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${cfg.cls}`}>{cfg.label}</span>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-600">Allowed categories:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {transport.allowedCarCategories === 'all' ? (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">All categories allowed</span>
            ) : (
              transport.allowedCarCategories.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{cat}</span>
              ))
            )}
          </div>
        </div>

        {transport.durationMode && (
          <div className="text-sm text-gray-600">
            Duration: <span className="font-medium">{transport.durationMode === 'all_days' ? 'All days' : 'Partial'}</span>
          </div>
        )}

        {(transport.level === 'recommended' || transport.level === 'required') && transport.note && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
            <span className="font-semibold">Note: </span>{transport.note}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// 11. DEPARTURES
// ============================================================================

function TourDepartures({ departures }) {
  if (!departures?.length) return null;

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`;
  };

  const byMonth = departures.reduce((acc, dep) => {
    const d = new Date(dep.date + 'T00:00:00');
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(dep);
    return acc;
  }, {});

  const months = Object.keys(byMonth);

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Departure Dates</h2>
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {months.map((month, i) => (
          <Accordion key={month} title={month} defaultOpen={i === 0}>
            <ul className="space-y-3 pt-1">
              {byMonth[month].map((dep, j) => (
                <li key={j} className="flex items-center justify-between">
                  <span className="text-gray-800 font-medium">{formatDate(dep.date)}</span>
                  {dep.times?.length ? (
                    <div className="flex gap-2">
                      {dep.times.map((t, k) => (
                        <span key={k} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">{t}</span>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </Accordion>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 12. ITINERARY
// ============================================================================

function TourItinerary({ itinerary }) {
  if (!itinerary?.length) return null;

  const [openDays, setOpenDays] = useState(new Set([1]));

  const toggleDay = (dayNumber) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(dayNumber) ? next.delete(dayNumber) : next.add(dayNumber);
      return next;
    });
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {itinerary.map((day) => {
          const isOpen = openDays.has(day.dayNumber);
          return (
            <div key={day.dayNumber}>
              <button
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
              >
                <span className="font-semibold text-gray-900">
                  Day {day.dayNumber}{day.title ? ` — ${day.title}` : ''}
                </span>
                <span className="text-gray-400 text-sm ml-4">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 space-y-4">
                  {day.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{day.description}</p>
                  )}

                  {day.activities?.length ? (
                    <ul className="space-y-2">
                      {day.activities.map((act, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-3 text-sm p-3 rounded-md ${
                            act.included ? 'bg-green-50' : 'bg-gray-50 border border-dashed border-gray-200'
                          }`}
                        >
                          <span className={`shrink-0 mt-0.5 ${act.included ? 'text-green-600' : 'text-gray-400'}`}>
                            {act.included ? '✓' : '○'}
                          </span>
                          <div className="flex-1">
                            <span className={act.included ? 'text-gray-800' : 'text-gray-600'}>{act.title}</span>
                            {!act.included && (
                              <span className="ml-2 text-xs text-gray-400 italic">Optional</span>
                            )}
                            {(act.time || act.duration) && (
                              <span className="ml-2 text-xs text-gray-400">
                                {act.time && `${act.time}`}{act.time && act.duration && ' · '}{act.duration && `${act.duration}`}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {day.overnightStop && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">🛏</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        Overnight: {day.overnightStop}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// 13. MEDIA
// ============================================================================

function TourMedia({ media }) {
  const [lightbox, setLightbox] = useState(null);
  if (!media?.images?.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {media.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(img)}
            className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox} alt="Gallery" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button
              onClick={() => setLightbox(null)}
              className="mt-4 block mx-auto text-white border border-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// 14. EXTRAS
// ============================================================================

function TourExtras({ extrasByCategory }) {
  if (!extrasByCategory?.length) return null;

  const unitLabel = (unit) => {
    if (unit === 'per_person') return '/ person';
    if (unit === 'per_day') return '/ day';
    if (unit === 'per_booking') return '/ booking';
    return '';
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Optional Extras</h2>
      <div className="space-y-6">
        {extrasByCategory.map((group, i) => (
          <div key={i}>
            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-3">{group.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.products.map((product, j) => (
                <div key={j} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900">{product.title}</span>
                    {product.price != null && (
                      <span className="text-blue-600 font-semibold text-sm shrink-0 ml-2">
                        ${product.price} <span className="text-gray-400 font-normal">{unitLabel(product.pricingUnit)}</span>
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-sm text-gray-600">{product.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 15. PREVIEW SUMMARY
// ============================================================================

function TourPreviewSummary({ tour }) {
  const formatDate = (d) => {
    if (!d) return '';
    const [, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m,10)-1]} ${parseInt(day,10)}`;
  };

  const routeSummary = tour.route?.stops
    ?.filter(s => s.nights > 0)
    .map(s => s.name)
    .join(' → ');

  return (
    <section className="mt-10">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trip at a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div>
              <span className="text-gray-500 block">Duration</span>
              <span className="font-medium text-gray-900">{tour.durationDays} days / {tour.durationNights} nights</span>
            </div>
            {tour.season && (
              <div>
                <span className="text-gray-500 block">Season</span>
                <span className="font-medium text-gray-900">{formatDate(tour.season.startDate)} – {formatDate(tour.season.endDate)}</span>
              </div>
            )}
            {routeSummary && (
              <div>
                <span className="text-gray-500 block">Route</span>
                <span className="font-medium text-gray-900">{routeSummary}</span>
              </div>
            )}
            {tour.conditions?.cancellation && (
              <div>
                <span className="text-gray-500 block">Cancellation</span>
                <span className="text-gray-700">{tour.conditions.cancellation.split('.')[0]}.</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {tour.highlights?.length ? (
              <div>
                <span className="text-gray-500 block mb-1">Top highlights</span>
                <ul className="space-y-1">
                  {tour.highlights.slice(0, 4).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-yellow-400 shrink-0">★</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {tour.itinerary?.length ? (
              <div>
                <span className="text-gray-500 block mb-1">Quick itinerary</span>
                <ul className="space-y-0.5">
                  {tour.itinerary.map((day) => (
                    <li key={day.dayNumber} className="text-gray-700">
                      <span className="font-medium">Day {day.dayNumber}:</span> {day.title || '—'}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default function TourDetail() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const tour = TOUR_DATA[tourId];

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: `tour-${Date.now()}`,
      type: 'tourPackage',
      name: tour.title,
      image: tour.image,
      shortDescription: tour.highlights?.[0] || '',
      tourType: tour.tourType,
      days: tour.durationDays,
      participants: 1,
      pricePerPerson: tour.priceFrom,
      startDate: tour.departures?.[0]?.date || tour.season?.startDate || '',
      endDate: '',
      includedActivities: tour.itinerary?.flatMap((d) =>
        (d.activities || [])
          .filter((a) => a.included)
          .map((a) => ({ name: a.title, requiresShoeSize: false }))
      ) || [],
      needsInfo: true,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h1>
          <Link to="/tours" className="text-blue-600 hover:text-blue-700">
            ← Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link to="/tours" className="text-gray-500 hover:text-gray-700">Tours</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">{tour.title}</span>
      </nav>
        {/* 1 — Hero */}
        <TourHero tour={tour} onAddToCart={handleAddToCart} added={added} />

        {/* 2 — Key info */}
        <TourKeyInfo tour={tour} />

        {/* 3 — Highlights */}
        <TourHighlights highlights={tour.highlights} />

        {/* 4 — Inclusions */}
        <TourInclusions
          included={tour.included}
          extraIncluded={tour.extraIncluded}
          notIncluded={tour.notIncluded}
        />

        {/* 5 — Bring with you */}
        <TourBringWithYou items={tour.bringWithYou} />

        {/* 6 — Conditions */}
        <TourConditions conditions={tour.conditions} />

        {/* 7 — Preferences */}
        <TourPreferences preferences={tour.preferences} />

        {/* 8 — Route */}
        <TourRoute route={tour.route} />

        {/* 9 — Accommodations */}
        <TourAccommodations accommodationsByStop={tour.accommodationsByStop} />

        {/* 10 — Transport */}
        <TourTransport transport={tour.transport} />

        {/* 11 — Departures */}
        <TourDepartures departures={tour.departures} />

        {/* 12 — Itinerary */}
        <TourItinerary itinerary={tour.itinerary} />

        {/* 13 — Media */}
        <TourMedia media={tour.media} />

        {/* 14 — Extras */}
        <TourExtras extrasByCategory={tour.extrasByCategory} />

        {/* 15 — Preview summary */}
        <TourPreviewSummary tour={tour} />

        {/* Bottom CTA */}
        <div className="mt-10 flex gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 text-white px-6 py-4 rounded-md font-medium text-lg transition-colors ${added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {added ? `✓ Added to Cart` : `Add to Cart — from $${tour.priceFrom}/person`}
          </button>
        </div>
    </div>
  );
}
