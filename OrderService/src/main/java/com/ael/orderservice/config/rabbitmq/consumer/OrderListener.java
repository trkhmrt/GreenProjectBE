package com.ael.orderservice.config.rabbitmq.consumer;

import com.ael.orderservice.config.rabbitmq.config.RabbitMQConfig;
import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.dto.StockUpdateMessage;
import com.ael.orderservice.service.OrderService;
import com.ael.orderservice.service.RabbitMQProducerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
@Slf4j
public class OrderListener {
    
    private final OrderService orderService;
    private final RabbitMQProducerService rabbitMQProducerService;

    @RabbitListener(queues = RabbitMQConfig.ORDER_QUEUE)
    public void listenOrderDetailFromPaymentService(OrderDetailRequest orderDetailRequest) {
        try {
            log.info("=== ORDER LISTENER DEBUG ===");
            log.info("Received order detail request from payment service: {}", orderDetailRequest);
            log.info("BasketItems size: {}", orderDetailRequest.getBasketItems() != null ? orderDetailRequest.getBasketItems().size() : 0);
            
            // Sipariş oluştur
            orderService.createOrder(orderDetailRequest);
            log.info("Order created successfully from payment service");

        } catch (Exception e) {
            log.error("Error processing order detail request from payment service: {}", e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to process order detail request from payment service", e);
        }
    }
}
