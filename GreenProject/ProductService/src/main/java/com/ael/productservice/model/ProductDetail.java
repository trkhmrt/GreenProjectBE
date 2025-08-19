package com.ael.productservice.model;

import com.ael.productservice.enums.ProductType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "productDetails")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // productDetailId yerine id


    @Column(name="productId")
    private Integer productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId", insertable = false, updatable = false)
    private Product product;

    // Temel varyant özellikleri
    private String sku;   // Stok Kodu
    private Double price; // Bu varyant için fiyat
    private Integer stockQuantity; // Bu varyant için stok

    // Durum
    private Boolean isActive = true;
    private Boolean isDeleted = false;

    private ProductType productType;

    // Bu varyant için resimler
    @OneToMany(mappedBy = "productDetail", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;

    // Varyant özellikleri (esnek yapı)
    @OneToMany(mappedBy = "productDetail", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductProperty> properties;
}