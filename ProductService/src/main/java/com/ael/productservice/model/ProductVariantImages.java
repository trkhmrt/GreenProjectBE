package com.ael.productservice.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "productVariantImages")
@Entity
public class ProductVariantImages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer imageId;
    private Integer productId;

    @Column(name = "variantId")
    private Integer variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variantId", insertable = false, updatable = false)
    private ProductVariant productVariant;

    private String imageUrl;
    private String imagePath;
    private Boolean isActive;
    private Boolean isDeleted;

}
