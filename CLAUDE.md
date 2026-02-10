# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A **low-fidelity wireframe prototype** for an Iceland travel booking site's unified cart and checkout flow. This is a single-page React application demonstrating how users can mix and match hotels, activities, tour packages, and car rentals in one cart and complete checkout in a single flow.

**Key Characteristic**: This is a prototype with dummy data, not a production application. Focus is on UI/UX flow and state management logic, not backend integration or real payment processing.

## Architecture

### Multi-Page React Application with Routing

The application uses React Router for navigation between browsing pages and checkout.

**Main structure**:
```
src/
├── App.jsx              # Router configuration
├── CartContext.jsx      # Global cart state (Context API)
├── components/
│   └── Layout.jsx       # Header + navigation wrapper
└── pages/
    ├── Home.jsx         # Landing page
    ├── Hotels.jsx       # Browse hotels
    ├── Activities.jsx   # Browse activities
    ├── Tours.jsx        # Browse tour packages
    ├── CarRentals.jsx   # Browse car rentals
    └── Checkout.jsx     # 5-step checkout flow
```

**Checkout components** (defined in Checkout.jsx):
- `StepNav` - Progress indicator
- `ConflictBanner` - Displays blocks and warnings
- `CartReview` - Step 1 content
- `ScheduleStep` - Step 2 content
- `PeopleManager` - Step 3 content
- `RequirementsForm` - Step 4 content
- `ReviewStep` - Step 5 content
- `OrderSummary` - Desktop sidebar
- `SuccessScreen` - Post-checkout confirmation

### Core State Management

**Global cart state** (via CartContext):
```javascript
cartItems[]      // Cart items with type discriminator
cartCount        // Number of items in cart
total            // Computed total price
addToCart()      // Add item to cart
removeFromCart() // Remove item by id
updateCartItem() // Update item properties
clearCart()      // Empty cart
```

**Checkout-specific state** (local to Checkout component):
```javascript
people[]         // Participant/guest list
assignments{}    // Maps itemId -> personId[]
leadBooker{}     // Contact info for booking
```

**Computed state** (via `useMemo`):
- `requirements` - Dynamically computed from cart + people + assignments
- `{ blocks, warnings }` - Conflict detection results
- `total` - Sum of all cart item prices

### Mental Model

**Requirements Engine**: Each cart item can generate required fields based on its properties and assigned people. For example:
- Activity with `requiresShoeSize: true` → requires shoe size for each participant
- Car rental with `needsDriver: true` → requires license country + DOB for driver
- Tour package with included activities → inherits their requirements

**Conflict Detection**: Validates cart state and flags issues:
- **Hard blocks** prevent proceeding (e.g., overlapping activity times)
- **Warnings** allow proceeding but show alerts (e.g., 4x4 recommended)

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build
# Output to ./dist/

# Preview production build
npm preview
```

## Tech Stack Details

- **React 18**: Functional components, hooks only (no classes)
- **React Router v6**: Client-side routing
- **Vite**: Fast dev server and build tool
- **TailwindCSS**: Utility-first styling, configured via `tailwind.config.js`
- **PostCSS**: Required for Tailwind processing

**State management**: React Context API (CartContext) for cart, local state for checkout
**No external libraries for**:
- Form validation (manual validation in code)
- UI components (built with Tailwind)

## Working with Cart Items

### Item Types

Cart items use a `type` discriminator: `'hotel' | 'activity' | 'tourPackage' | 'carRental'`

Each type has different properties:

```javascript
// Hotel
{ type: 'hotel', nights, checkIn, checkOut, rooms, guestsPerRoom, pricePerNight }

// Activity
{ type: 'activity', date, time, participants, pricePerPerson, minAge?, requiresShoeSize? }

// Tour Package
{ type: 'tourPackage', startDate, endDate, days, participants, pricePerPerson, includedActivities[] }

