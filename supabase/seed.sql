-- Demo data for a local or test database only. Do NOT run this on production:
-- it publishes two example courses whose links point to example.com.
insert into public.categories (name, slug, sort_order) values
  ('Marketing',    'marketing',    1),
  ('Programming',  'programming',  2),
  ('Design',       'design',       3),
  ('Business',     'business',     4)
on conflict (slug) do nothing;

insert into public.courses (name, slug, description, price, sales_page_url, download_url, category_id, is_featured)
select 'Facebook Ads Masterclass', 'facebook-ads-masterclass',
       'Launch profitable ad campaigns from scratch: targeting, creatives, scaling.',
       4900, 'https://example.com/facebook-ads', 'https://example.com/download/facebook-ads.zip',
       id, true
from public.categories where slug = 'marketing'
on conflict (slug) do nothing;

insert into public.courses (name, slug, description, price, sales_page_url, download_url, category_id)
select 'Next.js for Beginners', 'nextjs-for-beginners',
       'Build and deploy a full web app with Next.js and Supabase.',
       3900, 'https://example.com/nextjs', 'https://example.com/download/nextjs.zip',
       id
from public.categories where slug = 'programming'
on conflict (slug) do nothing;
