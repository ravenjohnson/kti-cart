import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../CartContext';

const CAR_RENTALS = [
  {
    id: 'economy',
    name: 'Economy Car',
    category: 'Economy',
    description: 'Perfect for city driving and paved roads. Fuel efficient and easy to park.',
    pricePerDay: 45,
    passengers: 5,
    luggage: 2,
    transmission: 'Manual',
    needsDriver: true,
    image: 'https://picsum.photos/seed/economy-car-road/800/450',
  },
  {
    id: 'compact-suv',
    name: 'Compact SUV',
    category: 'SUV',
    description: 'Comfortable for families with extra space. Suitable for most roads.',
    pricePerDay: 85,
    passengers: 5,
    luggage: 4,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/compact-suv-iceland/800/450',
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
  },
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    category: 'Luxury',
    description: 'Premium comfort with advanced features. Perfect for business travel.',
    pricePerDay: 150,
    passengers: 5,
    luggage: 3,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/luxury-car-city/800/450',
  },
  {
    id: 'campervan',
    name: 'Campervan',
    category: 'Camper',
    description: 'Sleep and travel in one vehicle. Includes basic camping equipment.',
    pricePerDay: 180,
    passengers: 4,
    luggage: 6,
    transmission: 'Manual',
    needsDriver: true,
    image: 'https://picsum.photos/seed/campervan-camping/800/450',
  },
  {
    id: 'electric',
    name: 'Electric Car',
    category: 'Electric',
    description: 'Eco-friendly with free charging at many locations across Iceland.',
    pricePerDay: 95,
    passengers: 5,
    luggage: 2,
    transmission: 'Automatic',
    needsDriver: true,
    image: 'https://picsum.photos/seed/electric-car-modern/800/450',
  },
];

const LOCATIONS = [
  'Keflavik International Airport (Kef)',
  'Reykjavik Downtown',
  'Akureyri Airport',
  'Egilsstaðir Airport',
];

