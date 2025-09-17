package com.ael.paymentservice.config.rabbitmq.model;

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
public class OrderDetail {
    private String customerId;
    private Integer basketId;
    private String paymentId;
    private String  orderAddress;
    private String  orderCity;
    private List<OrderProductUnit> basketItems = new ArrayList<>();
}
