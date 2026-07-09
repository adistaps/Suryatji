-- ============================================
-- SEED DATA: Produk Suryatji Coffee
-- Jalankan setelah schema.sql
-- Ganti foto image_url dengan foto asli produk nanti via Admin Panel
-- ============================================

-- Ambil category_id dulu (asumsi sudah insert di schema.sql: arabica, robusta, blend)
do $$
declare
  cat_arabica uuid;
  cat_robusta uuid;
  cat_blend uuid;
  prod_id uuid;
begin
  select id into cat_arabica from categories where slug = 'arabica';
  select id into cat_robusta from categories where slug = 'robusta';
  select id into cat_blend from categories where slug = 'blend';

  -- Produk 1: Kledung Arabica Green Bean
  insert into products (category_id, name, slug, description, origin, features, tags, is_active)
  values (cat_arabica, 'Kledung Arabica Green Bean', 'kledung-arabica-green-bean',
    'Biji kopi Arabica mentah (green bean) hasil panen langsung dari kebun Suryatji Coffee di kaki Gunung Sindoro, Kledung, Temanggung. Cocok untuk yang ingin roasting sendiri di rumah.',
    'Kledung, Temanggung', array['Panen Sendiri','Ketinggian 1200-1600 mdpl','Full Wash Process'], array['arabica','green bean'], true)
  returning id into prod_id;

  insert into product_variants (product_id, weight, grind_type, weight_grams, sku, price, stock) values
    (prod_id, '250g', 'whole_bean', 250, 'SC-ARB-GRN-250', 45000, 50),
    (prod_id, '500g', 'whole_bean', 500, 'SC-ARB-GRN-500', 85000, 35),
    (prod_id, '1kg', 'whole_bean', 1000, 'SC-ARB-GRN-1KG', 160000, 20);

  -- Produk 2: Kledung Arabica Roasted
  insert into products (category_id, name, slug, description, origin, features, tags, is_active)
  values (cat_arabica, 'Kledung Arabica Roasted', 'kledung-arabica-roasted',
    'Kopi Arabica hasil roasting medium dari biji pilihan kebun Kledung. Aroma floral dengan sedikit rasa citrus khas dataran tinggi Sindoro.',
    'Kledung, Temanggung', array['Medium Roast','Aroma Floral & Citrus','Roasting Fresh Setiap Minggu'], array['arabica','roasted'], true)
  returning id into prod_id;

  insert into product_variants (product_id, weight, grind_type, weight_grams, sku, price, stock) values
    (prod_id, '250g', 'whole_bean', 250, 'SC-ARB-RST-250-WB', 55000, 60),
    (prod_id, '250g', 'medium', 250, 'SC-ARB-RST-250-MD', 55000, 60),
    (prod_id, '250g', 'fine', 250, 'SC-ARB-RST-250-FN', 55000, 40),
    (prod_id, '500g', 'whole_bean', 500, 'SC-ARB-RST-500-WB', 105000, 40),
    (prod_id, '500g', 'medium', 500, 'SC-ARB-RST-500-MD', 105000, 40);

  -- Produk 3: Sindoro Robusta Roasted
  insert into products (category_id, name, slug, description, origin, features, tags, is_active)
  values (cat_robusta, 'Sindoro Robusta Roasted', 'sindoro-robusta-roasted',
    'Kopi Robusta dengan body tebal dan karakter kuat, cocok untuk penikmat kopi hitam pekat khas pegunungan. Diproses dengan metode natural dry process.',
    'Kledung, Temanggung', array['Body Tebal','Natural Dry Process','Kadar Kafein Tinggi'], array['robusta','roasted'], true)
  returning id into prod_id;

  insert into product_variants (product_id, weight, grind_type, weight_grams, sku, price, stock) values
    (prod_id, '250g', 'whole_bean', 250, 'SC-ROB-RST-250-WB', 35000, 70),
    (prod_id, '250g', 'coarse', 250, 'SC-ROB-RST-250-CS', 35000, 50),
    (prod_id, '500g', 'whole_bean', 500, 'SC-ROB-RST-500-WB', 65000, 45);

  -- Produk 4: Suryatji House Blend
  insert into products (category_id, name, slug, description, origin, features, tags, is_active)
  values (cat_blend, 'Suryatji House Blend', 'suryatji-house-blend',
    'Racikan khas Suryatji Coffee, perpaduan Arabica dan Robusta pilihan dari kebun sendiri, diformulasikan untuk keseimbangan rasa yang pas untuk espresso maupun seduh manual.',
    'Kledung, Temanggung', array['Perpaduan Arabica & Robusta','Cocok untuk Espresso','Resep Khas Suryatji'], array['blend','espresso'], true)
  returning id into prod_id;

  insert into product_variants (product_id, weight, grind_type, weight_grams, sku, price, stock) values
    (prod_id, '250g', 'espresso', 250, 'SC-BLD-HSE-250-ES', 60000, 50),
    (prod_id, '250g', 'whole_bean', 250, 'SC-BLD-HSE-250-WB', 60000, 50),
    (prod_id, '500g', 'espresso', 500, 'SC-BLD-HSE-500-ES', 115000, 30);

end $$;
