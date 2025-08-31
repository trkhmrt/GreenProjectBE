package com.ael.productservice.repository;

import com.ael.productservice.document.ProductDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// public interface ProductElasticsearchRepository extends ElasticsearchRepository<ProductDocument, String> {
public interface ProductElasticsearchRepository {
    
    // Ürün adına göre arama
    List<ProductDocument> findByProductNameContainingIgnoreCase(String productName);
    
    // Kategoriye göre arama
    List<ProductDocument> findByCategoryName(String categoryName);
    
    // Kategori ID'sine göre arama
    List<ProductDocument> findByCategoryId(Integer categoryId);
    
    // Kategori level'ına göre arama
    List<ProductDocument> findByCategoryLevel(Integer categoryLevel);
    
    // Kategori yoluna göre arama
    List<ProductDocument> findByCategoryPathContaining(String categoryPath);
    
    // Kategori hiyerarşisine göre arama
    List<ProductDocument> findByCategoryHierarchyContaining(String categoryName);
    
    // Fiyat aralığına göre arama
    List<ProductDocument> findByPriceBetween(Double minPrice, Double maxPrice);
    
    // Markaya göre arama
    List<ProductDocument> findByBrandContainingIgnoreCase(String brand);
    
    // Aktif ürünleri getir
    List<ProductDocument> findByIsActiveTrue();
    
    // Stokta olan ürünleri getir
    List<ProductDocument> findByStockGreaterThan(Integer minStock);
    
    // Kategori ve fiyat filtresi
    List<ProductDocument> findByCategoryNameAndPriceBetween(String categoryName, Double minPrice, Double maxPrice);
    
    // Kategori ID ve fiyat filtresi
    List<ProductDocument> findByCategoryIdAndPriceBetween(Integer categoryId, Double minPrice, Double maxPrice);
    
    // Tag'lere göre arama
    List<ProductDocument> findByTagsContaining(String tag);
    
    // Çoklu kategori filtreleme
    @Query("{\"bool\": {\"must\": [{\"terms\": {\"categoryId\": ?0}}, {\"range\": {\"price\": {\"gte\": ?1, \"lte\": ?2}}}]}}")
    List<ProductDocument> findByCategoryIdsAndPriceRange(List<Integer> categoryIds, Double minPrice, Double maxPrice);
    
    // Kategori hiyerarşisi ve fiyat filtresi
    @Query("{\"bool\": {\"must\": [{\"match\": {\"categoryPath\": \"?0\"}}, {\"range\": {\"price\": {\"gte\": ?1, \"lte\": ?2}}}]}}")
    List<ProductDocument> findByCategoryPathAndPriceRange(String categoryPath, Double minPrice, Double maxPrice);
}
