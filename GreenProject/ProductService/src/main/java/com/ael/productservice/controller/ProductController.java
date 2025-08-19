package com.ael.productservice.controller;


import com.ael.productservice.request.*;
import com.ael.productservice.response.*;
import com.ael.productservice.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ael.productservice.response.ProductVariantResponse;


import java.util.List;

@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/getAllProducts")
    public List<ProductResponse> getAllProducts() {

        return null;
    };


    @PostMapping("/create/simpleProduct")
    public ResponseEntity<?> createSimpleProduct(@ModelAttribute SimpleProductRequest productRequest) {
        try {
            ResponseEntity<ProductCreateResponse> response = productService.createSimpleProduct(productRequest);
            return response;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating simple product: " + e.getMessage());
        }
    }

    @PostMapping("/create/multipleProduct")
    public ResponseEntity<?> createMultipleProduct(@ModelAttribute MultipleProductRequest productRequest) {
        try {
            ResponseEntity<ProductCreateResponse> response = productService.createMultipleProduct(productRequest);
            return response;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating multiple product: " + e.getMessage());
        }
    }

    @GetMapping("/getAllProductsSimple")
    public ResponseEntity<?> getAllProductsSimple() {
        return ResponseEntity.ok(productService.getAllProductsSimple());
    }

    @GetMapping("/getAllProductsComplex")
    public ResponseEntity<?> getAllProductsComplex() {
        List<ProductResponse> products = productService.getAllProductsComplex();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/productDetails")
    public ResponseEntity<ProductResponse> productDetails(@RequestParam Integer productId) {
        return ResponseEntity.ok( productService.getProductById(productId));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer productId) {
        try {
            ProductResponse product = productService.getProductById(productId);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/filterProducts")
    public ResponseEntity<?> filterProducts(@RequestBody FilterRequest filterRequest) {
        List<ProductResponse> filteredProducts = productService.filterProducts(filterRequest);
        return ResponseEntity.ok(filteredProducts);
    }

    // Elasticsearch senkronizasyon endpoint'leri
    @PostMapping("/sync-to-elasticsearch")
    public ResponseEntity<String> syncAllProductsToElasticsearch() {
        try {
            productService.syncAllProductsToElasticsearch();
            return ResponseEntity.ok("Tüm ürünler Elasticsearch'e senkronize edildi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/sync-product/{productId}")
    public ResponseEntity<String> syncProductToElasticsearch(@PathVariable Integer productId) {
        try {
            productService.syncProductToElasticsearch(productId);
            return ResponseEntity.ok("Ürün Elasticsearch'e senkronize edildi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hata: " + e.getMessage());
        }
    }
    
    // Level bazlı ürün getirme
    @GetMapping("/by-level/{level}")
    public ResponseEntity<List<ProductResponse>> getProductsByLevel(@PathVariable Integer level) {
        List<ProductResponse> products = productService.getProductsByLevel(level);
        return ResponseEntity.ok(products);
    }
    
    // Kategori ve level bazlı ürün getirme
    @GetMapping("/by-category/{categoryId}/level/{level}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategoryAndLevel(
            @PathVariable Integer categoryId, 
            @PathVariable Integer level) {
        List<ProductResponse> products = productService.getProductsByCategoryAndLevel(categoryId, level);
        return ResponseEntity.ok(products);
    }

}
