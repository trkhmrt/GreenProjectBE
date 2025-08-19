package com.ael.productservice.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class FilterRequest {
    private Integer categoryId;
    private Integer subcategoryId;
    private Map<String, List<String>> filters;
    private Double maxPrice;
    private Double minPrice;
    private Map<String, List<String>> colors;
}
