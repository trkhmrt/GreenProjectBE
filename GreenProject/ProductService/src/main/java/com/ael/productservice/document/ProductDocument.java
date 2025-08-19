package com.ael.productservice.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.util.List;

@Document(indexName = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDocument {
    
    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String productName;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;
    
    @Field(type = FieldType.Double)
    private BigDecimal price;
    
    @Field(type = FieldType.Integer)
    private Integer stock;
    
    // Yeni kategori sistemi
    @Field(type = FieldType.Keyword)
    private String categoryName; // Ana kategori adı
    
    @Field(type = FieldType.Integer)
    private Integer categoryId; // Kategori ID'si
    
    @Field(type = FieldType.Integer)
    private Integer categoryLevel; // Kategorinin level'ı (0, 1, 2, 3...)
    
    @Field(type = FieldType.Keyword)
    private String categoryPath; // Tam kategori yolu: "Elektronik > Telefon > Android"
    
    @Field(type = FieldType.Keyword)
    private List<String> categoryHierarchy; // Tüm üst kategoriler: ["Elektronik", "Telefon", "Android"]
    
    @Field(type = FieldType.Boolean)
    private Boolean isActive;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String brand;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String model;
    
    @Field(type = FieldType.Keyword)
    private List<String> tags;
}
