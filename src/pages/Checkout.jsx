import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';

// ============================================================================
// REQUIREMENTS ENGINE
// Computes required fields based on cart items + assigned people
// ============================================================================

function computeRequirements(cartItems, people, assignments) {
  const requirements = [];

  cartItems.forEach((item) => {
    const assignedPeople = assignments[item.id] || [];

    // Activity: Shoe size requirement
    if (item.type === 'activity' && item.requiresShoeSize) {
      assignedPeople.forEach((personId) => {
        const person = people.find((p) => p.id === personId);
        if (person && !person.shoeSize) {
          requirements.push({
            itemId: item.id,
            itemName: item.name,
            personId,
            personName: person.name,
            field: 'shoeSize',
            label: 'Shoe Size',
          });
        }
      });
    }

    // Tour package: Inherited activity requirements
    if (item.type === 'tourPackage') {
      item.includedActivities.forEach((included) => {
        if (included.requiresShoeSize) {
          assignedPeople.forEach((personId) => {
            const person = people.find((p) => p.id === personId);
            if (person && !person.shoeSize) {
              requirements.push({
                itemId: item.id,
                itemName: `${item.name} (${included.name})`,
                personId,
                personName: person.name,
                field: 'shoeSize',
                label: 'Shoe Size',
              });
            }
          });
        }
      });
    }

    // Car rental: Driver license + DOB
    if (item.type === 'carRental' && item.needsDriver) {
      assignedPeople.forEach((personId) => {
        const person = people.find((p) => p.id === personId);
        if (person) {
          if (!person.licenseCountry) {
            requirements.push({
              itemId: item.id,
              itemName: item.name,
              personId,
              personName: person.name,
              field: 'licenseCountry',
              label: 'Driver License Country',
            });
          }
          if (!person.dob) {
            requirements.push({
              itemId: item.id,
              itemName: item.name,
              personId,
              personName: person.name,
              field: 'dob',
              label: 'Date of Birth',
            });
          }
        }
      });
    }

    // Activity: Min age validation (dummy - just check if DOB exists)
    if (item.type === 'activity' && item.minAge) {
      assignedPeople.forEach((personId) => {
        const person = people.find((p) => p.id === personId);
        if (person && !person.dob) {
          requirements.push({
            itemId: item.id,
            itemName: item.name,
            personId,
            personName: person.name,
            field: 'dob',
            label: 'Date of Birth (for age verification)',
          });
        }
      });
    }
  });

  return requirements;
}

// ============================================================================
// CONFLICT DETECTION
// Checks for time overlaps between activities (hard block)
// Checks for warnings (e.g., car recommended)
// ============================================================================