// Car Rental
{ type: 'carRental', pickup, dropoff, pickupDate, dropoffDate, days, pricePerDay, category, needsDriver, recommended?, passengers?, luggage?, transmission? }
```

### Adding New Item Types

1. Add to `INITIAL_CART_ITEMS` with new type discriminator
2. Update `computeRequirements()` to handle new type's requirements
3. Update `detectConflicts()` if new type can conflict with others
4. Update `total` calculation in useMemo
5. Update `CartReview` component to render new type
6. Add assignment logic in `PeopleManager` if applicable

### Editing Cart Items

Cart items can be edited after being added to the cart. The edit flow:

1. **Cart Review** - Each cart item has an "Edit" button in the `CartReview` component
2. **Navigation** - Clicking "Edit" navigates to the detail page with `?edit={itemId}` query parameter
3. **Pre-population** - Detail page detects edit mode and loads existing cart item data
4. **Update** - User modifies fields and clicks "Update Cart" (instead of "Add to Cart")
5. **Save** - Uses `updateCartItem()` instead of `addToCart()` and returns to `/checkout`

**Implementation for car rentals:**
- Edit button calls `handleEditItem(item)` which navigates to `/car-rentals/{carId}?edit={itemId}`
- `CarRentalDetail` uses `useSearchParams()` to detect edit mode
- `useEffect` loads existing item data into form fields
- `handleAddToCart` checks `editItemId` and uses `updateCartItem` when editing

**Adding edit support to other item types:**
1. Add case in `handleEditItem()` in Checkout.jsx for the item type
2. Update the detail page to accept `?edit={itemId}` query parameter
3. Load existing cart item data in `useEffect`
4. Conditionally use `updateCartItem()` vs `addToCart()`
5. Update button text and navigation based on edit mode

## Requirements System

### How It Works

`computeRequirements(cartItems, people, assignments)` iterates through cart items and checks:
1. What fields are required for this item type?
2. Which people are assigned to this item?
3. Do those people have values for the required fields?
4. If not, generate a requirement object

**Requirement object shape**:
```javascript
{
  itemId: 'activity-2',
  itemName: 'Glacier Hike',
  personId: 'person-123',
  personName: 'John Doe',
  field: 'shoeSize',        // Person field to populate
  label: 'Shoe Size'         // Display label
}
```

### Adding New Requirements

To add a new requirement type:
1. Add field to person object in `handleAddPerson()`
2. Add condition in `computeRequirements()` for when to require it
3. Add input field in `RequirementsForm` component for collection

Example:
```javascript
// In computeRequirements():
if (item.type === 'diving' && item.needsCertification) {
  assignedPeople.forEach((personId) => {
    const person = people.find((p) => p.id === personId);
    if (person && !person.divingCert) {
      requirements.push({
        itemId: item.id,
        itemName: item.name,
        personId,
        personName: person.name,
        field: 'divingCert',
        label: 'Diving Certification Number',
      });
    }
  });
}

// In RequirementsForm:
{req.field === 'divingCert' && (
  <input
    type="text"
    value={person?.[req.field] || ''}
    onChange={(e) => onUpdatePerson(personId, req.field, e.target.value)}
    placeholder="Certification #"
    className="w-full border border-gray-300 rounded-md px-3 py-2"
  />
)}
```

## Conflict Detection

### Current Conflicts

**Hard blocks** (prevent proceeding):
- Time overlap: Two activities scheduled for same date + time

**Warnings** (allow proceeding):
- Recommendation: Car rental category recommended for self-drive

### Adding New Conflicts

Update `detectConflicts(cartItems)` function:

```javascript
// Example: Block if hotel checkout is before activity date
const hotelItem = cartItems.find(item => item.type === 'hotel');
const activities = cartItems.filter(item => item.type === 'activity');

