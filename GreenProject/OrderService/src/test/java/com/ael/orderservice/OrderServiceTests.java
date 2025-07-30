package com.ael.orderservice.service;

import com.ael.orderservice.config.rabbitmq.model.BasketItem;
import com.ael.orderservice.config.rabbitmq.model.OrderDetailRequest;
import com.ael.orderservice.model.Order;
import com.ael.orderservice.model.OrderDetail;
import com.ael.orderservice.model.OrderStatus;
import com.ael.orderservice.repository.IOrderDetailRepository;
import com.ael.orderservice.repository.IOrderRepository;
import com.ael.orderservice.repository.IOrderStatusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

	@Mock
	private IOrderRepository orderRepository;

	@Mock
	private IOrderDetailRepository orderDetailRepository;

	@Mock
	private IOrderStatusRepository orderStatusRepository;

	@InjectMocks
	private OrderService orderService;

	private OrderDetailRequest orderDetailRequest;
	private OrderStatus activeStatus;
	private BasketItem basketItem;

	@BeforeEach
	void setUp() {
		basketItem = BasketItem.builder()
				.productId(1)
				.productName("Test Product")
				.productDescription("Test Description")
				.productPrice(19.99)
				.productQuantity(2)
				.subCategoryName("Test Category")
				.build();

		orderDetailRequest = new OrderDetailRequest();
		orderDetailRequest.setCustomerId(1);
		orderDetailRequest.setBasketId(100);
		orderDetailRequest.setOrderAddress("Test Address");
		orderDetailRequest.setBasketItems(Collections.singletonList(basketItem));

		activeStatus = new OrderStatus();
		activeStatus.setOrderStatusName(OrderService.STATUS_AKTIF);
	}

	@Test
	void createOrder_ShouldSuccessfullyCreateOrderWithAllItemDetails() {
		// Arrange
		when(orderStatusRepository.findByOrderStatusName(OrderService.STATUS_AKTIF))
				.thenReturn(Optional.of(activeStatus));
		when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
			Order order = invocation.getArgument(0);
			return order;
		});

		// Act
		orderService.createOrder(orderDetailRequest);

		// Assert
		verify(orderDetailRepository).save(argThat(orderDetail -> {
			assertEquals(basketItem.getProductId(), orderDetail.getProductId());
			assertEquals(basketItem.getProductQuantity(), orderDetail.getQuantity());
			assertEquals(basketItem.getProductPrice(), orderDetail.getUnitPrice());
			assertNotNull(orderDetail.getOrder());
			return true;
		}));
	}

	@Test
	void createOrder_ShouldHandleMultipleBasketItems() {
		// Arrange
		BasketItem secondItem = BasketItem.builder()
				.productId(2)
				.productName("Second Product")
				.productPrice(29.99)
				.productQuantity(1)
				.build();

		orderDetailRequest.setBasketItems(List.of(basketItem, secondItem));

		when(orderStatusRepository.findByOrderStatusName(OrderService.STATUS_AKTIF))
				.thenReturn(Optional.of(activeStatus));
		when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
			Order order = invocation.getArgument(0);
			return order;
		});

		// Act
		orderService.createOrder(orderDetailRequest);

		// Assert
		verify(orderDetailRepository, times(2)).save(any(OrderDetail.class));
	}

	@Test
	void createOrder_ShouldHandleEmptyBasketItems() {
		// Arrange
		orderDetailRequest.setBasketItems(Collections.emptyList());
		when(orderStatusRepository.findByOrderStatusName(OrderService.STATUS_AKTIF))
				.thenReturn(Optional.of(activeStatus));
		when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
			Order order = invocation.getArgument(0);
			return order;
		});

		// Act
		orderService.createOrder(orderDetailRequest);

		// Assert
		verify(orderDetailRepository, never()).save(any(OrderDetail.class));
	}
}