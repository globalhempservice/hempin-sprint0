
-- Anonymize PII in staging
update public.profiles
set
  email = 'user_' || left(id::text, 8) || '@example.com',
  name = null,
  country = null
where true;

-- Null notes in submissions
update public.submissions set notes_user = null, notes_admin = null;

-- Clear tracking numbers
update public.logistics_shipments set tracking_number = null, carrier = null, notes = null;
