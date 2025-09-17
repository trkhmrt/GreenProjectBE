package com.ael.orderservice.client;

import com.ael.orderservice.model.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ProductService")
public interface IProductClient {
    
    @GetMapping("/product/{productId}")
    Product getProduct(@PathVariable Integer productId);

}
