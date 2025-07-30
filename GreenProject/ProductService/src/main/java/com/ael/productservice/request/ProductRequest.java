package com.ael.productservice.request;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
public class ProductRequest {
    private Integer productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private Integer subCategoryId;
    private List<MultipartFile> images;

}