function detectConflicts(cartItems) {
  const blocks = [];
  const warnings = [];

  // Hard block: Time overlap between activities
  const activities = cartItems.filter(
    (item) => item.type === 'activity' && item.date && item.time
  );
  for (let i = 0; i < activities.length; i++) {
    for (let j = i + 1; j < activities.length; j++) {
      const a = activities[i];
      const b = activities[j];
      if (a.date === b.date && a.time === b.time) {
        blocks.push({
          type: 'overlap',
          message: `Time conflict: "${a.name}" and "${b.name}" are both scheduled for ${a.date} at ${a.time}`,
          items: [a.id, b.id],
        });
      }
    }
  }

  // Warning: Car rental recommended
  cartItems.forEach((item) => {
    if (item.type === 'carRental' && item.recommended) {
      warnings.push({
        type: 'recommendation',
        message: `4x4 vehicle recommended for self-drive tours in Iceland`,
        itemId: item.id,
      });
    }
  });

  return { blocks, warnings };
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartCount, removeFromCart, clearCart, total: cartTotal } = useCart();
  const [leadBooker, setLeadBooker] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    consent: false,
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/');
    }
  }, [cartItems.length, orderComplete, navigate]);

  // Detect conflicts
  const { blocks, warnings } = useMemo(
    () => detectConflicts(cartItems),
    [cartItems]
  );

  const total = cartTotal;

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleEditItem = (item) => {
    if (item.type === 'carRental') {
      const carTypeMap = {
        'Economy': 'economy',
        'SUV': 'compact-suv',
        '4x4': '4x4-suv',
        'Luxury': 'luxury-sedan',
        'Camper': 'campervan',
        'Electric': 'electric',
      };
      const carId = carTypeMap[item.category] || 'economy';
      navigate(`/car-rentals/${carId}?edit=${item.id}`);
    } else if (item.type === 'activity' && item.activityId) {
      navigate(`/activities/${item.activityId}?edit=${item.id}`);
    } else if (item.type === 'tourPackage' && item.tourId) {
      navigate(`/tours/${item.tourId}?edit=${item.id}#day-1`);
    }
  };

  const handleSubmitOrder = () => {
    setOrderNumber(`ICE-${Date.now()}`);
    setOrderComplete(true);
    clearCart();
  };

  const canSubmit = leadBooker.name && leadBooker.email && leadBooker.consent && blocks.length === 0;

  if (orderComplete) {
    return <SuccessScreen orderNumber={orderNumber} cartItems={cartItems} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              KTI Checkout
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/tours" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Tours</Link>
              <Link to="/activities" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Activities</Link>
              <Link to="/hotels" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Hotels</Link>
              <Link to="/car-rentals" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Car Rentals</Link>
            </nav>

            {/* Cart Icon */}
            <Link to="/checkout" className="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center space-x-4 mt-4">
            <Link to="/tours" className="text-sm font-medium text-gray-700 transition-colors">Tours</Link>
            <Link to="/activities" className="text-sm font-medium text-gray-700 transition-colors">Activities</Link>
            <Link to="/hotels" className="text-sm font-medium text-gray-700 transition-colors">Hotels</Link>
            <Link to="/car-rentals" className="text-sm font-medium text-gray-700 transition-colors">Car Rentals</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8 pb-32 lg:pb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Cart</h2>
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conflict Banner */}
            {(blocks.length > 0 || warnings.length > 0) && (
              <ConflictBanner blocks={blocks} warnings={warnings} />
            )}

            {/* Cart Items */}
            <CartReview
              cartItems={cartItems}
              onRemoveItem={handleRemoveItem}
              onEditItem={handleEditItem}
              assignments={{}}
            />

            {/* Lead Booker */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={leadBooker.name}
                  onChange={(e) => setLeadBooker({ ...leadBooker, name: e.target.value })}
                  placeholder="Full name *"
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="email"
                  value={leadBooker.email}
                  onChange={(e) => setLeadBooker({ ...leadBooker, email: e.target.value })}
                  placeholder="Email *"
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  value={leadBooker.country}
                  onChange={(e) => setLeadBooker({ ...leadBooker, country: e.target.value })}
                  placeholder="Country"
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="tel"
                  value={leadBooker.phone}
                  onChange={(e) => setLeadBooker({ ...leadBooker, phone: e.target.value })}
                  placeholder="Phone (optional)"
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Cancellation Policy: </span>
                  Free cancellation up to 48 hours before start date. After that, 50% refund.
                </p>
              </div>
              <label className="flex items-start mt-4">
                <input
                  type="checkbox"
                  checked={leadBooker.consent}
                  onChange={(e) => setLeadBooker({ ...leadBooker, consent: e.target.checked })}
                  className="mt-1 mr-2"
                />
                <span className="text-sm text-gray-700">
                  I agree to the terms and conditions, cancellation policy, and privacy policy *
                </span>
              </label>
            </div>

            {/* Payment */}
            <PaymentForm />

            {/* Pay Button (Desktop) */}
            <div className="hidden lg:block">
              <button
                onClick={handleSubmitOrder}
                disabled={!canSubmit}
                className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay Now — ${total.toLocaleString()}
              </button>
            </div>
          </div>

          {/* Order Summary (Desktop) */}
          <div className="hidden lg:block">
            <OrderSummary cartItems={cartItems} total={total} />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-xl font-bold">${total.toLocaleString()}</span>
        </div>
        <button
          onClick={handleSubmitOrder}
          disabled={!canSubmit}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-md disabled:opacity-50"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// STEP NAVIGATION COMPONENT
// ============================================================================

function StepNav({ currentStep }) {
  const steps = [
    'Cart Review',
    'Schedule',
    'Participants',
    'Requirements',
    'Review & Pay',
  ];

  return (
    <nav className="bg-white rounded-lg border border-gray-200 p-4">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentStep
                    ? 'bg-blue-600 text-white'
                    : index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-1 text-gray-600 hidden sm:block">
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 sm:w-16 h-0.5 bg-gray-200 mx-2" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ============================================================================
// CONFLICT BANNER COMPONENT
// ============================================================================

function ConflictBanner({ blocks, warnings }) {
  return (
    <div className="mt-4 space-y-3">
      {blocks.map((block, index) => (
        <div
          key={`block-${index}`}
          className="bg-red-50 border border-red-200 rounded-md p-4"
        >
          <div className="flex">
            <span className="text-red-600 font-semibold mr-2">⚠️ BLOCKED:</span>
            <span className="text-red-800">{block.message}</span>
          </div>
        </div>
      ))}
      {warnings.map((warning, index) => (
        <div
          key={`warning-${index}`}
          className="bg-yellow-50 border border-yellow-200 rounded-md p-4"
        >
          <div className="flex">
            <span className="text-yellow-600 font-semibold mr-2">💡 Note:</span>
            <span className="text-yellow-800">{warning.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CART REVIEW COMPONENT (Step 1)
// ============================================================================

function CartItemDetails({ item }) {
  const INSURANCE_LABELS = {
    cdw: 'Collision Damage Waiver',
    theft: 'Theft Protection',
    full: 'Full Protection',
    gravel: 'Gravel Protection',
    sand: 'Sand and Ash Damage Waiver',
    super: 'Super Collision Damage Waiver',
  };

  const EXTRAS_LABELS = {
    gps: 'GPS',
    extraDriver: 'Extra driver',
    booster: 'Booster',
    childSeat: 'Child seat',
    babySeat: 'Baby seat',
    internet: '4G internet box',
    roadside: 'Roadside assistance waiver',
  };

  if (item.type === 'carRental') {
    const activeExtras = item.extras
      ? Object.entries(item.extras).filter(([, qty]) => qty > 0)
      : [];
    const optionalInsurance = (item.insurance || []).filter(
      (id) => id !== 'cdw' && id !== 'theft'
    );

    return (
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
          <div>
            <span className="text-gray-500">Pick-up</span>
            <div className="font-medium">{item.pickup}</div>
            <div>{item.pickupDate} at {item.pickupTime || '—'}</div>
          </div>
          <div>
            <span className="text-gray-500">Drop-off</span>
            <div className="font-medium">{item.dropoff}</div>
            <div>{item.dropoffDate} at {item.dropoffTime || '—'}</div>
          </div>
          {item.driverAge && (
            <div>
              <span className="text-gray-500">Driver's age</span>
              <div className="font-medium">{item.driverAge}</div>
            </div>
          )}
          {item.driverCountry && (
            <div>
              <span className="text-gray-500">Driver's country</span>
              <div className="font-medium">{item.driverCountry}</div>
            </div>
          )}
          {item.flightNumber && (
            <div>
              <span className="text-gray-500">Flight number</span>
              <div className="font-medium">{item.flightNumber}</div>
            </div>
          )}
          <div>
            <span className="text-gray-500">Transmission</span>
            <div className="font-medium">{item.transmission}</div>
          </div>
        </div>

        <div>
          <div className="text-gray-500 mb-1">Insurance included</div>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">Collision Damage Waiver</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">Theft Protection</span>
            {optionalInsurance.map((id) => (
              <span key={id} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                {INSURANCE_LABELS[id] || id}
              </span>
            ))}
          </div>
        </div>

        {activeExtras.length > 0 && (
          <div>
            <div className="text-gray-500 mb-1">Extras</div>
            <div className="flex flex-wrap gap-1">
              {activeExtras.map(([id, qty]) => (
                <span key={id} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                  {EXTRAS_LABELS[id] || id} ×{qty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (item.type === 'hotel') {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <span className="text-gray-500">Check-in</span>
            <div className="font-medium">{item.checkIn || '—'}</div>
          </div>
          <div>
            <span className="text-gray-500">Check-out</span>
            <div className="font-medium">{item.checkOut || '—'}</div>
          </div>
          <div>
            <span className="text-gray-500">Duration</span>
            <div className="font-medium">{item.nights} nights</div>
          </div>
          <div>
            <span className="text-gray-500">Rooms</span>
            <div className="font-medium">{item.rooms} × {item.guestsPerRoom} guests</div>
          </div>
          <div>
            <span className="text-gray-500">Rate</span>
            <div className="font-medium">${item.pricePerNight}/night</div>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === 'activity') {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-700">
        {/* Location / operator / duration chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.location && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">📍 {item.location}</span>
          )}
          {item.operator && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{item.operator}</span>
          )}
          {item.duration && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">⏱ {item.duration}</span>
          )}
        </div>
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {item.date && (
            <div>
              <span className="text-gray-500">Date</span>
              <div className="font-medium">{item.date}</div>
            </div>
          )}
          <div>
            <span className="text-gray-500">Participants</span>
            <div className="font-medium">{item.participants}</div>
          </div>
          <div>
            <span className="text-gray-500">Rate</span>
            <div className="font-medium">${item.pricePerPerson}/person</div>
          </div>
          {item.minAge > 0 && (
            <div>
              <span className="text-gray-500">Min. age</span>
              <div className="font-medium">{item.minAge}+</div>
            </div>
          )}
          {item.requiresShoeSize && (
            <div className="col-span-2">
              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                Shoe size required
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (item.type === 'tourPackage') {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <span className="text-gray-500">Start date</span>
            <div className="font-medium">{item.startDate || '—'}</div>
          </div>
          <div>
            <span className="text-gray-500">End date</span>
            <div className="font-medium">{item.endDate || '—'}</div>
          </div>
          <div>
            <span className="text-gray-500">Duration</span>
            <div className="font-medium">{item.days} days</div>
          </div>
          <div>
            <span className="text-gray-500">Participants</span>
            <div className="font-medium">{item.participants}</div>
          </div>
          <div>
            <span className="text-gray-500">Rate</span>
            <div className="font-medium">${item.pricePerPerson}/person</div>
          </div>
        </div>
        {item.daySelections && Object.keys(item.daySelections).length > 0 && (
          <div className="space-y-2">
            <div className="text-gray-500 mb-1">Day selections</div>
            {Object.entries(item.daySelections)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([dayNum, sel]) => {
                const hasAccom = sel.accommodation;
                const hasActivities = sel.activities?.length > 0;
                if (!hasAccom && !hasActivities) return null;
                return (
                  <div key={dayNum} className="border border-gray-100 rounded p-2 text-xs space-y-1">
                    <p className="font-semibold text-gray-700">Day {dayNum}</p>
                    {hasAccom && (
                      <p className="text-gray-600">
                        🏨 <span className="font-medium">{sel.accommodation.name}</span>
                        <span className="text-gray-400"> · ${sel.accommodation.pricePerNight}/night</span>
                      </p>
                    )}
                    {hasActivities && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sel.activities.map((act) => (
                          <span key={act.id} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                            {act.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  return null;
}

function CartReview({ cartItems, onRemoveItem, onEditItem, assignments }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const itemPrice = (item) => {
    if (item.type === 'hotel') return item.pricePerNight * item.nights * item.rooms;
    if (item.type === 'activity') return item.pricePerPerson * item.participants;
    if (item.type === 'tourPackage') return item.pricePerPerson * item.participants;
    if (item.type === 'carRental') return item.totalPrice ?? item.pricePerDay * item.days;
    return 0;
  };

  const itemSummary = (item) => {
    if (item.type === 'hotel') return `${item.nights} nights • ${item.rooms} room • ${item.guestsPerRoom} guests`;
    if (item.type === 'activity') return `${item.participants} participants${item.date ? ` • ${item.date}` : ''}`;
    if (item.type === 'carRental') return `${item.days} days • ${item.category} • ${item.pickup}`;
    if (item.type === 'tourPackage') return `${item.days} days • ${item.participants} participants`;
    return '';
  };

  return (
    <div className="space-y-4">
      {cartItems.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        return (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
            {/* Header row */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.needsInfo && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                      Needs info
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{itemSummary(item)}</p>
              </div>

              <div className="flex items-start gap-4 ml-4 shrink-0">
                <span className="font-bold text-gray-900">${itemPrice(item)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditItem(item)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Persistent thumbnail + description */}
            {(item.image || item.description || item.shortDescription) && (
              <div className="flex gap-3 mt-3">
                {item.image && (
                  <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs text-gray-500 leading-relaxed self-center">
                  {item.shortDescription || item.description || ''}
                </p>
              </div>
            )}

            {isExpanded && <CartItemDetails item={item} />}

            <button
              onClick={() => toggleExpand(item.id)}
              className="mt-5 pt-3 border-t border-gray-100 w-full text-left text-sm text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? 'Hide details ▲' : 'Show details ▼'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// SCHEDULE STEP COMPONENT (Step 2)
// ============================================================================

function ScheduleStep({ cartItems, updateCartItem }) {
  const activities = cartItems.filter((item) => item.type === 'activity');

  const handleUpdateActivity = (id, field, value) => {
    updateCartItem(id, { [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Select Date & Time</h2>
      <p className="text-sm text-gray-600">
        Choose when you want to do each activity
      </p>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <h3 className="font-semibold text-gray-900 mb-3">{activity.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <select
                value={activity.date || ''}
                onChange={(e) =>
                  handleUpdateActivity(activity.id, 'date', e.target.value)
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select date</option>
                <option value="2025-06-15">June 15, 2025</option>
                <option value="2025-06-16">June 16, 2025</option>
                <option value="2025-06-17">June 17, 2025</option>
                <option value="2025-06-18">June 18, 2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <select
                value={activity.time || ''}
                onChange={(e) =>
                  handleUpdateActivity(activity.id, 'time', e.target.value)
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select time</option>
                <option value="09:00">09:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// PEOPLE MANAGER COMPONENT (Step 3)
// ============================================================================

function PeopleManager({
  people,
  cartItems,
  assignments,
  onAddPerson,
  onUpdatePerson,
  onRemovePerson,
  onAssignPerson,
  onUseHotelGuests,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manage Participants</h2>
        <button
          onClick={onAddPerson}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Person
        </button>
      </div>

      {/* People List */}
      <div className="space-y-3">
        {people.map((person) => (
          <div
            key={person.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <input
                type="text"
                value={person.name}
                onChange={(e) =>
                  onUpdatePerson(person.id, 'name', e.target.value)
                }
                placeholder="Full name"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-3"
              />
              <button
                onClick={() => onRemovePerson(person.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {people.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No participants yet. Add people to continue.</p>
        </div>
      )}

      {/* Assignment Section */}
      {people.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Assign to Items</h3>
            <button
              onClick={onUseHotelGuests}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Use hotel guests for all
            </button>
          </div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
              <div className="space-y-2">
                {people.map((person) => (
                  <label key={person.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(assignments[item.id] || []).includes(person.id)}
                      onChange={() => onAssignPerson(item.id, person.id)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {person.name || 'Unnamed'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REQUIREMENTS FORM COMPONENT (Step 4)
// ============================================================================

function RequirementsForm({ requirements, people, onUpdatePerson }) {
  if (requirements.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <p className="text-green-800 font-medium">
          ✓ All requirements completed!
        </p>
      </div>
    );
  }

  // Group requirements by person
  const byPerson = {};
  requirements.forEach((req) => {
    if (!byPerson[req.personId]) {
      byPerson[req.personId] = [];
    }
    byPerson[req.personId].push(req);
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Required Information</h2>
      <p className="text-sm text-gray-600">
        Please provide the following information to proceed
      </p>
      {Object.entries(byPerson).map(([personId, reqs]) => {
        const person = people.find((p) => p.id === personId);
        return (
          <div
            key={personId}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <h3 className="font-semibold text-gray-900 mb-3">
              {person?.name || 'Unnamed'}
            </h3>
            <div className="space-y-3">
              {reqs.map((req, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {req.label}
                    <span className="text-xs text-gray-500 ml-2">
                      (for {req.itemName})
                    </span>
                  </label>
                  {req.field === 'shoeSize' && (
                    <select
                      value={person?.[req.field] || ''}
                      onChange={(e) =>
                        onUpdatePerson(personId, req.field, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select size</option>
                      <option value="EU 38">EU 38</option>
                      <option value="EU 39">EU 39</option>
                      <option value="EU 40">EU 40</option>
                      <option value="EU 41">EU 41</option>
                      <option value="EU 42">EU 42</option>
                      <option value="EU 43">EU 43</option>
                      <option value="EU 44">EU 44</option>
                    </select>
                  )}
                  {req.field === 'licenseCountry' && (
                    <input
                      type="text"
                      value={person?.[req.field] || ''}
                      onChange={(e) =>
                        onUpdatePerson(personId, req.field, e.target.value)
                      }
                      placeholder="e.g., USA, UK, Germany"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  )}
                  {req.field === 'dob' && (
                    <input
                      type="date"
                      value={person?.[req.field] || ''}
                      onChange={(e) =>
                        onUpdatePerson(personId, req.field, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// PAYMENT FORM COMPONENT
// ============================================================================

function CardLogo({ brand }) {
  if (brand === 'visa') return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white">
      <span className="text-[10px] font-extrabold italic tracking-tight text-blue-700">VISA</span>
    </span>
  );
  if (brand === 'mc') return (
    <span className="inline-flex items-center px-1 py-0.5 rounded border border-gray-200 bg-white gap-0">
      <span className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90 -mr-1.5 inline-block" />
      <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 opacity-90 inline-block" />
    </span>
  );
  if (brand === 'amex') return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-blue-600">
      <span className="text-[10px] font-bold tracking-tight text-white">AMEX</span>
    </span>
  );
  if (brand === 'discover') return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white">
      <span className="text-[10px] font-bold tracking-tight text-orange-500">DISC</span>
    </span>
  );
  return null;
}

function detectCardBrand(number) {
  const n = number.replace(/\s/g, '');
  if (n.startsWith('4')) return 'visa';
  if (n.startsWith('5') || n.startsWith('2')) return 'mc';
  if (n.startsWith('3')) return 'amex';
  if (n.startsWith('6')) return 'discover';
  return null;
}

function PaymentForm() {
  const [method, setMethod] = React.useState('card');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [saveCard, setSaveCard] = React.useState(false);

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + ' / ' + digits.slice(2);
    return digits;
  };

  const detectedBrand = detectCardBrand(cardNumber);

  const METHODS = [
    { id: 'card', label: 'Credit / Debit card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'klarna', label: 'Pay later with Klarna' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Payment</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Express checkout */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Express checkout</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors">
              <span className="text-base leading-none"></span>
              <span>Apple Pay</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-10 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm">
                <span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span>
              </span>
              <span>Pay</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or pay another way</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Method tiles */}
        <div className="space-y-2">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                method === m.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                method === m.id ? 'border-blue-500' : 'border-gray-300'
              }`}>
                {method === m.id && <span className="w-2 h-2 rounded-full bg-blue-500 block" />}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800">{m.label}</span>
              {m.id === 'card' && (
                <span className="flex items-center gap-1">
                  <CardLogo brand="visa" />
                  <CardLogo brand="mc" />
                  <CardLogo brand="amex" />
                  <CardLogo brand="discover" />
                </span>
              )}
              {m.id === 'paypal' && (
                <span className="text-sm font-bold">
                  <span className="text-blue-800">Pay</span><span className="text-blue-500">Pal</span>
                </span>
              )}
              {m.id === 'klarna' && (
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">Klarna</span>
              )}
            </button>
          ))}
        </div>

        {/* Card form */}
        {method === 'card' && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Card number</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {detectedBrand
                    ? <CardLogo brand={detectedBrand} />
                    : <span className="text-xs text-gray-300 select-none">0000</span>
                  }
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Expiry date</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM / YY"
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">CVC / CVV</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm">?</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cardholder name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name as it appears on card"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-xs text-gray-600">Save card for future bookings</span>
            </label>
          </div>
        )}

        {/* PayPal */}
        {method === 'paypal' && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-center space-y-3">
            <p className="text-sm text-gray-600">
              You'll be redirected to PayPal to complete your payment securely.
            </p>
            <div className="inline-flex items-center justify-center gap-1 px-5 py-2 rounded-full bg-yellow-400 text-sm font-bold text-blue-900">
              Pay with <span className="font-extrabold ml-1">PayPal</span>
            </div>
          </div>
        )}

        {/* Klarna */}
        {method === 'klarna' && (
          <div className="rounded-lg bg-pink-50 border border-pink-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-pink-200 text-pink-800 text-xs font-bold">Klarna</span>
              <span className="text-sm font-medium text-gray-800">Pay in 3 interest-free installments</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
              <div className="bg-white rounded-md p-2 border border-pink-100">
                <div className="font-semibold text-gray-800 mb-0.5">Today</div>
                <div>1st payment</div>
              </div>
              <div className="bg-white rounded-md p-2 border border-pink-100">
                <div className="font-semibold text-gray-800 mb-0.5">30 days</div>
                <div>2nd payment</div>
              </div>
              <div className="bg-white rounded-md p-2 border border-pink-100">
                <div className="font-semibold text-gray-800 mb-0.5">60 days</div>
                <div>3rd payment</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">No interest. No fees. Subject to Klarna approval.</p>
          </div>
        )}

        {/* Security footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>🔒</span> SSL encrypted · PCI DSS compliant
          </span>
          <span className="flex items-center gap-1">
            <CardLogo brand="visa" />
            <CardLogo brand="mc" />
            <CardLogo brand="amex" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// REVIEW STEP COMPONENT (Step 5)
// ============================================================================

function ReviewStep({
  cartItems,
  people,
  assignments,
  leadBooker,
  setLeadBooker,
  total,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Review & Pay</h2>

      {/* Your Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Your details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={leadBooker.name}
            onChange={(e) => setLeadBooker({ ...leadBooker, name: e.target.value })}
            placeholder="Full name *"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="email"
            value={leadBooker.email}
            onChange={(e) => setLeadBooker({ ...leadBooker, email: e.target.value })}
            placeholder="Email *"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            value={leadBooker.country}
            onChange={(e) => setLeadBooker({ ...leadBooker, country: e.target.value })}
            placeholder="Country"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="tel"
            value={leadBooker.phone}
            onChange={(e) => setLeadBooker({ ...leadBooker, phone: e.target.value })}
            placeholder="Phone (optional)"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Payment */}
      <PaymentForm />

      {/* Trip Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Trip Itinerary</h3>
        <div className="space-y-2 text-sm">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3" />
              <div>
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-gray-600">
                  {item.type === 'hotel' && `${item.checkIn} to ${item.checkOut}`}
                  {item.type === 'activity' && item.date && `${item.date} at ${item.time}`}
                  {item.type === 'carRental' && `${item.pickup} to ${item.dropoff}`}
                  {item.type === 'tourPackage' && `${item.startDate} to ${item.endDate}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policies */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
        <p className="text-sm text-gray-600">
          Free cancellation up to 48 hours before start date. After that, 50% refund.
        </p>
      </div>

      {/* Terms */}
      <label className="flex items-start">
        <input
          type="checkbox"
          checked={leadBooker.consent}
          onChange={(e) =>
            setLeadBooker({ ...leadBooker, consent: e.target.checked })
          }
          className="mt-1 mr-2"
        />
        <span className="text-sm text-gray-700">
          I agree to the terms and conditions, cancellation policy, and privacy policy *
        </span>
      </label>

      {/* Total */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ORDER SUMMARY COMPONENT (Desktop sidebar)
// ============================================================================

function OrderSummary({ cartItems, total }) {
  return (
    <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.name}</span>
            <span className="font-medium">
              ${
                item.type === 'hotel'
                  ? item.pricePerNight * item.nights * item.rooms
                  : item.type === 'activity'
                  ? item.pricePerPerson * item.participants
                  : item.type === 'tourPackage'
                  ? item.pricePerPerson * item.participants
                  : item.pricePerDay * item.days
              }
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUCCESS SCREEN COMPONENT
// ============================================================================

function SuccessScreen({ orderNumber, cartItems }) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  React.useEffect(() => {
    if (countdown === 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Order #{orderNumber}</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Your Iceland Adventure</h2>
          <div className="space-y-2 text-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-gray-600">
                    {item.type === 'hotel' && `${item.checkIn} to ${item.checkOut}`}
                    {item.type === 'activity' && item.date && `${item.date} at ${item.time}`}
                    {item.type === 'carRental' && `${item.pickup} to ${item.dropoff}`}
                    {item.type === 'tourPackage' && `${item.startDate} to ${item.endDate}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>A confirmation email has been sent to your email address.</p>
          <p className="mt-2">Have a wonderful trip to Iceland! 🇮🇸</p>
          <p className="mt-4 text-gray-400">
            Returning to homepage in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </div>
  );
}
