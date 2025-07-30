package com.ael.productservice.service;

import com.ael.productservice.model.Category;
import com.ael.productservice.model.CategoryProperty;
import com.ael.productservice.model.Property;
import com.ael.productservice.repository.ICategoryPropertyRepository;
import com.ael.productservice.repository.ICategoryRepository;
import com.ael.productservice.repository.IPropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import com.ael.productservice.response.CategoryPropertySimpleResponse;

@Service
@RequiredArgsConstructor
public class CategoryPropertyService {
    private final ICategoryPropertyRepository categoryPropertyRepository;
    private final ICategoryRepository categoryRepository;
    private final IPropertyRepository propertyRepository;

    public CategoryProperty addPropertyToCategory(Integer categoryId, Integer propertyId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        Property property = propertyRepository.findById(propertyId).orElseThrow(() -> new RuntimeException("Property not found"));
        CategoryProperty cp = CategoryProperty.builder().category(category).property(property).isActive(true).isDeleted(false).build();
        return categoryPropertyRepository.save(cp);
    }

    public CategoryProperty addPropertyToCategoryByName(Integer categoryId, String propertyName) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Property var mı kontrol et
        Property property = propertyRepository.findByName(propertyName)
                .orElseGet(() -> {
                    // Property yoksa oluştur
                    Property newProperty = Property.builder()
                            .name(propertyName)
                            .build();
                    return propertyRepository.save(newProperty);
                });

        // CategoryProperty var mı kontrol et
        boolean exists = categoryPropertyRepository.existsByCategoryAndProperty(category, property);
        if (exists) {
            throw new RuntimeException("Property '" + propertyName + "' already exists for this category");
        }
        
        // Yoksa yeni CategoryProperty oluştur
        CategoryProperty cp = CategoryProperty.builder()
                .category(category)
                .property(property)
                .isActive(true)
                .isDeleted(false)
                .build();
        return categoryPropertyRepository.save(cp);
    }

    public CategoryProperty updateCategoryProperty(Integer id, Integer propertyId, Integer categoryId, Boolean isActive) {
        CategoryProperty cp = categoryPropertyRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryProperty not found"));
        if (propertyId != null) {
            Property property = propertyRepository.findById(propertyId).orElseThrow(() -> new RuntimeException("Property not found"));
            cp.setProperty(property);
        }
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
            cp.setCategory(category);
        }
        if (isActive != null) {
            cp.setIsActive(isActive);
        }
        return categoryPropertyRepository.save(cp);
    }

    public void deactivateCategoryProperty(Integer id) {
        CategoryProperty cp = categoryPropertyRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryProperty not found"));
        cp.setIsActive(false);
        categoryPropertyRepository.save(cp);
    }

    public CategoryProperty toggleCategoryPropertyStatus(Integer propertyId) {
        CategoryProperty cp = categoryPropertyRepository.findByProperty_Id(propertyId)
                .orElseThrow(() -> new RuntimeException("CategoryProperty not found for propertyId: " + propertyId));
        cp.setIsActive(!cp.getIsActive()); // Mevcut durumun tersini al
        return categoryPropertyRepository.save(cp);
    }

    public CategoryProperty toggleCategoryPropertyDeleted(Integer propertyId) {
        CategoryProperty cp = categoryPropertyRepository.findByProperty_Id(propertyId)
                .orElseThrow(() -> new RuntimeException("CategoryProperty not found for propertyId: " + propertyId));
        
        // Mevcut durumun tersini al
        Boolean currentDeleted = cp.getIsDeleted();
        Boolean newDeletedStatus = currentDeleted == null ? true : !currentDeleted;
        cp.setIsDeleted(newDeletedStatus);
        
        // Eğer isDeleted true yapılıyorsa isActive'i false yap
        if (newDeletedStatus) {
            cp.setIsActive(false);
        }
        
        return categoryPropertyRepository.save(cp);
    }

    public Property updatePropertyName(Integer propertyId, String newName) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        
        // Eğer aynı isimse (case-insensitive) ve aynı property ise güncellemeye izin ver
        if (property.getName().equalsIgnoreCase(newName)) {
            property.setName(newName); // Büyük/küçük harf düzeltmesi için
            return propertyRepository.save(property);
        }
        
        // Yeni isim başka bir property'de var mı kontrol et (case-insensitive)
        boolean exists = propertyRepository.findAll().stream()
                .anyMatch(p -> p.getName().equalsIgnoreCase(newName) && !p.getId().equals(propertyId));
        
        if (exists) {
            throw new RuntimeException("Property with name '" + newName + "' already exists in the system");
        }
        
        property.setName(newName);
        return propertyRepository.save(property);
    }


    public List<CategoryPropertySimpleResponse> getAllCategoryProperties() {
        return categoryPropertyRepository.findAll().stream()
                .filter(cp -> cp.getIsDeleted() == null || !cp.getIsDeleted()) // isDeleted=false olanları al
                .map(cp -> CategoryPropertySimpleResponse.builder()
                        .id(cp.getId())
                        .categoryId(cp.getCategory().getCategoryId())
                        .propertyId(cp.getProperty().getId())
                        .propertyName(cp.getProperty().getName())
                        .isActive(cp.getIsActive())
                        .isDeleted(cp.getIsDeleted())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }
} 