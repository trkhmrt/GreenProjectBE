package com.ael.productservice.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class SimpleProductPropertyRequest {
    private Integer propertyId;
    private String propertyValue; // Örn: "Renk", "Beden"
    private String value;
}
