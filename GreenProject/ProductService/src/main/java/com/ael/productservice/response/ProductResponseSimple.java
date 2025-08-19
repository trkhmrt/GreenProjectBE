package com.ael.productservice.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ProductResponseSimple {
    private Integer productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private String productCatalogImageUrl;
}
