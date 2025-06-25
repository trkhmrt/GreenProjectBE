package com.ael.productservice.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductCreateResponse {
    private Integer productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private String productModel;
    private String productModelYear;
    private String productImageUrl;
    private Integer subCategoryId;
    private String subCategoryName;
    private String categoryName;
}
