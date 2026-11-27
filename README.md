# pop-up-events-website
Pop Up Events official website and booking platform

---

# Work Plan

Steps to get the site running and finish the brief. The tasks run from the quickest and simplest to the most complex. Finish each phase before starting the next, because later phases depend on earlier ones.

**Stack:** React 18 + Vite 6 front end, Supabase for auth, database and storage.

---

## Phase 0: Access & setup (before any code)

- [ ] 1. Get admin access to the client's Supabase project (Owner or Developer role).
- [ ] 2. In Supabase, open **Project Settings → API** and copy the Project URL and the anon key.
- [ ] 3. Copy `.env.example` (now in the project root) to `.env`. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- [ ] 4. Make sure `.env` is listed in `.gitignore`.
- [ ] 5. Run `npm install`.
- [ ] 6. Export the existing database schema, for example with `npx supabase db dump --schema public > supabase/schema.sql`, and commit it so the database is tracked in the repo.

---

## Phase 1: Fix what's broken (quick wins, under 1 day)

### 1.1 Fix the build-breaking syntax error (5 min)
- [x] In `src/AdminDashboard.jsx`, replace lines 35–45 with one call:
  ```js
  const { error } = await supabase.rpc('review_vendor_application', {
    application_id: id,
    decision,
    notes: notes[id] || null,
  })
  ```
- [x] Remove the `console.log` on line 45.
- [x] Run `npm run build` and confirm it passes.
- [x] Run `npm run dev` and confirm the homepage loads.

### 1.2 Remove debug output from the homepage (5 min)
- [x] Delete the "Logged-in user / Account role" block in `src/App.jsx` (around lines 162–166), along with the unused `connectionStatus` state.

### 1.3 Small cleanups (15 min)
- [x] Run `npm uninstall lucide-react`, or start using it for icons.
- [x] Fix the logo: `public/logo.png` was an empty 2-byte file, so the real logo was copied over it and the duplicate `Pop up events logo.png` was deleted.
- [x] Point the "Find Out More" event buttons somewhere real. For now they open an email enquiry with the event name in the subject, until Phase 3.
- [x] Move `.env.example` from `src/` to the project root.

### 1.4 Logout & navigation (1–2 hrs)
- [x] Add a styled logout button to a shared header that shows whenever a user is logged in.
- [x] Fix the admin and vendor dashboard nav links so they no longer point at hidden sections.
- [x] Hide the Login and Register forms once the user is logged in.
- [x] Style the vendor and admin dashboards to match the site (cards, buttons, text areas).
- [ ] Test all of the above with real admin, vendor and customer accounts once Supabase is connected (Phase 0).

### 1.5 Basic screens for customers and pending vendors (1–2 hrs)
- [x] Customer, logged in: show a simple "My Account" page with a placeholder for "My Tickets" (filled in during Phase 5).
- [x] Vendor, pending or declined: show the application status and any admin notes instead of sending them to the homepage.
- [ ] Test with real accounts once Supabase is connected. The lookup assumes `vendor_onboarding_applications.user_id`, and the notes column is read as `admin_notes`, `review_notes` or `notes`; confirm both in 1.6. Until then, preview the screens in dev with `?preview=customer`, `?preview=pending` or `?preview=declined`.

### 1.6 Check that database field names match (1–2 hrs)
- [ ] Compare the columns in `vendor_onboarding_applications` with what the code reads and writes.
- [x] Known mismatch: signup saves `business_email` and `business_description`, but the admin screen reads `email` and `description`. Pick one set of names and update the code or the database to match. (Code side done: standardised on `business_*`.)
- [ ] Once the schema is exported, confirm the table uses `business_email` / `business_phone` / `business_description`, then remove the fallback to the old names in `applicationDetails()` in `src/AdminDashboard.jsx`.
- [ ] Check the `vendor_profiles` table that `VendorDashboard.jsx` reads and writes. It's not mentioned elsewhere in this plan, and it uses `email` / `phone` / `description`.
- [ ] Check that the signup trigger creates the `profiles` row and the application row.
- [ ] Test the full flow: register as a vendor, then the admin approves, then the vendor sees the approved dashboard.

