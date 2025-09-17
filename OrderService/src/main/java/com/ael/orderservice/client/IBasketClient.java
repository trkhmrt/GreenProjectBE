package com.ael.orderservice.client;

import com.ael.orderservice.model.BasketProductUnitResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "BasketService")
public interface IBasketClient {

    @GetMapping("/basket/getCustomerbasket")
    public ResponseEntity<BasketProductUnitResponse> getCustomerbasket(
            @RequestParam(required = false) Integer basketId,
            @RequestHeader("X-Customer-Id") Integer customerId,
            @RequestParam(required = false) Integer statusId);
}
