package com.ael.orderservice.service;

import com.ael.orderservice.config.rabbitmq.config.RabbitMQConfig;
import com.ael.orderservice.dto.StockUpdateMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class RabbitMQProducerService {

    private final RabbitTemplate rabbitTemplate;

    /**
     * Sipariş oluşturulduğunda stok düşürme mesajı gönder
     */
    public void sendStockDecreaseMessages(List<StockUpdateMessage> stockUpdateMessages) {
        try {
            for (StockUpdateMessage message : stockUpdateMessages) {
                rabbitTemplate.convertAndSend(
                        RabbitMQConfig.STOCK_UPDATE_EXCHANGE,
                        RabbitMQConfig.STOCK_UPDATE_ROUTING_KEY,
                        message
                );
                
                log.info("Stock decrease message sent for productId: {}, quantity: {}", 
                        message.getProductId(), message.getQuantity());
            }
            
            log.info("Total {} stock decrease messages sent successfully", stockUpdateMessages.size());
        } catch (Exception e) {
            log.error("Error sending stock decrease messages: {}", e.getMessage());
            throw new RuntimeException("Failed to send stock decrease messages", e);
        }
    }
    
    /**
     * Tek bir ürün için stok düşürme mesajı gönder
     */
    public void sendStockDecreaseMessage(Integer productId, Integer quantity) {
        try {
            StockUpdateMessage message = StockUpdateMessage.builder()
                    .productId(productId)
                    .quantity(quantity)
                    .updateType("DECREASE")
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.STOCK_UPDATE_EXCHANGE,
                    RabbitMQConfig.STOCK_UPDATE_ROUTING_KEY,
                    message
            );

            log.info("Stock decrease message sent for productId: {}, quantity: {}", 
                    productId, quantity);
        } catch (Exception e) {
            log.error("Error sending stock decrease message: {}", e.getMessage());
            throw new RuntimeException("Failed to send stock decrease message", e);
        }
    }
}
