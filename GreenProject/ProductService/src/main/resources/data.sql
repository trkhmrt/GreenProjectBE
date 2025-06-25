-- Seed data for ProductService

-- Insert Categories
INSERT INTO categories (category_id, category_name) VALUES
                                                        (1, 'Elektronik'),
                                                        (2, 'Giyim'),
                                                        (3, 'Ev & Yaşam'),
                                                        (4, 'Spor & Outdoor'),
                                                        (5, 'Kitap & Hobi'),
                                                        (6, 'Sağlık & Güzellik'),
                                                        (7, 'Otomotiv'),
                                                        (8, 'Oyuncak & Hobi'),
                                                        (9, 'Gıda & İçecek'),
                                                        (10, 'Bahçe & Yapı Market');

-- Insert SubCategories for Elektronik
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (1, 'Telefon & Aksesuar', 1),
                                                                                 (2, 'Bilgisayar & Tablet', 1),
                                                                                 (3, 'TV & Ses Sistemleri', 1),
                                                                                 (4, 'Küçük Ev Aletleri', 1),
                                                                                 (5, 'Güneş Enerjisi', 1);

-- Insert SubCategories for Giyim
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (6, 'Erkek Giyim', 2),
                                                                                 (7, 'Kadın Giyim', 2),
                                                                                 (8, 'Çocuk Giyim', 2),
                                                                                 (9, 'Spor Giyim', 2),
                                                                                 (10, 'İç Giyim', 2);

-- Insert SubCategories for Ev & Yaşam
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (11, 'Mobilya', 3),
                                                                                 (12, 'Dekorasyon', 3),
                                                                                 (13, 'Mutfak & Yemek', 3),
                                                                                 (14, 'Banyo & Sağlık', 3),
                                                                                 (15, 'Temizlik & Bakım', 3);

-- Insert SubCategories for Spor & Outdoor
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (16, 'Fitness Ekipmanları', 4),
                                                                                 (17, 'Kamp & Doğa', 4),
                                                                                 (18, 'Bisiklet', 4),
                                                                                 (19, 'Su Sporları', 4),
                                                                                 (20, 'Kış Sporları', 4);

-- Insert SubCategories for Kitap & Hobi
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (21, 'Roman', 5),
                                                                                 (22, 'Bilim & Teknoloji', 5),
                                                                                 (23, 'Çocuk Kitapları', 5),
                                                                                 (24, 'Sanat & El Sanatları', 5),
                                                                                 (25, 'Müzik Aletleri', 5);

-- Insert SubCategories for Sağlık & Güzellik
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (26, 'Cilt Bakımı', 6),
                                                                                 (27, 'Saç Bakımı', 6),
                                                                                 (28, 'Makyaj', 6),
                                                                                 (29, 'Kişisel Bakım', 6),
                                                                                 (30, 'Vitamin & Takviye', 6);

-- Insert SubCategories for Otomotiv
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (31, 'Araç Bakım', 7),
                                                                                 (32, 'Araç Aksesuar', 7),
                                                                                 (33, 'Motosiklet', 7),
                                                                                 (34, 'Deniz Araçları', 7),
                                                                                 (35, 'Ticari Araçlar', 7);

-- Insert SubCategories for Oyuncak & Hobi
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (36, 'Eğitici Oyuncaklar', 8),
                                                                                 (37, 'Puzzle & Zeka Oyunları', 8),
                                                                                 (38, 'Model & Koleksiyon', 8),
                                                                                 (39, 'Dış Mekan Oyunları', 8),
                                                                                 (40, 'Video Oyunları', 8);

-- Insert SubCategories for Gıda & İçecek
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (41, 'Organik Gıda', 9),
                                                                                 (42, 'Kuruyemiş & Atıştırmalık', 9),
                                                                                 (43, 'İçecek', 9),
                                                                                 (44, 'Kahvaltılık', 9),
                                                                                 (45, 'Dondurulmuş Gıda', 9);

