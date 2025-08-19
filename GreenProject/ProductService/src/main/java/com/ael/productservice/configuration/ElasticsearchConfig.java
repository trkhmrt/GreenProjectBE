package com.ael.productservice.configuration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

// @Configuration
// @EnableElasticsearchRepositories(basePackages = "com.ael.productservice.repository")
// @ConditionalOnProperty(name = "spring.elasticsearch.rest.uris")
public class ElasticsearchConfig {
    // Elasticsearch konfigürasyonu - şu an devre dışı
}
