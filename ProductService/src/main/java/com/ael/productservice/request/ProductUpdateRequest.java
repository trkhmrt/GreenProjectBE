package com.ael.productservice.request;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
public class ProductUpdateRequest {
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private Integer subCategoryId;
    private List<MultipartFile> newImages; // YENİ: Ek fotoğraflar
    private List<String> imagesToDelete; // YENİ: Silinecek fotoğraf URL'leri
    private Boolean replaceAllImages;
}