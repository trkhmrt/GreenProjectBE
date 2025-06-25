-- Tablo oluşturma
CREATE TABLE IF NOT EXISTS Customers
(
    customer_id  INT AUTO_INCREMENT PRIMARY KEY,
    first_name   VARCHAR(50),
    last_name    VARCHAR(50),
    email        VARCHAR(100),
    phone_number VARCHAR(20),
    address      VARCHAR(255),
    city         VARCHAR(50),
    user_name    VARCHAR(50),
    password     VARCHAR(255)
);

-- Örnek veri ekleme
INSERT INTO Customers (first_name,
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
