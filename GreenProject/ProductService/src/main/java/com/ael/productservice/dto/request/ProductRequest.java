package com.ael.productservice.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductRequest {
    private Integer productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private String productModel;
    private String productModelYear;
    private String productImageUrl;
    private Integer subCategoryId;
}