-- Insert SubCategories for Bahçe & Yapı Market
INSERT INTO sub_categories (sub_category_id, sub_category_name, category_id) VALUES
                                                                                 (46, 'Bahçe Ekipmanları', 10),
                                                                                 (47, 'Yapı Malzemeleri', 10),
                                                                                 (48, 'Aydınlatma', 10),
                                                                                 (49, 'Güvenlik Sistemleri', 10),
                                                                                 (50, 'Isıtma & Soğutma', 10);

-- Insert Products for Elektronik - Telefon & Aksesuar
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (1, 'iPhone 15 Pro', 'Apple iPhone 15 Pro 128GB Titanium, A17 Pro çip, 48MP kamera', 89999.99, 50, 1),
                                                                                                                                   (2, 'Samsung Galaxy S24', 'Samsung Galaxy S24 256GB Phantom Black, AI özellikleri', 79999.99, 45, 1),
                                                                                                                                   (3, 'Xiaomi Redmi Note 13', 'Xiaomi Redmi Note 13 128GB, 108MP kamera, 5000mAh batarya', 12999.99, 80, 1),
                                                                                                                                   (4, 'Apple AirPods Pro', 'Apple AirPods Pro 2. nesil, Aktif Gürültü Engelleme', 8999.99, 100, 1),
                                                                                                                                   (5, 'Samsung Galaxy Watch 6', 'Samsung Galaxy Watch 6 44mm, Sağlık takibi', 5999.99, 60, 1);

-- Insert Products for Elektronik - Bilgisayar & Tablet
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (6, 'MacBook Air M3', 'Apple MacBook Air 13" M3 çip, 8GB RAM, 256GB SSD', 69999.99, 30, 2),
                                                                                                                                   (7, 'Dell XPS 13', 'Dell XPS 13 Intel i7, 16GB RAM, 512GB SSD', 54999.99, 25, 2),
                                                                                                                                   (8, 'iPad Air 5', 'Apple iPad Air 5. nesil 64GB, M1 çip', 29999.99, 40, 2),
                                                                                                                                   (9, 'ASUS ROG Strix', 'ASUS ROG Strix Gaming Laptop, RTX 4060, 16GB RAM', 89999.99, 15, 2),
                                                                                                                                   (10, 'Lenovo ThinkPad X1', 'Lenovo ThinkPad X1 Carbon, Intel i5, 8GB RAM', 44999.99, 35, 2);

-- Insert Products for Elektronik - Güneş Enerjisi
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (11, 'Güneş Paneli 100W', 'Monokristal güneş paneli 100W, 12V sistem', 2999.99, 20, 5),
                                                                                                                                   (12, 'Güneş Enerjili Şarj Cihazı', '20000mAh güneş enerjili power bank', 899.99, 50, 5),
                                                                                                                                   (13, 'Solar Su Pompası', 'Güneş enerjili su pompası, 12V DC', 1999.99, 10, 5),
                                                                                                                                   (14, 'Solar Aydınlatma Seti', 'Bahçe için güneş enerjili LED aydınlatma', 599.99, 30, 5),
                                                                                                                                   (15, 'Solar Şarj Kontrolcüsü', '20A güneş enerjisi şarj kontrolcüsü', 399.99, 25, 5);

-- Insert Products for Giyim - Erkek Giyim
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (16, 'Organik Pamuklu T-Shirt', 'Doğal pamuktan üretilmiş, nefes alabilir erkek t-shirt', 89.99, 100, 6),
                                                                                                                                   (17, 'Kot Pantolon', 'Slim fit kot pantolon, %100 pamuk', 299.99, 75, 6),
                                                                                                                                   (18, 'Blazer Ceket', 'Klasik kesim blazer ceket, iş ortamı için', 599.99, 40, 6),
                                                                                                                                   (19, 'Polo Yaka T-Shirt', 'Pamuklu polo yaka t-shirt, günlük kullanım', 129.99, 80, 6),
                                                                                                                                   (20, 'Gömlek', 'Uzun kollu pamuklu gömlek, resmi ortamlar için', 199.99, 60, 6);

