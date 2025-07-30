package com.ael.productservice.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubCategoryRequest {
    private Integer categoryId;
    private String subCategoryName;
}
