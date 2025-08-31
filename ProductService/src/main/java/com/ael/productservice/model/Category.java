package com.ael.productservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name="categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;
    
    private String categoryName;
    
    private Integer parentId; // NULL = root, sayı = parent ID
    
    private Boolean isActive;
    
    private Boolean isDeleted;
    
    private Integer level; // 0: root, 1: child, 2: grandchild, 3: great-grandchild, ...
}
