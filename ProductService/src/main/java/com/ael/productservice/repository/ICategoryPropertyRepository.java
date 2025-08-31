package com.ael.productservice.repository;

import com.ael.productservice.model.Category;
import com.ael.productservice.model.CategoryProperty;
import com.ael.productservice.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ICategoryPropertyRepository extends JpaRepository<CategoryProperty, Integer> {
    List<CategoryProperty> findByCategory_CategoryId(Integer categoryId);
    java.util.Optional<CategoryProperty> findByProperty_Id(Integer propertyId);
    boolean existsByCategoryAndProperty(Category category, Property property);
} 