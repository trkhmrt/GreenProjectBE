package com.ael.productservice.repository;

import com.ael.productservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProductRepository extends JpaRepository<Product, Integer> {
    // Ana sorgu - sadece kategori bilgileri
    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.category c")
    List<Product> findAllWithCategory();

    // Tek ürün için resimler
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.imageFiles " +
            "WHERE p.productId = :productId")
    Optional<Product> findByIdWithImages(@Param("productId") Integer productId);

    // Tek ürün için özellikler
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.productProperties ppv " +
            "LEFT JOIN FETCH ppv.property " +
            "WHERE p.productId = :productId")
    Optional<Product> findByIdWithProperties(@Param("productId") Integer productId);

    // Tek ürün için tüm detaylar
    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.imageFiles " +
            "LEFT JOIN FETCH p.productProperties ppv " +
            "LEFT JOIN FETCH ppv.property " +
            "LEFT JOIN FETCH p.category c " +
            "WHERE p.productId = :productId")
    Optional<Product> findByIdWithAllDetails(@Param("productId") Integer productId);

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.category c " +
            "WHERE p.productId = :productId")
    Optional<Product> findByIdWithCategory(@Param("productId") Integer productId);

    // Yeni metodlar
    List<Product> findByLevel(Integer level);
    List<Product> findByCategoryIdIn(List<Integer> categoryIds);
    List<Product> findByCategoryId(Integer categoryId);
    List<Product> findByCategoryIdAndLevel(Integer categoryId, Integer level);
    List<Product> findByIsActiveTrue();
    List<Product> findByIsDeletedFalse();
    long countByCategoryId(Integer categoryId);
}
