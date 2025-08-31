package com.ael.productservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CategoryPropertySimpleResponse {
    private Integer id;
    private Integer categoryId;
    private Integer propertyId;
    private String propertyName;
    private Boolean isActive;
    private Boolean isDeleted;
} 