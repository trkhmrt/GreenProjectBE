package com.ael.productservice.repository;

import com.ael.productservice.model.ProductPropertyValue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IProductPropertyValueRepository extends JpaRepository<ProductPropertyValue, Integer> {
} 