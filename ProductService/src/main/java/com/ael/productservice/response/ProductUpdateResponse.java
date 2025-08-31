package com.ael.productservice.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductUpdateResponse {
    private String message;
    private Integer productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private Integer subCategoryId;
    private String subCategoryName;
}