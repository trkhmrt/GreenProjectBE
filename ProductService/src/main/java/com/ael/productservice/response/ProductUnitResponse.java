package com.ael.productservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ProductUnitResponse {
    private Integer productId;
    private String productName;
    private String productDescription;
    private Integer subCategoryId;
    private String subCategoryName;
    private String categoryName;
    private Double productPrice;
    private List<String> productImageUrl;
}
