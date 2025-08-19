package com.ael.productservice.response;

import com.ael.productservice.model.ProductProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantResponse {
    private Integer variantId;
    private Integer productId;
    private String sku;
    private Double price;
    private Integer stockQuantity;
    private Boolean isActive;
    private List<String> variantImageUrls;
    private List<ProductPropertyValueResponse> properties; // "Renk": "Mavi", "Beden": "M", "RAM": "8GB" vs.
}