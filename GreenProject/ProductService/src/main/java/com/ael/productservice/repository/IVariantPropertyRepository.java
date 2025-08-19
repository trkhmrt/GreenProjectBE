package com.ael.productservice.repository;

import com.ael.productservice.model.VariantProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVariantPropertyRepository extends JpaRepository<VariantProperty, Integer> {
    List<VariantProperty> findByVariantId(Integer variantId);
    List<VariantProperty> findByProductId(Integer variantId);
    
    @Query("SELECT vp FROM VariantProperty vp LEFT JOIN FETCH vp.property WHERE vp.variantId = :variantId")
    List<VariantProperty> findByVariantIdWithProperty(@Param("variantId") Integer variantId);
}
