package com.ael.paymentservice.config;

import com.iyzipay.Options;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IyzicoConfig {
    @Bean
    public Options iyzicoOptions(IyzicoProperties iyzicoProperties) {
        Options options = new Options();
        options.setApiKey(iyzicoProperties.getApiKey());
        options.setSecretKey(iyzicoProperties.getSecretKey());
        options.setBaseUrl(iyzicoProperties.getBaseUrl());

        return options;
    }
}
