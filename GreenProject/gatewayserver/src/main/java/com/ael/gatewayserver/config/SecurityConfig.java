package com.ael.gatewayserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity serverHttpSecurity) {
        serverHttpSecurity
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.GET).permitAll()
                        .pathMatchers(HttpMethod.POST).permitAll()
                        .pathMatchers("/ael/authservice/auth/login").permitAll() // Login endpoint'ini açık bırak
                        .pathMatchers("/ael/authservice/auth/register").permitAll() // Register endpoint'ini açık bırak// Customer service için USER rolü gerekli
                        .pathMatchers("/ael/basketservice/**").permitAll() // Register endpoint'ini açık bırak// Customer service için USER rolü gerekli
                        .anyExchange().permitAll()
                )
                .csrf(csrfSpec -> csrfSpec.disable());

        return serverHttpSecurity.build();
    }


}
