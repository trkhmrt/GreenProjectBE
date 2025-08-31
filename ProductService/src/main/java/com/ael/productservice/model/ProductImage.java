package com.ael.productservice.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productImages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "productDetailId")
    private ProductDetail productDetail;

    private String imagePath;
    private Boolean isActive = true;
    private Boolean isDeleted = false;

    //Eğer ürün variantsa detailId koy değilse direkt ProductId ile kaydet
    private Integer detailId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;


}