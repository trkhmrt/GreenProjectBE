package com.ael.productservice.controller;

import com.ael.productservice.request.CategoryRequest;
import com.ael.productservice.request.PropertyCategoryRequest;
import com.ael.productservice.response.CategoryResponse;
import com.ael.productservice.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@AllArgsConstructor
public class CategoryController {

    CategoryService categoryService;


    @PostMapping("/createCategory")
    public ResponseEntity<String> createCategory(@RequestBody CategoryRequest categoryRequest) {

        categoryService.createCategory(categoryRequest);

        return ResponseEntity.ok().body("Category created");
    }

    @PostMapping("/createProperty")
    public ResponseEntity<String> createProperty(@RequestBody String name) {
        categoryService.createProperty(name);
        return ResponseEntity.ok().body("Property created");
    }

    @PostMapping("/addPropertyToCategory")
    public ResponseEntity<String> addPropertyToCategory(@RequestBody PropertyCategoryRequest propertyCategoryRequest) {
        categoryService.addPropertyToCategory(propertyCategoryRequest.getCategoryId(),propertyCategoryRequest.getPropertyId());
        return ResponseEntity.ok().body("Property added to Category");
    }


    @GetMapping("/getAllCategories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok().body(categoryService.findAllWithSubCategories());
    }

    @GetMapping("/getAllCategoryProperty")
    public ResponseEntity<String> getAllCategoryProperty(@RequestParam Integer categoryId) {
        categoryService.getAllCategoryProperties(categoryId);
        return ResponseEntity.ok().body("Success Listing");
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable("id") Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().body("Category deleted");
    }

    @PutMapping("/updateCategoryName")
    public ResponseEntity<String> updateCategoryName(@RequestParam Integer id, @RequestParam String name) {
        categoryService.updateCategoryName(id, name);
        return ResponseEntity.ok("Category name updated");
    }

    /**
     * Bu endpoint frontendden tetiklenmeyecek, sadece Postman'den tetiklenecek bir endpointtir.
     * CategoryId ile Category'nin isDeleted durumunu tersine çevirir.
     */
    @PostMapping("/toggle-deleted/{categoryId}")
    public ResponseEntity<String> toggleCategoryDeleted(@PathVariable Integer categoryId) {
        categoryService.toggleCategoryDeleted(categoryId);
        return ResponseEntity.ok("Category deleted/restored successfully");
    }

    /**
     * Bu endpoint frontendden tetiklenmeyecek, sadece Postman'den tetiklenecek bir endpointtir.
     * CategoryId ile Category'nin isActive durumunu tersine çevirir.
     */
    @PostMapping("/toggle-active/{categoryId}")
    public ResponseEntity<String> toggleCategoryActive(@PathVariable Integer categoryId) {
        categoryService.toggleCategoryActive(categoryId);
        return ResponseEntity.ok("Category activated/deactivated successfully");
    }
}
