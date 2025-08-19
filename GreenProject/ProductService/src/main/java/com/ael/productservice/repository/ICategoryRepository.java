package com.ael.productservice.repository;

import com.ael.productservice.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ICategoryRepository extends JpaRepository<Category, Integer> {
    // Root kategoriler (parentId = null)
    List<Category> findByParentIdIsNull();
    
    // Belirli bir parent'ın çocukları
    List<Category> findByParentId(Integer parentId);
    
    // Aktif kategoriler
    List<Category> findByIsActiveTrue();
    
    // İsme göre arama
    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);
    
    // Level metodları
    List<Category> findByLevel(Integer level);
    List<Category> findByLevelGreaterThan(Integer level);
    List<Category> findByLevelBetween(Integer minLevel, Integer maxLevel);
    
    // Belirli bir kategorinin tüm alt kategorilerini getir (recursive)
    @Query(value = """
        WITH RECURSIVE category_tree AS (
            SELECT category_id, category_name, parent_id, is_active, level, 0 as depth
            FROM categories 
            WHERE category_id = :categoryId
            
            UNION ALL
            
            SELECT c.category_id, c.category_name, c.parent_id, c.is_active, c.level, ct.depth + 1
            FROM categories c
            JOIN category_tree ct ON c.parent_id = ct.category_id
        )
        SELECT * FROM category_tree ORDER BY level, category_name
        """, nativeQuery = true)
    List<Category> findAllSubcategories(@Param("categoryId") Integer categoryId);
    
    // Belirli bir kategorinin tüm üst kategorilerini getir (recursive)
    @Query(value = """
        WITH RECURSIVE category_tree AS (
            SELECT category_id, category_name, parent_id, is_active, level, 0 as depth
            FROM categories 
            WHERE category_id = :categoryId
            
            UNION ALL
            
            SELECT c.category_id, c.category_name, c.parent_id, c.is_active, c.level, ct.depth + 1
            FROM categories c
            JOIN category_tree ct ON c.category_id = ct.parent_id
        )
        SELECT * FROM category_tree ORDER BY level DESC, category_name
        """, nativeQuery = true)
    List<Category> findAllAncestors(@Param("categoryId") Integer categoryId);
}
