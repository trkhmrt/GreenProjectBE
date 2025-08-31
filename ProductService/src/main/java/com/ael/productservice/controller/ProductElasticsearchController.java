package com.ael.productservice.controller;

import com.ael.productservice.document.ProductDocument;
import com.ael.productservice.service.ProductElasticsearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController
// @RequestMapping("/elasticsearch/products")
// @RequiredArgsConstructor
// @ConditionalOnProperty(name = "spring.elasticsearch.rest.uris")
public class ProductElasticsearchController {
    
    // private final ProductElasticsearchService productElasticsearchService;
    
    /*
    // Tüm ürünleri getir
    @GetMapping
    public ResponseEntity<List<ProductDocument>> getAllProducts() {
        List<ProductDocument> products = productElasticsearchService.findAll();
        return ResponseEntity.ok(products);
    }
    
    // Ürün adına göre arama
    @GetMapping("/search/name")
    public ResponseEntity<List<ProductDocument>> searchByProductName(@RequestParam String productName) {
        List<ProductDocument> products = productElasticsearchService.searchByProductName(productName);
        return ResponseEntity.ok(products);
    }
    
    // Kategoriye göre arama
    @GetMapping("/search/category")
    public ResponseEntity<List<ProductDocument>> searchByCategory(@RequestParam String categoryName) {
        List<ProductDocument> products = productElasticsearchService.searchByCategory(categoryName);
        return ResponseEntity.ok(products);
    }
    
    // Alt kategoriye göre arama
    @GetMapping("/search/subcategory")
    public ResponseEntity<List<ProductDocument>> searchBySubCategory(@RequestParam String subCategoryName) {
        // Bu metod artık yok, kategori ID'si ile arama yapılmalı
        return ResponseEntity.badRequest().build();
    }
    
    // Kategori ID'sine göre arama
    @GetMapping("/search/category-id")
    public ResponseEntity<List<ProductDocument>> searchByCategoryId(@RequestParam Integer categoryId) {
        List<ProductDocument> products = productElasticsearchService.searchByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }
    
    // Kategori level'ına göre arama
    @GetMapping("/search/category-level")
    public ResponseEntity<List<ProductDocument>> searchByCategoryLevel(@RequestParam Integer categoryLevel) {
        List<ProductDocument> products = productElasticsearchService.searchByCategoryLevel(categoryLevel);
        return ResponseEntity.ok(products);
    }
    
    // Kategori yoluna göre arama
    @GetMapping("/search/category-path")
    public ResponseEntity<List<ProductDocument>> searchByCategoryPath(@RequestParam String categoryPath) {
        List<ProductDocument> products = productElasticsearchService.searchByCategoryPath(categoryPath);
        return ResponseEntity.ok(products);
    }
    
    // Kategori hiyerarşisine göre arama
    @GetMapping("/search/category-hierarchy")
    public ResponseEntity<List<ProductDocument>> searchByCategoryHierarchy(@RequestParam String categoryName) {
        List<ProductDocument> products = productElasticsearchService.searchByCategoryHierarchy(categoryName);
        return ResponseEntity.ok(products);
    }
    
    // Fiyat aralığına göre arama
    @GetMapping("/search/price")
    public ResponseEntity<List<ProductDocument>> searchByPriceRange(
            @RequestParam Double minPrice, 
            @RequestParam Double maxPrice) {
        List<ProductDocument> products = productElasticsearchService.searchByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
    
    // Markaya göre arama
    @GetMapping("/search/brand")
    public ResponseEntity<List<ProductDocument>> searchByBrand(@RequestParam String brand) {
        List<ProductDocument> products = productElasticsearchService.searchByBrand(brand);
        return ResponseEntity.ok(products);
    }
    
    // Aktif ürünleri getir
    @GetMapping("/active")
    public ResponseEntity<List<ProductDocument>> getActiveProducts() {
        List<ProductDocument> products = productElasticsearchService.getActiveProducts();
        return ResponseEntity.ok(products);
    }
    
    // Stokta olan ürünleri getir
    @GetMapping("/in-stock")
    public ResponseEntity<List<ProductDocument>> getProductsInStock(@RequestParam(defaultValue = "0") Integer minStock) {
        List<ProductDocument> products = productElasticsearchService.getProductsInStock(minStock);
        return ResponseEntity.ok(products);
    }
    
    // Kategori ve fiyat filtresi
    @GetMapping("/search/category-price")
    public ResponseEntity<List<ProductDocument>> searchByCategoryAndPriceRange(
            @RequestParam String categoryName,
            @RequestParam Double minPrice, 
            @RequestParam Double maxPrice) {
        List<ProductDocument> products = productElasticsearchService.searchByCategoryAndPriceRange(categoryName, minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
    
    // Çoklu filtre arama
    @GetMapping("/search/advanced")
    public ResponseEntity<List<ProductDocument>> searchAdvanced(
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) List<Integer> categoryIds,
            @RequestParam(required = false) Double minPrice, 
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String brand) {
        List<ProductDocument> products = productElasticsearchService.advancedSearch(productName, categoryIds, minPrice, maxPrice, brand);
        return ResponseEntity.ok(products);
    }
    
    // Tag'lere göre arama
    @GetMapping("/search/tag")
    public ResponseEntity<List<ProductDocument>> searchByTag(@RequestParam String tag) {
        List<ProductDocument> products = productElasticsearchService.searchByTag(tag);
        return ResponseEntity.ok(products);
    }
    
    // Tüm ürünleri Elasticsearch'ten sil
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearAllProducts() {
        productElasticsearchService.deleteAll();
        return ResponseEntity.ok("Tüm ürünler Elasticsearch'ten silindi");
    }
    */
}
