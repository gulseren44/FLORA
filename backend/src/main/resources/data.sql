-- 1. Kategorileri Ekleme (Varsa hata vermez, es geçer)
INSERT OR IGNORE INTO categories (id, name, category_key) VALUES (1, 'Ic Mekan Bitkileri', 'IC_MEKAN');
INSERT OR IGNORE INTO categories (id, name, category_key) VALUES (2, 'Dis Mekan Bitkileri', 'DIS_MEKAN');
INSERT OR IGNORE INTO categories (id, name, category_key) VALUES (3, 'Sukulentler', 'SUKULENT');
INSERT OR IGNORE INTO categories (id, name, category_key) VALUES (4, 'Aksesuarlar', 'AKSESUAR');

-- 2. Ürünleri (Bitkileri ve Aksesuarları) Ekleme
-- İç Mekan Bitkileri (category_id = 1)
INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(1, 'Monstera (Deve Tabani)', 250.0, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400', 'Monstera deliciosa', 'Büyük ve delikli yapraklarıyla salonunuza tropikal bir hava katacak, bakımı oldukça kolay popüler bir iç mekan bitkisidir.', 1);

INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(2, 'Pasa Kilici', 180.0, 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=400', 'Sansevieria trifasciata', 'Gece boyunca oksijen üretmeye devam eden, susuzluğa son derece dayanıklı ve modern mekanların vazgeçilmez bitkisidir.', 1);

-- Dış Mekan Bitkileri (category_id = 2)
INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(3, 'Lavanta', 120.0, 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=400', 'Lavandula angustifolia', 'Eşsiz kokusu ve mor çiçekleriyle bahçe veya balkonlarınızı süsleyecek, güneşi çok seven çok yıllık bir bitkidir.', 2);

INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(4, 'Ortanca', 210.0, 'https://images.unsplash.com/photo-1507206122144-ad81f1df3393?q=80&w=400', 'Hydrangea macrophylla', 'Göz alıcı büyük çiçek kurullarıyla yarı gölge alanları canlandıran, nemli toprakları seven klasik bir bahçe güzeli.', 2);

-- Sukulentler (category_id = 3)
INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(5, 'Echeveria (Gul Sukulent)', 65.0, 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=400', 'Echeveria elegans', 'Gül formundaki yaprak dizilimiyle dikkat çeken, az sulama isteyen ve bol aydınlık ortamları seven minyatür sukulent.', 3);

INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(6, 'Zebra Sukulent (Haworthia)', 55.0, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400', 'Haworthia fasciata', 'Üzerindeki beyaz yatay çizgileriyle zebra desenini andıran, kompakt yapısıyla çalışma masaları için harika bir tercihtir.', 3);

INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(7, 'Para Agaci (Crassula)', 90.0, 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=400', 'Crassula ovata', 'Etli tombul yapraklarıyla bolluk ve bereket getirdiğine inanılan, uzun ömürlü ve dayanıklı bir sukulent türüdür.', 3);

-- Aksesuarlar (category_id = 4)
INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(8, 'El Yapimi Toprak Saksi', 120.0, 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=400', NULL, 'Bitkilerinizin köklerinin rahatça nefes almasını sağlayan, tamamen doğal malzemeden üretilmiş el yapımı terakota saklı.', 4);

INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(9, 'Premium Bitki Topragi (5L)', 75.0, 'https://images.unsplash.com/photo-1605686819102-961473790681?q=80&w=400', NULL, 'İçerdiği perlit ve torf karışımı sayesinde bitkileriniz için ideal drenaj ve besin ortamı sunan özel saksı toprağı.', 4);

INSERT OR IGNORE INTO products (id, name, price, image_url, scientific_name, description, category_id) VALUES 
(10, 'Tasarim Mini Sulama Kabigi', 145.0, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400', NULL, 'İnce uzun ucu sayesinde küçük saksılarda dökülme yapmadan nokta atışı sulama yapmanızı sağlayan estetik sulama kabı.', 4);