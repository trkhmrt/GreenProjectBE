package com.ael.productservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CategoryPropertyResponse {
    private Integer categoryId;
    private String categoryName;
    private Integer propertyId;
    private String propertyValue;
    private Boolean isActive;
}
