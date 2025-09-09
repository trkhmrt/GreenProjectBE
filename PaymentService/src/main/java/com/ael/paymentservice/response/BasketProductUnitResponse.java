package com.ael.paymentservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BasketProductUnitResponse {
    private Integer basketId;
    private Integer customerId;
    private List<ProductUnitResponse> basketProducts = new ArrayList<>();
}




