package com.ael.productservice.response;

import com.ael.productservice.enums.ProductType;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductCreateResponse {
    private String message;
    private Integer productId;
    // Ürün tipi
    private ProductType productType;

    // Varyantsız ürünler için
    private Double productPrice;
    private Integer productQuantity;
    private List<String> imageUrls;
}
