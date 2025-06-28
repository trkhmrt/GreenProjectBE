-- Tablo oluşturma

-- Örnek veri ekleme
INSERT INTO customers (first_name,
                       last_name,
                       email,
                       phone_number,
                       address,
                       city,
                       user_name,
                       password)
VALUES ('Tarık', 'Hamarat', 'tarik@example.com', '05321234567', 'İstiklal Caddesi No:23', 'İstanbul', 'tarikhamarat',
        'sifre123'),
       ('Ayşe', 'Demir', 'ayse@example.com', '05431234567', 'Cumhuriyet Mah. No:45', 'Ankara', 'aysedemir', 'sifre456'),
       ('Mehmet', 'Yılmaz', 'mehmet@example.com', '05541234567', 'Atatürk Cad. No:10', 'İzmir', 'mehmetyilmaz',
        'sifre789');
