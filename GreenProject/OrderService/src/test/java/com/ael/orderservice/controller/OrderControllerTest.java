package com.ael.orderservice.controller;

import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private OrderDetailRequest orderDetailRequest;

    @BeforeEach
    void setUp() {
        orderDetailRequest = new OrderDetailRequest();
        orderDetailRequest.setCustomerId(1);
        orderDetailRequest.setBasketId(100);
        // Diğer gerekli alanları initialize edebilirsiniz
    }

    @Test
    void createOrder_ShouldReturnOkStatus_WhenOrderCreated() {
        // Arrange
        doNothing().when(orderService).createOrder(any(OrderDetailRequest.class));

        // Act
        ResponseEntity<String> response = orderController.createOrder(orderDetailRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Order created", response.getBody());
        verify(orderService, times(1)).createOrder(orderDetailRequest);
    }

    @Test
    void createOrder_ShouldCallServiceWithCorrectParameters() {
        // Arrange
        doNothing().when(orderService).createOrder(any(OrderDetailRequest.class));

        // Act
        ResponseEntity<String> response = orderController.createOrder(orderDetailRequest);

        // Assert
        verify(orderService).createOrder(argThat(request -> {
            assertEquals(1, request.getCustomerId());
            assertEquals(100, request.getBasketId());
            return true;
        }));
    }

    @Test
    void createOrder_ShouldReturnInternalServerError_WhenServiceFails() {
        // Arrange
        doThrow(new RuntimeException("Service error"))
                .when(orderService)
                .createOrder(any(OrderDetailRequest.class));

        // Act
        ResponseEntity<String> response = orderController.createOrder(orderDetailRequest);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Error creating order"));
    }

    @Test
    void createOrder_ShouldReturnBadRequest_WhenInvalidInput() {
        // Arrange
        OrderDetailRequest invalidRequest = new OrderDetailRequest(); // Eksik alanlar

        // Act
        ResponseEntity<String> response = orderController.createOrder(invalidRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        // Hata mesajı kontrolü de eklenebilir
    }
}