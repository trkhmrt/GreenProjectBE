package com.ael.productservice.repository;

import com.ael.productservice.model.ProductVariantImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IProductVariantImagesRepository extends JpaRepository<ProductVariantImages,Integer> {
    List<ProductVariantImages> findByProductIdAndVariantId(Integer productId, Integer variantId);
    
    // Aktif ve silinmemiş variant görselleri getir
    List<ProductVariantImages> findByProductIdAndVariantIdAndIsDeletedFalseAndIsActiveTrue(Integer productId, Integer variantId);
}
