package com.ael.basketservice.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BasketStatusEnum {
    ACTIVE(1, "ACTIVE", "Aktif"),
    PASSIVE(2, "PASSIVE", "Pasif"),
    READY_PAYMENT(3, "READY_PAYMENT", "Ödemeye Hazır"),
    PAID(4, "PAID", "Ödendi"),
    CANCELLED(5, "CANCELLED", "İptal"),
    DELETED(6, "DELETED", "Silindi");

    private final Integer id;
    private final String name;
    private final String description;

    // ID'den enum'a çevirme
    public static BasketStatusEnum fromId(Integer id) {
        if (id == null) return null;

        for (BasketStatusEnum status : values()) {
            if (status.getId().equals(id)) {
                return status;
            }
        }
        throw new IllegalArgumentException("BasketStatusEnum bulunamadı: " + id);
    }

    // Name'den enum'a çevirme
    public static BasketStatusEnum fromName(String name) {
        if (name == null || name.trim().isEmpty()) return null;

        for (BasketStatusEnum status : values()) {
            if (status.getName().equalsIgnoreCase(name.trim())) {
                return status;
            }
        }
        throw new IllegalArgumentException("BasketStatusEnum bulunamadı: " + name);
    }

    // Enum'dan ID'ye çevirme
    public static Integer toId(BasketStatusEnum status) {
        return status != null ? status.getId() : null;
    }

    // Enum'dan name'e çevirme
    public static String toName(BasketStatusEnum status) {
        return status != null ? status.getName() : null;
    }

}
