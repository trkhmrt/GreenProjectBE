package com.ael.orderservice.repository;

import com.ael.orderservice.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IOrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findOrderDetailByOrder_OrderId(Integer orderId);
}
