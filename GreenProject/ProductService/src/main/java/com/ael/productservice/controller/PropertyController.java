package com.ael.productservice.controller;

import com.ael.productservice.model.Property;
import com.ael.productservice.repository.IPropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/property")
@RequiredArgsConstructor
public class PropertyController {
    private final IPropertyRepository propertyRepository;

    @PostMapping("/create")
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        return ResponseEntity.ok(propertyRepository.save(property));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyRepository.findAll());
    }
} 