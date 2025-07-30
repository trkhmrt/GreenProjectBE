package com.ael.productservice.controller;


import com.ael.productservice.request.ProductRequest;
import com.ael.productservice.request.ProductUpdateRequest;
import com.ael.productservice.response.ProductCreateResponse;
import com.ael.productservice.response.ProductResponse;
import com.ael.productservice.response.ProductUnitResponse;
import com.ael.productservice.response.ProductUpdateResponse;
import com.ael.productservice.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/getAllProducts")
    public List<ProductResponse> getAllProducts() {

        return productService.getAllProductsWithImages();
    };


    @PostMapping("/createProduct")
    public ResponseEntity<ProductCreateResponse> createProduct(@ModelAttribute ProductRequest productRequest) {
        ProductCreateResponse response = productService.createProduct(productRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/addPropertyToProduct")
    public ResponseEntity<String> addPropertyToProduct(@RequestBody ProductRequest productRequest) {

        productService.createProduct(productRequest);

        return ResponseEntity.ok().body("Created Succesfuly");
    };

    @GetMapping("/getProductById/{productId}")
    public ProductResponse getProductById(@PathVariable Integer productId){
        return productService.getProductById(productId);
    }

    @DeleteMapping("/deleteProduct/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer productId){
        return ResponseEntity.ok(productService.deleteProduct(productId));
    }


    @PutMapping("/updateProduct/{productId}")
    public ResponseEntity<ProductUpdateResponse> updateProduct(
            @PathVariable Integer productId,
            @ModelAttribute ProductUpdateRequest productUpdateRequest) {

        ProductUpdateResponse response = productService.updateProduct(productId, productUpdateRequest);
        return ResponseEntity.ok(response);
    }
}