activities.forEach(activity => {
  if (activity.date && activity.date < hotelItem.checkIn) {
    blocks.push({
      type: 'date_mismatch',
      message: `Activity "${activity.name}" is scheduled before hotel check-in`,
      items: [activity.id, hotelItem.id],
    });
  }
});
```

## Styling Conventions

### Tailwind Utility Classes

All styling uses Tailwind utilities directly in JSX:
- Layout: `flex`, `grid`, `space-y-4`, `gap-3`
- Spacing: `p-4`, `mx-auto`, `mt-6`
- Colors: `bg-white`, `text-gray-900`, `border-gray-200`
- Responsive: `lg:col-span-2`, `sm:grid-cols-2`, `hidden lg:block`

### Color Palette (Wireframe Style)

- **Neutral grays**: `gray-50` (bg), `gray-200` (borders), `gray-600`/`gray-900` (text)
- **Primary blue**: `blue-600` (buttons, accents)
- **Success green**: `green-600` (completed steps, success states)
- **Warning yellow**: `yellow-50`/`yellow-600` (warning banners)
- **Error red**: `red-50`/`red-600` (blocking issues)

### Responsive Breakpoints

- **Mobile-first**: Base styles for mobile
- **sm** (640px): Subtle layout adjustments
- **lg** (1024px): Desktop layout with sidebar, hidden mobile controls

## Step Flow Logic

### Navigation Guards

`canProceedToNextStep()` checks if current step is complete:
- Step 0 (Cart): Cart not empty
- Step 1 (Schedule): All activities have date + time selected
- Step 2 (Participants): At least one person added
- Step 3 (Requirements): All requirements satisfied (`requirements.length === 0`)
- Step 4 (Review): Lead booker info filled + consent checked

**Blocking issues** (from `detectConflicts()`): If `blocks.length > 0`, Continue button is disabled regardless of step completion.

### Adding New Steps

1. Add step name to `steps` array in `StepNav`
2. Add conditional render in main content area: `{currentStep === 5 && <NewStep />}`
3. Update `canProceedToNextStep()` logic
4. Update final step check: `{currentStep < 5 ? ... : ...}`

## Routing & Navigation

### Routes

```javascript
/                  # Home page (landing)
/hotels            # Browse hotels
/activities        # Browse activities
/tours             # Browse tour packages
/car-rentals       # Browse car rentals
/checkout          # 5-step checkout flow
```

All routes except `/checkout` use the `Layout` wrapper which provides the header with navigation and cart badge.

### Adding New Routes

1. Create page component in `src/pages/`
2. Add route to `App.jsx`:
   ```javascript
   <Route
     path="/new-page"
     element={
       <Layout>
         <NewPage />
       </Layout>
     }
   />
   ```
3. Add navigation link to `Layout.jsx` header

### Cart Context Usage

**In browsing pages** (Hotels, Activities, Tours, CarRentals):
```javascript
import { useCart } from '../CartContext';

function MyPage() {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      type: 'hotel',
      name: 'Hotel Name',
      // ...other properties
    });
  };
}
```

**In checkout**:
```javascript
const { cartItems, removeFromCart, updateCartItem, total } = useCart();
```

## Working with Browsing Pages

### Page Structure Pattern

All browsing pages follow the same pattern:
1. Import `useCart` hook
2. Define dummy data array (HOTELS, ACTIVITIES, TOURS, CAR_RENTALS)
3. Track "added" state for button feedback
4. Render grid of cards
5. Each card has "Add to Cart" button with feedback

### Adding New Items to Dummy Data

**Hotels** (`src/pages/Hotels.jsx`):
```javascript
{
  name: 'Hotel Name',
  location: 'City',
  description: 'Description text',
  pricePerNight: 150,
  image: '🏨', // Emoji placeholder
}
```

**Activities** (`src/pages/Activities.jsx`):
```javascript
{
  name: 'Activity Name',
  description: 'Description text',
  duration: '3 hours',
  pricePerPerson: 120,
  minAge: 18,              // 0 for no restriction
  requiresShoeSize: false, // true if gear needed
  image: '⛷️',
}
```

**Tours** (`src/pages/Tours.jsx`):
```javascript
{
  name: 'Tour Name',
  description: 'Description text',
  days: 4,
  pricePerPerson: 450,
  image: '🚌',
  includedActivities: [
    { name: 'Activity', requiresShoeSize: true },
  ],
  included: [
    '3 nights accommodation',
    'All transportation',
  ],
}
```

**Car Rentals** (`src/pages/CarRentals.jsx`):
```javascript
{
  name: 'Economy Car',
  category: 'Economy',              // Economy, SUV, 4x4, Luxury, Camper, Electric
  description: 'Description text',
  pricePerDay: 45,
  passengers: 5,                    // Passenger capacity
  luggage: 2,                       // Luggage capacity
  transmission: 'Manual',           // Manual or Automatic
  needsDriver: true,                // Always true for car rentals
  recommended: 'F-roads',           // Optional - what this car is recommended for
  image: '🚗',
}
```

### Add to Cart Button Pattern

All pages use this pattern for visual feedback:
```javascript
const [addedItems, setAddedItems] = useState(new Set());

const handleAddToCart = (item) => {
  // Create cart item with defaults
  const cartItem = { /* ... */ };
  addToCart(cartItem);

  // Show "Added" feedback
  setAddedItems(new Set(addedItems).add(item.name));

  // Reset after 2 seconds
  setTimeout(() => {
    setAddedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(item.name);
      return newSet;
    });
  }, 2000);
};

