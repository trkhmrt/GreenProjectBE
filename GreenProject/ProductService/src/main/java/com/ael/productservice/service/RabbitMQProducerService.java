package com.ael.productservice.service;

import com.ael.productservice.config.RabbitMQConfig;
import com.ael.productservice.dto.ImageUploadMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class RabbitMQProducerService {

    private final RabbitTemplate rabbitTemplate;

    public void sendImageUploadMessage(Integer productId, Integer variantId, 
                                     List<ImageUploadMessage.ImageData> images, String uploadType) {
        try {
            ImageUploadMessage message = ImageUploadMessage.builder()
                    .productId(productId)
                    .variantId(variantId)
                    .images(images)
                    .uploadType(uploadType)
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.IMAGE_UPLOAD_EXCHANGE,
                    RabbitMQConfig.IMAGE_UPLOAD_ROUTING_KEY,
                    message
            );

            log.info("Image upload message sent for productId: {}, variantId: {}, uploadType: {}", 
                    productId, variantId, uploadType);
        } catch (Exception e) {
            log.error("Error sending image upload message: {}", e.getMessage());
            throw new RuntimeException("Failed to send image upload message", e);
        }
    }

    public void sendProductImageUploadMessage(Integer productId, List<ImageUploadMessage.ImageData> images) {
        sendImageUploadMessage(productId, null, images, "PRODUCT");
    }

    public void sendVariantImageUploadMessage(Integer productId, Integer variantId, 
                                            List<ImageUploadMessage.ImageData> images) {
        sendImageUploadMessage(productId, variantId, images, "VARIANT");
    }
}
