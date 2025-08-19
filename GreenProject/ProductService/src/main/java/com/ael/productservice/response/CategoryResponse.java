package com.ael.productservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer categoryId;
    private String categoryName;
    private Integer parentId;
    private Boolean isActive;
    private Integer level;
    private String fullPath;
    private Boolean isDeleted;
    private List<PropertyResponse> properties;
    private List<CategoryResponse> children;
}
