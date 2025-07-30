package com.ael.productservice.service;

import com.ael.productservice.model.CategoryProperty;
import com.ael.productservice.model.Property;
import com.ael.productservice.repository.ICategoryPropertyRepository;
import com.ael.productservice.repository.IProductRepository;
import com.ael.productservice.request.CategoryRequest;
import com.ael.productservice.request.PropertyRequest;
import com.ael.productservice.response.CategoryPropertyResponse;
import com.ael.productservice.response.CategoryResponse;
import com.ael.productservice.response.SubCategoryDto;
import com.ael.productservice.model.Category;
import com.ael.productservice.repository.ICategoryRepository;
import com.ael.productservice.repository.IPropertyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {
    ICategoryRepository categoryRepository;
    IPropertyRepository propertyRepository;
    ICategoryPropertyRepository categoryPropertyRepository;



    public void createCategory(CategoryRequest categoryRequest) {

        Category newCategory = Category.builder()
                .categoryName(categoryRequest.getCategoryName())
                .isActive(true)
                .isDeleted(false)
                .build();

        categoryRepository.save(newCategory);
    }

//    @Override
//    public List<CategoryResponse> getAllCategories() {
//        List<Category> categories = categoryRepository.findAll();
//        return categories.stream().map(category -> new CategoryResponse(category.getCategoryId(), category.getCategoryName())).toList();
//    }


    public List<CategoryResponse> findAllWithSubCategories() {

        List<CategoryProperty> categoryProperties = categoryPropertyRepository.findAll()
                .stream()
                .filter(cp -> cp.getIsDeleted() == null || !cp.getIsDeleted()) // isDeleted=false olanları al
                .collect(Collectors.toList());

        return categoryRepository.findAllWithSubCategories()
                .stream()
                .filter(category -> category.getIsDeleted() == null || !category.getIsDeleted()) // isDeleted=false olan kategorileri al
                .map(category -> {
                    // Alt kategoriler (isDeleted=false olanlar)
                    List<SubCategoryDto> subDtoList = category.getSubCategories()
                            .stream()
                            .filter(sub -> sub.getIsDeleted() == null || !sub.getIsDeleted()) // isDeleted=false olan subcategory'leri al
                            .map(sub -> SubCategoryDto.builder()
                                    .id(sub.getSubCategoryId())
                                    .name(sub.getSubCategoryName())
                                    .isActive(sub.getIsActive())
                                    .build())
                            .collect(Collectors.toList());

                    // Bu kategoriye ait property'leri bul (isDeleted=false olanlar)
                    List<CategoryPropertyResponse> propertyDtoList = categoryProperties.stream()
                            .filter(cp -> cp.getCategory().getCategoryId().equals(category.getCategoryId()))
                            .map(cp -> CategoryPropertyResponse.builder()
                                    .propertyId(cp.getProperty().getId())
                                    .propertyValue(cp.getProperty().getName())
                                    .isActive(cp.getIsActive())
                                    .build())
                            .collect(Collectors.toList());

                    // CategoryResponse'u builder ile oluştur
                    return CategoryResponse.builder()
                            .categoryId(category.getCategoryId())
                            .categoryName(category.getCategoryName())
                            .isActive(category.getIsActive())
                            .subcategories(subDtoList)
                            .filters(propertyDtoList)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public void deleteCategory(Integer categoryId) {
        categoryRepository.deleteById(categoryId);
    }


    public void updateCategoryName(Integer categoryId, String categoryName) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setCategoryName(categoryName);
        categoryRepository.save(category);
    }

    public void toggleCategoryDeleted(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Boolean currentDeleted = category.getIsDeleted();
        Boolean newDeletedStatus = currentDeleted == null ? true : !currentDeleted;
        category.setIsDeleted(newDeletedStatus);
        
        // Eğer kategori siliniyorsa (isDeleted=true) tüm alt kategorileri de sil
        if (newDeletedStatus) {
            category.getSubCategories().forEach(subCategory -> {
                subCategory.setIsDeleted(true);
                // SubCategory repository'si gerekirse burada kaydet
            });
        }
        
        categoryRepository.save(category);
    }

    public void toggleCategoryActive(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Boolean currentActive = category.getIsActive();
        Boolean newActiveStatus = currentActive == null ? false : !currentActive;
        category.setIsActive(newActiveStatus);
        
        // Tüm alt kategorilerin isActive durumunu da güncelle
        category.getSubCategories().forEach(subCategory -> {
            subCategory.setIsActive(newActiveStatus);
            // SubCategory repository'si gerekirse burada kaydet
        });
        
        categoryRepository.save(category);
    }

    public void addPropertyToCategory(Integer categoryId, Integer propertyId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        Property property = propertyRepository.findById(propertyId).orElseThrow(() -> new RuntimeException("Property not found"));

        CategoryProperty categoryProperty = CategoryProperty.builder().category(category).property(property).build();
        categoryPropertyRepository.save(categoryProperty);

    }

    public void createProperty(String name){
        Property property = Property.builder().name(name).build();
        propertyRepository.save(property);
    }

    public void getAllCategoryProperties(Integer categoryId) {
        List<CategoryProperty> categoryProperty = categoryPropertyRepository.findByCategory_CategoryId(categoryId);
        categoryProperty.stream().forEach(p-> System.out.println(p.getProperty().getName()));
    }


}
