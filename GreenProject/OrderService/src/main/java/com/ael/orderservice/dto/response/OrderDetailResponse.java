package com.ael.orderservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailResponse {
    private Integer orderDetailId;
    private Integer productId;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}


