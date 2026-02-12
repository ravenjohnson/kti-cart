import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../CartContext';

// ============================================================================
// DUMMY TOUR DATA
// ============================================================================

const TOUR_DATA = {

  // ── SELF-DRIVE, 7 days ──────────────────────────────────────────────────
  'ring-road': {
    id: 'ring-road',
    title: '7-day Ring Road Expedition',
    image: 'https://picsum.photos/seed/ring-road-iceland/1200/500',
    tourType: 'self_drive',
    totalDays: 7,
    priceFrom: 890,
    season: { startDate: '2025-05-01', endDate: '2025-09-30' },
    description: "Circle the entire island of Iceland at your own pace on the legendary Route 1. In seven days you'll encounter thundering waterfalls, vast glaciers, volcanic craters, and dramatic fjords.",
    highlights: [
      'Drive the full Ring Road — the complete circle of Iceland',
      'Walk behind the curtain of Seljalandsfoss waterfall',
      'Watch icebergs drift at Jökulsárlón Glacier Lagoon',
      'Explore volcanic craters and geothermal pools at Lake Mývatn',
      'Spot puffins, Arctic foxes, and humpback whales in season',
      'Experience the midnight sun in summer',
    ],
    included: [
      '6 nights accommodation (guesthouse / hotel)',
      'Compact SUV car rental (CDW included)',
      'Detailed self-drive road book & GPS route',
      'Welcome pack with maps and local tips',
      '24/7 emergency assistance hotline',
      'All road and bridge tolls',
    ],
    extraIncluded: ['Airport car pickup on Day 1', 'Airport car return on Day 7'],
    notIncluded: ['Flights', 'Travel insurance', 'Meals', 'Activity entrance fees', 'Fuel'],
    bringWithYou: ['Waterproof jacket', 'Hiking boots', 'Swimwear', 'Camera', 'Sunscreen', 'Cash'],
    conditions: {
      cancellation: 'Free cancellation up to 14 days before departure. 50% refund 7–14 days before. No refund within 7 days.',
      importantInfo: 'F-roads require a 4x4 vehicle. Minimum driver age 20. Valid licence required.',
      terms: 'Booking confirmation within 24 hours. Final payment due 30 days before departure.',
    },
    travelStyle: ['Adventure', 'Nature', 'Road Trip'],
    wayOfTravel: ['Self-drive'],
    interests: ['Waterfalls', 'Glaciers', 'Hot Springs', 'Wildlife', 'Photography'],
    regionTags: ['South Iceland', 'East Iceland', 'North Iceland', 'West Iceland'],
    transport: {
      allowCarRental: true,
      advisedAllDays: true,
      allowedCarCategories: ['Compact SUV', '4x4 SUV', 'Large 4x4'],
      notes: '4x4 strongly recommended. Highland F-roads require 4x4 clearance.',
      recommendedCar: {
        make: 'Toyota',
        model: 'Land Cruiser',
        type: '4x4 SUV',
        transmission: 'Automatic',
        pricePerDay: 120,
        image: 'https://picsum.photos/seed/4x4-offroad-iceland/400/280',
      },
    },
    availabilityLabels: ['Self-drive', 'Guided (on request)', 'Private'],
    media: { images: [
      'https://picsum.photos/seed/rr-mountain/600/400',
      'https://picsum.photos/seed/rr-waterfall/600/400',
      'https://picsum.photos/seed/rr-glacier/600/400',
      'https://picsum.photos/seed/rr-volcano/600/400',
      'https://picsum.photos/seed/rr-ocean/600/400',
      'https://picsum.photos/seed/rr-sunset/600/400',
    ] },
    extrasByCategory: [
      { category: 'Activities', products: [
        { title: 'Glacier Hike', description: 'Walk on a glacier with a certified guide.', price: 89, pricingUnit: 'per_person' },
        { title: 'Northern Lights Tour', description: 'Guided minibus tour chasing the aurora.', price: 65, pricingUnit: 'per_person' },
      ]},
      { category: 'Upgrades', products: [
        { title: 'Hotel Upgrade', description: 'Upgrade all stays to 4-star hotels.', price: 250, pricingUnit: 'per_person' },
        { title: '4x4 Vehicle Upgrade', description: 'Full-size 4x4 for F-road access.', price: 35, pricingUnit: 'per_day' },
      ]},
    ],

    // Day-by-day interactive structure
    days: [
      {
        dayNumber: 1,
        date: '2025-06-07',
        city: 'Reykjavík',
        region: 'Capital Region',
        accommodations: [
          { id: 'kex-hostel',   name: 'KEX Hostel',              rating: 8.6, reviewCount: 2613, pricePerNight: 89,  category: 'Hostel',     checkIn: '15:00', checkOut: '11:00', location: '1 km from centre', image: 'https://picsum.photos/seed/kex-hostel/400/280' },
          { id: 'rk-lights',   name: 'Reykjavík Lights Hotel',  rating: 8.8, reviewCount: 1258, pricePerNight: 145, category: '3-star Hotel', checkIn: '15:00', checkOut: '12:00', location: '0.4 km from centre', image: 'https://picsum.photos/seed/reykjavik-lights/400/280' },
          { id: 'rey-apts',    name: 'Rey Apartments',          rating: 9.0, reviewCount: 282,  pricePerNight: 195, category: 'Apartment',   checkIn: '15:00', checkOut: '11:00', location: '0.6 km from centre', image: 'https://picsum.photos/seed/rey-apartments/400/280' },
        ],
        activities: [
          { id: 'hallgrimskirkja',  name: 'Hallgrímskirkja Church Tower',     rating: 8.5, reviewCount: 3200, pricePerPerson: 18,  duration: '1.5h',     image: 'https://picsum.photos/seed/hallgrimskirkja/400/280',     description: 'Ride the elevator to the top of Reykjavík\'s iconic church for a 360° panoramic view across the city, the harbour, and the surrounding mountains. The tower is 74 metres tall and on a clear day you can see as far as Mount Esja.' },
          { id: 'whale-rvk',        name: 'Whale Watching from Reykjavík',    rating: 9.2, reviewCount: 5100, pricePerPerson: 89,  duration: '3h',       image: 'https://picsum.photos/seed/whale-watching-rvk/400/280',   description: 'Board a traditional oak boat from the Old Harbour and head into Faxaflói Bay. Humpback whales, minke whales, and white-beaked dolphins are commonly spotted. A marine biologist guide narrates throughout.' },
          { id: 'rvk-walk',         name: 'Reykjavík City Walking Tour',      rating: 8.7, reviewCount: 2800, pricePerPerson: 35,  duration: '2h',       image: 'https://picsum.photos/seed/reykjavik-city-walk/400/280',   description: 'Explore the colourful streets of the world\'s northernmost capital with a local guide. Visit Tjörnin lake, the parliament building, Laugavegur shopping street, and the Sun Voyager sculpture on the seafront.' },
          { id: 'blue-lagoon-day',  name: 'Blue Lagoon Day Trip',             rating: 9.0, reviewCount: 4500, pricePerPerson: 65,  duration: '4h',       image: 'https://picsum.photos/seed/blue-lagoon-day/400/280',       description: 'Soak in the famous geothermal lagoon surrounded by black lava fields, 45 minutes from Reykjavík. The milky-blue water is rich in silica and minerals. Includes return transport and Comfort entry with silica mud mask and algae mask.' },
        ],
      },
      {
        dayNumber: 2,
        date: '2025-06-08',
        city: 'Vík',
        region: 'South Iceland',
        accommodations: [
          { id: 'vik-guesthouse', name: 'Vík Guesthouse',       rating: 8.4, reviewCount: 890,  pricePerNight: 120, category: 'Guesthouse',  checkIn: '14:00', checkOut: '11:00', location: '0.3 km from beach', image: 'https://picsum.photos/seed/vik-guesthouse/400/280' },
          { id: 'icelandair-vik', name: 'Icelandair Hotel Vík', rating: 8.9, reviewCount: 1560, pricePerNight: 185, category: '4-star Hotel', checkIn: '15:00', checkOut: '12:00', location: '1 km from centre',  image: 'https://picsum.photos/seed/icelandair-vik/400/280' },
        ],
        activities: [
          { id: 'seljalandsfoss',  name: 'Seljalandsfoss Waterfall',          rating: 9.1, reviewCount: 7200, pricePerPerson: 25,  duration: '1h',       image: 'https://picsum.photos/seed/seljalandsfoss/400/280',  description: 'One of Iceland\'s most photographed waterfalls — and the only one you can walk behind. A narrow path leads through the cave behind the 60-metre cascade. Best visited in the golden evening light of the midnight sun.' },
          { id: 'skogafoss',       name: 'Skógafoss Waterfall',               rating: 9.0, reviewCount: 6800, pricePerPerson: 20,  duration: '1h',       image: 'https://picsum.photos/seed/skogafoss/400/280',       description: 'Stand at the base of this 62-metre waterfall and feel the mist on your face, or climb the 527 steps to the viewing platform for sweeping views over the south coast. According to legend, a Viking hid a treasure chest inside the cave behind the falls.' },
          { id: 'reynisfjara',     name: 'Reynisfjara Black Sand Beach',      rating: 9.3, reviewCount: 8900, pricePerPerson: 15,  duration: '1.5h',     image: 'https://picsum.photos/seed/reynisfjara/400/280',     description: 'Walk the dramatic jet-black sand beach framed by towering basalt columns and sea stacks. Watch for sneaker waves and spot nesting puffins on the cliffs in summer. One of the most visited natural sites in Iceland.' },
          { id: 'glacier-hike',    name: 'Glacier Hike on Sólheimajökull',   rating: 9.2, reviewCount: 3400, pricePerPerson: 89,  duration: '3h',       image: 'https://picsum.photos/seed/solheimajokull/400/280',  description: 'Strap on crampons and hike the outlet glacier of Mýrdalsjökull with a certified glacier guide. Explore crevasses, ice formations, and blue ice tunnels. Harness, helmet, and all technical gear are provided.' },
        ],
      },
      {
        dayNumber: 3,
        date: '2025-06-09',
        city: 'Jökulsárlón',
        region: 'East Iceland',
        accommodations: [
          { id: 'glacier-lagoon-hotel', name: 'Glacier Lagoon Hotel', rating: 8.7, reviewCount: 620, pricePerNight: 225, category: '3-star Hotel', checkIn: '15:00', checkOut: '11:00', location: 'Steps from the lagoon', image: 'https://picsum.photos/seed/glacier-lagoon-hotel/400/280' },
          { id: 'jokull-hostel',        name: 'Jökull Hostel',        rating: 7.9, reviewCount: 445, pricePerNight: 85,  category: 'Hostel',      checkIn: '14:00', checkOut: '10:00', location: '2 km from lagoon',   image: 'https://picsum.photos/seed/jokull-hostel/400/280' },
        ],
        activities: [
          { id: 'lagoon-boat',   name: 'Jökulsárlón Glacier Lagoon Boat',  rating: 9.4, reviewCount: 5600, pricePerPerson: 59,  duration: '45 min',   image: 'https://picsum.photos/seed/lagoon-boat/400/280',    description: 'Cruise among floating icebergs calved from the Breiðamerkurjökull glacier on an amphibious boat. Your guide explains the glaciology, wildlife, and environmental changes. Seals often rest on the ice floes close by.' },
          { id: 'diamond-beach', name: 'Diamond Beach Walk',               rating: 9.2, reviewCount: 4300, pricePerPerson: 12,  duration: '1h',       image: 'https://picsum.photos/seed/diamond-beach/400/280',  description: 'Cross the road from the lagoon to find translucent ice chunks washed up on the black sand — nature\'s own diamonds. Best photographed in morning light or under the midnight sun. A short but unforgettable walk.' },
          { id: 'zodiac-tour',   name: 'Zodiac Glacier Tour',              rating: 9.5, reviewCount: 2100, pricePerPerson: 110, duration: '1.5h',     image: 'https://picsum.photos/seed/zodiac-glacier/400/280', description: 'Get up close to the glacier face on a fast Zodiac inflatable. Navigate between towering icebergs and reach areas the amphibian boats cannot. Small groups of 8 max. Dry suits and full safety equipment provided.' },
        ],
      },
      {
        dayNumber: 4,
        date: '2025-06-10',
        city: 'Seyðisfjörður',
        region: 'East Fjords',
        accommodations: [
          { id: 'aldan-hotel',   name: 'Aldan Hotel',         rating: 8.8, reviewCount: 380, pricePerNight: 160, category: 'Boutique Hotel', checkIn: '15:00', checkOut: '11:00', location: 'Town centre', image: 'https://picsum.photos/seed/aldan-hotel/400/280' },
          { id: 'hafaldan-hi',   name: 'Hafaldan HI Hostel',  rating: 8.5, reviewCount: 720, pricePerNight: 75,  category: 'Hostel',         checkIn: '14:00', checkOut: '10:00', location: '0.5 km from ferry', image: 'https://picsum.photos/seed/hafaldan-hostel/400/280' },
        ],
        activities: [
          { id: 'seydis-village', name: 'Seyðisfjörður Village Tour',     rating: 8.9, reviewCount: 1200, pricePerPerson: 45,  duration: '2h',       image: 'https://picsum.photos/seed/seydisfjordur-village/400/280', description: 'Wander the rainbow street and timber-framed Norwegian houses of this artistic fjord village with a local guide. Visit the 19th-century blue church, the technical museum, and hear stories of the Smyril Line ferry route to Europe.' },
          { id: 'puffin-boat',    name: 'Puffin Watching Boat Tour',      rating: 9.1, reviewCount: 890,  pricePerPerson: 65,  duration: '2h',       image: 'https://picsum.photos/seed/puffin-watching/400/280',       description: 'Sail out from Seyðisfjörður harbour to the Atlantic puffin nesting colonies on the sea cliffs. Puffins nest here from May to August and can be photographed at close range from the boat. Binoculars provided.' },
          { id: 'fjords-drive',   name: 'East Fjords Scenic Drive',       rating: 9.0, reviewCount: 2300, pricePerPerson: 35,  duration: 'Half-day', image: 'https://picsum.photos/seed/east-fjords-drive/400/280',      description: 'Wind along the fjord roads of East Iceland, passing dramatic cliffs, tiny fishing villages, and mirror-calm waters. Multiple photo stops at the most scenic viewpoints. A driver-guide narrates the landscape and local history.' },
        ],
      },
      {
        dayNumber: 5,
        date: '2025-06-11',
        city: 'Mývatn',
        region: 'North Iceland',
        accommodations: [
          { id: 'hotel-laxa',    name: 'Hotel Laxá',          rating: 8.6, reviewCount: 510, pricePerNight: 195, category: '3-star Hotel', checkIn: '15:00', checkOut: '12:00', location: 'Lakeside',           image: 'https://picsum.photos/seed/hotel-laxa/400/280' },
          { id: 'myvatn-gh',     name: 'Mývatn Guesthouse',   rating: 8.2, reviewCount: 890, pricePerNight: 115, category: 'Guesthouse',   checkIn: '14:00', checkOut: '11:00', location: 'Near geothermal fields', image: 'https://picsum.photos/seed/myvatn-guesthouse/400/280' },
        ],
        activities: [
          { id: 'myvatn-baths',    name: 'Mývatn Nature Baths',         rating: 9.2, reviewCount: 6700, pricePerPerson: 55,  duration: '2h',      image: 'https://picsum.photos/seed/myvatn-baths/400/280',    description: 'Bathe in the milky-blue geothermal lagoon heated by volcanic activity beneath the lake. The silica-rich water is known for its skin benefits. Open-air pools with views over the lava fields and steam vents.' },
          { id: 'dettifoss',       name: 'Dettifoss Waterfall',         rating: 9.4, reviewCount: 4500, pricePerPerson: 25,  duration: '2h',      image: 'https://picsum.photos/seed/dettifoss/400/280',       description: 'Stand at the edge of the most powerful waterfall in Europe — 193 cubic metres of glacial water thundering 45 metres into Jökulságljúfur canyon every second. The spray can be seen from kilometres away and the roar is deafening.' },
          { id: 'grjótagja-cave',  name: 'Grjótagjá Lava Cave',        rating: 8.8, reviewCount: 3200, pricePerPerson: 20,  duration: '1h',      image: 'https://picsum.photos/seed/grjotagja-cave/400/280',  description: 'Enter a fissure cave carved by lava and gaze at the crystal-clear geothermal pool glowing turquoise in the dark. Made famous by Game of Thrones, the water temperature fluctuates between 43°C and 50°C — too hot to swim, perfect to marvel at.' },
          { id: 'volcanic-walk',   name: 'Mývatn Volcanic Landscape',  rating: 8.7, reviewCount: 2100, pricePerPerson: 35,  duration: '1.5h',    image: 'https://picsum.photos/seed/myvatn-volcanic/400/280', description: 'Walk through a surreal landscape of pseudocraters, lava pillars, and boiling mud pools with a geologist guide. The Krafla caldera and Víti explosion crater are highlights on this circular route around Lake Mývatn.' },
        ],
      },
      {
        dayNumber: 6,
        date: '2025-06-12',
        city: 'Akureyri',
        region: 'North Iceland',
        accommodations: [
          { id: 'icelandair-akureyri', name: 'Icelandair Hotel Akureyri', rating: 8.5, reviewCount: 1240, pricePerNight: 175, category: '4-star Hotel', checkIn: '15:00', checkOut: '12:00', location: '0.3 km from harbour', image: 'https://picsum.photos/seed/icelandair-akureyri/400/280' },
          { id: 'akureyri-backpackers',name: 'Akureyri Backpackers',      rating: 8.1, reviewCount: 670,  pricePerNight: 65,  category: 'Hostel',       checkIn: '14:00', checkOut: '11:00', location: 'Town centre',         image: 'https://picsum.photos/seed/akureyri-backpackers/400/280' },
          { id: 'gula-villan',         name: 'Gula Villan Guesthouse',    rating: 9.0, reviewCount: 340,  pricePerNight: 145, category: 'Guesthouse',   checkIn: '15:00', checkOut: '11:00', location: '1 km from centre',    image: 'https://picsum.photos/seed/gula-villan/400/280' },
        ],
        activities: [
          { id: 'husavik-whale',   name: 'Whale Watching from Húsavík', rating: 9.5, reviewCount: 8900, pricePerPerson: 110, duration: '3h',   image: 'https://picsum.photos/seed/husavik-whale/400/280',    description: 'Húsavík is Iceland\'s whale watching capital. Sail out on a traditional oak schooner or fast RIB boat to spot humpbacks, blue whales, and minke whales in Skjálfandi Bay. One of the highest success rates in Europe, with expert marine biologist guides.' },
          { id: 'akureyri-garden', name: 'Akureyri Botanical Garden',   rating: 8.4, reviewCount: 1800, pricePerPerson: 10,  duration: '1.5h', image: 'https://picsum.photos/seed/akureyri-garden/400/280',   description: 'Visit one of the world\'s northernmost botanical gardens at 65°N latitude. Over 7,000 plant species from the subarctic and around the world. In summer the garden is in full bloom and the beds are ablaze with colour under the midnight sun.' },
          { id: 'north-horses',    name: 'North Iceland Horse Riding',  rating: 9.1, reviewCount: 2200, pricePerPerson: 95,  duration: '2h',   image: 'https://picsum.photos/seed/north-horses/400/280',     description: 'Ride through lava fields and along a glacial river on a pure-bred Icelandic horse. Experience the unique tölt gait — smooth enough to carry a glass of beer without spilling. Suitable for all levels including beginners. Helmet and boots provided.' },
        ],
      },
      {
        dayNumber: 7,
        date: '2025-06-13',
        city: 'Reykjavík',
        region: 'Capital Region',
        // Last day — no accommodations
        accommodations: [],
        activities: [
          { id: 'food-tour',          name: 'Reykjavík Street Food Tour',       rating: 9.0, reviewCount: 3100, pricePerPerson: 75,  duration: '3h', image: 'https://picsum.photos/seed/reykjavik-food-tour/400/280',  description: 'Taste your way through Reykjavík\'s best food spots — from the famous hot dog stand by the harbour to Icelandic lamb soup, skyr desserts, and fresh langoustine. A local foodie guide leads you through 7–8 tastings across the city centre.' },
          { id: 'blue-lagoon-prem',   name: 'Blue Lagoon Premium Ticket',       rating: 9.3, reviewCount: 7800, pricePerPerson: 115, duration: '3h', image: 'https://picsum.photos/seed/blue-lagoon-premium/400/280', description: 'The Premium entry includes a sparkling wine welcome drink, a silica mud mask, an algae mask, access to the Lava Restaurant for a meal, and a complimentary Blue Lagoon robe. The ideal farewell experience before flying home from nearby Keflavík.' },
          { id: 'departure-transfer', name: 'Departure Transfer to Keflavík',   rating: 8.5, reviewCount: 5600, pricePerPerson: 35,  duration: '1h', image: 'https://picsum.photos/seed/keflavik-transfer/400/280',   description: 'Shared comfortable coach transfer from your Reykjavík hotel directly to Keflavík International Airport. Hotel pick-up included. Departs 3 hours before flight time. Luggage storage available at the terminal while you explore the airport.' },
        ],
      },
    ],
  },

  // ── GUIDED, 4 days ──────────────────────────────────────────────────────
  'south-coast': {
    id: 'south-coast',
    title: '4-day Guided South Coast Package',
    image: 'https://picsum.photos/seed/south-coast-iceland/1200/500',
    tourType: 'guided',
    startLocation: 'Reykjavík, Iceland',
    totalDays: 4,
    priceFrom: 450,
    season: { startDate: '2025-04-01', endDate: '2025-10-31' },
    description: "Join a small group for a 4-day guided journey along Iceland's iconic south coast. Roaring waterfalls, a glacier tongue, and a haunting black sand beach — with comfortable guesthouse stays each night.",
    highlights: ['Walk behind Seljalandsfoss waterfall', 'Guided glacier walk on Sólheimajökull', 'Black sand beach at Reynisfjara', 'Small group — max 12 travellers'],
    included: ['3 nights accommodation', 'Professional guide', 'Minibus transport', 'Glacier walk equipment'],
    extraIncluded: [],
    notIncluded: ['Flights', 'Meals', 'Travel insurance'],
    bringWithYou: ['Waterproof jacket', 'Hiking boots', 'Warm mid-layer'],
    conditions: {
      cancellation: 'Free cancellation up to 7 days before. No refund within 7 days.',
      importantInfo: 'Moderate fitness required for glacier walk.',
      terms: 'Final payment due 14 days before departure.',
    },
    travelStyle: ['Nature', 'Comfort'],
    wayOfTravel: ['Small group'],
    interests: ['Waterfalls', 'Glaciers', 'Beaches'],
    regionTags: ['South Iceland'],
    transport: { allowCarRental: false, advisedAllDays: false, allowedCarCategories: 'all', notes: 'All transport included. Minibus picks up from Reykjavík hotel each morning.', vehicle: { type: 'Minibus', capacity: 12, image: 'https://picsum.photos/seed/minibus-tour-iceland/400/280' } },
    availabilityLabels: ['Guided'],
    media: { images: ['https://picsum.photos/seed/sc-waterfall/600/400', 'https://picsum.photos/seed/sc-glacier/600/400', 'https://picsum.photos/seed/sc-beach/600/400'] },
    extrasByCategory: [],
    days: [
      {
        dayNumber: 1,
        date: '2025-05-05',
        city: 'Reykjavík',
        region: 'Capital Region',
        accommodations: [
          { id: 'rk-lights-sc', name: 'Reykjavík Lights Hotel', rating: 8.8, reviewCount: 1258, pricePerNight: 145, category: '3-star Hotel', checkIn: '15:00', checkOut: '12:00', location: '0.4 km from centre', image: 'https://picsum.photos/seed/reykjavik-lights/400/280' },
          { id: 'fosshotel-sc',  name: 'Fosshotel Reykjavík',   rating: 8.5, reviewCount: 940,  pricePerNight: 165, category: '4-star Hotel', checkIn: '15:00', checkOut: '12:00', location: 'Harbour area',       image: 'https://picsum.photos/seed/fosshotel-rvk/400/280' },
        ],
        activities: [
          { id: 'rvk-walk-sc',  name: 'Reykjavík City Walking Tour', rating: 8.7, reviewCount: 2800, pricePerPerson: 35, duration: '2h', image: 'https://picsum.photos/seed/reykjavik-city-walk/400/280' },
          { id: 'harpa-tour',   name: 'Harpa Concert Hall Tour',     rating: 8.5, reviewCount: 1600, pricePerPerson: 20, duration: '1h', image: 'https://picsum.photos/seed/harpa-concert/400/280' },
        ],
      },
      {
        dayNumber: 2,
        date: '2025-05-06',
        city: 'Hella',
        region: 'South Iceland',
        accommodations: [
          { id: 'hella-hotel', name: 'Hella Country Hotel', rating: 8.3, reviewCount: 720, pricePerNight: 130, category: 'Country Hotel', checkIn: '14:00', checkOut: '11:00', location: 'Rural South Iceland', image: 'https://picsum.photos/seed/hella-hotel/400/280' },
        ],
        activities: [
          { id: 'seljalandsfoss-sc', name: 'Seljalandsfoss Waterfall',  rating: 9.1, reviewCount: 7200, pricePerPerson: 25, duration: '1h',   image: 'https://picsum.photos/seed/seljalandsfoss/400/280' },
          { id: 'skogafoss-sc',      name: 'Skógafoss Waterfall',       rating: 9.0, reviewCount: 6800, pricePerPerson: 20, duration: '1h',   image: 'https://picsum.photos/seed/skogafoss/400/280' },
          { id: 'secret-lagoon',     name: 'Secret Lagoon Hot Spring',  rating: 8.9, reviewCount: 4100, pricePerPerson: 30, duration: '2h',   image: 'https://picsum.photos/seed/secret-lagoon/400/280' },
        ],
      },
      {
        dayNumber: 3,
        date: '2025-05-07',
        city: 'Vík',
        region: 'South Iceland',
        accommodations: [
          { id: 'vik-gh-sc',      name: 'Vík Guesthouse',        rating: 8.4, reviewCount: 890,  pricePerNight: 120, category: 'Guesthouse',  checkIn: '14:00', checkOut: '11:00', location: '0.3 km from beach', image: 'https://picsum.photos/seed/vik-guesthouse/400/280' },
          { id: 'icelandair-vik-sc', name: 'Icelandair Hotel Vík', rating: 8.9, reviewCount: 1560, pricePerNight: 185, category: '4-star Hotel', checkIn: '15:00', checkOut: '12:00', location: '1 km from centre', image: 'https://picsum.photos/seed/icelandair-vik/400/280' },
        ],
        activities: [
          { id: 'glacier-hike-sc', name: 'Glacier Hike on Sólheimajökull', rating: 9.2, reviewCount: 3400, pricePerPerson: 89, duration: '3h',   image: 'https://picsum.photos/seed/solheimajokull/400/280' },
          { id: 'reynisfjara-sc',  name: 'Reynisfjara Black Sand Beach',    rating: 9.3, reviewCount: 8900, pricePerPerson: 15, duration: '1.5h', image: 'https://picsum.photos/seed/reynisfjara/400/280' },
          { id: 'horse-riding',    name: 'Icelandic Horse Riding',          rating: 9.0, reviewCount: 2600, pricePerPerson: 75, duration: '2h',   image: 'https://picsum.photos/seed/horse-riding/400/280' },
        ],
      },
      {
        dayNumber: 4,
        date: '2025-05-08',
        city: 'Reykjavík',
        region: 'Capital Region',
        accommodations: [],  // Last day — no accommodation
        activities: [
          { id: 'skalholtkjord',  name: 'Skálholt Cathedral Visit',       rating: 8.4, reviewCount: 980,  pricePerPerson: 15, duration: '1h', image: 'https://picsum.photos/seed/skalholtkjord/400/280' },
          { id: 'departure-sc',   name: 'Reykjavík Departure Transfer',   rating: 8.5, reviewCount: 2300, pricePerPerson: 30, duration: '1h', image: 'https://picsum.photos/seed/rvk-departure/400/280' },
        ],
      },
    ],
  },

  // ── Minimal stubs ─────────────────────────────────────────────────────────
  'golden-circle': {
    id: 'golden-circle',
    title: '5-day Golden Circle Adventure',
    image: 'https://picsum.photos/seed/golden-circle-tour/1200/500',
    tourType: 'guided',
    startLocation: 'Reykjavík, Iceland',
    totalDays: 5,
    priceFrom: 520,
    season: { startDate: '2025-03-01', endDate: '2025-11-30' },
    description: 'Geysers, waterfalls, and hot springs on the classic Golden Circle route.',
    highlights: ['Geysir erupts every 5–8 minutes', 'Þingvellir UNESCO World Heritage Site'],
    included: ['4 nights accommodation', 'All transportation', 'Professional guide'],
    extraIncluded: [],
    notIncluded: ['Flights', 'Travel insurance'],
    bringWithYou: ['Warm layers', 'Camera'],
    conditions: { cancellation: 'Free cancellation up to 10 days before.', importantInfo: 'Suitable for all fitness levels.', terms: '' },
    travelStyle: ['Comfort'], wayOfTravel: ['Small group'], interests: ['Geysers', 'Hot Springs'], regionTags: ['South Iceland'],
    transport: { allowCarRental: false, advisedAllDays: false, allowedCarCategories: 'all', notes: 'Minibus transport included.', vehicle: { type: 'Minibus', capacity: 15, image: 'https://picsum.photos/seed/gc-minibus/400/280' } },
    availabilityLabels: ['Guided'],
    media: { images: ['https://picsum.photos/seed/gc-geyser/600/400'] },
    extrasByCategory: [],
    days: [
      { dayNumber: 1, date: '2025-04-14', city: 'Reykjavík', region: 'Capital Region',
        accommodations: [
          { id: 'rk-lights-gc',    name: 'Reykjavík Lights Hotel',   rating: 8.8, reviewCount: 1258, pricePerNight: 145, category: '3-star Hotel', checkIn: '15:00', checkOut: '12:00', location: 'City centre',       image: 'https://picsum.photos/seed/reykjavik-lights/400/280' },
          { id: 'kex-gc',          name: 'KEX Hostel',                rating: 8.6, reviewCount: 2613, pricePerNight: 89,  category: 'Hostel',       checkIn: '15:00', checkOut: '11:00', location: '1 km from centre',  image: 'https://picsum.photos/seed/kex-hostel/400/280' },
          { id: 'tingholt-gc',     name: 'CenterHotel Þingholt',     rating: 9.0, reviewCount: 876,  pricePerNight: 210, category: '4-star Hotel', checkIn: '16:00', checkOut: '12:00', location: 'Old town',          image: 'https://picsum.photos/seed/tingholt-hotel/400/280' },
        ],
        activities: [
          { id: 'rvk-walk-gc',     name: 'Reykjavík Welcome Walk',   rating: 8.6, reviewCount: 1900, pricePerPerson: 25,  duration: '1.5h', image: 'https://picsum.photos/seed/reykjavik-welcome/400/280',   description: 'A relaxed 1.5-hour orientation walk through the heart of Reykjavík with a local guide. Cover the main landmarks: Hallgrímskirkja, Tjörnin lake, the parliament, and the old harbour. Perfect for first-time visitors.' },
          { id: 'hallg-gc',        name: 'Hallgrímskirkja Tower',    rating: 8.5, reviewCount: 3200, pricePerPerson: 18,  duration: '1h',   image: 'https://picsum.photos/seed/hallgrimskirkja/400/280',     description: 'Ride the lift to the 74-metre tower of Iceland\'s most iconic church for sweeping 360° views across the city and out to sea.' },
          { id: 'blue-lagoon-gc',  name: 'Blue Lagoon Day Trip',     rating: 9.0, reviewCount: 4500, pricePerPerson: 65,  duration: '4h',   image: 'https://picsum.photos/seed/blue-lagoon-day/400/280',     description: 'Soak in the world-famous geothermal lagoon 45 minutes from Reykjavík. The milky-blue water is rich in silica and minerals. Comfort entry includes silica mud mask and algae mask.' },
        ] },
      { dayNumber: 2, date: '2025-04-15', city: 'Þingvellir', region: 'South Iceland',
        accommodations: [
          { id: 'thing-cabins',    name: 'Þingvellir Cabins',        rating: 8.3, reviewCount: 450,  pricePerNight: 135, category: 'Cabin',        checkIn: '14:00', checkOut: '11:00', location: 'Park edge',         image: 'https://picsum.photos/seed/thingvellir-cabins/400/280' },
          { id: 'ion-hotel',       name: 'ION Adventure Hotel',      rating: 9.1, reviewCount: 620,  pricePerNight: 295, category: 'Design Hotel', checkIn: '15:00', checkOut: '12:00', location: 'Þingvellir lava',   image: 'https://picsum.photos/seed/ion-adventure-hotel/400/280' },
        ],
        activities: [
          { id: 'thingvellir',     name: 'Þingvellir National Park', rating: 9.0, reviewCount: 6200, pricePerPerson: 20,  duration: '2h',   image: 'https://picsum.photos/seed/thingvellir/400/280',         description: 'Walk the rift valley where the Eurasian and North American tectonic plates meet. Site of the world\'s oldest parliament (930 AD) and a UNESCO World Heritage Site.' },
          { id: 'silfra-snorkel', name: 'Snorkelling in Silfra',    rating: 9.5, reviewCount: 2800, pricePerPerson: 120, duration: '3h',   image: 'https://picsum.photos/seed/silfra-snorkel/400/280',      description: 'Float between two tectonic plates in crystal-clear glacier meltwater with visibility over 100 metres. The water is 2–4°C — dry suits and all equipment provided. Minimum age 18, no diving experience required.' },
          { id: 'haifoss-hike',    name: 'Háifoss Waterfall Hike',  rating: 8.8, reviewCount: 1200, pricePerPerson: 30,  duration: '2.5h', image: 'https://picsum.photos/seed/haifoss-waterfall/400/280',   description: 'Hike to the edge of the canyon and look down on Háifoss, one of Iceland\'s tallest waterfalls at 122 metres. A moderate trail through lava fields with stunning views over the Þjórsá river valley.' },
        ] },
      { dayNumber: 3, date: '2025-04-16', city: 'Golden Circle', region: 'South Iceland',
        accommodations: [
          { id: 'gc-hotel',        name: 'Golden Circle Hotel',      rating: 8.5, reviewCount: 710,  pricePerNight: 150, category: 'Hotel',        checkIn: '15:00', checkOut: '11:00', location: 'Rural area',        image: 'https://picsum.photos/seed/gc-hotel/400/280' },
          { id: 'hestasport-gc',   name: 'Hestasport Farm Hotel',    rating: 8.4, reviewCount: 390,  pricePerNight: 125, category: 'Farm Hotel',   checkIn: '14:00', checkOut: '11:00', location: 'Horse farm',        image: 'https://picsum.photos/seed/hestasport-farm/400/280' },
        ],
        activities: [
          { id: 'geysir-gc',       name: 'Geysir Geothermal Area',  rating: 9.2, reviewCount: 8100, pricePerPerson: 0,   duration: '1.5h', image: 'https://picsum.photos/seed/geysir-area/400/280',         description: 'Watch Strokkur geyser erupt up to 40 metres every 5–8 minutes. The surrounding geothermal field has boiling mud pools, fumaroles, and vivid mineral deposits to explore.' },
          { id: 'gullfoss-gc',     name: 'Gullfoss Waterfall',      rating: 9.1, reviewCount: 7400, pricePerPerson: 0,   duration: '1h',   image: 'https://picsum.photos/seed/gullfoss/400/280',            description: 'Stand at the edge of the "Golden Falls" — a double-tier cascade plunging 32 metres into a kilometre-long gorge. On sunny days a rainbow hovers permanently in the spray.' },
          { id: 'atv-gc',          name: 'ATV Quad Bike Adventure', rating: 9.0, reviewCount: 1650, pricePerPerson: 85,  duration: '2h',   image: 'https://picsum.photos/seed/atv-quad-iceland/400/280',   description: 'Ride quad bikes through lava fields and river plains near the Golden Circle with a guide. No licence required. Helmets, goggles, and overalls provided.' },
          { id: 'kerid-gc',        name: 'Kerið Volcano Crater',    rating: 8.7, reviewCount: 3900, pricePerPerson: 8,   duration: '45min',image: 'https://picsum.photos/seed/kerid-crater/400/280',        description: 'Walk the rim of a 3,000-year-old volcanic crater lake. The vivid red scoria walls contrast with the teal water below. A short but striking stop on the Golden Circle route.' },
        ] },
      { dayNumber: 4, date: '2025-04-17', city: 'Flúðir', region: 'South Iceland',
        accommodations: [
          { id: 'fludir-gh',       name: 'Flúðir Guesthouse',       rating: 8.1, reviewCount: 380,  pricePerNight: 110, category: 'Guesthouse',   checkIn: '14:00', checkOut: '11:00', location: 'Village centre',    image: 'https://picsum.photos/seed/fludir-gh/400/280' },
          { id: 'hotel-selfoss',   name: 'Hotel Selfoss',            rating: 8.6, reviewCount: 820,  pricePerNight: 155, category: '3-star Hotel', checkIn: '15:00', checkOut: '12:00', location: 'Selfoss riverside',  image: 'https://picsum.photos/seed/hotel-selfoss/400/280' },
        ],
        activities: [
          { id: 'secret-lagoon-gc',name: 'Secret Lagoon',           rating: 8.9, reviewCount: 4100, pricePerPerson: 30,  duration: '2h',   image: 'https://picsum.photos/seed/secret-lagoon/400/280',       description: 'Soak in Iceland\'s oldest swimming pool (1891), a naturally heated geothermal pool surrounded by erupting mini geysers and lava fields. A quieter, more authentic alternative to the Blue Lagoon.' },
          { id: 'horse-gc',        name: 'Icelandic Horse Riding',  rating: 9.0, reviewCount: 2600, pricePerPerson: 75,  duration: '2h',   image: 'https://picsum.photos/seed/horse-riding/400/280',        description: 'Ride through lava fields and river valleys on a pure-bred Icelandic horse. Experience the famous tölt gait. Suitable for all levels including beginners. Helmet and boots provided.' },
          { id: 'fridheimar-gc',   name: 'Friðheimar Greenhouse',   rating: 9.1, reviewCount: 2100, pricePerPerson: 45,  duration: '1.5h', image: 'https://picsum.photos/seed/fridheimar-greenhouse/400/280',description: 'Tour a geothermal greenhouse where tomatoes grow year-round under the midnight sun, then dine at the famous tomato soup restaurant inside. A unique and delicious farm-to-table experience.' },
        ] },
      { dayNumber: 5, date: '2025-04-18', city: 'Reykjavík', region: 'Capital Region', accommodations: [],
        activities: [
          { id: 'rvk-departure-gc',name: 'Reykjavík Departure Transfer', rating: 8.5, reviewCount: 1200, pricePerPerson: 30, duration: '1h', image: 'https://picsum.photos/seed/rvk-departure/400/280', description: 'Comfortable shared transfer from your Reykjavík hotel to Keflavík International Airport. Luggage assistance included.' },
          { id: 'laugavegur-gc',   name: 'Laugavegur Shopping Walk', rating: 8.3, reviewCount: 1800, pricePerPerson: 0,  duration: '2h', image: 'https://picsum.photos/seed/laugavegur-shopping/400/280', description: 'Use your final morning to stroll Laugavegur, Reykjavík\'s famous main shopping street. Browse Icelandic wool jumpers, design boutiques, and street-food stalls before heading to the airport.' },
        ] },
    ],
  },

  'northern-lights': {
    id: 'northern-lights',
    title: '3-day Northern Lights Package',
    image: 'https://picsum.photos/seed/northern-lights-iceland/1200/500',
    tourType: 'guided',
    startLocation: 'Reykjavík, Iceland',
    totalDays: 3,
    priceFrom: 380,
    season: { startDate: '2025-09-15', endDate: '2026-03-31' },
    description: "Chase the aurora borealis with expert guides, then explore an ice cave inside Vatnajökull glacier.",
    highlights: ['Expert guides find the darkest aurora spots', 'Ice cave inside Vatnajökull', 'Small group — max 12'],
    included: ['2 nights accommodation', 'All transportation', 'Professional guide'],
    extraIncluded: [],
    notIncluded: ['Flights', 'Meals', 'Travel insurance'],
    bringWithYou: ['Very warm jacket', 'Thermals', 'Gloves & hat'],
    conditions: { cancellation: 'Aurora sightings not guaranteed. No refund for weather issues.', importantInfo: 'Ice cave tours depend on glacier safety.', terms: '' },
    travelStyle: ['Adventure'], wayOfTravel: ['Small group'], interests: ['Northern Lights', 'Ice Caves'], regionTags: ['South Iceland'],
    transport: { allowCarRental: false, advisedAllDays: false, allowedCarCategories: 'all', notes: 'Super jeep transport included.', vehicle: { type: 'Super Jeep', capacity: 8, image: 'https://picsum.photos/seed/superjeep-highland/400/280' } },
    availabilityLabels: ['Guided'],
    media: { images: ['https://picsum.photos/seed/nl-aurora/600/400', 'https://picsum.photos/seed/nl-icecave/600/400'] },
    extrasByCategory: [],
    days: [
      { dayNumber: 1, date: '2025-10-04', city: 'Reykjavík', region: 'Capital Region',
        accommodations: [
          { id: 'rk-lights-nl',  name: 'Reykjavík Lights Hotel',  rating: 8.8, reviewCount: 1258, pricePerNight: 145, category: '3-star Hotel', checkIn: '15:00', checkOut: '12:00', location: 'City centre',      image: 'https://picsum.photos/seed/reykjavik-lights/400/280' },
          { id: 'storm-hotel-nl',name: 'Storm Hotel',              rating: 8.9, reviewCount: 740,  pricePerNight: 185, category: '4-star Hotel', checkIn: '15:00', checkOut: '12:00', location: 'Laugavegur',       image: 'https://picsum.photos/seed/storm-hotel-rvk/400/280' },
          { id: 'kex-nl',        name: 'KEX Hostel',               rating: 8.6, reviewCount: 2613, pricePerNight: 89,  category: 'Hostel',       checkIn: '15:00', checkOut: '11:00', location: '1 km from centre', image: 'https://picsum.photos/seed/kex-hostel/400/280' },
        ],
        activities: [
          { id: 'aurora-hunt',   name: 'Evening Aurora Hunt',      rating: 9.0, reviewCount: 3400, pricePerPerson: 65,  duration: '3h',   image: 'https://picsum.photos/seed/aurora-hunt/400/280',          description: 'Small-group minibus tour venturing beyond the city light pollution to find the northern lights. Expert guides use live cloud forecasts and solar activity data to find the best spot. Photography tips included.' },
          { id: 'perlan-nl',     name: 'Perlan Museum',            rating: 8.8, reviewCount: 5200, pricePerPerson: 35,  duration: '2h',   image: 'https://picsum.photos/seed/perlan-museum/400/280',        description: 'Explore Iceland\'s most impressive museum, built on top of six geothermal hot water tanks. The aurora exhibition, real indoor ice cave, and panoramic viewing deck are unmissable. Catch the sunset from the glass dome.' },
          { id: 'aurora-photo',  name: 'Aurora Photography Workshop', rating: 9.1, reviewCount: 1800, pricePerPerson: 95, duration: '4h', image: 'https://picsum.photos/seed/aurora-photography/400/280',  description: 'Learn long-exposure night photography techniques from a professional photographer while chasing the northern lights. Tripod use, camera settings, and post-processing basics covered. All skill levels welcome.' },
        ] },
      { dayNumber: 2, date: '2025-10-05', city: 'Jökulsárlón', region: 'South Iceland',
        accommodations: [
          { id: 'south-gh-nl',   name: 'South Iceland Guesthouse',rating: 8.0, reviewCount: 560,  pricePerNight: 110, category: 'Guesthouse',   checkIn: '14:00', checkOut: '11:00', location: 'Rural area',       image: 'https://picsum.photos/seed/south-gh/400/280' },
          { id: 'fossil-gl-nl',  name: 'Fosshotel Glacier Lagoon', rating: 8.8, reviewCount: 890,  pricePerNight: 220, category: '3-star Hotel', checkIn: '15:00', checkOut: '12:00', location: 'Near lagoon',      image: 'https://picsum.photos/seed/fosshotel-lagoon/400/280' },
        ],
        activities: [
          { id: 'ice-cave-nl',   name: 'Vatnajökull Ice Cave',     rating: 9.4, reviewCount: 4800, pricePerPerson: 95,  duration: '2h',   image: 'https://picsum.photos/seed/ice-cave/400/280',             description: 'Enter a natural ice cave beneath Europe\'s largest glacier. The ceiling glows electric blue as light filters through ancient compressed ice. Your certified guide explains the glacial geology. Crampons and helmets provided.' },
          { id: 'lagoon-nl',     name: 'Jökulsárlón Glacier Lagoon',rating: 9.2, reviewCount: 5600, pricePerPerson: 12, duration: '1h',   image: 'https://picsum.photos/seed/jokulsarlon-lagoon/400/280',   description: 'Walk the edge of the glacial lagoon and watch enormous icebergs slowly drift past, calved from the Breiðamerkurjökull glacier. Seals often laze on the ice floes.' },
          { id: 'superjeep-nl',  name: 'Super Jeep Highland Tour', rating: 9.3, reviewCount: 1400, pricePerPerson: 130, duration: '4h',   image: 'https://picsum.photos/seed/superjeep-highland/400/280',  description: 'Venture deep into the volcanic highlands on a custom super jeep with massive suspension. Cross glacial rivers, explore lava fields, and reach landscapes no normal vehicle can access.' },
        ] },
      { dayNumber: 3, date: '2025-10-06', city: 'Reykjavík', region: 'Capital Region', accommodations: [],
        activities: [
          { id: 'nl-departure',  name: 'Reykjavík Departure Transfer', rating: 8.5, reviewCount: 1200, pricePerPerson: 30, duration: '1h', image: 'https://picsum.photos/seed/rvk-departure/400/280', description: 'Comfortable shared transfer from your Reykjavík hotel to Keflavík International Airport. Luggage assistance included.' },
          { id: 'rvk-flea-nl',   name: 'Kolaportið Flea Market',  rating: 8.0, reviewCount: 2100, pricePerPerson: 0,   duration: '1.5h', image: 'https://picsum.photos/seed/kolaportid-market/400/280',   description: 'Browse Reykjavík\'s famous weekend flea market at the old harbour. Pick up Icelandic wool goods, vintage clothes, local snacks, and quirky souvenirs before heading to the airport.' },
        ] },
    ],
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
      <ul className="space-y-2">{visible.map((item, i) => renderItem(item, i))}</ul>
      {items.length > limit && (
        <button onClick={() => setExpanded(!expanded)} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
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
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 px-4 text-left font-medium text-gray-900 hover:text-blue-600">
        <span>{title}</span>
        <span className="text-gray-400 text-sm ml-4">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="pb-4 px-4 text-sm text-gray-700 leading-relaxed">{children}</div>}
    </div>
  );
}

// ============================================================================
// HERO
// ============================================================================

function TourHero({ tour }) {
  const isGuided = tour.tourType === 'guided';
  const nights = tour.totalDays - 1;
  const formatDate = (d) => {
    if (!d) return '';
    const [, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m, 10) - 1]} ${parseInt(day, 10)}`;
  };
  return (
    <div>
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
      </div>
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isGuided ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {isGuided ? 'Guided tour' : 'Self-drive'}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {tour.totalDays} days / {nights} nights
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
    </div>
  );
}

// ============================================================================
// TOUR BASICS
// ============================================================================

function TourBasics({ tour }) {
  const { tourType, startLocation, totalDays, description, included = [], extraIncluded = [],
    travelStyle = [], wayOfTravel = [], interests = [], regionTags = [] } = tour;
  const prefGroups = [
    { label: 'Travel Style',  items: travelStyle,  color: 'bg-blue-100 text-blue-700' },
    { label: 'Way of Travel', items: wayOfTravel,  color: 'bg-purple-100 text-purple-700' },
    { label: 'Interests',     items: interests,    color: 'bg-green-100 text-green-700' },
    { label: 'Regions',       items: regionTags,   color: 'bg-orange-100 text-orange-700' },
  ].filter((g) => g.items.length > 0);
  if (!tourType) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Description</h2>
        <div className="mb-8">
        {description && <p className="text-gray-800 pt-2 border-t border-gray-100 leading-relaxed">{description}</p>}
        </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
        {/* <div className="flex items-center gap-3">
          <span className="text-gray-500 w-16 shrink-0">Tour type</span>
          <span className={`px-3 py-1 rounded-full font-medium ${tourType === 'guided' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {tourType === 'guided' ? 'Guided' : 'Self-drive'}
          </span>
        </div> */}
        {/* {tourType === 'guided' && startLocation && (
          <div className="flex items-center gap-3">
            <span className="text-gray-500 w-32 shrink-0">Departs from</span>
            <span className="font-medium text-gray-900">{startLocation}</span>
          </div>
        )}
        {tourType === 'self_drive' && (
          <div className="bg-blue-50 border border-blue-100 rounded p-3 text-blue-800">
            Self-drive tour — you make your own way to the first location and follow the provided route book at your own pace.
          </div>
        )}
        {totalDays && (
          <div className="flex items-center gap-3">
            <span className="text-gray-500 w-16 shrink-0">Duration</span>
            <span className="font-medium text-gray-900">{totalDays} days / {totalDays - 1} nights</span>
          </div>
        )} */}
        {/* {description && <p className="text-gray-600 pt-2 border-t border-gray-100 leading-relaxed">{description}</p>} */}
        {(included.length > 0 || prefGroups.length > 0) && (
          <div className="border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Included */}
            {included.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-2 text-sm">Included</p>
                <ul className="space-y-1">
                  {included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold mt-0.5 shrink-0">✓</span>{item}
                    </li>
                  ))}
                </ul>
                {extraIncluded.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-900 mb-2 text-sm">Pickup & dropoff</p>
                  <div className="mt-3 pl-3 border-l-2 border-dashed border-gray-300">
                    {extraIncluded.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                        <span className="text-green-500 shrink-0">✓</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
            )}
            {/* Preferences */}
            {prefGroups.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-2 text-sm opacity-0">Summary (filtering only?)</p>
                <div className="space-y-2">
                  {prefGroups.map((group) => (
                    <div key={group.label} className="flex items-start gap-2">
                      <span className="text-sm text-gray-500 w-24 shrink-0 pt-0.5">{group.label}</span>
                      <div className="flex flex-wrap gap-1">
                        {group.items.map((item) => (
                          <span key={item} className={`px-2 py-0.5 rounded-full text-xs font-medium ${group.color}`}>{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// TOUR DESCRIPTION
// ============================================================================

function TourDescription({ tour }) {
  const { included = [], extraIncluded = [] } = tour;
  if (!tour.description && !included.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Description</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        {tour.description && (
          <p className="text-gray-700 text-sm leading-relaxed mb-5">{tour.description}</p>
        )}
        {included.length > 0 && (
          <>
            <h3 className="font-semibold text-gray-900 mb-2">Included</h3>
            <ShowMore items={included} limit={6} renderItem={(item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 font-bold mt-0.5 shrink-0">✓</span>{item}
              </li>
            )} />
            {extraIncluded.length > 0 && (
              <div className="mt-3 pl-3 border-l-2 border-dashed border-gray-300">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Also included</p>
                {extraIncluded.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                    <span className="text-green-500 shrink-0">✓</span>{item}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// TOUR PREFERENCES
// ============================================================================

function TourPreferences({ tour }) {
  const { travelStyle = [], wayOfTravel = [], interests = [], regionTags = [] } = tour;
  const isEmpty = !travelStyle.length && !wayOfTravel.length && !interests.length && !regionTags.length;
  if (isEmpty) return null;
  const groups = [
    { label: 'Travel Style',  items: travelStyle,  color: 'bg-blue-100 text-blue-700' },
    { label: 'Way of Travel', items: wayOfTravel,  color: 'bg-purple-100 text-purple-700' },
    { label: 'Interests',     items: interests,    color: 'bg-green-100 text-green-700' },
    { label: 'Regions',       items: regionTags,   color: 'bg-orange-100 text-orange-700' },
  ].filter((g) => g.items.length > 0);
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Preferences</h2>
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.label} className="flex items-start gap-3">
            <span className="text-sm text-gray-500 w-28 shrink-0 pt-1">{group.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className={`px-3 py-1 rounded-full text-sm font-medium ${group.color}`}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// DAY-BY-DAY INTERACTIVE SECTIONS
// ============================================================================

function AccommodationCard({ hotel, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`flex-shrink-0 w-52 rounded-lg border-2 overflow-hidden cursor-pointer transition-all bg-white ${
        selected
          ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
          : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
      }`}
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        {/* Rating badge */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-95 rounded px-2 py-1 flex items-center gap-1.5 shadow-sm">
          <span className="text-sm font-bold text-gray-900">{hotel.rating}</span>
          <span className="text-xs text-gray-500">{hotel.reviewCount.toLocaleString()} reviews</span>
        </div>
        {/* Learn more */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 bg-white text-xs font-medium px-2.5 py-1 rounded shadow-sm hover:bg-gray-50"
        >
          Learn more
        </button>
        {/* Category badge */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
          {hotel.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 text-sm mb-3 text-center">{hotel.name}</h4>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs mb-3">
          <div>
            <p className="text-gray-400 mb-0.5">Check-in / out</p>
            <p className="font-medium text-gray-700">{hotel.checkIn} / {hotel.checkOut}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Location</p>
            <p className="font-medium text-gray-700">{hotel.location}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">${hotel.pricePerNight}</span>
            <span className="text-gray-400"> / night</span>
          </span>
          {/* Radio indicator */}
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
          }`}>
            {selected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityModal({ activity, onClose }) {
  if (!activity) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-48">
          <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-gray-700 hover:bg-gray-100 text-lg leading-none"
          >
            ×
          </button>
          <div className="absolute top-3 left-3 bg-white bg-opacity-95 rounded px-2 py-1 flex items-center gap-1.5 shadow-sm">
            <span className="text-sm font-bold text-gray-900">{activity.rating}</span>
            <span className="text-xs text-gray-500">{activity.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>
        {/* Body */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{activity.name}</h3>
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5">{activity.duration}</span>
            <span className="font-bold text-gray-900">${activity.pricePerPerson}<span className="font-normal text-gray-500">/person</span></span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity, selected, onToggle, onLearnMore }) {
  return (
    <div
      onClick={onToggle}
      className={`flex-shrink-0 w-52 rounded-lg border-2 overflow-hidden cursor-pointer transition-all bg-white ${
        selected
          ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
          : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
      }`}
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
        {/* Rating badge */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-95 rounded px-2 py-1 flex items-center gap-1.5 shadow-sm">
          <span className="text-sm font-bold text-gray-900">{activity.rating}</span>
          <span className="text-xs text-gray-500">{activity.reviewCount.toLocaleString()} reviews</span>
        </div>
        {/* Learn more */}
        <button
          onClick={(e) => { e.stopPropagation(); onLearnMore?.(activity); }}
          className="absolute top-2 right-2 bg-white text-xs font-medium px-2.5 py-1 rounded shadow-sm hover:bg-gray-50"
        >
          Learn more
        </button>
        {/* Checkbox indicator */}
        <div className={`absolute bottom-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          selected ? 'border-blue-500 bg-blue-500' : 'border-white bg-white bg-opacity-80'
        }`}>
          {selected && <span className="text-white text-xs font-bold leading-none">✓</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 text-sm mb-2">{activity.name}</h4>
        <div className="flex items-center justify-between text-xs">
          <span className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">{activity.duration}</span>
          <span className="font-bold text-gray-900">${activity.pricePerPerson}<span className="font-normal text-gray-400">/person</span></span>
        </div>
      </div>
    </div>
  );
}

function TourDays({ days, daySelections, onSelectAccommodation, onToggleActivity }) {
  if (!days?.length) return null;
  const [modalActivity, setModalActivity] = useState(null);

  const formatDayDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = d.toLocaleDateString('en-US', { month: 'long' });
    return `${weekday}, ${monthName} ${day}`;
  };

  const lastDayNumber = days[days.length - 1].dayNumber;

  return (
    <section className="mt-10">
      <ActivityModal activity={modalActivity} onClose={() => setModalActivity(null)} />
      <div className="space-y-10">
        {days.map((day) => {
          const isLastDay = day.dayNumber === lastDayNumber;
          const sel = daySelections[day.dayNumber] || { accommodation: null, activities: [] };

          return (
            <div key={day.dayNumber} id={`day-${day.dayNumber}`} className="border-t border-gray-100 pt-8 first:border-t-0 first:pt-0">
              {/* Day header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[10px] font-semibold uppercase leading-none mb-0.5">Day</span>
                  <span className="text-xl font-bold leading-none">{day.dayNumber}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{formatDayDate(day.date)}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span>📍 {day.city}</span>
                    <span>·</span>
                    <span>{day.region}</span>
                  </div>
                </div>
              </div>

              {/* Accommodation — skip on last day */}
              {!isLastDay && day.accommodations?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-orange-600 mb-3">
                    Accommodation on day {day.dayNumber}
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
                    {day.accommodations.map((hotel) => (
                      <AccommodationCard
                        key={hotel.id}
                        hotel={hotel}
                        selected={sel.accommodation?.id === hotel.id}
                        onSelect={() => onSelectAccommodation(day.dayNumber, hotel)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {day.activities?.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-orange-600 mb-3">
                    Tours on day {day.dayNumber}
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
                    {day.activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        selected={sel.activities.some((a) => a.id === activity.id)}
                        onToggle={() => onToggleActivity(day.dayNumber, activity)}
                        onLearnMore={setModalActivity}
                      />
                    ))}
                  </div>
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
// TRANSPORT
// ============================================================================

function TourTransport({ transport }) {
  if (!transport) return null;
  const { allowCarRental, advisedAllDays, allowedCarCategories, notes } = transport;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Transport</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Car rental available</span>
          {allowCarRental ? <span className="text-green-600 font-medium">✓ Yes</span> : <span className="text-red-500 font-medium">✗ No</span>}
        </div>
        {!allowCarRental && (
          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-600">
            Car rental is not available for this tour. Transport is arranged as part of the package.
          </div>
        )}
        {allowCarRental && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Advised for all days</span>
              {advisedAllDays ? <span className="text-green-600 font-medium">✓ Yes</span> : <span className="text-yellow-600 font-medium">⚠ Partial</span>}
            </div>
            {!advisedAllDays && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800">
                Car rental is not advised for all days. Check the itinerary for days where transport is included.
              </div>
            )}
            <div>
              <p className="text-gray-500 mb-1.5">Allowed vehicle categories</p>
              {allowedCarCategories === 'all' ? (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">All categories</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(allowedCarCategories) ? allowedCarCategories : [allowedCarCategories]).map((cat) => (
                    <span key={cat} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{cat}</span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {notes && <p className="text-gray-500 border-t border-gray-100 pt-3">{notes}</p>}
      </div>
    </section>
  );
}

// ============================================================================
// BRING WITH YOU
// ============================================================================

// ============================================================================
// CAR RENTAL FORM (self-drive tours only)
// ============================================================================

const CAR_RENTAL_LOCATIONS = ['Keflavík Airport', 'Reykjavík City', 'Akureyri'];

function TourCarRentalForm({ values, onChange }) {
  const { pickupLocation, pickupDate, dropoffDate, pickupTime, dropoffTime, driverAge, flightNumber } = values;

  const timeOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Car Rental Details</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up & drop-off location</label>
          <select
            value={pickupLocation}
            onChange={(e) => onChange('pickupLocation', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CAR_RENTAL_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>✈️ {loc}</option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => onChange('pickupDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off date</label>
            <input
              type="date"
              value={dropoffDate}
              onChange={(e) => onChange('dropoffDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up time</label>
            <select
              value={pickupTime}
              onChange={(e) => onChange('pickupTime', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off time</label>
            <select
              value={dropoffTime}
              onChange={(e) => onChange('dropoffTime', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Driver age */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver's age</label>
            <select
              value={driverAge}
              onChange={(e) => onChange('driverAge', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="20-25">20 – 25</option>
              <option value="25-30">25 – 30</option>
              <option value="30-65">30 – 65</option>
              <option value="65+">65+</option>
            </select>
          </div>
        </div>

        {/* Flight number */}
        <div>
          <label className="block text-sm font-medium text-blue-600 mb-2">Add arrival flight number</label>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => onChange('flightNumber', e.target.value)}
            placeholder="Flight info ensures timely pick-up"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </section>
  );
}

function TourBringWithYou({ items }) {
  if (!items?.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Bring With You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded p-2.5">
            <span className="w-4 h-4 border-2 border-gray-300 rounded-sm shrink-0 inline-block" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// CONDITIONS
// ============================================================================

function TourConditions({ conditions }) {
  if (!conditions) return null;
  const { cancellation, importantInfo, terms } = conditions;
  if (!cancellation && !importantInfo && !terms) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Conditions</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
        {cancellation && <Accordion title="Cancellation policy" defaultOpen><p>{cancellation}</p></Accordion>}
        {importantInfo && <Accordion title="Important information"><p>{importantInfo}</p></Accordion>}
        {terms && <Accordion title="Terms & Conditions"><p>{terms}</p></Accordion>}
      </div>
    </section>
  );
}

// ============================================================================
// MEDIA GALLERY
// ============================================================================

function TourMedia({ media }) {
  const [lightbox, setLightbox] = useState(null);
  if (!media?.images?.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {media.images.map((src, i) => (
          <button key={i} onClick={() => setLightbox(src)} className="aspect-square overflow-hidden rounded-md border border-gray-200 hover:opacity-80 transition-opacity">
            <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {lightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300">✕</button>
          <img src={lightbox} alt="Full view" className="max-w-full max-h-full rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

// ============================================================================
// OPTIONAL EXTRAS
// ============================================================================

function TourExtras({ extrasByCategory }) {
  if (!extrasByCategory?.length) return null;
  const unitLabel = (u) => u === 'per_person' ? 'per person' : u === 'per_day' ? 'per day' : 'per booking';
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Optional Extras</h2>
      <div className="space-y-6">
        {extrasByCategory.map((cat) => (
          <div key={cat.category}>
            <h3 className="font-semibold text-gray-700 mb-2">{cat.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.products.map((p) => (
                <div key={p.title} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">{p.title}</span>
                    <span className="text-sm font-bold text-gray-900 shrink-0">${p.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{p.description}</p>
                  <span className="text-xs text-gray-400">{unitLabel(p.pricingUnit)}</span>
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
// BOOKING PANEL — SELECTION SUMMARY
// ============================================================================

function PanelSelectionSummary({ days, daySelections }) {
  // Start collapsed; auto-expand when the user makes a new selection
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const prevHotelsRef = useRef(0);
  const prevActivitiesRef = useRef(0);

  useEffect(() => {
    if (!days?.length) return;
    const lastDayNum = days[days.length - 1].dayNumber;
    const hDays = days.filter((d) => d.dayNumber !== lastDayNum);
    const currHotels = hDays.filter((d) => daySelections[d.dayNumber]?.accommodation).length;
    const currActivities = days.reduce((sum, d) => sum + (daySelections[d.dayNumber]?.activities?.length || 0), 0);
    if (currHotels > prevHotelsRef.current) setHotelsOpen(true);
    if (currActivities > prevActivitiesRef.current) setActivitiesOpen(true);
    prevHotelsRef.current = currHotels;
    prevActivitiesRef.current = currActivities;
  }, [daySelections, days]);

  if (!days?.length) return null;

  const lastDayNumber = days[days.length - 1].dayNumber;

  const fmtShort = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const hotelDays = days.filter((d) => d.dayNumber !== lastDayNumber);
  const selectedHotelsCount = hotelDays.filter((d) => daySelections[d.dayNumber]?.accommodation).length;
  const allActivities = days.reduce((sum, d) => sum + (daySelections[d.dayNumber]?.activities?.length || 0), 0);
  const activityDaysWithData = days.filter((d) => (daySelections[d.dayNumber]?.activities?.length || 0) > 0);

  const GroupHeader = ({ label, count, open, onToggle }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 text-left"
    >
      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
        {label}
        {count > 0 && (
          <span className="ml-1.5 text-blue-600 normal-case font-normal tracking-normal">
            {label === 'Hotels' ? `${selectedHotelsCount}/${hotelDays.length}` : `${count}`}
          </span>
        )}
      </span>
      <span className="text-gray-400 text-[10px]">{open ? '▲' : '▼'}</span>
    </button>
  );

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden text-sm">
      {/* ── Hotels ── */}
      <GroupHeader label="Hotels" count={selectedHotelsCount} open={hotelsOpen} onToggle={() => setHotelsOpen(!hotelsOpen)} />
      {hotelsOpen && (
        <div className="divide-y divide-gray-100">
          {hotelDays.map((day) => {
            const hotel = daySelections[day.dayNumber]?.accommodation;
            return (
              <div key={day.dayNumber} className="px-3 py-2">
                <div className="text-[12px] font-semibold text-gray-700 mb-0.5">
                  Day {day.dayNumber} · {fmtShort(day.date)}
                </div>
                {hotel ? (
                  <div className="flex items-baseline gap-1 leading-tight">
                    <span className="font-medium text-gray-800 truncate">{hotel.name}</span>
                    <span className="text-gray-500 shrink-0">· included</span>
                  </div>
                ) : (
                  <div className="text-[12px] text-gray-400 italic">Not selected</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-gray-200" />

      {/* ── Activities ── */}
      <GroupHeader label="Activities" count={allActivities} open={activitiesOpen} onToggle={() => setActivitiesOpen(!activitiesOpen)} />
      {activitiesOpen && (
        <div className="divide-y divide-gray-100">
          {days.map((day) => {
            const acts = daySelections[day.dayNumber]?.activities || [];
            return (
              <div key={day.dayNumber} className="px-3 py-2 space-y-0.5">
                <div className="text-[12px] font-semibold text-gray-500 mb-1">
                  Day {day.dayNumber} · {fmtShort(day.date)}
                </div>
                {acts.length > 0 ? (
                  <>
                    <div className="text-[12px] text-gray-500 mb-1">📍 {day.city}</div>
                    {acts.map((act) => (
                      <div key={act.id} className="text-gray-800 leading-tight truncate">{act.name}</div>
                    ))}
                  </>
                ) : (
                  <div className="text-gray-400 italic">Not selected</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BOOKING PANEL  (right column, sticky)
// ============================================================================

function TourBookingPanel({ tour, participants, setParticipants, onAddToCart, added, isEditing, daySelections }) {
  const [saved, setSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const total = tour.priceFrom * participants;
  return (
    <div className="sticky top-6">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <p className="text-sm text-gray-500 mb-1">from</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">
          ${tour.priceFrom}<span className="text-base font-normal text-gray-500"> / person</span>
        </p>
        <p className="text-xs text-gray-400 mb-5">{tour.totalDays} days · {tour.totalDays - 1} nights</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-700">Dates</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-700">Travelers</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setParticipants(Math.max(1, participants - 1))} className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg leading-none">−</button>
            <span className="w-6 text-center font-medium text-gray-900">{participants}</span>
            <button onClick={() => setParticipants(participants + 1)} className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg leading-none">+</button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-4 text-sm">
          <span className="text-gray-600">{participants} × ${tour.priceFrom}</span>
          <span className="font-bold text-gray-900 text-lg">${total}</span>
        </div>

        <button
          onClick={onAddToCart}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {added ? '✓ Updated' : isEditing ? `Update Cart — $${total}` : `Add to Cart — $${total}`}
        </button>

        <PanelSelectionSummary days={tour.days} daySelections={daySelections} />
      </div>

      {tour.tourType === 'self_drive' && tour.transport?.recommendedCar && (() => {
        const car = tour.transport.recommendedCar;
        return (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">Car Rental</p>
            <div className="flex gap-3 items-center">
              <div className="w-20 h-14 rounded overflow-hidden shrink-0 bg-gray-100">
                <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-700 rounded font-medium">{car.type}</span>
                  <span className="text-xs text-gray-400">{car.transmission}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{car.make} {car.model}</p>
                <p className="text-xs text-gray-500 mt-0.5">${car.pricePerDay} / day</p>
              </div>
            </div>
            {tour.transport.notes && (
              <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded p-2 leading-relaxed">{tour.transport.notes}</p>
            )}
          </div>
        );
      })()}

      {tour.tourType === 'guided' && tour.transport?.vehicle && (() => {
        const v = tour.transport.vehicle;
        return (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">Transport</p>
            <div className="flex gap-3 items-center">
              <div className="w-20 h-14 rounded overflow-hidden shrink-0 bg-gray-100">
                <img src={v.image} alt={v.type} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-medium">{v.type}</span>
                  <span className="text-xs text-gray-400">Included</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">All transport included</p>
                <p className="text-xs text-gray-500 mt-0.5">Up to {v.capacity} passengers</p>
              </div>
            </div>
            {tour.transport.notes && (
              <p className="mt-3 text-xs text-blue-700 bg-blue-50 rounded p-2 leading-relaxed">{tour.transport.notes}</p>
            )}
          </div>
        );
      })()}

      {/* {tour.availabilityLabels?.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Available as</p>
          <div className="flex flex-wrap gap-1.5">
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Available as</p>
          <div className="flex flex-wrap gap-1.5">
            {tour.availabilityLabels.map((label) => (
              <span key={label} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{label}</span>
            ))}
          </div>
        </div>
            {tour.availabilityLabels.map((label) => (
              <span key={label} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{label}</span>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default function TourDetail() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, updateCartItem, cartItems } = useCart();

  const editItemId = searchParams.get('edit');
  const existingItem = editItemId ? cartItems.find((item) => item.id === editItemId) : null;
  const isEditing = !!existingItem;

  const tour = TOUR_DATA[tourId];

  const [added, setAdded] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [daySelections, setDaySelections] = useState({});
  const [carRental, setCarRental] = useState({
    pickupLocation: CAR_RENTAL_LOCATIONS[0],
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '13:00',
    dropoffTime: '13:00',
    driverAge: '30-65',
    flightNumber: '',
  });

  // Initialise day selections when tour loads
  useEffect(() => {
    if (tour) {
      const initial = {};
      (tour.days || []).forEach((day) => {
        initial[day.dayNumber] = { accommodation: null, activities: [] };
      });
      setDaySelections(initial);
    }
  }, [tour?.id]);

  // Load from existing cart item (edit mode)
  useEffect(() => {
    if (existingItem) {
      setParticipants(existingItem.participants || 1);
      if (existingItem.daySelections) {
        setDaySelections(existingItem.daySelections);
      }
      if (existingItem.carRental) {
        setCarRental(existingItem.carRental);
      }
    }
  }, [existingItem]);

  // Scroll to day 1 when arriving in edit mode
  useEffect(() => {
    if (isEditing) {
      const el = document.getElementById('day-1');
      if (el) {
        // Offset accounts for the sticky Layout header (~56px) + breathing room
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 150);
      }
    }
  }, [isEditing]);

  const handleSelectAccommodation = (dayNumber, hotel) => {
    setDaySelections((prev) => ({
      ...prev,
      [dayNumber]: { ...prev[dayNumber], accommodation: hotel },
    }));
  };

  const handleToggleActivity = (dayNumber, activity) => {
    setDaySelections((prev) => {
      const current = prev[dayNumber]?.activities || [];
      const exists = current.some((a) => a.id === activity.id);
      return {
        ...prev,
        [dayNumber]: {
          ...prev[dayNumber],
          activities: exists
            ? current.filter((a) => a.id !== activity.id)
            : [...current, activity],
        },
      };
    });
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: isEditing ? existingItem.id : `tour-${Date.now()}`,
      type: 'tourPackage',
      tourId,
      name: tour.title,
      image: tour.image,
      shortDescription: tour.highlights?.[0] || '',
      tourType: tour.tourType,
      days: tour.totalDays,
      participants,
      pricePerPerson: tour.priceFrom,
      startDate: tour.days?.[0]?.date || tour.season?.startDate || '',
      endDate: tour.days?.[tour.days.length - 1]?.date || '',
      daySelections,
      // Flatten selected activities for requirements engine compatibility
      includedActivities: Object.values(daySelections)
        .flatMap((ds) => ds.activities || [])
        .map((a) => ({ name: a.name, requiresShoeSize: false })),
      ...(tour.tourType === 'self_drive' ? { carRental } : {}),
      needsInfo: true,
    };

    if (isEditing) {
      updateCartItem(existingItem.id, cartItem);
      navigate('/checkout');
    } else {
      addToCart(cartItem);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h1>
          <Link to="/tours" className="text-blue-600 hover:text-blue-700">← Back to Tours</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link to="/tours" className="text-gray-500 hover:text-gray-700">Tours</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">{tour.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2">
          <TourHero tour={tour} />
          <TourBasics tour={tour} />

          {/* Day-by-day interactive selection */}
          <TourDays
            days={tour.days}
            daySelections={daySelections}
            onSelectAccommodation={handleSelectAccommodation}
            onToggleActivity={handleToggleActivity}
          />

          {tour.tourType !== 'self_drive' && <TourTransport transport={tour.transport} />}

          {tour.tourType === 'self_drive' && (
            <TourCarRentalForm
              values={carRental}
              onChange={(field, value) => setCarRental((prev) => ({ ...prev, [field]: value }))}
            />
          )}

          <TourBringWithYou items={tour.bringWithYou} />
          <TourConditions conditions={tour.conditions} />
          <TourMedia media={tour.media} />
          <TourExtras extrasByCategory={tour.extrasByCategory} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <TourBookingPanel
            tour={tour}
            participants={participants}
            setParticipants={setParticipants}
            onAddToCart={handleAddToCart}
            added={added}
            isEditing={isEditing}
            daySelections={daySelections}
          />
        </div>
      </div>
    </div>
  );
}