-- Insert Products for Giyim - Kadın Giyim
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (21, 'Organik Pamuklu Elbise', 'Doğal pamuktan üretilmiş, rahat kesim elbise', 199.99, 70, 7),
                                                                                                                                   (22, 'Kot Etek', 'A-line kesim kot etek, günlük kullanım', 249.99, 55, 7),
                                                                                                                                   (23, 'Bluz', 'Şifon bluz, kadın günlük giyim', 159.99, 65, 7),
                                                                                                                                   (24, 'Pamuklu Pantolon', 'Yüksek bel pamuklu pantolon', 179.99, 45, 7),
                                                                                                                                   (25, 'Trençkot', 'Su geçirmez trençkot, yağmurlu havalar için', 399.99, 30, 7);

-- Insert Products for Ev & Yaşam - Mobilya
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (26, 'Ahşap Yemek Masası', 'Doğal ahşap yemek masası, 6 kişilik', 2999.99, 15, 11),
                                                                                                                                   (27, 'Koltuk Takımı', '3+3+1 koltuk takımı, kumaş kaplama', 4999.99, 10, 11),
                                                                                                                                   (28, 'Yatak Odası Takımı', '5 parça yatak odası takımı, ceviz ağacı', 8999.99, 8, 11),
                                                                                                                                   (29, 'Çalışma Masası', 'Ahşap çalışma masası, çekmeceli', 1299.99, 25, 11),
                                                                                                                                   (30, 'Kitaplık', '5 raflı kitaplık, beyaz renk', 899.99, 20, 11);

-- Insert Products for Ev & Yaşam - Mutfak & Yemek
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (31, 'Paslanmaz Çelik Tencere Seti', '6 parça paslanmaz çelik tencere seti', 899.99, 30, 13),
                                                                                                                                   (32, 'Blender Seti', '1000W güçlü blender, 6 kademeli hız', 299.99, 40, 13),
                                                                                                                                   (33, 'Kahve Makinesi', 'Otomatik kahve makinesi, filtre kahve', 599.99, 25, 13),
                                                                                                                                   (34, 'Mikrodalga Fırın', '20L mikrodalga fırın, ızgara özelliği', 799.99, 35, 13),
                                                                                                                                   (35, 'Buzdolabı', 'No-frost buzdolabı, A+ enerji sınıfı', 8999.99, 12, 13);

-- Insert Products for Spor & Outdoor - Fitness Ekipmanları
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (36, 'Koşu Bandı', 'Katlanabilir koşu bandı, 12 km/h hız', 3999.99, 8, 16),
                                                                                                                                   (37, 'Dumbbell Seti', 'Çelik dambıl seti, 2-20kg arası', 899.99, 25, 16),
                                                                                                                                   (38, 'Yoga Matı', 'Eco-friendly yoga matı, 6mm kalınlık', 199.99, 50, 16),
                                                                                                                                   (39, 'Bisiklet Ergometresi', 'Dijital ekranlı bisiklet ergometresi', 2499.99, 15, 16),
                                                                                                                                   (40, 'Pilates Topu', '65cm pilates topu, dayanıklı malzeme', 89.99, 40, 16);

-- Insert Products for Spor & Outdoor - Kamp & Doğa
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (41, 'Çadır', '4 kişilik su geçirmez kamp çadırı', 899.99, 20, 17),
                                                                                                                                   (42, 'Uyku Tulumu', '-5°C uyku tulumu, hafif ve kompakt', 399.99, 30, 17),
                                                                                                                                   (43, 'Kamp Ocağı', 'Portatif kamp ocağı, gaz yakıtlı', 199.99, 35, 17),
                                                                                                                                   (44, 'Sırt Çantası', '60L kapasiteli sırt çantası, su geçirmez', 299.99, 25, 17),
                                                                                                                                   (45, 'Kamp Lambası', 'LED kamp lambası, şarj edilebilir', 149.99, 40, 17);

-- Insert Products for Kitap & Hobi - Roman
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (46, 'Suç ve Ceza', 'Dostoyevski - Klasik Rus edebiyatı', 29.99, 100, 21),
                                                                                                                                   (47, '1984', 'George Orwell - Distopik roman', 24.99, 80, 21),
                                                                                                                                   (48, 'Küçük Prens', 'Antoine de Saint-Exupéry - Çocuk klasikleri', 19.99, 120, 21),
                                                                                                                                   (49, 'Fareler ve İnsanlar', 'John Steinbeck - Amerikan edebiyatı', 22.99, 90, 21),
                                                                                                                                   (50, 'Dönüşüm', 'Franz Kafka - Modern edebiyat', 26.99, 70, 21);

