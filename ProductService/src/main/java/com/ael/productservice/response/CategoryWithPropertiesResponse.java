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
public class CategoryWithPropertiesResponse {
    private Integer categoryId;
    private String categoryName;
    private Integer parentId;
    private Integer level;
    private Boolean isActive;
    private List<PropertyResponse> properties;
}




