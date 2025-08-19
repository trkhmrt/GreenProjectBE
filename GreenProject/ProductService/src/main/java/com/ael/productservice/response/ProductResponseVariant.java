package com.ael.productservice.response;

import com.ael.productservice.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseVariant {
    private Integer productId;
    private String productName;
    private String productModel;
    private String productBrand;
    private ProductType productType;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private String productImageUrl;
    private Integer categoryId;
    private String categoryName;
    private Integer level;
    private List<ProductPropertyValueResponse> productProperties;
    private List<ImageFileResponse> imageFiles;
    private List<ProductVariantResponse> variants;
}