export default function CarRentalDetail() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, updateCartItem, cartItems } = useCart();

  // Check if we're editing an existing cart item
  const editItemId = searchParams.get('edit');
  const existingItem = editItemId ? cartItems.find(item => item.id === editItemId) : null;

  const car = CAR_RENTALS.find((c) => c.id === carId);

  const [pickupLocation, setPickupLocation] = useState(LOCATIONS[0]);
  const [dropoffLocation, setDropoffLocation] = useState(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState('2024-02-10');
  const [dropoffDate, setDropoffDate] = useState('2024-02-17');
  const [pickupTime, setPickupTime] = useState('13:00');
  const [dropoffTime, setDropoffTime] = useState('13:00');
  const [driverAge, setDriverAge] = useState('30-65');
  const [driverCountry, setDriverCountry] = useState('Iceland');
  const [flightNumber, setFlightNumber] = useState('');

  // Insurance options
  const [selectedInsurance, setSelectedInsurance] = useState(new Set(['cdw', 'theft']));

  // Extras with quantities
  const [extras, setExtras] = useState({
    gps: 0,
    extraDriver: 0,
    booster: 0,
    childSeat: 0,
    babySeat: 0,
    internet: 0,
    roadside: 0,
  });

  // Load existing cart item data if editing
  useEffect(() => {
    if (existingItem) {
      setPickupLocation(existingItem.pickup || LOCATIONS[0]);
      setDropoffLocation(existingItem.dropoff || LOCATIONS[0]);
      setPickupDate(existingItem.pickupDate || '2024-02-10');
      setDropoffDate(existingItem.dropoffDate || '2024-02-17');
      setPickupTime(existingItem.pickupTime || '13:00');
      setDropoffTime(existingItem.dropoffTime || '13:00');
      setDriverAge(existingItem.driverAge || '30-65');
      setDriverCountry(existingItem.driverCountry || 'Iceland');
      setFlightNumber(existingItem.flightNumber || '');

      if (existingItem.insurance) {
        setSelectedInsurance(new Set(existingItem.insurance));
      }

      if (existingItem.extras) {
        setExtras(existingItem.extras);
      }
    }
  }, [existingItem]);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
          <Link to={editItemId ? "/checkout" : "/car-rentals"} className="text-blue-600 hover:text-blue-700">
            {editItemId ? 'Back to Checkout' : 'Back to Car Rentals'}
          </Link>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const days = calculateDays();

  const INSURANCE_OPTIONS = [
    { id: 'cdw', name: 'Collision Damage Waiver', price: 0, included: true },
    { id: 'theft', name: 'Theft Protection', price: 0, included: true },
    { id: 'full', name: 'Full Protection', price: 55, perDay: true },
    { id: 'gravel', name: 'Gravel Protection', price: 9, perDay: true },
    { id: 'sand', name: 'Sand and Ash Damage Waiver', price: 16, perDay: true },
    { id: 'super', name: 'Super Collision Damage Waiver', price: 14, perDay: true },
  ];

  const EXTRAS_OPTIONS = [
    { id: 'gps', name: 'GPS', price: 14, perDay: true },
    { id: 'extraDriver', name: 'Extra driver', price: 10, perDay: true },
    { id: 'booster', name: 'Booster', price: 9, perDay: false },
    { id: 'childSeat', name: 'Child seat', price: 37, perDay: false },
    { id: 'babySeat', name: 'Baby seat', price: 37, perDay: false },
    { id: 'internet', name: '4G internet box', price: 14, perDay: true },
    { id: 'roadside', name: 'Roadside assistance waiver', price: 11, perDay: true },
  ];

  const toggleInsurance = (id) => {
    const option = INSURANCE_OPTIONS.find((opt) => opt.id === id);
    if (option?.included) return; // Can't toggle included items

    const newSet = new Set(selectedInsurance);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedInsurance(newSet);
  };

  const updateExtra = (id, delta) => {
    setExtras((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const calculateTotal = () => {
    let total = car.pricePerDay * days;

    // Add insurance costs
    INSURANCE_OPTIONS.forEach((option) => {
      if (selectedInsurance.has(option.id) && !option.included) {
        total += option.perDay ? option.price * days : option.price;
      }
    });

    // Add extras costs
    EXTRAS_OPTIONS.forEach((option) => {
      const quantity = extras[option.id];
      if (quantity > 0) {
        const cost = option.perDay ? option.price * days : option.price;
        total += cost * quantity;
      }
    });

    return total;
  };

  const handleAddToCart = () => {
    if (editItemId && existingItem) {
      // Update existing cart item
      const updatedItem = {
        ...existingItem,
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        pickupDate,
        dropoffDate,
        pickupTime,
        dropoffTime,
        days,
        driverAge,
        driverCountry,
        flightNumber,
        insurance: Array.from(selectedInsurance),
        extras: { ...extras },
        totalPrice: calculateTotal(),
      };
      updateCartItem(editItemId, updatedItem);
      navigate('/checkout');
    } else {
      // Add new cart item
      const cartItem = {
        id: `car-${Date.now()}`,
        type: 'carRental',
        name: car.name,
        description: car.description,
        image: car.image,
        category: car.category,
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        pickupDate,
        dropoffDate,
        pickupTime,
        dropoffTime,
        days,
        pricePerDay: car.pricePerDay,
        needsDriver: car.needsDriver,
        recommended: car.recommended,
        passengers: car.passengers,
        luggage: car.luggage,
        transmission: car.transmission,
        driverAge,
        driverCountry,
        flightNumber,
        insurance: Array.from(selectedInsurance),
        extras: { ...extras },
        totalPrice: calculateTotal(),
        needsInfo: true,
      };

      addToCart(cartItem);
      navigate('/car-rentals');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link to="/car-rentals" className="text-gray-500 hover:text-gray-700">Car Rentals</Link>
        <span className="mx-2 text-gray-400">/</span>
        {editItemId ? (
          <>
            <Link to="/checkout" className="text-gray-500 hover:text-gray-700">Cart</Link>
            <span className="mx-2 text-gray-400">/</span>
          </>
        ) : null}
        <span className="text-gray-900">{car.name}</span>
      </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-6">
                <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {car.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{car.description}</p>
                  <div className="flex gap-6 text-sm text-gray-700">
                    <span>👤 {car.passengers} passengers</span>
                    <span>🧳 {car.luggage} bags</span>
                    <span>⚙️ {car.transmission}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pick-up & Drop-off */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Pick-up & drop-off location
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setDropoffLocation(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        ✈️ {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pick-up date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop-off date
                    </label>
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pick-up time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <option key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop-off time
                    </label>
                    <select
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <option key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver's age
                    </label>
                    <select
                      value={driverAge}
                      onChange={(e) => setDriverAge(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3"
                    >
                      <option value="20-25">20 - 25</option>
                      <option value="25-30">25 - 30</option>
                      <option value="30-65">30 - 65</option>
                      <option value="65+">65+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver's country
                    </label>
                    <select
                      value={driverCountry}
                      onChange={(e) => setDriverCountry(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3"
                    >
                      <option value="Iceland">I live in Iceland</option>
                      <option value="USA">I live in USA</option>
                      <option value="UK">I live in UK</option>
                      <option value="Germany">I live in Germany</option>
                      <option value="France">I live in France</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    Add arrival flight number
                  </label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Flight info ensures timely pick-up"
                    className="w-full border border-gray-300 rounded-md px-4 py-3"
                  />
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choose insurances</h2>
              <div className="space-y-3">
                {INSURANCE_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      option.included
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">ⓘ</span>
                      <div>
                        <div className="font-medium text-gray-900">{option.name}</div>
                        {option.included ? (
                          <div className="text-sm text-green-600 font-medium">Included</div>
                        ) : (
                          <div className="text-sm text-green-600 font-medium">
                            +{option.price} USD{option.perDay ? ' / Per day' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedInsurance.has(option.id)}
                      onChange={() => toggleInsurance(option.id)}
                      disabled={option.included}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choose extras</h2>
              <div className="space-y-3">
                {EXTRAS_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">ⓘ</span>
                      <div>
                        <div className="font-medium text-gray-900">{option.name}</div>
                        <div className="text-sm text-green-600 font-medium">
                          +{option.price} USD{option.perDay ? ' / Per day' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateExtra(option.id, -1)}
                        className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{extras[option.id]}</span>
                      <button
                        onClick={() => updateExtra(option.id, 1)}
                        className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-green-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h2>
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Car rental</span>
                  <span className="font-medium">
                    ${car.pricePerDay} × {days} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base price</span>
                  <span className="font-medium">${car.pricePerDay * days}</span>
                </div>

                {/* Insurance costs */}
                {INSURANCE_OPTIONS.map((option) => {
                  if (selectedInsurance.has(option.id) && !option.included) {
                    const cost = option.perDay ? option.price * days : option.price;
                    return (
                      <div key={option.id} className="flex justify-between text-xs">
                        <span className="text-gray-500">{option.name}</span>
                        <span className="text-gray-700">${cost}</span>
                      </div>
                    );
                  }
                  return null;
                })}

                {/* Extras costs */}
                {EXTRAS_OPTIONS.map((option) => {
                  const quantity = extras[option.id];
                  if (quantity > 0) {
                    const cost = option.perDay ? option.price * days : option.price;
                    const totalCost = cost * quantity;
                    return (
                      <div key={option.id} className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          {option.name} × {quantity}
                        </span>
                        <span className="text-gray-700">${totalCost}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${calculateTotal()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  for {days} {days === 1 ? 'day' : 'days'}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors"
              >
                {editItemId ? 'Update Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
