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
            log.info("BasketId: {}", orderDetailRequest.getBasketId());
            log.info("CustomerId: {}", orderDetailRequest.getCustomerId());
            log.info("BasketItems size: {}", orderDetailRequest.getBasketItems() != null ? orderDetailRequest.getBasketItems().size() : 0);
            
            // Sipariş oluştur
            orderService.createOrder(orderDetailRequest);
            log.info("Order created successfully from payment service");
            
            // Stok düşürme mesajlarını hazırla ve kuyruğa bırak
            List<StockUpdateMessage> stockUpdateMessages = new ArrayList<>();
            
            if (orderDetailRequest.getBasketItems() != null && !orderDetailRequest.getBasketItems().isEmpty()) {
                log.info("Processing {} basket items for stock update", orderDetailRequest.getBasketItems().size());
                for (var basketItem : orderDetailRequest.getBasketItems()) {
                    try {
                        log.info("Processing basket item - ProductId: {}, Quantity: {}", 
                                basketItem.getProductId(), basketItem.getProductQuantity());
                        
                        Integer productId = Integer.valueOf(basketItem.getProductId());
                        // Quantity bilgisi yoksa varsayılan olarak 1 kullan
                        Integer quantity = 1;
                        if (basketItem.getProductQuantity() != null && !basketItem.getProductQuantity().trim().isEmpty()) {
                            try {
                                quantity = Integer.valueOf(basketItem.getProductQuantity());
                                log.info("Using actual quantity: {}", quantity);
                            } catch (NumberFormatException e) {
                                log.error("Error parsing quantity: {}, using default: 1", basketItem.getProductQuantity());
                                quantity = 1;
                            }
                        } else {
                            log.warn("Quantity is null or empty, using default: 1");
                        }
                        
                        StockUpdateMessage stockMessage = StockUpdateMessage.builder()
                                .productId(productId)
                                .quantity(quantity)
                                .updateType("DECREASE")
                                .build();
                        
                        stockUpdateMessages.add(stockMessage);
                        
                        log.info("Stock decrease message prepared for productId: {}, quantity: {}", 
                                productId, quantity);
                    } catch (NumberFormatException e) {
                        log.error("Error parsing productId or quantity: productId={}, quantity={}", 
                                basketItem.getProductId(), basketItem.getProductQuantity());
                    }
                }
                
                // Stok düşürme mesajlarını kuyruğa gönder
                if (!stockUpdateMessages.isEmpty()) {
                    log.info("Sending {} stock update messages to RabbitMQ", stockUpdateMessages.size());
                    rabbitMQProducerService.sendStockDecreaseMessages(stockUpdateMessages);
                    log.info("Stock decrease messages sent to RabbitMQ for {} products", stockUpdateMessages.size());
                }
            } else {
                log.warn("No basket items found in order detail request");
            }
            
        } catch (Exception e) {
            log.error("Error processing order detail request from payment service: {}", e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to process order detail request from payment service", e);
        }
    }
}
