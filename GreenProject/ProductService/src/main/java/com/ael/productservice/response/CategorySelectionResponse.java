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
public class CategorySelectionResponse {
    private Integer categoryId;
    private String categoryName;
    private Integer level;
    private String fullPath;
    private Boolean isSelected;
    private Boolean hasChildren;
    private List<CategorySelectionResponse> children;
    private String selectionPath; // Seçim yolu: "1 > 3 > 5" (ID'ler)
}


