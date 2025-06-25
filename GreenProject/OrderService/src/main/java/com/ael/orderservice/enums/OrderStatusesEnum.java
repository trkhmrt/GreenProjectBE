package com.ael.orderservice.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderStatusesEnum {
    Aktif(1) ,
    Beklemede(2) ,
    İptal(3) ,
    Kargolandı(4);

    private final Integer orderStatusId;
}