### 1.7 Lock down security (half a day)
- [ ] Enable row-level security (RLS) on every table.
- [ ] `profiles`: users can read and update only their own row and **cannot change their own `role`**.
- [ ] `vendor_onboarding_applications`: vendors can read only their own application; only admins can read all of them or update any.
- [ ] `review_vendor_application` RPC: add a check inside the function that the caller is an admin, using `SECURITY DEFINER` and a role check.
- [ ] Test with a non-admin account that you can't read other users' data or approve yourself.

### 1.8 Deploy (1 hr)
- [ ] Connect the repo to Vercel or Netlify.
- [ ] Add the two `VITE_` environment variables in the hosting dashboard.
- [ ] Add the live URL to Supabase **Auth → URL Configuration** (Site URL and Redirect URLs).
- [ ] Confirm that the live site builds and that login works.

**End of Phase 1:** the existing features work, are secure and are live.

---

## Phase 2: Account basics (1–2 days)

### 2.1 Real page routing
- [x] Run `npm install react-router-dom`.
- [x] Create routes: `/`, `/login`, `/register`, `/account`, `/vendor`, `/admin`, `/events`, `/events/:id`.
- [x] Add route guards so `/admin` is for admins only, `/vendor` for vendors only and `/account` for logged-in users.
- [x] Add a rewrite rule on the host so deep links don't return 404. Both `vercel.json` and `public/_redirects` (Netlify) are in place; delete whichever one isn't used once the host is chosen in 1.8.

### 2.2 Password reset
- [x] Add a "Forgot password" link that calls `supabase.auth.resetPasswordForEmail`. (The link on `/login` opens `/forgot-password`.)
- [x] Add a `/reset-password` page that calls `supabase.auth.updateUser({ password })`.
- [ ] Add `<live site>/reset-password` and `http://localhost:5173/reset-password` to Supabase **Auth → URL Configuration → Redirect URLs**, then test the full flow with a real account. Until then, preview in dev: without `.env`, `/forgot-password` shows the "email sent" screen, and `/reset-password?preview=customer` shows the new-password form.

### 2.3 Auth emails
- [ ] Customise the Supabase email templates (confirm signup, reset password) with the Pop Up Events branding.
- [ ] Set up a custom SMTP provider such as Resend, Postmark or SendGrid, because Supabase's built-in email has strict rate limits.

---

## Phase 3: Markets & events (2–3 days)

### 3.1 Database
- [ ] Create an `events` table: `id`, `title`, `description`, `venue`, `start_at`, `end_at`, `image_url`, `ticket_price`, `ticket_capacity`, `stall_price`, `stall_capacity`, `status` (draft/published/cancelled), `created_at`.
- [ ] RLS: anyone can read published events; only admins can insert, update or delete.
- [ ] Create a Supabase Storage bucket `event-images` (public read, admin write).

### 3.2 Admin event management
- [ ] Add an admin page to list all events.
- [ ] Add a create/edit form with all the fields above, including image upload to `event-images`.
- [ ] Add publish, unpublish and cancel actions.

### 3.3 Public event pages
- [ ] Replace the hard-coded "Coming Soon" cards on the homepage with published events from the database.
- [ ] Add an `/events` list page.
- [ ] Add an `/events/:id` detail page showing the description, date, venue, image and price, with a "Buy tickets" button for Phase 5.

---

## Phase 4: Vendor photos & stall booking (3–4 days)

### 4.1 Product photo uploads
- [ ] Create a private Storage bucket `vendor-photos`. Vendors can upload only to their own folder (`{user_id}/...`); admins can read everything.
- [ ] Create a `vendor_photos` table: `id`, `vendor_id`, `storage_path`, `caption`, `created_at`.
- [ ] Add an upload UI to the vendor application/dashboard that accepts multiple images and limits file type and size (e.g. 5 MB max).
- [ ] Show a gallery on the vendor dashboard with a delete option.

### 4.2 Admin review shows photos
- [ ] In the admin application review, show each vendor's photos using signed URLs.
- [ ] Add a notes field and approve/decline buttons (these already exist; check they still work).

### 4.3 Application status notifications
- [ ] Email the vendor when their application is approved or declined, using a Supabase Edge Function or database webhook plus the SMTP provider from 2.3.

