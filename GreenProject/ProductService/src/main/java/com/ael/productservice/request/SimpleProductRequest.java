package com.ael.productservice.request;

import com.ael.productservice.enums.ProductType;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
public class SimpleProductRequest {
    private String productName;
    private String productBrand;
    private String productDescription;
    private Double productPrice;
    private ProductType productType;
    private Integer productQuantity;
    private Integer categoryId;
    private String categoryName; // Kategori adı (opsiyonel)
    private String parentCategoryName; // Parent kategori adı (opsiyonel)
    private List<MultipartFile> images;
    private List<SimpleProductPropertyRequest> simpleProductProperties;
}
