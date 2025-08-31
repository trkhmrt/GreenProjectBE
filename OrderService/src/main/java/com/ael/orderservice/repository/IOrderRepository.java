package com.ael.orderservice.repository;

import com.ael.orderservice.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IOrderRepository extends JpaRepository<Order, Integer> {
    List<Order> getOrderByCustomerId(Integer customerId);
}
