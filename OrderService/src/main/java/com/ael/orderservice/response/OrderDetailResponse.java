package com.ael.orderservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class OrderDetailResponse {
    private String orderId;

}
