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
public class CategoryHierarchyResponse {
    private Integer categoryId;
    private String categoryName;
    private Integer parentId;
    private Boolean isActive;
    private Integer level;
    private String description;
    private List<CategoryHierarchyResponse> children; // Alt kategoriler (nested)
    private Integer childrenCount; // Alt kategori sayısı
    private String fullPath; // Tam yol: "Elektronik > Telefon > Android"
}
