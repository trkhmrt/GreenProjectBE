package com.ael.productservice.repository;

import com.ael.productservice.model.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IProductDetailRepository  extends JpaRepository<ProductDetail, Integer> {
    // YENİ: Ürüne ait tüm variant'ları getir
    @Query("SELECT pd FROM ProductDetail pd WHERE pd.productId = :productId")
    List<ProductDetail> findByProductId(@Param("productId") Integer productId);
}
