package com.ael.productservice.repository;

import com.ael.productservice.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IPropertyRepository extends JpaRepository<Property, Integer> {
    Optional<Property> findByName(String name);
} 