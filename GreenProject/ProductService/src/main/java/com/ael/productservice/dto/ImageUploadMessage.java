package com.ael.productservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadMessage {
    private Integer productId;
    private Integer variantId; // null ise product image, değilse variant image
    private List<ImageData> images;
    private String uploadType; // "PRODUCT" veya "VARIANT"
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageData {
        private String imageId;
        private byte[] imageBytes;
        private String originalFileName;
        private String contentType;
    }
}


