package com.ael.orderservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailResponse {
    private Integer orderDetailId;
    private Integer productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}



