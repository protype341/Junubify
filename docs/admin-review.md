# Admin upload review

The review UI is available at `/admin.html`. It requires an authenticated Supabase user whose trusted **app metadata** contains `role: "admin"`.

## Enable the review workflow

1. Run `supabase/migrations/20261114000000_admin_track_review.sql` in the Supabase SQL editor after the platform backend migration.
2. Assign `role: "admin"` in the selected user's Supabase Auth **app metadata** using a trusted Auth admin workflow. Never allow the user to set this role from the client or put a service-role key in the browser. Refresh the user's session after changing the role so the JWT includes the updated claim.
3. Sign in at `/admin.html` using that account. The queue supports private audio previews, approval (publishes the track), rejection, and refresh.

The database policies enforce admin access even if someone bypasses the UI. Artists and ordinary signed-in users cannot see the review queue or update track status.
