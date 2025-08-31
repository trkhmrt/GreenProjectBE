package com.ael.productservice.model;

import jakarta.persistence.*;
import jakarta.ws.rs.core.Variant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productProperties")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    private String value; // Özelliğin değeri

    private Boolean isActive = true;

    private Boolean isDeleted = false;

    // Sadece ID alanları
    @Column(name = "detail_id")
    private Integer detailId;

    @Column(name = "propertyId")
    private Integer propertyId;

    @Column(name = "productId")
    private Integer productId;

    @Column(name="variantId")
    private Integer variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id", insertable = false, updatable = false)
    private ProductVariant variant;

    // Lazy loading ile entity'lere erişim
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id", insertable = false, updatable = false)
    private ProductDetail productDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propertyId", insertable = false, updatable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId", insertable = false, updatable = false)
    private Product product;

}

