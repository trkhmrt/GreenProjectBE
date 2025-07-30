package com.ael.productservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class SubCategoryDto {
    private Integer id;
    private String name;
    private Boolean isActive;
}