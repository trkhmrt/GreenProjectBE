package com.ael.orderservice.config.rabbitmq.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BasketItem {
    private String productId;
    private String productName;
    private String productDescription;
    private String productPrice;
    private String productQuantity;
    private String subCategoryName;
}
