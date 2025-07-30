package com.ael.productservice.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductCreateResponse {
    private String message;
    private Integer productId;
    private List<String> imageUrls;
}
