-- docs/SEEDS_SPRINT2.sql
-- Seed products and optional price rules. Run in Supabase SQL editor on STAGING.

insert into products (id,title,description,base_price_usd,kind) values
('brand_page','Brand page','Your brand page on HEMP’IN',5000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('product','Single product page','1 product page for 1 year',2000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('bundle_1b5p','Special Offer: Brand + 5 products','Best value starter pack',10000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('popup_bkk_2025','Pop-up kit (Bangkok 2025)','Includes 5 exhibited products + brand + 5 product pages',50000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('popup_extra','Pop-up extra exhibited + product page','Add one more exhibited product',10000,'one_time')
on conflict (id) do update set title=excluded.title;

-- Optional date rules
insert into price_rules (product_id,phase,price_usd,start_date,end_date) values
('popup_bkk_2025','early',30000,'2025-01-01','2025-09-01'),
('popup_bkk_2025','general',40000,'2025-09-02','2025-09-30'),
('popup_bkk_2025','late',50000,'2025-10-01','2025-10-15');
