package com.ael.orderservice.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderRequest {
    private Integer orderId;
    private Integer customerId;
    private Integer basketId;
    private String orderAddress;

}
