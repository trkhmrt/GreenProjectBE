package com.ael.productservice.service;

import com.ael.productservice.document.ProductDocument;
import com.ael.productservice.model.Product;
import com.ael.productservice.repository.ProductElasticsearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// @ConditionalOnProperty(name = "spring.elasticsearch.rest.uris")
public class ProductElasticsearchService {
    
    // private final ProductElasticsearchRepository productElasticsearchRepository;
    
    // Ürünü Elasticsearch'e kaydet
    /*
    public ProductDocument saveProduct(ProductDocument productDocument) {
        return productElasticsearchRepository.save(productDocument);
    }
    
    // Ürünü ID'ye göre bul
    public Optional<ProductDocument> findById(String id) {
        return productElasticsearchRepository.findById(id);
    }
    
    // Tüm ürünleri getir
    public List<ProductDocument> findAll() {
        Iterable<ProductDocument> iterable = productElasticsearchRepository.findAll();
        List<ProductDocument> list = new ArrayList<>();
        iterable.forEach(list::add);
        return list;
    }
    
    // Ürün adına göre arama
    public List<ProductDocument> searchByProductName(String productName) {
        return productElasticsearchRepository.findByProductNameContainingIgnoreCase(productName);
    }
    
    // Kategoriye göre arama
    public List<ProductDocument> searchByCategory(String categoryName) {
        return productElasticsearchRepository.findByCategoryName(categoryName);
    }
    
    // Kategori ID'sine göre arama
    public List<ProductDocument> searchByCategoryId(Integer categoryId) {
        return productElasticsearchRepository.findByCategoryId(categoryId);
    }
    
    // Kategori level'ına göre arama
    public List<ProductDocument> searchByCategoryLevel(Integer categoryLevel) {
        return productElasticsearchRepository.findByCategoryLevel(categoryLevel);
    }
    
    // Kategori yoluna göre arama
    public List<ProductDocument> searchByCategoryPath(String categoryPath) {
        return productElasticsearchRepository.findByCategoryPathContaining(categoryPath);
    }
    
    // Kategori hiyerarşisine göre arama
    public List<ProductDocument> searchByCategoryHierarchy(String categoryName) {
        return productElasticsearchRepository.findByCategoryHierarchyContaining(categoryName);
    }
    
    // Fiyat aralığına göre arama
    public List<ProductDocument> searchByPriceRange(Double minPrice, Double maxPrice) {
        return productElasticsearchRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    // Markaya göre arama
    public List<ProductDocument> searchByBrand(String brand) {
        return productElasticsearchRepository.findByBrandContainingIgnoreCase(brand);
    }
    
    // Aktif ürünleri getir
    public List<ProductDocument> getActiveProducts() {
        return productElasticsearchRepository.findByIsActiveTrue();
    }
    
    // Stokta olan ürünleri getir
    public List<ProductDocument> getProductsInStock(Integer minStock) {
        return productElasticsearchRepository.findByStockGreaterThan(minStock);
    }
    
    // Kategori ve fiyat filtresi
    public List<ProductDocument> searchByCategoryAndPriceRange(String categoryName, Double minPrice, Double maxPrice) {
        return productElasticsearchRepository.findByCategoryNameAndPriceBetween(categoryName, minPrice, maxPrice);
    }
    
    // Kategori ID ve fiyat filtresi
    public List<ProductDocument> searchByCategoryIdAndPriceRange(Integer categoryId, Double minPrice, Double maxPrice) {
        return productElasticsearchRepository.findByCategoryIdAndPriceBetween(categoryId, minPrice, maxPrice);
    }
    
    // Çoklu kategori filtreleme
    public List<ProductDocument> searchByCategoryIdsAndPriceRange(List<Integer> categoryIds, Double minPrice, Double maxPrice) {
        return productElasticsearchRepository.findByCategoryIdsAndPriceRange(categoryIds, minPrice, maxPrice);
    }
    
    // Kategori yolu ve fiyat filtresi
    public List<ProductDocument> searchByCategoryPathAndPriceRange(String categoryPath, Double minPrice, Double maxPrice) {
        return productElasticsearchRepository.findByCategoryPathAndPriceRange(categoryPath, minPrice, maxPrice);
    }
    */
    
    /*
    // Gelişmiş arama - çoklu filtre
    public List<ProductDocument> advancedSearch(String productName, List<Integer> categoryIds, Double minPrice, Double maxPrice, String brand) {
        List<ProductDocument> allProducts = findAll();
        
        return allProducts.stream()
                .filter(product -> productName == null || (product.getProductName() != null && 
                        product.getProductName().toLowerCase().contains(productName.toLowerCase())))
                .filter(product -> categoryIds == null || categoryIds.isEmpty() || 
                        (product.getCategoryId() != null && categoryIds.contains(product.getCategoryId())))
                .filter(product -> minPrice == null || (product.getPrice() != null && 
                        product.getPrice().doubleValue() >= minPrice))
                .filter(product -> maxPrice == null || (product.getPrice() != null && 
                        product.getPrice().doubleValue() <= maxPrice))
                .filter(product -> brand == null || (product.getBrand() != null && 
                        product.getBrand().toLowerCase().contains(brand.toLowerCase())))
                .collect(Collectors.toList());
    }
    
    // Tag'lere göre arama
    public List<ProductDocument> searchByTag(String tag) {
        return productElasticsearchRepository.findByTagsContaining(tag);
    }
    
    // Ürünü Elasticsearch'ten sil
    public void deleteProduct(String id) {
        productElasticsearchRepository.deleteById(id);
    }
    
    // Tüm ürünleri sil
    public void deleteAll() {
        productElasticsearchRepository.deleteAll();
    }
    */
}
