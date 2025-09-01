-- === Avatars bucket RLS policies ===
-- Assumes a public bucket named 'avatars'

-- 1) Public can read (so profile images load without signed URLs)
create policy "public can read avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

-- 2) Authenticated users can upload ONLY inside their own folder: user-<uid>/...
create policy "users can upload their own avatar path"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and name like ('user-' || auth.uid()::text || '/%')
);

-- 3) Authenticated users can update only their own files
create policy "users can update own avatar files"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

-- 4) Authenticated users can delete only their own files
create policy "users can delete own avatar files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());