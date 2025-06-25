package com.ael.orderservice.model;


import com.ael.orderservice.enums.OrderStatusesEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="OrderStatuses")
@Entity
public class OrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_status_id")
    private Integer orderStatusId;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private OrderStatusesEnum orderStatusName;
}
