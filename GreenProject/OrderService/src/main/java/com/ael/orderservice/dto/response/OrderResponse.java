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
public class OrderResponse {
    private Integer orderId;
    private Integer customerId;
    private Integer basketId;
    private String orderAddress;
    private String orderStatus;
    private List<OrderDetailResponse> orderDetails;
    private Double totalAmount;
    private Integer totalItems;
}


