package com.ael.productservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ProductPropertyValues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPropertyValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToOne
    private Property property;

    private String value;
}