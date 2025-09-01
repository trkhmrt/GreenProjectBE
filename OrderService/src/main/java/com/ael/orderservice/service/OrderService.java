package com.ael.orderservice.service;


import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.dto.StockUpdateMessage;
import com.ael.orderservice.dto.response.OrderDetailResponse;
import com.ael.orderservice.dto.response.OrderResponse;
import com.ael.orderservice.enums.OrderStatusesEnum;
import com.ael.orderservice.exception.OrderNotFoundException;
import com.ael.orderservice.exception.OrderAccessDeniedException;
import com.ael.orderservice.model.Order;
import com.ael.orderservice.model.OrderDetail;
import com.ael.orderservice.model.OrderStatus;
import com.ael.orderservice.repository.IOrderDetailRepository;
import com.ael.orderservice.repository.IOrderRepository;
import com.ael.orderservice.repository.IOrderStatusRepository;
import com.ael.orderservice.client.ProductClient;
import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Slf4j
public class OrderService {

    private final IOrderRepository orderRepository;
    private final IOrderDetailRepository orderDetailRepository;
    private final IOrderStatusRepository orderStatusRepository;
    private final RabbitMQProducerService rabbitMQProducerService;
    private final ProductClient productClient;

    // Sipariş durumları için static sabitler
    public static final String STATUS_AKTIF = "Aktif";
    public static final String STATUS_BEKLEMEDE = "Beklemede";
    public static final String STATUS_IPTAL = "İptal";
    public static final String STATUS_KARGOLANDI = "Kargolandı";

    @Transactional
    public void createOrder(OrderDetailRequest orderDetailRequest) {
        String statusName = STATUS_AKTIF; // Burada ihtiyaca göre farklı bir sabit de kullanılabilir
        OrderStatus orderStatus = orderStatusRepository
                .findByOrderStatusName(statusName)
                .orElseThrow(() -> new RuntimeException("Order Status not Found"));

        log.info("Creating order for customer: {}, basket: {}", 
                orderDetailRequest.getCustomerId(), orderDetailRequest.getBasketId());

        Order order = Order.builder()
                .customerId(orderDetailRequest.getCustomerId())
                .basketId(orderDetailRequest.getBasketId())
                .orderAddress(orderDetailRequest.getOrderAddress())
                .orderStatus(orderStatus)
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully with ID: {}", savedOrder.getOrderId());

        orderDetailRequest.getBasketItems().forEach(item -> {
            try {
                OrderDetail orderDetail = OrderDetail.builder()
                        .productId(Integer.valueOf(item.getProductId()))
                        .quantity(item.getProductQuantity() != null ? Integer.valueOf(item.getProductQuantity()) : 1)
                        .order(savedOrder)
                        .unitPrice(item.getProductPrice() != null ? Double.valueOf(item.getProductPrice()) : 0.0)
                        .build();

                orderDetailRepository.save(orderDetail);
                
                log.info("Order detail created for product: {}, quantity: {}", 
                        item.getProductId(), item.getProductQuantity() != null ? item.getProductQuantity() : "1 (default)");
            } catch (NumberFormatException e) {
                log.error("Error parsing basket item data: productId={}, quantity={}, price={}", 
                        item.getProductId(), item.getProductQuantity(), item.getProductPrice());
                // Hata durumunda varsayılan değerlerle devam et
                OrderDetail orderDetail = OrderDetail.builder()
                        .productId(0)
                        .quantity(1)
                        .order(savedOrder)
                        .unitPrice(0.0)
                        .build();
                orderDetailRepository.save(orderDetail);
            }
        });

        log.info("Order creation completed successfully for order: {}", savedOrder.getOrderId());
    }
    
    public List<Order> getOrderByCustomerId(Integer customerId) {
        return orderRepository.getOrderByCustomerId(customerId);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
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
                .orderStatus(order.getOrderStatus().getOrderStatusName())
                .orderDetails(detailResponses)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .build();
    }
    
