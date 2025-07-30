package com.ael.paymentservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Payments")
public class PaymentInternal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    private String basketId;

    private String customerId;

    private BigDecimal price;

    private BigDecimal paidPrice;

    private String iyzicoPaymentId;

    private String cardNumber;

    private Integer couponId;

    private String gsmNumber;

    private String conversationId;

    private String paymentStatus;






}
