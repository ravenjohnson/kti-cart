# Tour Detail Page — Documentation

## Overview

The Tour Detail page (`/tours/:tourId`) is the primary product page for a single tour. It presents all tour information, allows the user to interactively select accommodation and activities for each day, and adds the configured tour to the cart.

The page has a **two-column layout** on desktop:
- **Left column** (2/3 width) — tour content, day-by-day selection
- **Right column** (1/3 width, sticky) — booking panel, summary, transport/car rental

---

## Tour Types

Every tour has a `tourType` field that drives layout differences throughout the page.

| Value | Label shown | Transport box | Description section note |
|---|---|---|---|
| `guided` | Guided tour (green badge) | Minibus / Super Jeep included | Start location shown |
| `self_drive` | Self-drive (blue badge) | Car rental recommendation | Self-drive callout note |

---

## Data Model

Each tour in `TOUR_DATA` is keyed by its ID (e.g. `ring-road`, `south-coast`). Below is a full description of every field.

### Top-level fields

| Field | Type | Description |
|---|---|---|
| `id` | string | URL slug, matches the route parameter `:tourId` |
| `title` | string | Full display name of the tour |
| `image` | string (URL) | Hero image shown at the top of the left column |
| `tourType` | `'guided'` \| `'self_drive'` | Determines transport display, badge colour, and description note |
| `totalDays` | number | Total number of days (nights = totalDays − 1) |
| `priceFrom` | number | Base price per person in USD, used for all price calculations |
| `season` | `{ startDate, endDate }` | ISO date strings shown as a season range pill (e.g. "May 1 – Sep 30") |
| `description` | string | Paragraph shown inside the Description box |
| `highlights` | string[] | Bullet list of key selling points (currently stored but not rendered on the page) |
| `included` | string[] | Items shown with green ✓ inside the Description box |
| `extraIncluded` | string[] | Secondary included items shown with a dashed left border below the main included list |
| `notIncluded` | string[] | Stored but not currently rendered on the page |
| `bringWithYou` | string[] | Checklist shown in the Bring With You section |
| `conditions` | object | See Conditions below |
| `travelStyle` | string[] | Blue chips shown in the Preferences column of the Description box |
| `wayOfTravel` | string[] | Purple chips |
| `interests` | string[] | Green chips |
| `regionTags` | string[] | Orange chips |
| `transport` | object | See Transport below |
| `availabilityLabels` | string[] | Tag pills (currently commented out in the panel) |
| `media` | `{ images: string[] }` | Gallery image URLs |
| `extrasByCategory` | array | See Optional Extras below |
| `days` | array | See Day Structure below — the core interactive data |

### `conditions`

```
{
  cancellation:  string   // Cancellation policy text
  importantInfo: string   // Health / fitness / legal notes
  terms:         string   // Payment and confirmation terms
}
```

Each field becomes a collapsible Accordion row. Cancellation opens by default.

### `transport`

```
{
  allowCarRental:        boolean
  advisedAllDays:        boolean
  allowedCarCategories:  string[] | 'all'
  notes:                 string        // Shown as a note inside the panel box

  // Self-drive tours only:
  recommendedCar: {
    make:         string   // e.g. "Toyota"
    model:        string   // e.g. "Land Cruiser"
    type:         string   // e.g. "4x4 SUV"
    transmission: string   // e.g. "Automatic"
    pricePerDay:  number
    image:        string (URL)
  }

  // Guided tours only:
  vehicle: {
    type:     string   // e.g. "Minibus", "Super Jeep"
    capacity: number   // Max passengers
    image:    string (URL)
  }
}
```

The right column renders either a **Car Rental** box (self-drive) or a **Transport** box (guided) based on which sub-field is present.

### Day Structure (`days[]`)

Each entry in the `days` array represents one calendar day of the tour.

```
{
  dayNumber:      number          // 1-based
  date:           string          // ISO date "YYYY-MM-DD"
  city:           string          // City name shown in the day header
  region:         string          // Region label shown below city
  accommodations: Hotel[]         // See below (empty array on last day)
  activities:     Activity[]      // See below
}
```

**Accommodation object:**
```
{
  id:            string
  name:          string
  rating:        number    // e.g. 8.8 out of 10
  reviewCount:   number
  pricePerNight: number
  category:      string    // e.g. "3-star Hotel", "Hostel", "Apartment"
  checkIn:       string    // e.g. "15:00"
  checkOut:      string    // e.g. "11:00"
  location:      string    // e.g. "0.4 km from centre"
  image:         string (URL)
}
```

**Activity object:**
```
{
  id:            string
  name:          string
  rating:        number
  reviewCount:   number
  pricePerPerson: number
  duration:      string    // e.g. "3h", "1.5h", "Half-day"
  image:         string (URL)
  description:   string    // Shown in the Learn More modal
}
```

### `extrasByCategory`

Optional extras are grouped into categories for display at the bottom of the page.

```
[
  {
    category: string
    products: [
      {
        title:       string
        description: string
        price:       number
        pricingUnit: 'per_person' | 'per_day' | 'per_booking'
      }
    ]
  }
]
```

