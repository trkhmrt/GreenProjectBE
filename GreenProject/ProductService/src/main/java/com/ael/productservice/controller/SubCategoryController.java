package com.ael.productservice.controller;


import com.ael.productservice.request.SubCategoryRequest;
import com.ael.productservice.response.SubCategoryResponse;
import com.ael.productservice.service.ISubCategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subCategory")
@AllArgsConstructor
public class SubCategoryController {

    ISubCategoryService subCategoryService;

    @GetMapping("/getAllSubCategories")
    public ResponseEntity<List<SubCategoryResponse>> getAllSubCategories() {
        return ResponseEntity.ok(subCategoryService.getAllSubCategories());
    }

    @PostMapping("/createSubCategory")
    public ResponseEntity<String> createSubCategory(@RequestBody SubCategoryRequest subCategoryRequest) {

        subCategoryService.createSubCategory(subCategoryRequest);
        return ResponseEntity.ok("SubCategory created");
    }

    @DeleteMapping("/deleteSubCategory/{id}")
    public ResponseEntity<String> deleteSubCategory(@PathVariable("id") Integer id) {
        subCategoryService.deleteSubCategory(id);
        return ResponseEntity.ok("SubCategory deleted");
    }

    @PutMapping("/updateSubCategoryName")
    public ResponseEntity<String> updateSubCategoryName(@RequestParam Integer id, @RequestParam String name) {
        subCategoryService.updateSubCategoryName(id, name);
        return ResponseEntity.ok("SubCategory name updated");
    }
}
