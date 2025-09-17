package com.ael.orderservice.service;


import com.ael.orderservice.client.IBasketClient;
import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.dto.response.OrderDetailResponse;
import com.ael.orderservice.dto.response.OrderResponse;
import com.ael.orderservice.enums.OrderStatusEnum;
import com.ael.orderservice.exception.OrderNotFoundException;
import com.ael.orderservice.model.BasketProductUnitResponse;
import com.ael.orderservice.model.Order;
import com.ael.orderservice.model.OrderDetail;
import com.ael.orderservice.model.Product;
import com.ael.orderservice.repository.IOrderDetailRepository;
import com.ael.orderservice.repository.IOrderRepository;
import com.ael.orderservice.client.IProductClient;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Slf4j
public class OrderService {

    private final IOrderRepository orderRepository;
    private final IOrderDetailRepository orderDetailRepository;
    private final IProductClient productClient;
    private final IBasketClient basketClient;


    @Transactional
    public void createOrder(OrderDetailRequest orderDetailRequest) {


        log.info("Creating order for customer: {}, basket: {}",
                orderDetailRequest.getCustomerId(), orderDetailRequest.getBasketId());

        Order order = Order.builder()
                .customerId(Integer.valueOf(orderDetailRequest.getCustomerId()))
                .basketId(orderDetailRequest.getBasketId())
                .orderAddress(orderDetailRequest.getOrderAddress())
                .orderStatus(OrderStatusEnum.ACTIVE)
                .build();

        System.out.println(order);
        Order savedOrder = orderRepository.save(order);


        BasketProductUnitResponse basketProducts = basketClient.getCustomerbasket(orderDetailRequest.getBasketId(), Integer.valueOf(orderDetailRequest.getCustomerId()), 1).getBody();
        List<OrderDetail> orderDetails = basketProducts.getBasketProducts()
                .stream()
                .map(bp -> OrderDetail.builder()
                        .productId(bp.getProductId())
                        .quantity(bp.getProductQuantity())
                        .unitPrice(bp.getProductPrice())
                        .orderId(savedOrder.getOrderId())
                        .build())
                .collect(Collectors.toList());

        // Toplu kaydetme
        orderDetailRepository.saveAll(orderDetails);

        log.info("Order created successfully with ID: {}", savedOrder.getOrderId());


    }


    public List<Order> getOrderByCustomerId(Integer customerId) {
        return orderRepository.getOrderByCustomerId(customerId);
    }


    public List<OrderResponse> getAllOrdersWithDetails() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getCustomerOrdersWithDetails(Integer customerId) {
        List<Order> orders = orderRepository.getOrderByCustomerId(customerId);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderDetail> orderDetails = orderDetailRepository.findOrderDetailByOrder_OrderId(order.getOrderId());

        List<OrderDetailResponse> detailResponses = orderDetails.stream()
                .map(detail -> OrderDetailResponse.builder()
                        .orderDetailId(detail.getOrderDetailId())
                        .productId(detail.getProductId())
                        .quantity(detail.getQuantity())
                        .unitPrice(detail.getUnitPrice())
                        .totalPrice(detail.getQuantity() * detail.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        Double totalAmount = detailResponses.stream()
                .mapToDouble(OrderDetailResponse::getTotalPrice)
                .sum();

        Integer totalItems = detailResponses.stream()
                .mapToInt(OrderDetailResponse::getQuantity)
                .sum();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .customerId(order.getCustomerId())
                .basketId(order.getBasketId())
                .orderAddress(order.getOrderAddress())

                .orderDetails(detailResponses)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .build();
    }

    public OrderResponse getOrderDetailsByOrderId(Integer customerId, Integer orderId) {
        // Önce siparişin var olup olmadığını kontrol et
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));


        // Sipariş detaylarını al
        List<OrderDetail> orderDetails = orderDetailRepository.findOrderDetailByOrder_OrderId(orderId);

        // Her detay için ürün bilgilerini al
        List<OrderDetailResponse> detailResponses = orderDetails.stream()
                .map(detail -> {

                    Product product = productClient.getProduct(detail.getProductId());

                    return OrderDetailResponse.builder().orderDetailId(detail.getOrderDetailId())
                            .productId(detail.getProductId())
                            .productName(product.getProductName())
                            .productDescription(product.getProductDescription())
                            .quantity(detail.getQuantity())
                            .unitPrice(detail.getUnitPrice())
                            .totalPrice(detail.getQuantity() * detail.getUnitPrice())
                            .build();
                })
                .collect(Collectors.toList());

        // Toplam tutarı hesapla
        Double totalAmount = detailResponses.stream()
                .mapToDouble(OrderDetailResponse::getTotalPrice)
                .sum();

        // Toplam ürün sayısını hesapla
        Integer totalItems = detailResponses.stream()
                .mapToInt(OrderDetailResponse::getQuantity)
                .sum();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .customerId(order.getCustomerId())
                .basketId(order.getBasketId())
                .orderStatus(order.getOrderStatusCode())
                .createdDate(order.getCreatedDate())
                .orderAddress(order.getOrderAddress())
                .orderDetails(detailResponses)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .build();
    }

    @Transactional
    public String orderStatusUpdate(Integer orderId,String status){
        Order existingOrder = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        OrderStatusEnum orderStatusEnum = OrderStatusEnum.fromName(status);
        existingOrder.setOrderStatus(orderStatusEnum);

        return "Order Status Updated Succesfully";
    }
}
    

    

    
