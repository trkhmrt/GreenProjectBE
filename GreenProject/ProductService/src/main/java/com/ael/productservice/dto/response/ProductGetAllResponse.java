package com.ael.productservice.dto.response;

import lombok.Data;

@Data
public class ProductGetAllResponse {
    private Integer productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private Integer subCategoryId;
}
