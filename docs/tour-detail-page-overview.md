# Tour Detail Page — Overview

This document describes what information the Tour Detail page displays and what options it offers to the user. It is intended as a reference for comparing the frontend requirements against the booking backend data model.

---

## What the Page Does

The Tour Detail page is the main product page for a single tour. A user arrives here from the tours list, reviews all tour information, selects accommodation and activities for each day of the trip, chooses how many people are travelling, and adds the configured tour to their cart.

---

## Tour Identity

Each tour has:
- A **title** (the full display name)
- A **tour type**: either **Guided** or **Self-drive** — this affects several parts of the page (see below)
- A **duration** in days (and the derived number of nights, which is days minus one)
- A **season** — a start date and end date showing when the tour runs (e.g. "May 1 – Sep 30")
- A **base price per person**

---

## Tour Description Box

A summary box near the top of the page contains:

- The tour type badge and a note relevant to the type (for self-drive: a note that the traveller drives themselves; for guided: the departure location)
- The duration
- A free-text **description** paragraph
- A list of **what is included** in the base price (accommodation, transfers, guides, etc.)
- A secondary list of additional included items (e.g. airport pickup/dropoff)
- A set of **preference tags** categorised as:
  - Travel style (e.g. Adventure, Nature, Road Trip)
  - Way of travel (e.g. Self-drive, Small group)
  - Interests (e.g. Waterfalls, Glaciers, Wildlife)
  - Regions covered (e.g. South Iceland, East Iceland)

---

## Day-by-Day Selection

The core interactive section of the page. The tour is broken into individual days. For each day the backend must supply:

- The **day number** (1-based)
- A **calendar date**
- The **city** and **region** for that day

### Accommodation (per day, except the last day)

Each day (except the final departure day) offers a list of **accommodation options** to choose from. The user picks one. For each option the backend must supply:

- Name
- Star/quality rating (numeric, out of 10)
- Number of reviews
- Price per night
- Category (e.g. 3-star Hotel, Hostel, Apartment)
- Check-in and check-out times
- Distance from the town centre
- A photo

Only one accommodation can be selected per day (radio-button behaviour). The last day never shows accommodation.

### Activities (per day, all days)

Each day also offers a list of **optional activities** the user can add. Multiple activities can be selected on the same day. For each activity the backend must supply:

- Name
- Rating and review count
- Price per person
- Duration (e.g. "3h", "Half-day")
- A photo
- A short description (shown when the user taps "Learn more")

---

## Booking Panel (right column)

A sticky panel on the right side of the page that the user uses to configure and book the tour. It contains:

### Pricing & Booking

- The base price per person
- Duration summary (X days / Y nights)
- A **start date** selector (date the tour begins)
- A **traveller count** selector (minimum 1, increments by 1)
- A calculated total (number of travellers × base price per person)
- An **Add to Cart** button (becomes **Update Cart** when editing an existing booking)

### Selection Summary

Two collapsible groups that reflect the user's current choices:

- **Hotels** — one row per non-last day, showing the selected hotel name or "Not selected"
- **Activities** — one row per day, showing selected activity names or "Not selected"

Both groups collapse by default and automatically expand the first time the user makes a selection in that category.

### Transport Information

Displayed below the selection summary. The content depends on tour type:

**Self-drive tours — Car Rental box:**
- Photo of the recommended car
- Car type and transmission
- Make and model
- Price per day
- A note about road requirements (e.g. "4x4 strongly recommended")

**Guided tours — Transport box:**
- Photo of the tour vehicle (minibus, super jeep, etc.)
- Vehicle type and "Included" label
- Passenger capacity
- A note about what transport is provided

---

## Checklist: What to Bring

A simple list of recommended items for the traveller to pack. Each item is shown as a checklist entry.

---

## Conditions

Three collapsible sections:

1. **Cancellation policy** — the refund and cancellation terms
2. **Important information** — health, fitness, and legal requirements (e.g. minimum driver age, licence requirements)
3. **Terms & Conditions** — payment schedule and booking confirmation process

---

## Photo Gallery

A grid of tour photos. Clicking a photo opens it full-screen. The backend should supply a list of image URLs.

---

## Optional Extras

A read-only display of additional products the traveller can add to their booking (handled separately at checkout). Extras are grouped into categories (e.g. Activities, Meals, Upgrades). For each extra the backend supplies:

- Title
- Description
- Price
- Pricing unit: **per person**, **per day**, or **per booking**

---

## What Gets Added to the Cart

When the user clicks Add to Cart, the following data is captured:

- The tour being booked (by ID)
- Tour type (guided or self-drive)
- Number of days
- Number of travellers
- Base price per person
- Start date
- The full set of day-by-day selections:
  - Which accommodation was chosen for each day
  - Which activities were chosen for each day (across all days)
- A flat list of all selected activities (used downstream in checkout to determine what information needs to be collected from each traveller)

---

## Edit Mode

If a user returns to this page to change an existing booking, the page pre-fills all previously made selections (traveller count, start date, accommodation and activity choices). The Add to Cart button reads "Update Cart" and saves changes back to the existing cart item rather than creating a new one.

---

## Summary: Data the Backend Must Provide

| Area | Required fields |
|---|---|
| Tour identity | ID, title, type (guided/self-drive), total days, price per person, season (start/end dates) |
| Description | Text description, included items, additional included items, preference tags (style, travel mode, interests, regions) |
| Days | Day number, calendar date, city, region |
| Accommodation (per day) | Name, rating, review count, price per night, category, check-in/out times, distance from centre, photo |
| Activities (per day) | Name, rating, review count, price per person, duration, photo, description |
| Transport | Type (guided/self-drive), vehicle or recommended car details, notes |
| Conditions | Cancellation policy text, important information text, terms text |
| Bring with you | List of recommended items |
| Gallery | List of image URLs |
| Optional extras | Category name, product title, description, price, pricing unit |
