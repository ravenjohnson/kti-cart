import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../CartContext';

// ============================================================================
// ACTIVITY DATA
// ============================================================================

export const ACTIVITY_DATA = {
  'glacier-hike-solheimajokull': {
    id: 'glacier-hike-solheimajokull',
    name: 'HEY - Glacier Hike on Sólheimajökull Glacier',
    operator: 'HEY',
    location: 'Sólheimajáleiguvegur, Vík',
    region: 'South Iceland',
    duration: '4 hours',
    difficulty: 'MODERATE',
    shortDescription: 'A thrilling 4-hour glacier hike on Sólheimajökull, designed for medium to hard difficulty adventure seekers.',
    description: 'Embark on a thrilling 4-hour glacier hike on the Sólheimajökull Glacier in Iceland, designed for those seeking a medium to hard difficulty adventure. This guided trek leads you across stunning ice formations, deep crevasses, and towering ridges, offering up-close views of the glacier\'s dynamic landscape. Equipped with crampons and ice axes, you\'ll be navigating icy terrain, ascending moderate inclines, and carefully traversing uneven surfaces. Ideal for those with a reasonable fitness level, this hike provides an unforgettable experience amid Iceland\'s pristine, icy wilderness.',
    price: 115,
    minAge: 12,
    requiresShoeSize: true,
    experienceType: 'Day tour or activity',
    meetingPoint: 'Sólheimajáleiguvegur, Vík',
    categories: ['Walking tour', 'Adventure', 'Nature', 'Climbing', 'Glacier hiking', 'Ice climbing', 'Family friendly', 'Eco friendly', 'Outdoor'],
    inclusions: [
      'National park entrance fee',
      'Tip or gratuity',
      'Parking fees',
      'Certified glacier guide',
      'Crampons & ice axes',
      'Helmet & climbing harness',
    ],
    exclusions: [
      'Food and drinks',
      'Transportation to meeting point',
      'Travel insurance',
    ],
    bringWithYou: [
      'Warm outdoor clothing',
      'Waterproof jacket and pants',
      'Head wear and gloves',
      'Good hiking shoes (available to rent)',
    ],
    cancellationPolicy: [
      { label: '100% cancellation fee if cancelled 10 days or less before the event' },
      { label: '50% cancellation fee if cancelled 20 days or less before the event' },
    ],
    availableDates: [
      '2025-05-03', '2025-05-10', '2025-05-17', '2025-05-24', '2025-05-31',
      '2025-06-07', '2025-06-14', '2025-06-21', '2025-06-28',
      '2025-07-05', '2025-07-12', '2025-07-19', '2025-07-26',
      '2025-08-02', '2025-08-09', '2025-08-16', '2025-08-23', '2025-08-30',
      '2025-09-06', '2025-09-13', '2025-09-20',
    ],
    image: 'https://picsum.photos/seed/glacier-hike/800/500',
    images: [
      'https://picsum.photos/seed/glacier-hike/800/500',
      'https://picsum.photos/seed/glacier-hike-2/800/500',
      'https://picsum.photos/seed/glacier-hike-3/800/500',
    ],
  },

  'silfra-snorkeling': {
    id: 'silfra-snorkeling',
    name: 'DIVE.IS - Snorkeling in Silfra Fissure',
    operator: 'DIVE.IS',
    location: 'Þingvellir National Park',
    region: 'West Iceland',
    duration: '3 hours',
    difficulty: 'EASY',
    shortDescription: 'Snorkel between the North American and Eurasian tectonic plates in Silfra\'s crystal-clear glacial water.',
    description: 'Experience one of the world\'s most unique snorkeling spots — the Silfra fissure in Þingvellir National Park, where you float between the North American and Eurasian tectonic plates. The glacially filtered water offers visibility of up to 100 metres and maintains a constant temperature of 2–4°C year-round. Dry suits are provided, making this accessible even for non-swimmers with a good sense of adventure. The vivid colours of algae and rock formations create an otherworldly underwater landscape unlike anything else on Earth.',
    price: 130,
    minAge: 12,
    requiresShoeSize: false,
    experienceType: 'Day tour or activity',
    meetingPoint: 'Þingvellir National Park parking area P5',
    categories: ['Snorkeling', 'Adventure', 'Nature', 'Water sports', 'Eco friendly', 'UNESCO site'],
    inclusions: [
      'Dry suit & undersuit',
      'Snorkeling mask & fins',
      'PADI-certified guide',
      'National park entrance fee',
      'Warm drink after the tour',
      'Underwater photos',
    ],
    exclusions: [
      'Meals and drinks (except post-tour warm drink)',
      'Transportation to Þingvellir',
      'Travel insurance',
    ],
    bringWithYou: [
      'Warm base layers (worn under dry suit)',
      'Wool or fleece socks',
      'Swimwear or thermals',
      'Personal medication if needed',
    ],
    cancellationPolicy: [
      { label: '100% cancellation fee if cancelled 7 days or less before the event' },
      { label: '50% cancellation fee if cancelled 14 days or less before the event' },
    ],
    availableDates: [
      '2025-05-05', '2025-05-12', '2025-05-19', '2025-05-26',
      '2025-06-02', '2025-06-09', '2025-06-16', '2025-06-23', '2025-06-30',
      '2025-07-07', '2025-07-14', '2025-07-21', '2025-07-28',
      '2025-08-04', '2025-08-11', '2025-08-18', '2025-08-25',
      '2025-09-01', '2025-09-08', '2025-09-15', '2025-09-22',
    ],
    image: 'https://picsum.photos/seed/silfra-snorkeling/800/500',
    images: [
      'https://picsum.photos/seed/silfra-snorkeling/800/500',
      'https://picsum.photos/seed/silfra-snorkeling-2/800/500',
      'https://picsum.photos/seed/silfra-snorkeling-3/800/500',
    ],
  },

  'ice-cave-exploration': {
    id: 'ice-cave-exploration',
    name: 'Extreme Iceland - Blue Ice Cave Exploration',
    operator: 'Extreme Iceland',
    location: 'Jökulsárlón Glacier Lagoon',
    region: 'South Iceland',
    duration: '5 hours',
    difficulty: 'EASY',
    shortDescription: 'Step inside the mesmerising blue ice caves of Vatnajökull glacier with an expert guide.',
    description: 'Discover the magical world hidden beneath Vatnajökull, Europe\'s largest glacier. This guided tour takes you into breathtaking blue ice caves formed by the glacier\'s constantly shifting interior. The vivid azure and cobalt hues of the ice walls are a natural wonder caused by thousands of years of compressed snow. Your expert glaciologist guide will explain the cave formations and glacier dynamics as you navigate through this ancient frozen landscape. Available from October to March when ice conditions are safest.',
    price: 150,
    minAge: 8,
    requiresShoeSize: true,
    experienceType: 'Day tour or activity',
    meetingPoint: 'Jökulsárlón Glacier Lagoon car park',
    categories: ['Adventure', 'Nature', 'Glacier hiking', 'Ice cave', 'Family friendly', 'Photography', 'Outdoor'],
    inclusions: [
      'Super jeep transport to cave entrance',
      'Certified glaciologist guide',
      'Helmet & crampons',
      'Ice cave entry',
      'Photo opportunities',
    ],
    exclusions: [
      'Food and drinks',
      'Hotel pickup from Reykjavík',
      'Travel insurance',
      'Gear rental (hiking boots)',
    ],
    bringWithYou: [
      'Warm layered clothing',
      'Waterproof jacket and trousers',
      'Sturdy ankle-support footwear',
      'Gloves and warm hat',
      'Camera or phone',
    ],
    cancellationPolicy: [
      { label: '100% cancellation fee if cancelled 10 days or less before the event' },
      { label: 'Tour may be cancelled due to unsafe ice conditions — full refund given' },
    ],
    availableDates: [
      '2025-10-04', '2025-10-11', '2025-10-18', '2025-10-25',
      '2025-11-01', '2025-11-08', '2025-11-15', '2025-11-22', '2025-11-29',
      '2025-12-06', '2025-12-13', '2025-12-20',
      '2026-01-03', '2026-01-10', '2026-01-17', '2026-01-24', '2026-01-31',
      '2026-02-07', '2026-02-14', '2026-02-21',
    ],
    image: 'https://picsum.photos/seed/ice-cave-tour/800/500',
    images: [
      'https://picsum.photos/seed/ice-cave-tour/800/500',
      'https://picsum.photos/seed/ice-cave-tour-2/800/500',
      'https://picsum.photos/seed/ice-cave-tour-3/800/500',
    ],
  },

  'whale-watching-husavik': {
    id: 'whale-watching-husavik',
    name: 'North Sailing - Whale Watching from Húsavík',
    operator: 'North Sailing',
    location: 'Húsavík Harbour',
    region: 'North Iceland',
    duration: '3 hours',
    difficulty: 'EASY',
    shortDescription: 'Sail from the whale watching capital of Iceland to spot humpbacks, minkes, and dolphins in their natural habitat.',
    description: 'Húsavík is Iceland\'s whale watching capital and one of the best places in the world to see these magnificent creatures up close. Board a traditional oak sailing vessel and head out into Skjálfandi Bay, where humpback whales, minke whales, white-beaked dolphins, and harbour porpoises are regularly spotted. An experienced naturalist guide will share insights about the whales and marine environment. The classic wooden schooners offer a more intimate experience than large vessels — hot chocolate and soup are served onboard.',
    price: 85,
    minAge: 0,
    requiresShoeSize: false,
    experienceType: 'Day tour or activity',
    meetingPoint: 'North Sailing dock, Húsavík Harbour',
    categories: ['Whale watching', 'Nature', 'Wildlife', 'Boat tour', 'Family friendly', 'Eco friendly', 'Photography'],
    inclusions: [
      'Guided whale watching tour on wooden schooner',
      'Experienced naturalist guide',
      'Warm overalls & life jacket',
      'Hot chocolate & soup onboard',
      'Whale sighting guarantee (free repeat if no whale seen)',
    ],
    exclusions: [
      'Meals (beyond onboard hot chocolate & soup)',
      'Transportation to Húsavík',
      'Travel insurance',
    ],
    bringWithYou: [
      'Warm clothing (layers)',
      'Windproof jacket',
      'Sea-sickness medication if needed',
      'Camera with good zoom',
      'Sunscreen (bright summer days)',
    ],
    cancellationPolicy: [
      { label: '100% cancellation fee if cancelled 24 hours or less before departure' },
      { label: 'Free cancellation more than 24 hours before departure' },
      { label: 'Tour may be cancelled in severe weather — full refund given' },
    ],
    availableDates: [
      '2025-05-01', '2025-05-08', '2025-05-15', '2025-05-22', '2025-05-29',
      '2025-06-05', '2025-06-12', '2025-06-19', '2025-06-26',
      '2025-07-03', '2025-07-10', '2025-07-17', '2025-07-24', '2025-07-31',
      '2025-08-07', '2025-08-14', '2025-08-21', '2025-08-28',
      '2025-09-04', '2025-09-11', '2025-09-18', '2025-09-25',
    ],
    image: 'https://picsum.photos/seed/whale-watching/800/500',
    images: [
      'https://picsum.photos/seed/whale-watching/800/500',
      'https://picsum.photos/seed/whale-watching-2/800/500',
      'https://picsum.photos/seed/whale-watching-3/800/500',
    ],
  },

  'northern-lights-hunt': {
    id: 'northern-lights-hunt',
    name: 'Arctic Adventures - Northern Lights Jeep Hunt',
    operator: 'Arctic Adventures',
    location: 'Reykjavík departure',
    region: 'Reykjavík & surroundings',
    duration: '4 hours',
    difficulty: 'EASY',
    shortDescription: 'Chase the aurora borealis across the Icelandic countryside in a comfortable 4x4, guided by aurora experts.',
    description: 'The Northern Lights are one of the most awe-inspiring natural phenomena on Earth, and Iceland\'s dark, clear winter skies offer some of the best viewing conditions in the world. Your experienced guide uses real-time aurora forecasts and cloud radar to take you to the best viewing spot on any given night. Travel in a comfortable heated 4x4 super jeep and enjoy warm drinks under the dancing lights. Photography tips are provided so you can capture the aurora on your camera.',
    price: 75,
    minAge: 0,
    requiresShoeSize: false,
    experienceType: 'Day tour or activity',
    meetingPoint: 'Arctic Adventures base, Laugavegur 11, Reykjavík',
    categories: ['Northern Lights', 'Night tour', 'Nature', 'Photography', 'Family friendly', 'Eco friendly'],
    inclusions: [
      '4x4 super jeep transport',
      'Experienced aurora guide',
      'Hot chocolate and snacks',
      'Photography guidance',
      'Aurora certificate',
      'Free repeat tour if no aurora seen',
    ],
    exclusions: [
      'Hotel pickup (meeting point only)',
      'Meals',
      'Travel insurance',
    ],
    bringWithYou: [
      'Very warm jacket and trousers',
      'Thermal base layers',
      'Gloves, hat and scarf',
      'Camera with manual mode',
      'Tripod (recommended)',
    ],
    cancellationPolicy: [
      { label: '100% cancellation fee if cancelled 24 hours or less before departure' },
      { label: 'Free cancellation more than 24 hours before departure' },
    ],
    availableDates: [
      '2025-09-15', '2025-09-22', '2025-09-29',
      '2025-10-06', '2025-10-13', '2025-10-20', '2025-10-27',
      '2025-11-03', '2025-11-10', '2025-11-17', '2025-11-24',
      '2025-12-01', '2025-12-08', '2025-12-15', '2025-12-22', '2025-12-29',
      '2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26',
      '2026-02-02', '2026-02-09', '2026-02-16',
    ],
    image: 'https://picsum.photos/seed/northern-lights-hunt/800/500',
    images: [
      'https://picsum.photos/seed/northern-lights-hunt/800/500',
      'https://picsum.photos/seed/northern-lights-hunt-2/800/500',
      'https://picsum.photos/seed/northern-lights-hunt-3/800/500',
    ],
  },

  'horseback-riding': {
    id: 'horseback-riding',
    name: 'Íshestar - Horseback Riding through Lava Fields',
    operator: 'Íshestar',
    location: 'Hafnarfjörður',
    region: 'Capital Region',
    duration: '2 hours',
    difficulty: 'EASY',
    shortDescription: 'Ride the unique and gentle Icelandic horse through ancient lava fields just 20 minutes from Reykjavík.',
    description: 'The Icelandic horse is a breed found only in Iceland, famous for its unique fifth gait called the tölt — an exceptionally smooth four-beat pace that makes it comfortable for riders of all experience levels. Íshestar, Iceland\'s largest horse rental company, offers rides through the dramatic lava fields of Hafnarfjörður, with views of the surrounding mountains and coastline. No experience necessary — your guide will match you with the perfect horse and provide all instruction needed. A truly Icelandic experience that\'s suitable for the whole family.',
    price: 90,
    minAge: 6,
    requiresShoeSize: false,
    experienceType: 'Day tour or activity',
    meetingPoint: 'Íshestar Riding Centre, Sörlaskeið 26, Hafnarfjörður',
    categories: ['Horseback riding', 'Nature', 'Family friendly', 'Outdoor', 'Culture', 'Eco friendly'],
    inclusions: [
      'Icelandic horse & tack',
      'Riding helmet',
      'Experienced riding guide',
      'Basic riding instruction',
      'Stable visit before and after',
    ],
    exclusions: [
      'Meals and drinks',
      'Transportation to Hafnarfjörður',
      'Travel insurance',
      'Riding boots (available to rent)',
    ],
    bringWithYou: [
      'Comfortable, warm trousers',
      'Sturdy closed-toe shoes or boots',
      'Warm jacket',
      'Gloves (in cooler months)',
    ],
    cancellationPolicy: [
      { label: '100% cancellation fee if cancelled 48 hours or less before the event' },
      { label: '50% cancellation fee if cancelled 7 days or less before the event' },
      { label: 'Free cancellation more than 7 days before the event' },
    ],
    availableDates: [
      '2025-05-02', '2025-05-09', '2025-05-16', '2025-05-23', '2025-05-30',
      '2025-06-06', '2025-06-13', '2025-06-20', '2025-06-27',
      '2025-07-04', '2025-07-11', '2025-07-18', '2025-07-25',
      '2025-08-01', '2025-08-08', '2025-08-15', '2025-08-22', '2025-08-29',
      '2025-09-05', '2025-09-12', '2025-09-19', '2025-09-26',
    ],
    image: 'https://picsum.photos/seed/horseback-riding-iceland/800/500',
    images: [
      'https://picsum.photos/seed/horseback-riding-iceland/800/500',
      'https://picsum.photos/seed/horseback-riding-iceland-2/800/500',
      'https://picsum.photos/seed/horseback-riding-iceland-3/800/500',
    ],
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DIFFICULTY_STYLE = {
  EASY: 'bg-green-100 text-green-700',
  MODERATE: 'bg-yellow-100 text-yellow-700',
  HARD: 'bg-red-100 text-red-700',
};

export default function ActivityDetail() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, updateCartItem, cartItems, cartCount } = useCart();

  const editItemId = searchParams.get('edit');
  const existingItem = editItemId ? cartItems.find((item) => item.id === editItemId) : null;
  const isEditing = !!existingItem;

  const activity = ACTIVITY_DATA[activityId];

  const [selectedDate, setSelectedDate] = useState(null);
  const [participants, setParticipants] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (existingItem) {
      setSelectedDate(existingItem.date || null);
      setParticipants(existingItem.participants || 1);
    }
  }, [existingItem]);

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Activity not found</h1>
          <Link to="/activities" className="text-blue-600 hover:underline">← Back to Activities</Link>
        </div>
      </div>
    );
  }

  const total = activity.price * participants;

  const handleAddToCart = () => {
    const cartItem = {
      id: isEditing ? existingItem.id : `activity-${Date.now()}`,
      type: 'activity',
      activityId: activity.id,
      name: activity.name,
      operator: activity.operator,
      location: activity.location,
      region: activity.region,
      duration: activity.duration,
      difficulty: activity.difficulty,
      date: selectedDate,
      participants,
      pricePerPerson: activity.price,
      minAge: activity.minAge,
      requiresShoeSize: activity.requiresShoeSize,
      image: activity.image,
      shortDescription: activity.shortDescription,
      meetingPoint: activity.meetingPoint,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={isEditing ? '/checkout' : '/activities'}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← {isEditing ? 'Back to Cart' : 'Back to Activities'}
          </Link>
          <Link
            to="/checkout"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column — main content */}
          <div className="lg:col-span-2">

            {/* Hero image */}
            <div className="w-full h-72 rounded-lg overflow-hidden mb-6">
              <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
            </div>

            {/* Badges + title */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  📍 {activity.region}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  {activity.operator}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  ⏱ {activity.duration}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_STYLE[activity.difficulty] || DIFFICULTY_STYLE.EASY}`}>
                  {activity.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{activity.name}</h1>
              <p className="text-gray-600">{activity.shortDescription}</p>
            </div>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this activity</h2>
              <p className="text-gray-600 leading-relaxed">{activity.description}</p>
            </section>

            {/* Inclusions / Exclusions */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What's included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide text-green-700">Included</h3>
                  <ul className="space-y-2">
                    {activity.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide text-red-600">Not included</h3>
                  <ul className="space-y-2">
                    {activity.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="text-red-500 mr-2 mt-0.5 flex-shrink-0">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* What to bring */}
            <section className="mb-8 bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What to bring</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activity.bringWithYou.map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-700">
                    <span className="w-4 h-4 border border-gray-400 rounded-sm mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Know before you go */}
            <section className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-base font-bold text-gray-900 mb-2">Know before you go</h2>
              <ul className="space-y-1 text-sm text-yellow-900">
                {activity.minAge > 0 && <li>• Minimum age: {activity.minAge} years</li>}
                <li>• Experience type: {activity.experienceType}</li>
                {activity.meetingPoint && <li>• Meeting point: {activity.meetingPoint}</li>}
              </ul>
            </section>

            {/* Cancellation policy */}
            <section className="mb-8 bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Cancellation policy</h2>
              <ul className="space-y-2">
                {activity.cancellationPolicy.map((rule, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-700">
                    <span className="text-gray-400 mr-2">•</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            </section>

            {/* Categories */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {activity.categories.map((cat, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            </section>

          </div>

          {/* Right column — booking panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${activity.price}</span>
                <span className="text-gray-500 ml-1 text-sm">/ person</span>
              </div>

              {/* Participants */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-lg">{participants}</span>
                  <button
                    onClick={() => setParticipants(participants + 1)}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Date selector */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select date
                </label>
                <input
                  type="date"
                  value={selectedDate || ''}
                  min={activity.availableDates[0]}
                  max={activity.availableDates[activity.availableDates.length - 1]}
                  onChange={(e) => setSelectedDate(e.target.value || null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-4 text-sm">
                <span className="text-gray-600">{participants} × ${activity.price}</span>
                <span className="font-bold text-gray-900 text-lg">${total}</span>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                  added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isEditing ? 'Update Cart' : added ? '✓ Added to Cart' : `Add to Cart — $${total}`}
              </button>

              {activity.minAge > 0 && (
                <p className="mt-3 text-xs text-gray-500 text-center">Minimum age: {activity.minAge} years</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
