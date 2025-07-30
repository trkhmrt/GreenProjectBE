package com.ael.productservice.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Integer productId;
    private String productName;
    private String productModel;
    private String productModelYear;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private String productImageUrl;
    private Integer subCategoryId;
    private String subCategoryName;
    private String categoryName;
    private List<ProductPropertyValueResponse> productProperties;
    private List<ImageFileResponse> imageFiles;
}
