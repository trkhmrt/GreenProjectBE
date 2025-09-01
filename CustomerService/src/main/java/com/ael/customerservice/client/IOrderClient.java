package com.ael.customerservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "OrderService")
public interface IOrderClient {
    
    @GetMapping("/order/getCustomerOrders")
    ResponseEntity<?> getCustomerOrders(@RequestHeader("X-Customer-Id") Integer customerId);
    
    @GetMapping("/order/getCustomerOrdersWithDetails")
    ResponseEntity<?> getCustomerOrdersWithDetails(@RequestHeader("X-Customer-Id") Integer customerId);
    
    @GetMapping("/order/getOrderDetails/{orderId}")
    ResponseEntity<?> getOrderDetails(@RequestHeader("X-Customer-Id") Integer customerId, @PathVariable Integer orderId);
}
