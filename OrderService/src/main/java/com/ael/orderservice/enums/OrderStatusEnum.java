package com.ael.orderservice.enums;

public enum OrderStatusEnum {
    PENDING(1,"PENDING" ,"Beklemede"),
    ACTIVE(2, "ACTIVE","Aktif"),
    PREPARING(3,"PREPARING" ,"Hazırlanıyor"),
    CANCELLED(4, "CANCELLED","İptal Edildi"),
    SHIPPED(5,"SHIPPED" ,"Kargolandı"),
    REFUND(6, "REFUND","İade Edildi");

    private final Integer Id;
    private final String name;
    private final String description;

    OrderStatusEnum(Integer id, String name, String description) {
        this.Id = id;
        this.name = name;
        this.description = description;
    }



    // ID'den enum'a çevirme
    public static OrderStatusEnum fromId(Integer id) {
        if (id == null) {
            return null;
        }

        for (OrderStatusEnum status : values()) {
            if (status.Id.equals(id)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Unknown order status ID: " + id);
    }

    // Code'dan enum'a çevirme
    public static OrderStatusEnum fromName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return null;
        }

        for (OrderStatusEnum status : values()) {
            if (status.name.equalsIgnoreCase(name.trim())) {
                return status;
            }
        }

        throw new IllegalArgumentException("Unknown order status code: " + name);
    }

    // Enum'dan ID'ye çevirme
    public static Integer toId(OrderStatusEnum status) {
        return status != null ? status.Id : null;
    }

    // Enum'dan code'a çevirme
    public static String toCode(OrderStatusEnum status) {
        return status != null ? status.name : null;
    }
}


