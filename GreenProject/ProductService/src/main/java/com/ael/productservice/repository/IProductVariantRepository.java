package com.ael.productservice.repository;

import com.ael.productservice.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
        List<ProductVariant> findByProductId(Integer productId);
}
