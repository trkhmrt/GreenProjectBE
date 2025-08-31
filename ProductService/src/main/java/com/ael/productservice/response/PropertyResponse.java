package com.ael.productservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponse {
    private Integer propertyId;
    private String propertyName;
    private Boolean isActive;
}
