package com.ael.orderservice.config.rabbitmq.model;

import com.ael.orderservice.model.OrderProductUnit;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailRequest {
    private String customerId;
    private Integer basketId;
    private String paymentId;
    private String  orderAddress;
    private String  orderCity;
    @Nullable
    private List<OrderProductUnit> basketItems = new ArrayList<>();
}
