package com.ael.productservice.service;

import com.ael.productservice.config.RabbitMQConfig;
import com.ael.productservice.dto.ImageUploadMessage;
import com.ael.productservice.model.Product;
import com.ael.productservice.model.ProductImage;
import com.ael.productservice.model.ProductVariantImages;
import com.ael.productservice.repository.IProductImageRepository;
import com.ael.productservice.repository.IProductVariantRepository;
import com.ael.productservice.repository.IProductVariantImagesRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class RabbitMQConsumerService {

    private final S3Service s3Service;
    private final IProductImageRepository productImageRepository;
    private final IProductVariantImagesRepository productVariantImagesRepository;
    private final IProductVariantRepository productVariantRepository;

    @RabbitListener(queues = RabbitMQConfig.IMAGE_UPLOAD_QUEUE)
    public void handleImageUpload(ImageUploadMessage message) {
        try {
            log.info("Received image upload message for productId: {}, variantId: {}, uploadType: {}", 
                    message.getProductId(), message.getVariantId(), message.getUploadType());

            if ("PRODUCT".equals(message.getUploadType())) {
                handleProductImageUpload(message);
            } else if ("VARIANT".equals(message.getUploadType())) {
                handleVariantImageUpload(message);
            }

            log.info("Image upload completed successfully for productId: {}", message.getProductId());
        } catch (Exception e) {
            log.error("Error processing image upload message: {}", e.getMessage());
            // Burada retry logic veya dead letter queue'ya gönderme işlemi yapılabilir
        }
    }

    private void handleProductImageUpload(ImageUploadMessage message) {
        List<String> uploadedUrls = new ArrayList<>();
        
        for (ImageUploadMessage.ImageData imageData : message.getImages()) {
            try {
                // S3'e yükle - productId klasörü altına
                String folderPath = "products/" + message.getProductId() + "/";
                String fileName = imageData.getOriginalFileName(); // Sadece orijinal dosya adını kullan
                
                String uploadedUrl = s3Service.uploadImageToS3(
                        imageData.getImageBytes(),
                        folderPath + fileName,
                        imageData.getContentType()
                );
                
                uploadedUrls.add(uploadedUrl);
                
                // Database'deki mevcut kaydı güncelle (imageUrl'i ekle)
                List<ProductImage> existingImages = productImageRepository.findByProductId(message.getProductId());
                
                for (ProductImage existingImage : existingImages) {
                    if (existingImage.getImagePath() != null && 
                        existingImage.getImagePath().endsWith(imageData.getOriginalFileName())) {
                        existingImage.setImagePath(uploadedUrl); // imageUrl yerine imagePath'i güncelle
                        productImageRepository.save(existingImage);
                        log.info("Product image URL updated in database: {}", uploadedUrl);
                        break;
                    }
                }
                
                log.info("Product image uploaded successfully: {}", uploadedUrl);
            } catch (Exception e) {
                log.error("Error uploading product image: {}", e.getMessage());
            }
        }
    }

    private void handleVariantImageUpload(ImageUploadMessage message) {
        List<String> uploadedUrls = new ArrayList<>();
        
        for (ImageUploadMessage.ImageData imageData : message.getImages()) {
            try {
                // S3'e yükle - productId/variantId klasörü altına
                String folderPath = "products/" + message.getProductId() + "/" + message.getVariantId() + "/";
                String fileName = imageData.getOriginalFileName(); // Sadece orijinal dosya adını kullan
                
                String uploadedUrl = s3Service.uploadImageToS3(
                        imageData.getImageBytes(),
                        folderPath + fileName,
                        imageData.getContentType()
                );
                
                uploadedUrls.add(uploadedUrl);
                
                // Database'deki mevcut kaydı güncelle (imageUrl'i ekle)
                List<ProductVariantImages> existingImages = productVariantImagesRepository.findByProductIdAndVariantId(
                        message.getProductId(), message.getVariantId());
                
                for (ProductVariantImages existingImage : existingImages) {
                    if (existingImage.getImagePath() != null && 
                        existingImage.getImagePath().endsWith(imageData.getOriginalFileName())) {
                        existingImage.setImageUrl(uploadedUrl);
                        productVariantImagesRepository.save(existingImage);
                        log.info("Variant image URL updated in database: {}", uploadedUrl);
                        break;
                    }
                }
                
                log.info("Variant image uploaded successfully: {}", uploadedUrl);
            } catch (Exception e) {
                log.error("Error uploading variant image: {}", e.getMessage());
            }
        }
    }
}
