// Dev-only: preview logged-in screens without Supabase.
// Usage (npm run dev): http://localhost:5173/?preview=customer
// Options: customer | pending | declined | admin
// (The approved-vendor dashboard queries Supabase directly, so it can't be previewed this way.)
// Always returns null in production builds, and the mock data below is stripped from the bundle.

// Read once on first load, so the preview survives navigating to pages without ?preview= in the URL.
let cached

export function getDevPreview() {
  if (!import.meta.env.DEV) return null
  if (cached !== undefined) return cached

  const user = {
    id: 'preview-user',
    email: 'preview@example.com',
    user_metadata: { full_name: 'Thandi Preview', phone: '082 000 0000' },
  }

  const application = (status, notes) => ({
    id: 'preview-application',
    status,
    business_name: 'Preview Crafts & Co',
    created_at: new Date().toISOString(),
    admin_notes: notes,
  })

  const previews = {
    customer: { role: 'customer', application: null },
    pending: { role: 'customer', application: application('pending_review', null) },
    declined: {
      role: 'customer',
      application: application(
        'declined',
        "We're fully booked for food stalls this season. You're welcome to apply again for the spring markets."
      ),
    },
    admin: {
      role: 'admin',
      application: null,
      applications: [
        {
          id: 'preview-app-1',
          status: 'pending_review',
          business_name: 'Preview Crafts & Co',
          contact_name: 'Thandi Preview',
          business_email: 'hello@previewcrafts.example',
          business_phone: '082 000 0000',
          business_description: 'Handmade candles, soaps and gift hampers.',
          created_at: new Date().toISOString(),
        },
        {
          // Old-style column names, to check the fallback still renders
          id: 'preview-app-2',
          status: 'pending_review',
          business_name: 'Legacy Bakes',
          contact_name: 'Sipho Example',
          email: 'orders@legacybakes.example',
          phone: '083 111 2222',
          description: 'Koeksisters, rusks and seasonal baked goods.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    },
  }

  const preview = previews[new URLSearchParams(window.location.search).get('preview')]
  cached = preview ? { user, ...preview } : null
  return cached
}
