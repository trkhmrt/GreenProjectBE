package com.ael.productservice.repository;

import com.ael.productservice.model.Category;
import com.ael.productservice.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ISubCategoryRepository extends JpaRepository<SubCategory, Integer> {

    Optional<Object> findBySubCategoryNameAndCategory(String subCategoryName, Category category);
}
