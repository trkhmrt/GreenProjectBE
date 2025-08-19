package com.ael.productservice.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantPropertiesRequest {
    private Integer categoryId;
    private Integer propertyId;
    private String value;
}
