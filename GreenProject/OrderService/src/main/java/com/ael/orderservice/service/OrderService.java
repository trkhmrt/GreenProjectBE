package com.ael.orderservice.service;


import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.dto.StockUpdateMessage;
import com.ael.orderservice.model.Order;
import com.ael.orderservice.model.OrderDetail;
import com.ael.orderservice.model.OrderStatus;
import com.ael.orderservice.repository.IOrderDetailRepository;
import com.ael.orderservice.repository.IOrderRepository;
import com.ael.orderservice.repository.IOrderStatusRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@AllArgsConstructor
@Slf4j
public class OrderService {

    private final IOrderRepository orderRepository;
    private final IOrderDetailRepository orderDetailRepository;
    private final IOrderStatusRepository orderStatusRepository;
    private final RabbitMQProducerService rabbitMQProducerService;

    // Sipariş durumları için static sabitler
    public static final String STATUS_AKTIF = "Aktif";
    public static final String STATUS_BEKLEMEDE = "Beklemede";
    public static final String STATUS_IPTAL = "İptal";
    public static final String STATUS_KARGOLANDI = "Kargolandı";

    @Transactional
    public void createOrder(OrderDetailRequest orderDetailRequest) {
        String statusName = STATUS_AKTIF; // Burada ihtiyaca göre farklı bir sabit de kullanılabilir
        OrderStatus orderStatus = orderStatusRepository
                .findByOrderStatusName(statusName)
                .orElseThrow(() -> new RuntimeException("Order Status not Found"));

        log.info("Creating order for customer: {}, basket: {}", 
                orderDetailRequest.getCustomerId(), orderDetailRequest.getBasketId());

        Order order = Order.builder()
                .customerId(orderDetailRequest.getCustomerId())
                .basketId(orderDetailRequest.getBasketId())
                .orderAddress(orderDetailRequest.getOrderAddress())
                .orderStatus(orderStatus)
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully with ID: {}", savedOrder.getOrderId());

        orderDetailRequest.getBasketItems().forEach(item -> {
            try {
                OrderDetail orderDetail = OrderDetail.builder()
                        .productId(Integer.valueOf(item.getProductId()))
                        .quantity(item.getProductQuantity() != null ? Integer.valueOf(item.getProductQuantity()) : 1)
                        .order(savedOrder)
                        .unitPrice(item.getProductPrice() != null ? Double.valueOf(item.getProductPrice()) : 0.0)
                        .build();

                orderDetailRepository.save(orderDetail);
                
                log.info("Order detail created for product: {}, quantity: {}", 
                        item.getProductId(), item.getProductQuantity() != null ? item.getProductQuantity() : "1 (default)");
            } catch (NumberFormatException e) {
                log.error("Error parsing basket item data: productId={}, quantity={}, price={}", 
                        item.getProductId(), item.getProductQuantity(), item.getProductPrice());
                // Hata durumunda varsayılan değerlerle devam et
                OrderDetail orderDetail = OrderDetail.builder()
                        .productId(0)
                        .quantity(1)
                        .order(savedOrder)
                        .unitPrice(0.0)
                        .build();
                orderDetailRepository.save(orderDetail);
            }
        });

        log.info("Order creation completed successfully for order: {}", savedOrder.getOrderId());
    }
    
    public List<Order> getOrderByCustomerId(Integer customerId) {
        return orderRepository.getOrderByCustomerId(customerId);
    }
    
    public List<OrderDetail> getOrderDetailsByOrderId(Integer orderId) {
        return orderDetailRepository.findOrderDetailByOrder_OrderId(orderId);
    }
}
