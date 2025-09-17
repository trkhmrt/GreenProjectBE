-- OrderStatuses tablosunu temizle (eğer varsa)
DELETE FROM OrderStatuses;

-- OrderStatuses'ları manuel ID'lerle oluştur
INSERT INTO OrderStatuses (order_status_id, order_status_name) VALUES (1, 'Aktif');
INSERT INTO OrderStatuses (order_status_id, order_status_name) VALUES (2, 'Beklemede');
INSERT INTO OrderStatuses (order_status_id, order_status_name) VALUES (3, 'İptal');
INSERT INTO OrderStatuses (order_status_id, order_status_name) VALUES (4, 'Kargolandı');







