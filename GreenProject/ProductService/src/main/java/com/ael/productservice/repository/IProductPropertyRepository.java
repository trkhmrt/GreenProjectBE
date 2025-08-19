package com.ael.productservice.repository;

import com.ael.productservice.model.ProductProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductPropertyRepository extends JpaRepository<ProductProperty, Integer> {

    List<ProductProperty> findByProductDetail_Id(Integer detailId);

    @Query("SELECT pvp FROM ProductProperty pvp " +
            "JOIN pvp.property p " +
            "WHERE pvp.productDetail.id = :detailId " +
            "AND p.name = :propertyName")
    ProductProperty findByDetailIdAndPropertyName(
            @Param("detailId") Integer detailId,
            @Param("propertyName") String propertyName);

    List<ProductProperty> findByProduct_ProductId(Integer productId);

    @Query("SELECT pp FROM ProductProperty pp " +
            "WHERE pp.product.productId = :productId " +
            "AND pp.property.id = :propertyId")
    ProductProperty findByProductIdAndPropertyId(
            @Param("productId") Integer productId,
            @Param("propertyId") Integer propertyId);

    // YENİ: Ürüne ait tüm property'leri getir
    @Query("SELECT pp FROM ProductProperty pp WHERE pp.productId = :productId")
    List<ProductProperty> findByProductId(@Param("productId") Integer productId);
}