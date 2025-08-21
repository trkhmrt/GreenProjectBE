package com.ael.paymentservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductUnitResponse {
    private Integer productId;
    private Integer basketProductUnitId;
    private String productName;
    private String productDescription;
    private Integer subCategoryId;
    private String categoryName;
    private String subCategoryName;
    private Double productPrice;
    private Integer productQuantity;
    private String productModel;
    private String productModelYear;
    private String productImageUrl;
}
