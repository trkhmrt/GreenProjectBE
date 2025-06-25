package com.ael.productservice.repository;

import com.ael.productservice.dto.response.SubCategoryResponse;
import com.ael.productservice.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ISubCategoryRepository extends JpaRepository<SubCategory, Integer> {

}
