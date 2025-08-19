package com.ael.productservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "variantProperties")
public class VariantProperty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer variantPropertyId;

    private String variantPropertyName;

    private String variantPropertyDescription;

    private String variantPropertyValue;

    private Integer productId;

    private Integer propertyId;

    private Boolean isActive;

    private Boolean isDeleted;

    @Column(name="variantId")
    private Integer variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variantId", insertable = false, updatable = false)
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propertyId", insertable = false, updatable = false)
    private Property property;

}
