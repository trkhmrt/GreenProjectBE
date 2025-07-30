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
@Table(name="productImagesFiles")
@Entity
public class ProductImageFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fileId;
    private String path;
    private Boolean isActive;
    private Boolean isDeleted;


    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

}
