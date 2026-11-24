// Placeholder event data until the `events` table exists (work plan Phase 3).
// Phase 3 replaces these two functions with Supabase queries; pages only use the functions.

const events = [
  {
    id: 'treasure-patch-market',
    name: 'The Treasure Patch Market',
    date: 'Coming Soon',
    category: 'Family Market',
    description: 'Discover unique stalls, wonderful finds and fun activities for the whole family.',
  },
  {
    id: 'kids-events-activities',
    name: 'Kids Events & Activities',
    date: 'Coming Soon',
    category: 'Children',
    description: 'Creative activities, competitions and memorable experiences for little ones.',
  },
  {
    id: 'social-events-celebrations',
    name: 'Social Events & Celebrations',
    date: 'Coming Soon',
    category: 'Social',
    description: 'Bringing people together through exciting and unforgettable events.',
  },
]

export function getEvents() {
  return events
}

export function getEvent(id) {
  return events.find((event) => event.id === id) ?? null
}
