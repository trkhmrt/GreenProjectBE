package com.ael.productservice.request;


import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ProductVariantRequest {
    private String sku;
    private Double price;
    private Integer stockQuantity;
    private List<MultipartFile> variantImages;
    private Map<String, String> properties; // "Renk": "Mavi", "Beden": "M", "RAM": "8GB" vs.
}