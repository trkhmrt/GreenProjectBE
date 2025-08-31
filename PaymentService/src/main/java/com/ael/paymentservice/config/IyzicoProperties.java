package com.ael.paymentservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix="iyzico")
public class IyzicoProperties {
    private String apiKey;
    private String secretKey;
    private String baseUrl;
}
