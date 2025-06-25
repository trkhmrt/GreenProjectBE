package com.ael.authservice.controller;
import com.ael.authservice.dto.request.AuthContactInfo;
import com.ael.authservice.dto.response.CustomerResponse;
import com.ael.authservice.filter.JwtUtil;
import com.ael.authservice.model.AuthLoginResponse;
import com.ael.authservice.model.LoginRequest;
import com.ael.authservice.client.ICustomerClient;
import com.ael.authservice.model.Customer;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Enumeration;


@RestController
@RefreshScope
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {


    private static final Logger log = LoggerFactory.getLogger(AuthController.class);


    private AuthContactInfo authContactInfo;
    private ICustomerClient customerClient;
    private JwtUtil jwtUtil;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        CustomerResponse customer = customerClient.authenticateCustomer(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        ).getBody();





        if (customer != null) {
            // JWT token üret
            String token = jwtUtil.generateToken(
                    customer.getEmail(),
                    "USER",
                    customer.getCustomerId()
            );

            AuthLoginResponse response = AuthLoginResponse.builder()
                    .accessToken(token)
                    .userName(customer.getEmail())
                    .customerId(customer.getCustomerId())
                    .activeBasketId(customer.getActiveBasketId())
                    .build();

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Customer customer) {

        customerClient.createCustomer(customer);
        return ResponseEntity.ok("Customer registered successfully!");
    }

    @GetMapping("/test")
    public ResponseEntity<?> test(HttpServletRequest request) {
        log.info("AuthContactInfo message: {}", authContactInfo != null ? authContactInfo.getMessage() : "null");

        log.info("=== ALL REQUEST HEADERS ===");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            log.info("Header: {} = {}", headerName, headerValue);
        }


        if (authContactInfo == null || authContactInfo.getMessage() == null) {
            return ResponseEntity.status(500).body("Configuration not loaded properly");
        }
        return ResponseEntity.ok(authContactInfo.getMessage());
    }
}
