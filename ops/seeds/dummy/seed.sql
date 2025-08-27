
-- Dummy users cannot be created here (auth.users). Create a test account via Supabase Auth UI and it will auto-provision a profile.
-- Dummy brand & product (assign owner later by updating owner_id to your test profile id).

insert into public.brands (slug, name, tagline, description, category, website, approved, is_cannabis, edition_city, embargo_date)
values
('green-thread-co', 'Green Thread Co.', 'Hemp-forward apparel', 'Sustainable hemp clothing brand.', 'Fashion', 'https://example.com', true, false, 'Bangkok', date '2025-11-01')
on conflict (slug) do nothing;

-- Assign owner (replace UUID below with your test profile id)
-- update public.brands set owner_id = '00000000-0000-0000-0000-000000000000' where slug = 'green-thread-co';

insert into public.products (brand_id, slug, name, description, materials, hemp_percent, images, approved, is_cannabis, edition_city)
select id, 'classic-hemp-tee', 'Classic Hemp Tee', 'A soft, breathable tee with 55% hemp.', jsonb_build_object('fabric', '55% hemp / 45% organic cotton'), 55, '[]'::jsonb, true, false, 'Bangkok'
from public.brands where slug = 'green-thread-co'
on conflict do nothing;
