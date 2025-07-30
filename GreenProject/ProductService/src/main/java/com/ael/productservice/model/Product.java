package com.ael.productservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

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
    private String productModel;
    private String productModelYear;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;


    @ManyToOne
    @JoinColumn(name = "productSubCategoryId")
    private SubCategory subcategory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ProductImageFile> imageFiles;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ProductPropertyValue> productPropertyValues;

}
