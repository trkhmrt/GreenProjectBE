package com.ael.productservice.controller;

import com.ael.productservice.model.CategoryProperty;
import com.ael.productservice.model.Category;
import com.ael.productservice.model.Property;
import com.ael.productservice.repository.ICategoryPropertyRepository;
import com.ael.productservice.repository.IPropertyRepository;
import com.ael.productservice.repository.ICategoryRepository;
import com.ael.productservice.service.CategoryPropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.ael.productservice.response.CategoryPropertySimpleResponse;

@RestController
@RequestMapping("/category-property")
@RequiredArgsConstructor
public class CategoryPropertyController {
    private final ICategoryPropertyRepository categoryPropertyRepository;
    private final ICategoryRepository categoryRepository;
    private final IPropertyRepository propertyRepository;
    private final CategoryPropertyService categoryPropertyService;

    @PostMapping("/add")
    public ResponseEntity<CategoryProperty> addPropertyToCategory(@RequestParam Integer categoryId, @RequestParam Integer propertyId) {
        return ResponseEntity.ok(categoryPropertyService.addPropertyToCategory(categoryId, propertyId));
    }

    @PostMapping("/add-by-name")
    public ResponseEntity<CategoryProperty> addPropertyToCategoryByName(@RequestParam Integer categoryId, @RequestParam String propertyName) {
        return ResponseEntity.ok(categoryPropertyService.addPropertyToCategoryByName(categoryId, propertyName));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryProperty> updateCategoryProperty(@PathVariable Integer id, @RequestParam(required = false) Integer propertyId, @RequestParam(required = false) Integer categoryId, @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(categoryPropertyService.updateCategoryProperty(id, propertyId, categoryId, isActive));
    }

    @PostMapping("/deactivate/{propertyId}")
    public ResponseEntity<String> deactivateCategoryProperty(@PathVariable Integer propertyId) {
        categoryPropertyService.deactivateCategoryProperty(propertyId);
        return ResponseEntity.ok("CategoryProperty deactivated (isActive=false)");
    }

    @PostMapping("/toggle-status/{propertyId}")
    public ResponseEntity<String> toggleCategoryPropertyStatus(@PathVariable Integer propertyId) {
        CategoryProperty updated = categoryPropertyService.toggleCategoryPropertyStatus(propertyId);
        String status = updated.getIsActive() ? "activated" : "deactivated";
        return ResponseEntity.ok("CategoryProperty " + status + " successfully");
    }

    /**
     * Bu endpoint frontendden tetiklenmeyecek, sadece Postman'den tetiklenecek bir endpointtir.
     * PropertyId ile CategoryProperty'nin isDeleted durumunu tersine çevirir.
     */
    @PostMapping("/toggle-deleted/{propertyId}")
    public ResponseEntity<String> toggleCategoryPropertyDeleted(@PathVariable Integer propertyId) {
        CategoryProperty updated = categoryPropertyService.toggleCategoryPropertyDeleted(propertyId);
        String status = updated.getIsDeleted() ? "deleted" : "restored";
        return ResponseEntity.ok("CategoryProperty " + status + " successfully (isDeleted: " + updated.getIsDeleted() + ")");
    }

    @PutMapping("/update-property-name")
    public ResponseEntity<Property> updatePropertyName(@RequestParam Integer propertyId, @RequestParam String newName) {
        return ResponseEntity.ok(categoryPropertyService.updatePropertyName(propertyId, newName));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryPropertySimpleResponse>> getAllCategoryPropertiesDto() {
        return ResponseEntity.ok(categoryPropertyService.getAllCategoryProperties());
    }
} 