package com.ael.productservice.controller;


import com.ael.productservice.request.*;
import com.ael.productservice.response.*;
import com.ael.productservice.service.ProductService;
import com.ael.productservice.dto.StockUpdateMessage;
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

    // ========== UPDATE ENDPOINTS ==========
    // Update endpoint'leri şimdilik kaldırıldı - mevcut yapıyla uyumlu değil

    // ========== IMAGE MANAGEMENT ENDPOINTS ==========

    // Simple ürün görselini sil (soft delete)
    @DeleteMapping("/image/{imageId}")
    public ResponseEntity<String> deleteSimpleProductImage(@PathVariable Integer imageId) {
        try {
            productService.deleteSimpleProductImage(imageId);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting image: " + e.getMessage());
        }
    }

    // Variant ürün görselini sil (soft delete)
    @DeleteMapping("/variant-image/{imageId}")
    public ResponseEntity<String> deleteVariantProductImage(@PathVariable Integer imageId) {
        try {
            productService.deleteVariantProductImage(imageId);
            return ResponseEntity.ok("Variant image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting variant image: " + e.getMessage());
        }
    }

    // Simple ürün görselini aktif/pasif yap
    @PutMapping("/image/{imageId}/toggle-active")
    public ResponseEntity<String> toggleSimpleProductImageActive(@PathVariable Integer imageId) {
        try {
            productService.toggleSimpleProductImageActive(imageId);
            return ResponseEntity.ok("Image active status toggled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling image active status: " + e.getMessage());
        }
    }

    // Variant ürün görselini aktif/pasif yap
    @PutMapping("/variant-image/{imageId}/toggle-active")
    public ResponseEntity<String> toggleVariantProductImageActive(@PathVariable Integer imageId) {
        try {
            productService.toggleVariantProductImageActive(imageId);
            return ResponseEntity.ok("Variant image active status toggled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling variant image active status: " + e.getMessage());
        }
    }
    
    // ========== RABBITMQ STOCK TEST ENDPOINTS ==========
    
    /**
     * Basit stok düşürme test endpoint'i
     */
    @PostMapping("/test/stock/decrease")
    public ResponseEntity<String> testStockDecrease(
            @RequestParam Integer productId,
            @RequestParam Integer quantity) {
        try {
            productService.decreaseStock(productId, quantity);
            return ResponseEntity.ok("Stock decrease message sent successfully to RabbitMQ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending stock decrease message: " + e.getMessage());
        }
    }
    
    /**
     * Basit stok artırma test endpoint'i
     */
    @PostMapping("/test/stock/increase")
    public ResponseEntity<String> testStockIncrease(
            @RequestParam Integer productId,
            @RequestParam Integer quantity) {
        try {
            productService.increaseStock(productId, quantity);
            return ResponseEntity.ok("Stock increase message sent successfully to RabbitMQ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending stock increase message: " + e.getMessage());
        }
    }
    
    /**
     * JSON ile stok düşürme test endpoint'i
     */
    @PostMapping("/test/stock/decrease-json")
    public ResponseEntity<String> testStockDecreaseJson(@RequestBody StockUpdateMessage stockUpdateMessage) {
        try {
            productService.decreaseStock(stockUpdateMessage.getProductId(), stockUpdateMessage.getQuantity());
            return ResponseEntity.ok("Stock decrease message sent successfully to RabbitMQ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending stock decrease message: " + e.getMessage());
        }
    }
    
    /**
     * JSON ile stok artırma test endpoint'i
     */
    @PostMapping("/test/stock/increase-json")
    public ResponseEntity<String> testStockIncreaseJson(@RequestBody StockUpdateMessage stockUpdateMessage) {
        try {
            productService.increaseStock(stockUpdateMessage.getProductId(), stockUpdateMessage.getQuantity());
            return ResponseEntity.ok("Stock increase message sent successfully to RabbitMQ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending stock increase message: " + e.getMessage());
        }
    }

}
