-- Run after 20261109000000_platform_backend.sql in the Supabase SQL editor.
-- Admin identity is read only from trusted auth.app_metadata (never user_metadata).
-- Set role=admin for selected users through a trusted Supabase Auth admin workflow.

create policy "Admins can read pending track submissions"
  on public.tracks for select to authenticated
  using (
    status = 'pending_review'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

grant update (status) on public.tracks to authenticated;

create policy "Admins can decide pending track submissions"
  on public.tracks for update to authenticated
  using (
    status = 'pending_review'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    status in ('published', 'rejected')
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admins can preview pending track audio"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'junubify-audio'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and exists (
      select 1
      from public.tracks t
      where t.audio_path = name
        and t.status = 'pending_review'
    )
  );