### 4.4 Stall booking
- [ ] Create a `stall_bookings` table: `id`, `event_id`, `vendor_id`, `status` (requested/confirmed/cancelled), `paid` (bool), `created_at`.
- [ ] Enforce in the database (RLS or a trigger) that **only approved vendors** can create a booking.
- [ ] Enforce stall capacity per event so no booking can go over `stall_capacity`.
- [ ] Vendor UI: an event list with a "Book a stall" button, and a "My bookings" list.
- [ ] Admin UI: stall bookings for each event, with the option to confirm or cancel.
- [ ] Optional: stall fee payment, which reuses the Phase 5 payment flow.

---

## Phase 5: Ticket sales & payments (4–6 days, the most complex)

### 5.1 Choose a payment provider
- [ ] Confirm with the client which provider to use. **PayFast** or **Yoco** suits South Africa (ZAR); **Stripe** works if they're eligible.
- [ ] Create a merchant account and get sandbox/test keys.

### 5.2 Database
- [ ] Create an `orders` table: `id`, `user_id`, `event_id`, `quantity`, `amount`, `status` (pending/paid/failed/refunded), `provider_ref`, `created_at`.
- [ ] Create a `tickets` table: `id` (UUID), `order_id`, `event_id`, `user_id`, `code` (random and unguessable), `status` (valid/used/void), `used_at`, `used_by`.
- [ ] RLS: customers can read only their own orders and tickets; only the server (service role) can create tickets or mark them paid.

### 5.3 Checkout (server side, never in the browser)
- [ ] Write a Supabase Edge Function `create-checkout` that:
  - checks the event is published and has capacity left
  - creates a `pending` order with the price taken **from the database, not the browser**
  - creates the payment session with the provider and returns the redirect URL
- [ ] Front end: add a quantity selector on the event page that calls `create-checkout` and sends the user to the payment page.
- [ ] Add success and cancelled return pages.

### 5.4 Payment confirmation webhook
- [ ] Write an Edge Function `payment-webhook` that:
  - verifies the provider's signature (or PayFast ITN validation)
  - marks the order `paid`; this must be safe to run twice
  - creates one `tickets` row per quantity, each with a unique code
- [ ] Register the webhook URL in the provider dashboard.
- [ ] Test with sandbox payments, covering success, failure and a duplicate webhook.

### 5.5 Deliver tickets
- [ ] Generate a QR code from each ticket's `code`, using e.g. the `qrcode` npm package.
- [ ] Email the buyer their tickets after payment (QR image or a link to the tickets page).
- [ ] Add a "My Tickets" page in `/account` showing each ticket's QR code, event and status.

---

## Phase 6: Scanning tickets at the event (1–2 days)

- [ ] Add an admin-only `/scan` page that uses the phone camera, with e.g. `html5-qrcode` (needs HTTPS, which the live site has).
- [ ] Write an Edge Function or RPC `redeem-ticket` that:
  - confirms the caller is an admin or staff member
  - looks up the ticket by `code` and checks it belongs to the selected event
  - marks it `used` with `used_at` and `used_by` in a **single update**, so the same ticket can't be scanned twice at once
  - returns clear results: ✅ valid, ⚠️ already used (with the time), ❌ invalid or wrong event
- [ ] Show the result full-screen in green, amber or red, then go back to scanning.
- [ ] Add a manual code entry fallback for damaged screens.
- [ ] Test on a real phone with tickets printed out and shown on screen.

---

## Phase 7: Admin reporting & legal (1–2 days)

- [ ] Admin dashboard: tickets sold and revenue per event, check-in count, stall bookings.
- [ ] Export attendees and vendors to CSV.
- [ ] Add Terms & Conditions, a Privacy Policy (POPIA-compliant for South Africa) and a Refund Policy, linked in the footer and at checkout.
- [ ] Final end-to-end test on the live site with real (small) payments, then switch the provider to live keys.

---

## Rough total

| Phase | Effort |
|---|---|
| 0–1 Setup & fixes | ~2 days |
| 2 Account basics | 1–2 days |
| 3 Events | 2–3 days |
| 4 Vendor photos & booking | 3–4 days |
| 5 Tickets & payments | 4–6 days |
| 6 Scanning | 1–2 days |
| 7 Reporting & legal | 1–2 days |
| **Total** | **~14–21 days** |
