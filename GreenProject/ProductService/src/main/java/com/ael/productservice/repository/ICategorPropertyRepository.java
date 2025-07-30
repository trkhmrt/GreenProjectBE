package com.ael.productservice.repository;

import com.ael.productservice.model.CategoryProperty;
import com.ael.productservice.response.CategoryPropertyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICategorPropertyRepository extends JpaRepository<CategoryProperty,Integer> {
    List<CategoryProperty> findByCategory_CategoryId(Integer categoryId);
}
