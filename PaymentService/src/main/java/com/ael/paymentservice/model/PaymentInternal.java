package com.ael.paymentservice.model;

import com.ael.paymentservice.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Date;

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

    @CreationTimestamp
    private Instant createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date")
    private Instant updatedDate;

    private String customerId;

    // Enum kullanımı
    @Column(name = "payment_status_id")
    private Integer paymentStatusId; // Database'de ID sakla

    @Transient
    private PaymentStatus paymentStatus; // Java'da enum kullan

    private BigDecimal price;

    private BigDecimal paidPrice;

    private String iyzicoPaymentId;

    private String cardNumber;

    private Integer couponId;

    private String gsmNumber;

    private String conversationId;







}