    public OrderResponse getOrderDetailsByOrderId(Integer customerId, Integer orderId) {
        // Önce siparişin var olup olmadığını kontrol et
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        
        // Siparişin bu müşteriye ait olup olmadığını kontrol et
        if (!order.getCustomerId().equals(customerId)) {
            throw new OrderAccessDeniedException("Order does not belong to customer with ID: " + customerId);
        }
        
        // Sipariş detaylarını al
        List<OrderDetail> orderDetails = orderDetailRepository.findOrderDetailByOrder_OrderId(orderId);
        
        // Her detay için ürün bilgilerini al
        List<OrderDetailResponse> detailResponses = orderDetails.stream()
                .map(detail -> {
                    try {
                        // ProductService'ten ürün bilgilerini al
                        ResponseEntity<Object> productResponse = productClient.getProduct(detail.getProductId());
                        Object productData = productResponse.getBody();
                        
                        log.info("Product data for productId {}: {}", detail.getProductId(), productData);
                        
                        // Ürün bilgilerini parse et
                        String productName = "Ürün " + detail.getProductId();
                        String productDescription = "";
                        Double productPrice = detail.getUnitPrice();
                        String productImage = "";
                        
                        // Eğer productData bir Map ise, bilgileri çıkar
                        if (productData instanceof java.util.Map) {
                            java.util.Map<?, ?> productMap = (java.util.Map<?, ?>) productData;
                            Object nameObj = productMap.get("productName");
                            productName = nameObj instanceof String ? (String) nameObj : "Ürün " + detail.getProductId();
                            
                            Object descObj = productMap.get("productDescription");
                            productDescription = descObj instanceof String ? (String) descObj : "";
                            
                            Object priceObj = productMap.get("productPrice");
                            productPrice = priceObj instanceof Double ? (Double) priceObj : detail.getUnitPrice();
                            
                            Object imageObj = productMap.get("productImageUrl");
                            productImage = imageObj instanceof String ? (String) imageObj : "";
                        }
                        
                        // Null safety için varsayılan değerler kullan
                        Integer quantity = detail.getQuantity() != null ? detail.getQuantity() : 1;
                        Double unitPrice = detail.getUnitPrice() != null ? detail.getUnitPrice() : 0.0;
                        
                        return OrderDetailResponse.builder()
                                .orderDetailId(detail.getOrderDetailId())
                                .productId(detail.getProductId())
                                .productName(productName)
                                .productDescription(productDescription)
                                .productPrice(productPrice)
                                .productImage(productImage)
                                .quantity(quantity)
                                .unitPrice(unitPrice)
                                .totalPrice(quantity * unitPrice)
                                .build();
                    } catch (Exception e) {
                        log.warn("Error fetching product details for productId: {}, using default values", detail.getProductId(), e);
                        // Hata durumunda varsayılan değerlerle devam et
                        // Null safety için varsayılan değerler kullan
                        Integer quantity = detail.getQuantity() != null ? detail.getQuantity() : 1;
                        Double unitPrice = detail.getUnitPrice() != null ? detail.getUnitPrice() : 0.0;
                        
                        return OrderDetailResponse.builder()
                                .orderDetailId(detail.getOrderDetailId())
                                .productId(detail.getProductId())
                                .productName("Ürün " + detail.getProductId())
                                .productDescription("Ürün bilgisi alınamadı")
                                .productPrice(unitPrice)
                                .productImage("")
                                .quantity(quantity)
                                .unitPrice(unitPrice)
                                .totalPrice(quantity * unitPrice)
                                .build();
                    }
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
                .orderAddress(order.getOrderAddress())
                .orderStatus(order.getOrderStatus().getOrderStatusName())
                .orderDetails(detailResponses)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .build();
    }
    
    @Transactional
    public void initializeOrderStatuses() {
        // Eğer OrderStatus'lar zaten varsa oluşturma
        if (orderStatusRepository.count() > 0) {
            log.info("OrderStatuses already exist, skipping initialization");
            return;
        }
        
        log.info("Initializing OrderStatuses...");
        
        // Enum'dan OrderStatus'ları oluştur
        for (OrderStatusesEnum statusEnum : OrderStatusesEnum.values()) {
            OrderStatus orderStatus = OrderStatus.builder()
                    .orderStatusId(statusEnum.getOrderStatusId())
                    .orderStatusName(statusEnum.getOrderStatusName())
                    .build();
            
            orderStatusRepository.save(orderStatus);
            log.info("Created OrderStatus: ID={}, Name={}", 
                    statusEnum.getOrderStatusId(), statusEnum.getOrderStatusName());
        }
        
        log.info("OrderStatuses initialization completed");
    }
    
    @Transactional
    public void updateOrderStatus(Integer orderId, Integer statusId) {
        log.info("Updating order status - OrderId: {}, StatusId: {}", orderId, statusId);
        
        // 1. Siparişin var olup olmadığını kontrol et
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        
        // 2. StatusId'nin geçerli olup olmadığını kontrol et
        OrderStatus newStatus = orderStatusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("OrderStatus not found with ID: " + statusId));
        
        // 3. Eski durumu logla
        String oldStatus = order.getOrderStatus().getOrderStatusName();
        
        // 4. Durumu güncelle
        order.setOrderStatus(newStatus);
        orderRepository.save(order);
        
        log.info("Order status updated successfully - OrderId: {}, OldStatus: {}, NewStatus: {}", 
                orderId, oldStatus, newStatus.getOrderStatusName());
    }
    
    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }
}
