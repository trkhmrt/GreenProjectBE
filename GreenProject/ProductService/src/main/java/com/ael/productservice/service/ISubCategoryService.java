package com.ael.productservice.service;

import com.ael.productservice.request.SubCategoryRequest;
import com.ael.productservice.response.SubCategoryResponse;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISubCategoryService {
    void createSubCategory(SubCategoryRequest subCategoryRequest);
    List<SubCategoryResponse> getAllSubCategories();
    void deleteSubCategory(Integer subCategoryId);
    void updateSubCategoryName(Integer subCategoryId, String subCategoryName);
}
