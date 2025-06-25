package com.ael.orderservice.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderStatusesEnum {
    Aktif(1, "Aktif"),
    Beklemede(2, "Beklemede"),
    Iptal(3, "İptal"),
    Kargolandi(4, "Kargolandı");

    private final Integer orderStatusId;
    private final String orderStatusName;
}


