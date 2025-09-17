package com.ael.paymentservice.enums;


import lombok.*;


@Getter
public enum PaymentStatus {

    PENDING(1,"PENDING","Ödeme Bekleniyor"),
    SUCCESS(2,"SUCCESS","Ödeme Başarılı"),
    REFUNDED(3,"REFUNDED","Ödeme İade Edildi"),
    CANCELLED(4,"CANCELLED","Ödeme İptal Edildi"),
    FAILED(5,"FAILED","Ödeme Başarısız"),
    PROCCESSING(6,"PROCCESSING","Ödeme İşleniyor");

    private final Integer id;
    private final String code;
    private final String description;

    PaymentStatus(Integer id, String code, String description) {
        this.id = id;
        this.code = code;
        this.description = description;
    }

    // ID'den enum'a çevirme
    public static PaymentStatus fromId(Integer id) {
        if (id == null) {
            return null;
        }

        for (PaymentStatus status : values()) {
            if (status.id.equals(id)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Unknown payment status ID: " + id);
    }

    // Code'dan enum'a çevirme
    public static PaymentStatus fromCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return null;
        }

        for (PaymentStatus status : values()) {
            if (status.code.equalsIgnoreCase(code.trim())) {
                return status;
            }
        }

        throw new IllegalArgumentException("Unknown payment status code: " + code);
    }

    // Enum'dan ID'ye çevirme
    public static Integer toId(PaymentStatus status) {
        return status != null ? status.id : null;
    }

    // Enum'dan code'a çevirme
    public static String toCode(PaymentStatus status) {
        return status != null ? status.code : null;
    }
}
