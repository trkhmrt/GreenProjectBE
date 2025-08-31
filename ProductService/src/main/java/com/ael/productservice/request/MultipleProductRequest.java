package com.ael.productservice.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
public class MultipleProductRequest {
    private String productName;
    private String productBrand;
    private String productDescription;
    private Integer categoryId;
    private List<VariantProductRequest> productVariants;

}
