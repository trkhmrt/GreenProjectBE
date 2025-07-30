package com.ael.productservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name; // Ör: RAM, CPU Hızı
}