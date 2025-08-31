package com.ael.productservice.model;

import com.ael.productservice.enums.ProductType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Table(name="products")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;
    private String productName;
    private String productBrand;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private Boolean isActive;
    private Boolean isDeleted;

    @Enumerated(EnumType.STRING)
    private ProductType productType;

    @Column(name = "productCategoryId")
    private Integer categoryId;
    
    @Column(name = "productLevel")
    private Integer level; // 0: root, 1: child, 2: grandchild, ...

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productCategoryId", insertable = false, updatable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ProductImage> imageFiles;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ProductProperty> productProperties;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductDetail> productDetails;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> productVariants;

}
