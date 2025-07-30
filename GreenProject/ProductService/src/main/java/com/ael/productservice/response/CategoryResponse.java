package com.ael.productservice.response;

import com.ael.productservice.model.CategoryProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class CategoryResponse {
    private Integer categoryId;
    private String categoryName;
    private Boolean isActive;
    private List<SubCategoryDto> subcategories;
    private List<CategoryPropertyResponse> filters;
}
