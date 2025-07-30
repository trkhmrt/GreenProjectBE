package com.ael.productservice.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryRequest {
    private String categoryName;
    private Integer categoryId;
}