// Button rendering
<button className={addedItems.has(item.name) ? 'bg-green-600' : 'bg-blue-600'}>
  {addedItems.has(item.name) ? '✓ Added to Cart' : 'Add to Cart'}
</button>
```

## Common Modifications

### Adding a New Cart Item

Update `INITIAL_CART_ITEMS` array at top of file:
```javascript
{
  id: 'unique-id',
  type: 'activity', // or hotel, tourPackage, carRental
  name: 'New Activity',
  // ... type-specific fields
  needsInfo: true,
}
```

### Adjusting Prices

Prices are in the cart item objects. Change `pricePerNight`, `pricePerPerson`, `pricePerDay` values in `INITIAL_CART_ITEMS`.

### Changing Date/Time Options

Hardcoded in `ScheduleStep` component's `<select>` elements. Update `<option>` values.

### Modifying Person Fields

Person objects are minimal by default. Add fields:
1. In `handleAddPerson()` - set default value
2. In `PeopleManager` - add input field if needed in person card
3. In `RequirementsForm` - add input for requirement collection

## Testing the Flow

### Manual Test Cases

1. **Happy path**: Proceed through all 5 steps with valid data
2. **Conflict block**: Set both activities to same date/time → Continue button disabled
3. **Missing requirements**: Skip filling shoe size → blocked at step 3
4. **Assignment shortcut**: Use "Use hotel guests for all" button in step 2
5. **Mobile responsive**: Test on narrow viewport (<640px)

### Dummy Data Scenarios

Pre-populated cart demonstrates:
- ✅ Time overlap conflict (must select same date/time manually)
- ✅ Shoe size requirements (activity-2 and tour-1)
- ✅ Car rental recommendation warning
- ✅ Min age validation (activity-1 requires DOB)
- ✅ Driver requirements (car-1 requires license + DOB)

## Converting to Production

To evolve this prototype into a real application:

### Immediate Next Steps
1. **Add routing**: Install `react-router-dom`, split into routes
2. **Form validation**: Add `react-hook-form` + `zod` for robust validation
3. **API integration**: Replace dummy data with fetch calls
4. **Loading states**: Add loading spinners during data fetch
5. **Error handling**: Add try/catch, error boundaries, user-facing error messages

### Architecture Changes
1. **Split components**: Extract into separate files in `src/components/`
2. **State management**: Consider Zustand or Context for shared state
3. **Type safety**: Convert to TypeScript
4. **API layer**: Create services/api directory with typed endpoints
5. **Testing**: Add Vitest + React Testing Library

### Production Features
1. **Real payment**: Integrate Stripe or similar
2. **Authentication**: Add user accounts, login flow
3. **Backend**: Build API for cart persistence, booking management
4. **Confirmation emails**: Send booking confirmations
5. **Booking management**: Allow users to view/modify/cancel bookings

## File Organization (Current)

```
kti-cart/
├── src/
│   ├── App.jsx              # Router configuration
│   ├── CartContext.jsx      # Global cart state (Context API)
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind imports + global styles
│   ├── components/
│   │   └── Layout.jsx       # Header + navigation
│   └── pages/
│       ├── Home.jsx         # Landing page
│       ├── Hotels.jsx       # Browse hotels
│       ├── Activities.jsx   # Browse activities
│       ├── Tours.jsx        # Browse tour packages
│       ├── CarRentals.jsx   # Browse car rentals
│       └── Checkout.jsx     # 5-step checkout (1000+ lines)
├── index.html               # HTML template
├── package.json             # Dependencies (includes react-router-dom)
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── .gitignore               # Git ignore rules
```

**Why is Checkout.jsx still large?** The checkout flow is complex with many interdependent components. Keeping them in one file makes it easier to understand the complete flow. Browsing pages are separate for clarity.

## Key Constraints

1. **No backend**: All data is in-memory, resets on page refresh
2. **No real payment**: "Pay Now" button just shows success screen
3. **Static availability**: Date/time options are hardcoded
4. **No persistence**: Cart and user data lost on reload
5. **Dummy validation**: Age checks just verify DOB field exists, don't calculate actual age

These constraints are **intentional** for a prototype. They keep focus on UX flow and state management patterns.
