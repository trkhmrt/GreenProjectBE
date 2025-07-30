package com.ael.productservice.controller;

import com.ael.productservice.model.ProductPropertyValue;
import com.ael.productservice.model.Product;
import com.ael.productservice.model.Property;
import com.ael.productservice.repository.IProductPropertyValueRepository;
import com.ael.productservice.repository.IPropertyRepository;
import com.ael.productservice.repository.IProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product-property-value")
@RequiredArgsConstructor
public class ProductPropertyValueController {
    private final IProductPropertyValueRepository productPropertyValueRepository;
    private final IProductRepository productRepository;
    private final IPropertyRepository propertyRepository;

    @PostMapping("/add")
    public ResponseEntity<ProductPropertyValue> addProductPropertyValue(@RequestParam Integer productId, @RequestParam Integer propertyId, @RequestParam String value) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        Property property = propertyRepository.findById(propertyId).orElseThrow(() -> new RuntimeException("Property not found"));
        ProductPropertyValue ppv = ProductPropertyValue.builder().product(product).property(property).value(value).build();
        return ResponseEntity.ok(productPropertyValueRepository.save(ppv));
    }
} 