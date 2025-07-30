package com.ael.orderservice.controller;

import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.model.Order;
import com.ael.orderservice.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;


    @PostMapping("/createOrder")
    public ResponseEntity<String> createOrder(@RequestBody OrderDetailRequest orderDetailRequest) {
        try {
            orderService.createOrder(orderDetailRequest);
            return ResponseEntity.ok("Order created");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/getCustomerOrders")
    public ResponseEntity<?> getOrderByCustomerId(@RequestHeader("X-Customer-Id") Integer customerId) {
        try {

            return ResponseEntity.ok( orderService.getOrderByCustomerId(customerId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/getCustomerOrderDetails/{orderId}")
    public ResponseEntity<?> getCustomerOrderDetails(@PathVariable Integer orderId) {
        try {

            return ResponseEntity.ok(orderService.getOrderDetailsByOrderId(orderId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

}