package com.ael.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ProductService")
public interface ProductClient {
    
    @GetMapping("/product/{productId}")
ResponseEntity<Object> getProduct(@PathVariable Integer productId);
}
