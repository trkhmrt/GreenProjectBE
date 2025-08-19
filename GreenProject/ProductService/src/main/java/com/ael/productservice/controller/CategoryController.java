package com.ael.productservice.controller;

import com.ael.productservice.request.CategoryRequest;
import com.ael.productservice.response.CategoryResponse;
import com.ael.productservice.response.PropertyResponse;
import com.ael.productservice.response.CategoryWithPropertiesResponse;
import com.ael.productservice.service.CategoryService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@AllArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    // 1. Kategori Ekleme
    @PostMapping("/create")
    public ResponseEntity<String> createCategory(@RequestBody CategoryRequest categoryRequest) {
        try {
            categoryService.createCategory(categoryRequest);
            return ResponseEntity.ok("Category created successfully");
        } catch (Exception e) {
            log.error("Error creating category: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 2. Kategori Güncelleme
    @PutMapping("/{categoryId}")
    public ResponseEntity<String> updateCategory(
            @PathVariable Integer categoryId, 
            @RequestBody CategoryRequest categoryRequest) {
        try {
            categoryService.updateCategory(categoryId, categoryRequest);
            return ResponseEntity.ok("Category updated successfully");
        } catch (Exception e) {
            log.error("Error updating category: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 3. Kategori Silme (isDeleted = true)
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.ok("Category deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting category: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 4. Kategori Aktif/Pasif Toggle
    @PutMapping("/{categoryId}/toggle-active")
    public ResponseEntity<String> toggleCategoryActive(@PathVariable Integer categoryId) {
        try {
            categoryService.toggleCategoryActive(categoryId);
            return ResponseEntity.ok("Category active status toggled successfully");
        } catch (Exception e) {
            log.error("Error toggling category active status: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 4.1. Kategoriyi Aktif Yap
    @PutMapping("/{categoryId}/activate")
    public ResponseEntity<String> activateCategory(@PathVariable Integer categoryId) {
        try {
            categoryService.activateCategory(categoryId);
            return ResponseEntity.ok("Category activated successfully");
        } catch (Exception e) {
            log.error("Error activating category: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 4.2. Kategoriyi Pasif Yap
    @PutMapping("/{categoryId}/deactivate")
    public ResponseEntity<String> deactivateCategory(@PathVariable Integer categoryId) {
        try {
            categoryService.deactivateCategory(categoryId);
            return ResponseEntity.ok("Category deactivated successfully");
        } catch (Exception e) {
            log.error("Error deactivating category: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 5. Tüm Kategorileri Getir
    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        try {
            List<CategoryResponse> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting all categories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 6. Root Kategorileri Getir
    @GetMapping("/root")
    public ResponseEntity<List<CategoryResponse>> getRootCategories() {
        try {
            List<CategoryResponse> categories = categoryService.getRootCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting root categories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 7. Alt Kategorileri Getir
    @GetMapping("/{categoryId}/children")
    public ResponseEntity<List<CategoryResponse>> getSubcategories(@PathVariable Integer categoryId) {
        try {
            List<CategoryResponse> children = categoryService.getSubcategories(categoryId);
            return ResponseEntity.ok(children);
        } catch (Exception e) {
            log.error("Error getting subcategories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 8. Aktif Kategorileri Getir
    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> getActiveCategories() {
        try {
            List<CategoryResponse> categories = categoryService.getActiveCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting active categories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 9. Kategori Arama
    @GetMapping("/search")
    public ResponseEntity<List<CategoryResponse>> searchCategories(@RequestParam String searchTerm) {
        try {
            List<CategoryResponse> categories = categoryService.searchCategories(searchTerm);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error searching categories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 10. Level'a Göre Kategorileri Getir
    @GetMapping("/level/{level}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByLevel(@PathVariable Integer level) {
        try {
            List<CategoryResponse> categories = categoryService.getCategoriesByLevel(level);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting categories by level: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 11. Tüm Kategorileri Level'larla Birlikte Getir
    @GetMapping("/all-with-levels")
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesWithLevels() {
        try {
            List<CategoryResponse> categories = categoryService.getAllCategoriesWithLevels();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting categories with levels: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 12. Ana Kategorileri Alt Kategorileriyle Birlikte Getir
    @GetMapping("/main-with-children")
    public ResponseEntity<List<CategoryResponse>> getMainCategoriesWithChildren() {
        try {
            List<CategoryResponse> categories = categoryService.getMainCategoriesWithChildren();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting main categories with children: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 13. Tüm Kategorileri Hiyerarşik Sırayla Getir
    @GetMapping("/hierarchical")
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesHierarchical() {
        try {
            List<CategoryResponse> categories = categoryService.getAllCategoriesHierarchical();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting hierarchical categories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 14. Tüm Kategorileri Hiyerarşik Yapıda Getir (Nested)
    @GetMapping("/hierarchical-nested")
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesHierarchicalNested() {
        try {
            List<CategoryResponse> categories = categoryService.getAllCategoriesHierarchicalNested();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting hierarchical nested categories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 15. Kategori Seçim Sistemi - Tüm Kategorileri Seçim İçin Getir
    @GetMapping("/selection")
    public ResponseEntity<List<CategoryResponse>> getCategoriesForSelection() {
        try {
            List<CategoryResponse> categories = categoryService.getCategoriesForSelection();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting categories for selection: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 16. Belirli Bir Kategorinin Alt Kategorilerini Seçim İçin Getir
    @GetMapping("/selection/{categoryId}/children")
    public ResponseEntity<List<CategoryResponse>> getCategoryChildrenForSelection(@PathVariable Integer categoryId) {
        try {
            List<CategoryResponse> children = categoryService.getCategoryChildrenForSelection(categoryId);
            return ResponseEntity.ok(children);
        } catch (Exception e) {
            log.error("Error getting category children for selection: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 17. Seçim Yoluna Göre Kategori Getir
    @GetMapping("/selection/path")
    public ResponseEntity<List<CategoryResponse>> getCategoriesBySelectionPath(@RequestParam List<Integer> categoryIds) {
        try {
            List<CategoryResponse> categories = categoryService.getCategoriesBySelectionPath(categoryIds);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting categories by selection path: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 18. Test Datası Oluşturma
    @PostMapping("/create-test-data")
    public ResponseEntity<String> createTestData() {
        try {
            categoryService.createTestData();
            return ResponseEntity.ok("Test data created successfully");
        } catch (Exception e) {
            log.error("Error creating test data: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 19. Kategoriye Ait Property'leri Getir
    @GetMapping("/{categoryId}/properties")
    public ResponseEntity<List<PropertyResponse>> getCategoryProperties(@PathVariable Integer categoryId) {
        try {
            List<PropertyResponse> properties = categoryService.getCategoryProperties(categoryId);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("Error getting category properties: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 20. Kategori Özelliklerini ve Property'lerini Birlikte Getir
    @GetMapping("/{categoryId}/with-properties")
    public ResponseEntity<CategoryWithPropertiesResponse> getCategoryWithProperties(@PathVariable Integer categoryId) {
        try {
            CategoryWithPropertiesResponse categoryWithProperties = categoryService.getCategoryWithProperties(categoryId);
            return ResponseEntity.ok(categoryWithProperties);
        } catch (Exception e) {
            log.error("Error getting category with properties: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 21. Test Property'leri Oluştur
    @PostMapping("/create-test-properties")
    public ResponseEntity<String> createTestProperties() {
        try {
            categoryService.createTestProperties();
            return ResponseEntity.ok("Test properties created successfully");
        } catch (Exception e) {
            log.error("Error creating test properties: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ========== ADMIN ENDPOINTS ==========

    // 22. Admin - Tüm Kategorileri Getir (Silinmişler Dahil)
    @GetMapping("/admin/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesForAdmin() {
        try {
            List<CategoryResponse> categories = categoryService.getAllCategoriesForAdmin();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting all categories for admin: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 23. Admin - Hiyerarşik Kategorileri Getir (Silinmişler Dahil)
    @GetMapping("/admin/hierarchical")
    public ResponseEntity<List<CategoryResponse>> getHierarchicalCategoriesForAdmin() {
        try {
            List<CategoryResponse> categories = categoryService.getHierarchicalCategoriesForAdmin();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting hierarchical categories for admin: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 24. Admin - İç İçe Hiyerarşik Kategorileri Getir (Silinmişler Dahil)
    @GetMapping("/admin/hierarchical-nested")
    public ResponseEntity<List<CategoryResponse>> getHierarchicalNestedCategoriesForAdmin() {
        try {
            List<CategoryResponse> categories = categoryService.getHierarchicalNestedCategoriesForAdmin();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting hierarchical nested categories for admin: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 25. Admin - Root Kategorileri Getir (Silinmişler Dahil)
    @GetMapping("/admin/root")
    public ResponseEntity<List<CategoryResponse>> getRootCategoriesForAdmin() {
        try {
            List<CategoryResponse> categories = categoryService.getRootCategoriesForAdmin();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error getting root categories for admin: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 26. Admin - Alt Kategorileri Getir (Silinmişler Dahil)
    @GetMapping("/admin/{categoryId}/children")
    public ResponseEntity<List<CategoryResponse>> getSubcategoriesForAdmin(@PathVariable Integer categoryId) {
        try {
            List<CategoryResponse> children = categoryService.getSubcategoriesForAdmin(categoryId);
            return ResponseEntity.ok(children);
        } catch (Exception e) {
            log.error("Error getting subcategories for admin: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== RESTORE ENDPOINTS ==========

    // 27. Silinmiş Kategoriyi Geri Getir (Sadece kendisi)
    @PutMapping("/admin/{categoryId}/restore")
    public ResponseEntity<String> restoreCategory(@PathVariable Integer categoryId) {
        try {
            categoryService.restoreCategory(categoryId);
            return ResponseEntity.ok("Category restored successfully");
        } catch (Exception e) {
            log.error("Error restoring category: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 28. Silinmiş Kategoriyi ve Tüm Alt Kategorilerini Geri Getir
    @PutMapping("/admin/{categoryId}/restore-with-children")
    public ResponseEntity<String> restoreCategoryWithChildren(@PathVariable Integer categoryId) {
        try {
            categoryService.restoreCategoryWithChildren(categoryId);
            return ResponseEntity.ok("Category and all children restored successfully");
        } catch (Exception e) {
            log.error("Error restoring category with children: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
