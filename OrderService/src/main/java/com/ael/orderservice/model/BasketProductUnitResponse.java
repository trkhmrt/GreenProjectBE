package com.ael.orderservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class BasketProductUnitResponse {
    private Integer basketId;
    private Integer customerId;
    private List<Product> basketProducts;
}