-- Insert Products for Kitap & Hobi - Bilim & Teknoloji
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (51, 'Kozmos', 'Carl Sagan - Evren hakkında bilimsel kitap', 34.99, 60, 22),
                                                                                                                                   (52, 'Kısa Bilim Tarihi', 'Stephen Hawking - Bilim tarihi', 39.99, 50, 22),
                                                                                                                                   (53, 'Yapay Zeka', 'Modern yapay zeka teknolojileri', 44.99, 40, 22),
                                                                                                                                   (54, 'Kuantum Fiziği', 'Kuantum mekaniği temelleri', 49.99, 35, 22),
                                                                                                                                   (55, 'İklim Değişikliği', 'Küresel ısınma ve çözümler', 29.99, 55, 22);

-- Insert Products for Sağlık & Güzellik - Cilt Bakımı
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (56, 'Güneş Kremi SPF 50', 'UVA/UVB korumalı güneş kremi', 89.99, 80, 26),
                                                                                                                                   (57, 'Nemlendirici Krem', 'Hyaluronik asit içeren nemlendirici', 129.99, 70, 26),
                                                                                                                                   (58, 'Yüz Temizleme Jeli', 'Hassas ciltler için temizleme jeli', 69.99, 90, 26),
                                                                                                                                   (59, 'Anti-Aging Serum', 'Retinol içeren anti-aging serum', 199.99, 45, 26),
                                                                                                                                   (60, 'Göz Kremi', 'Kafein içeren göz altı kremi', 149.99, 60, 26);

-- Insert Products for Sağlık & Güzellik - Vitamin & Takviye
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (61, 'C Vitamini', '1000mg C vitamini, 60 tablet', 79.99, 100, 30),
                                                                                                                                   (62, 'D Vitamini', '1000 IU D vitamini, 90 kapsül', 89.99, 85, 30),
                                                                                                                                   (63, 'Omega-3', '1000mg omega-3, 60 kapsül', 129.99, 70, 30),
                                                                                                                                   (64, 'Magnezyum', '400mg magnezyum, 60 tablet', 69.99, 90, 30),
                                                                                                                                   (65, 'Çinko', '15mg çinko, 60 kapsül', 59.99, 75, 30);

-- Insert Products for Gıda & İçecek - Organik Gıda
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (66, 'Organik Bal', 'Doğal çiçek balı, 1kg', 149.99, 50, 41),
                                                                                                                                   (67, 'Organik Zeytinyağı', 'Sızma zeytinyağı, 1L', 89.99, 60, 41),
                                                                                                                                   (68, 'Organik Kuruyemiş', 'Karışık kuruyemiş, 500g', 79.99, 70, 41),
                                                                                                                                   (69, 'Organik Çay', 'Yeşil çay, 100g', 39.99, 80, 41),
                                                                                                                                   (70, 'Organik Tahıl', 'Kinoa, 500g', 49.99, 45, 41);

-- Insert Products for Bahçe & Yapı Market - Bahçe Ekipmanları
INSERT INTO products (product_id, product_name, product_description, product_price, product_quantity, product_sub_category_id) VALUES
                                                                                                                                   (71, 'Bahçe Makası', 'Profesyonel bahçe makası', 199.99, 30, 46),
                                                                                                                                   (72, 'Sulama Sistemi', 'Otomatik sulama sistemi', 599.99, 15, 46),
                                                                                                                                   (73, 'Gübre', 'Organik gübre, 10kg', 89.99, 40, 46),
                                                                                                                                   (74, 'Tohum Seti', 'Sebze tohumu seti, 10 çeşit', 49.99, 60, 46),
                                                                                                                                   (75, 'Bahçe Eldiveni', 'Su geçirmez bahçe eldiveni', 29.99, 80, 46);