package com.ael.paymentservice.config.rabbitmq.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderProductUnit {
    private String id;
    private BigDecimal price;
    private String name;
    private String category1;
    private String category2;
    private String itemType;
    private String subMerchantKey;

    private String externalSubMerchantId;
    private BigDecimal subMerchantPrice;
    private boolean chargedFromMerchant;
    private BigDecimal chargedPriceFromMerchant;

    private BigDecimal withholdingTax;
}
