package com.ael.productservice.repository;

import com.ael.productservice.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPropertyRepository extends JpaRepository<Property, Integer> {
    java.util.Optional<Property> findByName(String name);
} 