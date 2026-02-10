# Iceland Travel Checkout Prototype

A low-fidelity wireframe prototype demonstrating a unified cart and checkout flow for an Iceland travel booking site.

## Features

- **Browsing Pages**: Separate pages for Hotels, Activities, and Tour Packages with add-to-cart functionality
- **Mixed Cart Items**: Hotels, activities, tour packages, and car rentals in one cart
- **5-Step Checkout Flow**:
  1. Cart Review
  2. Schedule & Availability
  3. Participants Management
  4. Requirements Collection
  5. Review & Pay
- **Smart Requirements Engine**: Dynamically computes required fields based on cart items and assignments
- **Conflict Detection**: Hard blocks for overlapping activities, warnings for recommendations
- **Responsive Design**: Mobile-first with sticky bottom bar, desktop with right-rail summary
- **Global Cart State**: React Context API manages cart across all pages

## Tech Stack

- React 18 (functional components, hooks)
- React Router v6 (client-side routing)
- Vite (build tool)
- TailwindCSS (utility-first styling)
- Context API (global cart state)
- No backend - dummy data only

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm preview
```

## Project Structure

```
src/
├── App.jsx              # Router configuration
├── CartContext.jsx      # Global cart state
├── main.jsx             # React entry point
├── index.css            # Global styles + Tailwind imports
├── components/
│   └── Layout.jsx       # Header + navigation
└── pages/
    ├── Home.jsx         # Landing page
    ├── Hotels.jsx       # Browse hotels (6 items)
    ├── Activities.jsx   # Browse activities (6 items)
    ├── Tours.jsx        # Browse tour packages (4 items)
    └── Checkout.jsx     # 5-step checkout flow
```

## Dummy Data

### Browsing Pages
- **Hotels page**: 6 hotels across Iceland
- **Activities page**: 6 activities (snorkeling, glacier hike, ice caves, whale watching, northern lights, horseback riding)
- **Tours page**: 4 multi-day packages (4-day South Coast, 5-day Golden Circle, 7-day Ring Road, 3-day Northern Lights)

All items can be added to cart from their respective pages. Cart starts empty.

## Key Implementation Details

### Requirements Engine

The `computeRequirements()` function generates required fields based on:
- Activity gear requirements (shoe size for glacier hike)
- Car rental requirements (driver license + DOB)
- Tour package inherited requirements (from included activities)
- Age validation for activities with minimum age

### Conflict Detection

The `detectConflicts()` function checks for:
- **Hard blocks**: Time overlaps between activities on the same date/time
- **Warnings**: Car rental recommendations, self-drive contexts

### State Management

Single source of truth using React `useState`:
- `cartItems[]` - all cart items
- `people[]` - participant/guest list
- `assignments{}` - maps item IDs to person IDs
- `leadBooker{}` - contact information
- Requirements and conflicts are computed via `useMemo`

### Mobile-First Design

- Sticky bottom bar on mobile with condensed controls
- Right-rail order summary on desktop (lg+ breakpoint)
- Step navigation adapts to screen size

## Edge Cases Demonstrated

1. **Time Overlap Block**: Schedule two activities for the same date/time to trigger hard block
2. **Recommendation Warning**: Car rental shows 4x4 recommendation warning
3. **Requirement Inheritance**: Tour package included activity triggers shoe size requirement

## Future Enhancements

To convert this prototype into a production application:
- Add routing (React Router)
- Connect to real backend API
- Integrate payment gateway
- Add form validation library (e.g., React Hook Form + Zod)
- Add loading states and error handling
- Implement real date/time availability checking
- Add photo galleries for items
- Implement search and filtering
