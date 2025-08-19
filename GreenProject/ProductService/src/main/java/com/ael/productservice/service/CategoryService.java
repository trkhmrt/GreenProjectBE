package com.ael.productservice.service;

import com.ael.productservice.model.Category;
import com.ael.productservice.model.CategoryProperty;
import com.ael.productservice.model.Property;
import com.ael.productservice.repository.ICategoryRepository;
import com.ael.productservice.repository.ICategoryPropertyRepository;
import com.ael.productservice.repository.IPropertyRepository;

import com.ael.productservice.request.CategoryRequest;
import com.ael.productservice.response.CategoryResponse;
import com.ael.productservice.response.PropertyResponse;
import com.ael.productservice.response.CategoryWithPropertiesResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class CategoryService {
    
    private final ICategoryRepository categoryRepository;
    private final ICategoryPropertyRepository categoryPropertyRepository;
    private final IPropertyRepository propertyRepository;

    @Transactional
    public void createCategory(CategoryRequest categoryRequest) {
        // Parent ID'yi al
        Integer parentId = categoryRequest.getParentId();
        
        // Level hesapla
        Integer level = 0;
        if (parentId != null) {
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            level = parent.getLevel() + 1;
        }

        Category newCategory = Category.builder()
                .categoryName(categoryRequest.getCategoryName())
                .parentId(parentId)
                .level(level)
                .isActive(true)
                .build();

        categoryRepository.save(newCategory);
        log.info("Category created: {}", newCategory.getCategoryName());
    }

    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getRootCategories() {
        List<Category> rootCategories = categoryRepository.findByParentIdIsNull();
        return rootCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getSubcategories(Integer parentId) {
        List<Category> subcategories = categoryRepository.findByParentId(parentId);
        return subcategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getActiveCategories() {
        List<Category> activeCategories = categoryRepository.findByIsActiveTrue();
        return activeCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> searchCategories(String searchTerm) {
        List<Category> categories = categoryRepository.findByCategoryNameContainingIgnoreCase(searchTerm);
        return categories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getCategoriesByLevel(Integer level) {
        List<Category> categories = categoryRepository.findByLevel(level);
        return categories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getAllCategoriesWithLevels() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .sorted((c1, c2) -> {
                    // Önce level'e göre sırala
                    int levelCompare = Integer.compare(c1.getLevel(), c2.getLevel());
                    if (levelCompare != 0) return levelCompare;
                    // Sonra isme göre sırala
                    return c1.getCategoryName().compareTo(c2.getCategoryName());
                })
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getMainCategoriesWithChildren() {
        List<Category> allCategories = categoryRepository.findAll();
        List<Category> rootCategories = allCategories.stream()
                .filter(cat -> cat.getParentId() == null)
                .collect(Collectors.toList());

        return rootCategories.stream()
                .map(root -> CategoryResponse.builder()
                        .categoryId(root.getCategoryId())
                        .categoryName(root.getCategoryName())
                        .parentId(root.getParentId())
                        .level(root.getLevel())
                        .isActive(root.getIsActive())
                        .children(getChildrenRecursive(root.getCategoryId(), allCategories))
                        .build())
                .collect(Collectors.toList());
    }

    private List<CategoryResponse> getChildrenRecursive(Integer parentId, List<Category> allCategories) {
        return allCategories.stream()
                .filter(cat -> parentId.equals(cat.getParentId()))
                .filter(cat -> (cat.getIsDeleted() == null || !cat.getIsDeleted()) && 
                              (cat.getIsActive() != null && cat.getIsActive())) // Hem silinmiş hem pasif kategorileri filtrele
                .map(child -> CategoryResponse.builder()
                        .categoryId(child.getCategoryId())
                        .categoryName(child.getCategoryName())
                        .parentId(child.getParentId())
                        .level(child.getLevel())
                        .isActive(child.getIsActive())
                        .isDeleted(child.getIsDeleted())
                        .properties(getCategoryProperties(child.getCategoryId()))
                        .children(getChildrenRecursive(child.getCategoryId(), allCategories))
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getAllCategoriesHierarchical() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .fullPath(calculateFullPath(category, allCategories))
                        .properties(getCategoryProperties(category.getCategoryId()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getAllCategoriesHierarchicalNested() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .filter(category -> (category.getIsDeleted() == null || !category.getIsDeleted()) && 
                                   (category.getIsActive() != null && category.getIsActive())) // Hem silinmiş hem pasif kategorileri filtrele
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .fullPath(calculateFullPathOptimized(category, allCategories))
                        .properties(getCategoryProperties(category.getCategoryId()))
                        .children(getChildrenRecursive(category.getCategoryId(), allCategories))
                        .build())
                .collect(Collectors.toList());
    }

    private String calculateFullPath(Category category, List<Category> allCategories) {
        if (category.getLevel() == null || category.getLevel() == 0) {
            return category.getCategoryName();
        }

        List<String> path = new ArrayList<>();
        path.add(category.getCategoryName());

        Integer parentId = category.getParentId();
        for (int i = 0; i < 10 && parentId != null; i++) { // Max 10 level
            Integer finalParentId = parentId;
            Category parent = allCategories.stream()
                    .filter(cat -> cat.getCategoryId().equals(finalParentId))
                    .findFirst()
                    .orElse(null);

            if (parent != null) {
                path.add(0, parent.getCategoryName());
                parentId = parent.getParentId();
            } else {
                break;
            }
        }

        return String.join(" > ", path);
    }

    private String calculateFullPathOptimized(Category category, List<Category> allCategories) {
        if (category.getLevel() == null || category.getLevel() == 0) {
            return category.getCategoryName();
        }
        
        List<String> path = new ArrayList<>();
        path.add(category.getCategoryName());
        
        // Parent'ları bul
        Integer parentId = category.getParentId();
        for (int i = 0; i < 10 && parentId != null; i++) { // Max 10 level
            Category parent = null;
            for (Category cat : allCategories) {
                if (cat.getCategoryId().equals(parentId)) {
                    parent = cat;
                    break;
                }
            }
            
            if (parent != null) {
                path.add(0, parent.getCategoryName());
                parentId = parent.getParentId();
            } else {
                break;
            }
        }
        
        return String.join(" > ", path);
    }

    public List<CategoryResponse> getCategoriesForSelection() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .fullPath(calculateFullPathOptimized(category, allCategories))
                        .properties(getCategoryProperties(category.getCategoryId()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getCategoryChildrenForSelection(Integer categoryId) {
        List<Category> allCategories = categoryRepository.findAll();
        List<Category> children = allCategories.stream()
                .filter(cat -> categoryId.equals(cat.getParentId()))
                .collect(Collectors.toList());

        return children.stream()
                .map(child -> CategoryResponse.builder()
                        .categoryId(child.getCategoryId())
                        .categoryName(child.getCategoryName())
                        .parentId(child.getParentId())
                        .level(child.getLevel())
                        .isActive(child.getIsActive())
                        .isDeleted(child.getIsDeleted())
                        .fullPath(calculateFullPathOptimized(child, allCategories))
                        .properties(getCategoryProperties(child.getCategoryId()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getCategoriesBySelectionPath(List<Integer> categoryIds) {
        List<Category> allCategories = categoryRepository.findAll();
        return categoryIds.stream()
                .map(id -> allCategories.stream()
                        .filter(cat -> cat.getCategoryId().equals(id))
                        .findFirst()
                        .orElse(null))
                .filter(category -> category != null)
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .fullPath(calculateFullPathOptimized(category, allCategories))
                        .properties(getCategoryProperties(category.getCategoryId()))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(Integer categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            
            // Kategoriyi silindi olarak işaretle (isDeleted = true)
            category.setIsDeleted(true);
            categoryRepository.save(category);
            
            // Tüm alt kategorileri recursive olarak silindi olarak işaretle
            markAllChildrenAsDeleted(categoryId);
            
            log.info("Category and all children marked as deleted: {}", categoryId);
        } catch (Exception e) {
            log.error("Error deleting category {}: {}", categoryId, e.getMessage());
            throw new RuntimeException("Failed to delete category: " + e.getMessage(), e);
        }
    }

    // Tüm alt kategorileri recursive olarak silindi olarak işaretle
    private void markAllChildrenAsDeleted(Integer parentId) {
        List<Category> children = categoryRepository.findByParentId(parentId);
        for (Category child : children) {
            // Alt kategoriyi silindi olarak işaretle
            child.setIsDeleted(true);
            categoryRepository.save(child);
            
            // Bu alt kategorinin de alt kategorilerini silindi olarak işaretle (recursive)
            markAllChildrenAsDeleted(child.getCategoryId());
        }
    }

    // Tüm alt kategorileri recursive olarak pasif yap
    private void deactivateAllChildren(Integer parentId) {
        List<Category> children = categoryRepository.findByParentId(parentId);
        for (Category child : children) {
            // Alt kategoriyi pasif yap
            child.setIsActive(false);
            categoryRepository.save(child);
            
            // Bu alt kategorinin de alt kategorilerini pasif yap (recursive)
            deactivateAllChildren(child.getCategoryId());
        }
    }

    // Tüm alt kategorileri recursive olarak aktif yap
    private void activateAllChildren(Integer parentId) {
        List<Category> children = categoryRepository.findByParentId(parentId);
        for (Category child : children) {
            // Alt kategoriyi aktif yap
            child.setIsActive(true);
            categoryRepository.save(child);
            
            // Bu alt kategorinin de alt kategorilerini aktif yap (recursive)
            activateAllChildren(child.getCategoryId());
        }
    }



    @Transactional
    public void updateCategory(Integer categoryId, CategoryRequest categoryRequest) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            category.setCategoryName(categoryRequest.getCategoryName());
            
            // Parent ID karşılaştırması - null değerleri güvenli şekilde kontrol et
            Integer currentParentId = category.getParentId();
            Integer newParentId = categoryRequest.getParentId();
            
            // Eğer parentId gönderilmemişse mevcut parentId'yi koru
            if (newParentId == null && categoryRequest.getCategoryName() != null) {
                newParentId = currentParentId; // Mevcut parentId'yi koru
            }
            
            boolean parentIdChanged = false;
            
            // Null kontrolü ile güvenli karşılaştırma
            if (currentParentId == null && newParentId != null) {
                parentIdChanged = true;
            } else if (currentParentId != null && newParentId == null) {
                parentIdChanged = true;
            } else if (currentParentId != null && newParentId != null && !currentParentId.equals(newParentId)) {
                parentIdChanged = true;
            }
            
            // Parent ID değişiyorsa level'i güncelle
            if (parentIdChanged) {
                Integer newLevel = 0;
                
                if (newParentId != null) {
                    Category newParent = categoryRepository.findById(newParentId)
                            .orElseThrow(() -> new RuntimeException("New parent category not found"));
                    newLevel = newParent.getLevel() + 1;
                }
                
                category.setParentId(newParentId);
                category.setLevel(newLevel);
                
                // Alt kategorilerin level'larını da güncelle
                updateChildrenLevels(categoryId, newLevel + 1);
                
                log.info("Category parent changed from {} to {}, level updated to {}", 
                        currentParentId, newParentId, newLevel);
            }

            categoryRepository.save(category);
            log.info("Category updated: {}", category.getCategoryName());
        } catch (Exception e) {
            log.error("Error updating category: {}", e.getMessage());
            throw new RuntimeException("Failed to update category: " + e.getMessage(), e);
        }
    }

    // Alt kategorilerin level'larını recursive olarak güncelle
    private void updateChildrenLevels(Integer parentId, Integer newLevel) {
        List<Category> children = categoryRepository.findByParentId(parentId);
        for (Category child : children) {
            child.setLevel(newLevel);
            categoryRepository.save(child);
            
            // Bu alt kategorinin de alt kategorilerini güncelle (recursive)
            updateChildrenLevels(child.getCategoryId(), newLevel + 1);
        }
    }

    // ========== ADMIN METHODS ==========

    // Admin - Tüm kategorileri getir (silinmişler dahil)
    public List<CategoryResponse> getAllCategoriesForAdmin() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .build())
                .collect(Collectors.toList());
    }

    // Admin - Hiyerarşik kategorileri getir (silinmişler dahil)
    public List<CategoryResponse> getHierarchicalCategoriesForAdmin() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .fullPath(calculateFullPath(category, allCategories))
                        .properties(getCategoryProperties(category.getCategoryId()))
                        .build())
                .collect(Collectors.toList());
    }

    // Admin - İç içe hiyerarşik kategorileri getir (silinmişler dahil)
    public List<CategoryResponse> getHierarchicalNestedCategoriesForAdmin() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .fullPath(calculateFullPathOptimized(category, allCategories))
                        .properties(getCategoryProperties(category.getCategoryId()))
                        .children(getChildrenRecursiveForAdmin(category.getCategoryId(), allCategories))
                        .build())
                .collect(Collectors.toList());
    }

    // Admin - Root kategorileri getir (silinmişler dahil)
    public List<CategoryResponse> getRootCategoriesForAdmin() {
        List<Category> rootCategories = categoryRepository.findByParentIdIsNull();
        return rootCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .build())
                .collect(Collectors.toList());
    }

    // Admin - Alt kategorileri getir (silinmişler dahil)
    public List<CategoryResponse> getSubcategoriesForAdmin(Integer parentId) {
        List<Category> subcategories = categoryRepository.findByParentId(parentId);
        return subcategories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .parentId(category.getParentId())
                        .level(category.getLevel())
                        .isActive(category.getIsActive())
                        .isDeleted(category.getIsDeleted())
                        .build())
                .collect(Collectors.toList());
    }

    // Admin - Recursive alt kategorileri getir (silinmişler dahil)
    private List<CategoryResponse> getChildrenRecursiveForAdmin(Integer parentId, List<Category> allCategories) {
        return allCategories.stream()
                .filter(cat -> parentId.equals(cat.getParentId()))
                .map(child -> CategoryResponse.builder()
                        .categoryId(child.getCategoryId())
                        .categoryName(child.getCategoryName())
                        .parentId(child.getParentId())
                        .level(child.getLevel())
                        .isActive(child.getIsActive())
                        .isDeleted(child.getIsDeleted())
                        .properties(getCategoryProperties(child.getCategoryId()))
                        .children(getChildrenRecursiveForAdmin(child.getCategoryId(), allCategories))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleCategoryActive(Integer categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            Boolean currentActive = category.getIsActive();
            Boolean newActiveStatus = currentActive == null ? false : !currentActive;
            category.setIsActive(newActiveStatus);
            categoryRepository.save(category);

            // Eğer kategori pasif yapılıyorsa, tüm alt kategorileri de pasif yap
            if (!newActiveStatus) {
                deactivateAllChildren(categoryId);
                log.info("Category and all children deactivated: {} -> {}", category.getCategoryName(), newActiveStatus);
            } else {
                // Eğer kategori aktif yapılıyorsa, parent'ı kontrol et
                if (category.getParentId() != null) {
                    Category parent = categoryRepository.findById(category.getParentId()).orElse(null);
                    if (parent != null && !parent.getIsActive()) {
                        throw new RuntimeException("Cannot activate category. Parent category is inactive.");
                    }
                }
                
                // Eğer ana kategori (root) aktif yapılıyorsa, tüm alt kategorileri de aktif yap
                if (category.getParentId() == null) {
                    activateAllChildren(categoryId);
                    log.info("Root category and all children activated: {} -> {}", category.getCategoryName(), newActiveStatus);
                } else {
                    log.info("Category activated: {} -> {}", category.getCategoryName(), newActiveStatus);
                }
            }
        } catch (Exception e) {
            log.error("Error toggling category active status: {}", e.getMessage());
            throw new RuntimeException("Failed to toggle category active status: " + e.getMessage(), e);
        }
    }

    // Kategoriyi aktif yap
    @Transactional
    public void activateCategory(Integer categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            // Parent kontrolü
            if (category.getParentId() != null) {
                Category parent = categoryRepository.findById(category.getParentId()).orElse(null);
                if (parent != null && !parent.getIsActive()) {
                    throw new RuntimeException("Cannot activate category. Parent category is inactive.");
                }
            }

            category.setIsActive(true);
            categoryRepository.save(category);

            // Eğer ana kategori (root) aktif yapılıyorsa, tüm alt kategorileri de aktif yap
            if (category.getParentId() == null) {
                activateAllChildren(categoryId);
                log.info("Root category and all children activated: {}", category.getCategoryName());
            } else {
                log.info("Category activated: {}", category.getCategoryName());
            }
        } catch (Exception e) {
            log.error("Error activating category: {}", e.getMessage());
            throw new RuntimeException("Failed to activate category: " + e.getMessage(), e);
        }
    }

    // Kategoriyi pasif yap
    @Transactional
    public void deactivateCategory(Integer categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            category.setIsActive(false);
            categoryRepository.save(category);

            // Tüm alt kategorileri de pasif yap
            deactivateAllChildren(categoryId);
            log.info("Category and all children deactivated: {}", category.getCategoryName());
        } catch (Exception e) {
            log.error("Error deactivating category: {}", e.getMessage());
            throw new RuntimeException("Failed to deactivate category: " + e.getMessage(), e);
        }
    }

    public void createTestData() {
        // Root kategoriler
        Category electronics = Category.builder()
                .categoryName("Elektronik")
                .parentId(null)
                .level(0)
                .isActive(true)
                .build();
        categoryRepository.save(electronics);

        Category clothing = Category.builder()
                .categoryName("Giyim")
                .parentId(null)
                .level(0)
                .isActive(true)
                .build();
        categoryRepository.save(clothing);

        // Elektronik alt kategorileri
        Category phone = Category.builder()
                .categoryName("Telefon")
                .parentId(electronics.getCategoryId())
                .level(1)
                .isActive(true)
                .build();
        categoryRepository.save(phone);

        Category computer = Category.builder()
                .categoryName("Bilgisayar")
                .parentId(electronics.getCategoryId())
                .level(1)
                .isActive(true)
                .build();
        categoryRepository.save(computer);

        // Telefon alt kategorileri
        Category smartphone = Category.builder()
                .categoryName("Akıllı Telefon")
                .parentId(phone.getCategoryId())
                .level(2)
                .isActive(true)
                .build();
        categoryRepository.save(smartphone);

        Category android = Category.builder()
                .categoryName("Android")
                .parentId(smartphone.getCategoryId())
                .level(3)
                .isActive(true)
                .build();
        categoryRepository.save(android);

        Category samsung = Category.builder()
                .categoryName("Samsung")
                .parentId(android.getCategoryId())
                .level(4)
                .isActive(true)
                .build();
        categoryRepository.save(samsung);

        log.info("Test data created successfully");
    }

    // Kategoriye ait property'leri getir
    public List<PropertyResponse> getCategoryProperties(Integer categoryId) {
        try {
            List<CategoryProperty> categoryProperties = categoryPropertyRepository.findByCategory_CategoryId(categoryId);
            
            return categoryProperties.stream()
                    .filter(cp -> cp.getIsActive() != null && cp.getIsActive())
                    .filter(cp -> cp.getIsDeleted() == null || !cp.getIsDeleted())
                    .map(cp -> PropertyResponse.builder()
                            .propertyId(cp.getProperty().getId())
                            .propertyName(cp.getProperty().getName())
                            .isActive(cp.getIsActive())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting category properties: {}", e.getMessage());
            throw new RuntimeException("Failed to get category properties", e);
        }
    }

    // Kategori özelliklerini ve property'lerini birlikte getir
    public CategoryWithPropertiesResponse getCategoryWithProperties(Integer categoryId) {
        try {
            // Kategoriyi bul
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            
            // Kategori property'lerini getir
            List<PropertyResponse> properties = getCategoryProperties(categoryId);
            
            // Response oluştur
            return CategoryWithPropertiesResponse.builder()
                    .categoryId(category.getCategoryId())
                    .categoryName(category.getCategoryName())
                    .parentId(category.getParentId())
                    .level(category.getLevel())
                    .isActive(category.getIsActive())
                    .properties(properties)
                    .build();
        } catch (Exception e) {
            log.error("Error getting category with properties: {}", e.getMessage());
            throw new RuntimeException("Failed to get category with properties", e);
        }
    }

    // Test için property'ler oluştur
    public void createTestProperties() {
        try {
            // Önce property'leri oluştur
            Property ram = Property.builder().name("RAM").build();
            Property cpu = Property.builder().name("CPU").build();
            Property storage = Property.builder().name("Depolama").build();
            Property color = Property.builder().name("Renk").build();
            Property size = Property.builder().name("Boyut").build();
            
            propertyRepository.save(ram);
            propertyRepository.save(cpu);
            propertyRepository.save(storage);
            propertyRepository.save(color);
            propertyRepository.save(size);
            
            // Kategorileri al
            List<Category> categories = categoryRepository.findAll();
            
            // Her kategoriye property'leri ata
            for (Category category : categories) {
                // Elektronik kategorilerine teknik özellikler
                if (category.getCategoryName().toLowerCase().contains("telefon") || 
                    category.getCategoryName().toLowerCase().contains("bilgisayar") ||
                    category.getCategoryName().toLowerCase().contains("elektronik")) {
                    
                    CategoryProperty cp1 = CategoryProperty.builder()
                            .category(category)
                            .property(ram)
                            .isActive(true)
                            .isDeleted(false)
                            .build();
                    categoryPropertyRepository.save(cp1);
                    
                    CategoryProperty cp2 = CategoryProperty.builder()
                            .category(category)
                            .property(cpu)
                            .isActive(true)
                            .isDeleted(false)
                            .build();
                    categoryPropertyRepository.save(cp2);
                    
                    CategoryProperty cp3 = CategoryProperty.builder()
                            .category(category)
                            .property(storage)
                            .isActive(true)
                            .isDeleted(false)
                            .build();
                    categoryPropertyRepository.save(cp3);
                }
                
                // Giyim kategorilerine renk ve boyut
                if (category.getCategoryName().toLowerCase().contains("giyim")) {
                    CategoryProperty cp1 = CategoryProperty.builder()
                            .category(category)
                            .property(color)
                            .isActive(true)
                            .isDeleted(false)
                            .build();
                    categoryPropertyRepository.save(cp1);
                    
                    CategoryProperty cp2 = CategoryProperty.builder()
                            .category(category)
                            .property(size)
                            .isActive(true)
                            .isDeleted(false)
                            .build();
                    categoryPropertyRepository.save(cp2);
                }
            }
            
            log.info("Test properties created and assigned to categories successfully");
        } catch (Exception e) {
            log.error("Error creating test properties: {}", e.getMessage());
            throw new RuntimeException("Failed to create test properties", e);
        }
    }

    // ========== RESTORE METHODS ==========

    // Silinmiş kategoriyi geri getir (restore)
    @Transactional
    public void restoreCategory(Integer categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            
            // Kategoriyi geri getir
            category.setIsDeleted(false);
            category.setIsActive(true);
            categoryRepository.save(category);
            
            // Eğer bu bir root kategori ise, tüm alt kategorilerini de geri getir
            if (category.getParentId() == null) {
                restoreAllChildren(categoryId);
            }
            
            log.info("Category restored successfully: {}", category.getCategoryName());
        } catch (Exception e) {
            log.error("Error restoring category: {}", e.getMessage());
            throw new RuntimeException("Failed to restore category", e);
        }
    }

    // Alt kategorileri geri getir (recursive)
    private void restoreAllChildren(Integer parentId) {
        List<Category> children = categoryRepository.findByParentId(parentId);
        for (Category child : children) {
            child.setIsDeleted(false);
            child.setIsActive(true);
            categoryRepository.save(child);
            
            // Alt kategorilerin de alt kategorilerini geri getir
            restoreAllChildren(child.getCategoryId());
        }
    }

    // Belirli bir kategorinin alt kategorilerini geri getir
    @Transactional
    public void restoreCategoryWithChildren(Integer categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            
            // Ana kategoriyi geri getir
            category.setIsDeleted(false);
            category.setIsActive(true);
            categoryRepository.save(category);
            
            // Tüm alt kategorilerini geri getir
            restoreAllChildren(categoryId);
            
            log.info("Category and all children restored successfully: {}", category.getCategoryName());
        } catch (Exception e) {
            log.error("Error restoring category with children: {}", e.getMessage());
            throw new RuntimeException("Failed to restore category with children", e);
        }
    }
}
