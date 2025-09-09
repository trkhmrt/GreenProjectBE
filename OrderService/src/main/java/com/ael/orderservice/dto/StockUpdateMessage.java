package com.ael.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockUpdateMessage {
    private Integer productId;
    private Integer quantity;
    private String updateType; // "DECREASE" veya "INCREASE"
}




