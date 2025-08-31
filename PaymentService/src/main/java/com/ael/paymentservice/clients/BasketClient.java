package com.ael.paymentservice.clients;

import com.ael.paymentservice.response.BasketProductUnitResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "BasketService")
public interface BasketClient {

    @PutMapping("/basket/updateBasketStatus/{basketId}/{newStatus}")
    ResponseEntity<String> updateBasketStatus(@PathVariable Integer basketId, @PathVariable Integer newStatus);
    
    @GetMapping("/basket/getCustomerbasket")
    ResponseEntity<BasketProductUnitResponse> getCustomerBasket(
            @RequestParam(required = false) Integer basketId,
            @RequestHeader("X-Customer-Id") Integer customerId,
            @RequestParam(required = false) Integer statusId);
}