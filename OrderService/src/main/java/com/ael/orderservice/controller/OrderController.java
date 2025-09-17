package com.ael.orderservice.controller;

import com.ael.orderservice.client.IProductClient;
import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.dto.StockUpdateMessage;
import com.ael.orderservice.dto.request.OrderStatusUpdateRequest;
import com.ael.orderservice.exception.OrderNotFoundException;
import com.ael.orderservice.exception.OrderAccessDeniedException;
import com.ael.orderservice.model.Order;
import com.ael.orderservice.model.Product;
import com.ael.orderservice.service.OrderService;
import com.ael.orderservice.service.RabbitMQProducerService;
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
    private final RabbitMQProducerService rabbitMQProducerService;
    private final IProductClient productClient;

    @PostMapping("/createOrder")
    public ResponseEntity<String> createOrder(@RequestBody OrderDetailRequest orderDetailRequest) {
        try {
            orderService.createOrder(orderDetailRequest);
            return ResponseEntity.ok("Order created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/getCustomerOrders")
    public ResponseEntity<?> getOrderByCustomerId(@RequestHeader("X-Customer-Id") Integer customerId) {
        try {
            return ResponseEntity.ok(orderService.getOrderByCustomerId(customerId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting orders: " + e.getMessage());
        }
    }


    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrdersWithDetails() {
        try {
            return ResponseEntity.ok(orderService.getAllOrdersWithDetails());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting all orders with details: " + e.getMessage());
        }
    }

    @GetMapping("/getCustomerOrdersWithDetails")
    public ResponseEntity<?> getCustomerOrdersWithDetails(@RequestHeader("X-Customer-Id") Integer customerId) {
        try {
            return ResponseEntity.ok(orderService.getCustomerOrdersWithDetails(customerId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting customer orders with details: " + e.getMessage());
        }
    }

    @GetMapping("/getOrderDetails/{orderId}")
    public ResponseEntity<?> getOrderDetailsByOrderId(@RequestHeader("X-Customer-Id") Integer customerId, @PathVariable Integer orderId) {
        try {
            return ResponseEntity.ok(orderService.getOrderDetailsByOrderId(customerId, orderId));
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order not found: " + e.getMessage());
        } catch (OrderAccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting order details: " + e.getMessage());
        }
    }

    @PutMapping("/update/orderStatus/{orderId}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        return ResponseEntity.ok(orderService.orderStatusUpdate(orderId, status));
    }


    // ========== RABBITMQ STOCK TEST ENDPOINTS ==========

    /**
     * Stok düşürme test endpoint'i
     */
    @PostMapping("/test/stock/decrease")
    public ResponseEntity<String> testStockDecrease(
            @RequestParam Integer productId,
            @RequestParam Integer quantity) {
        try {
            StockUpdateMessage message = StockUpdateMessage.builder()
                    .productId(productId)
                    .quantity(quantity)
                    .updateType("DECREASE")
                    .build();

            rabbitMQProducerService.sendStockDecreaseMessage(productId, quantity);
            return ResponseEntity.ok("Stock decrease message sent for productId: " + productId + ", quantity: " + quantity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending stock decrease message: " + e.getMessage());
        }
    }

    @PostMapping("/test/stock/decrease-json")
    public ResponseEntity<String> testStockDecreaseJson(@RequestBody StockUpdateMessage message) {
        try {
            rabbitMQProducerService.sendStockDecreaseMessage(message.getProductId(), message.getQuantity());
            return ResponseEntity.ok("Stock decrease message sent: " + message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending stock decrease message: " + e.getMessage());
        }
    }


    @GetMapping("/ptest")
    public void getProduct() {
        Product product = productClient.getProduct(31);
        System.out.println(product);
    }


}