---

## Page Sections (Left Column)

### Hero
Full-width banner image with tour type badge, duration pill, season range, title, and "from $X / person" price. Rendered by `TourHero`.

### Description box
Rendered by `TourBasics`. Contains:
- Tour type badge and start location (guided) or self-drive notice
- Duration row
- Description paragraph
- Two-column bottom section: **Included** (green ✓ list) on the left, **Preferences** (colour-coded chips) on the right

### Day-by-Day Selection
Rendered by `TourDays`. For each day:
- **Day header** — blue day number tile, formatted date (e.g. "Saturday, June 7"), city and region
- **Accommodation section** — horizontal scrollable row of `AccommodationCard` components. Radio-style selection (one per day). Hidden on the last day.
- **Activities section** — horizontal scrollable row of `ActivityCard` components. Checkbox-style selection (multiple allowed per day).

The last day (highest `dayNumber`) never shows an accommodation section.

### Bring With You
Simple checklist of recommended items. Rendered by `TourBringWithYou`.

### Transport (guided tours only)
Shown in the main column **only for guided tours**. Displays vehicle level, allowed categories, and notes. For self-drive tours this section is suppressed — transport is shown in the right column instead. Rendered by `TourTransport`.

### Conditions
Three collapsible accordions (Cancellation policy, Important information, Terms & Conditions). Rendered by `TourConditions`.

### Gallery
Responsive image grid. Clicking any image opens a full-screen lightbox overlay. Rendered by `TourMedia`.

### Optional Extras
Read-only product cards grouped by category (e.g. Activities, Meals, Upgrades). Rendered by `TourExtras`.

---

## Right Column — Booking Panel

The booking panel is sticky (`sticky top-6`). It consists of several stacked cards.

### Price & Booking card
- Price per person with "from" label
- Duration summary (X days · Y nights)
- **Start date** — date input (UI only, not used in cart logic)
- **Travelers** — increment/decrement counter (min 1)
- Price calculation row (N × $price)
- **Add to Cart / Update Cart** button — blue, switches to green with ✓ when activated

### Selection Summary
Rendered by `PanelSelectionSummary`. Two collapsible groups:

**Hotels** — lists every non-last day. Shows selected hotel name + "· included", or "Not selected" in muted italic. Starts collapsed; auto-expands when a hotel is first selected.

**Activities** — lists every day including last. Shows city and activity names for days with selections, "Not selected" otherwise. Starts collapsed; auto-expands when the first activity is selected.

Both groups show a count indicator in the header (e.g. `2/6` for hotels, `3` for activities).

### Transport / Car Rental card

Appears below the selection summary. Which card shows depends on `tourType`:

**Self-drive → Car Rental box**
- Thumbnail of the recommended car
- Type badge (red) + transmission
- Make and model
- Price per day
- Amber warning note from `transport.notes`

**Guided → Transport box**
- Thumbnail of the vehicle
- Type badge (green) + "Included" label
- "All transport included"
- Passenger capacity
- Blue info note from `transport.notes`

---

## Interactive State

### `daySelections`

The core selection state, initialised when the tour loads:

```js
{
  [dayNumber]: {
    accommodation: HotelObject | null,
    activities: ActivityObject[]
  }
}
```

- **Selecting a hotel**: `handleSelectAccommodation(dayNumber, hotel)` — replaces the current accommodation for that day. Clicking the same hotel again does not deselect (radio behaviour).
- **Toggling an activity**: `handleToggleActivity(dayNumber, activity)` — adds the activity if not present, removes it if already selected.

### Edit mode

If the page URL contains `?edit={itemId}`, the page loads in edit mode:
- Existing `participants` and `daySelections` from the cart item are pre-populated
- The button reads "Update Cart" instead of "Add to Cart"
- On submit, `updateCartItem()` is called instead of `addToCart()`

---

## Cart Item Shape

When added to cart, the tour produces an item of type `tourPackage`:

```js
{
  id:                  string       // "tour-{timestamp}"
  type:                'tourPackage'
  tourId:              string       // e.g. "ring-road" — used for edit navigation
  name:                string       // tour.title
  tourType:            string       // 'guided' | 'self_drive'
  days:                number       // tour.totalDays
  participants:        number
  pricePerPerson:      number       // tour.priceFrom
  startDate:           string       // date of day 1
  endDate:             string       // empty string (not calculated)
  daySelections:       object       // full daySelections state
  includedActivities:  array        // flat list of all selected activities (for requirements engine)
  needsInfo:           true
}
```

The `includedActivities` array is derived by flattening all selected activities across all days into objects of the shape `{ name, requiresShoeSize: false }`. This feeds the checkout requirements engine.

---

## Routing

| Path | Behaviour |
|---|---|
| `/tours/:tourId` | Normal view — add to cart |
| `/tours/:tourId?edit={itemId}` | Edit mode — pre-fills selections, updates existing cart item |

Navigation back to the tours list is via the breadcrumb at the top of the page.
