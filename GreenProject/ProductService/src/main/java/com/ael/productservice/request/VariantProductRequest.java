package com.ael.productservice.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class VariantProductRequest {
    private String SKU;
    private Double variantPrice;
    private Integer stockQuantity;
    private List<VariantPropertiesRequest> variantProperties;
    private List<MultipartFile> variantImages;
}
