package com.ael.productservice.service;

import com.ael.productservice.config.RabbitMQConfig;
import com.ael.productservice.dto.ImageUploadMessage;
import com.ael.productservice.dto.StockUpdateMessage;
import com.ael.productservice.model.Product;
import com.ael.productservice.model.ProductImage;
import com.ael.productservice.model.ProductVariant;
import com.ael.productservice.model.ProductVariantImages;
import com.ael.productservice.repository.IProductImageRepository;
import com.ael.productservice.repository.IProductRepository;
import com.ael.productservice.repository.IProductVariantRepository;
import com.ael.productservice.repository.IProductVariantImagesRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final IProductRepository productRepository;

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
    
    // ========== SIMPLE STOCK UPDATE CONSUMER ==========
    
    @RabbitListener(queues = RabbitMQConfig.STOCK_UPDATE_QUEUE)
    @Transactional
    public void handleStockUpdate(StockUpdateMessage message) {
        try {
            log.info("=== PRODUCT SERVICE STOCK UPDATE DEBUG ===");
            log.info("Received stock update message for productId: {}, quantity: {}, updateType: {}", 
                    message.getProductId(), message.getQuantity(), message.getUpdateType());

            // Önce simple product olarak dene
            try {
                log.info("Trying to update simple product stock...");
                updateSimpleProductStock(message);
                log.info("Simple product stock updated successfully");
            } catch (Exception e) {
                log.warn("Simple product not found, trying variant product: {}", e.getMessage());
                // Simple product bulunamadıysa variant product olarak dene
                updateVariantProductStock(message);
                log.info("Variant product stock updated successfully");
            }

            log.info("Stock update completed successfully for productId: {}", message.getProductId());
        } catch (Exception e) {
            log.error("Error processing stock update message: {}", e.getMessage());
            e.printStackTrace();
            // Burada hata durumunda retry mekanizması eklenebilir
        }
    }
    
    private void updateSimpleProductStock(StockUpdateMessage message) {
        Product product = productRepository.findById(message.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + message.getProductId()));

        Integer currentStock = product.getProductQuantity();
        Integer newStock;

        if ("DECREASE".equals(message.getUpdateType())) {
            newStock = currentStock - message.getQuantity();
            if (newStock < 0) {
                log.warn("Stock would become negative for productId: {}. Current: {}, Requested decrease: {}", 
                        message.getProductId(), currentStock, message.getQuantity());
                newStock = 0; // Stok 0'a düşür
            }
        } else if ("INCREASE".equals(message.getUpdateType())) {
            newStock = currentStock + message.getQuantity();
        } else {
            throw new RuntimeException("Invalid update type: " + message.getUpdateType());
        }

        product.setProductQuantity(newStock);
        productRepository.save(product);

        log.info("Simple product stock updated - ProductId: {}, Current: {}, New: {}, UpdateType: {}", 
                message.getProductId(), currentStock, newStock, message.getUpdateType());
    }
    
    private void updateVariantProductStock(StockUpdateMessage message) {
        // Variant product için tüm variant'ları kontrol et
        List<ProductVariant> variants = productVariantRepository.findByProductId(message.getProductId());
        
        if (variants.isEmpty()) {
            throw new RuntimeException("No variants found for productId: " + message.getProductId());
        }
        
        // İlk variant'ı güncelle (veya tüm variant'ları güncellemek istiyorsanız loop kullanın)
        ProductVariant variant = variants.get(0);
        Integer currentStock = variant.getVariantQuantity();
        Integer newStock;

        if ("DECREASE".equals(message.getUpdateType())) {
            newStock = currentStock - message.getQuantity();
            if (newStock < 0) {
                log.warn("Stock would become negative for variant - ProductId: {}, VariantId: {}. Current: {}, Requested decrease: {}", 
                        message.getProductId(), variant.getVariantId(), currentStock, message.getQuantity());
                newStock = 0; // Stok 0'a düşür
            }
        } else if ("INCREASE".equals(message.getUpdateType())) {
            newStock = currentStock + message.getQuantity();
        } else {
            throw new RuntimeException("Invalid update type: " + message.getUpdateType());
        }

        variant.setVariantQuantity(newStock);
        productVariantRepository.save(variant);

        log.info("Variant product stock updated - ProductId: {}, VariantId: {}, Current: {}, New: {}, UpdateType: {}", 
                message.getProductId(), variant.getVariantId(), currentStock, newStock, message.getUpdateType());
    }
}
