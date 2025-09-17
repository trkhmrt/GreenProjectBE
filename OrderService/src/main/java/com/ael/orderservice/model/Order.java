package com.ael.orderservice.model;

import com.ael.orderservice.enums.OrderStatusEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="Orders")
@Entity
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    private Integer customerId;

    private Integer basketId;

    private String orderAddress;

    private String orderCity;

    @CreationTimestamp
    private Instant createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date")
    private Instant updatedDate;

    // Enum kullanımı
    @Column(name = "order_status")
    private String orderStatusCode; // Database'de ID sakla

    @Transient
    private OrderStatusEnum orderStatus; // Java'da enum kullan

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OrderDetail> orderDetails;

    // Enum'ı set ettiğimizde string code'u otomatik güncelle
    public void setOrderStatus(OrderStatusEnum orderStatus) {
        this.orderStatus = orderStatus;
        this.orderStatusCode = OrderStatusEnum.toCode(orderStatus);
    }

    // String code'u set ettiğimizde enum'ı otomatik güncelle
    public void setOrderStatusCode(String orderStatusCode) {
        this.orderStatusCode = orderStatusCode;
        this.orderStatus = OrderStatusEnum.fromName(orderStatusCode);
    }

    // Enum'ı get ettiğimizde string'den otomatik oluştur
    public OrderStatusEnum getOrderStatus() {
        if (orderStatus == null && orderStatusCode != null) {
            orderStatus = OrderStatusEnum.fromName(orderStatusCode);
        }
        return orderStatus;
    }

    // Builder için özel metod
    @PostConstruct
    @PrePersist
    public void updateOrderStatusCode() {
        if (orderStatus != null && orderStatusCode == null) {
            orderStatusCode = OrderStatusEnum.toCode(orderStatus);
        }
    }
}
