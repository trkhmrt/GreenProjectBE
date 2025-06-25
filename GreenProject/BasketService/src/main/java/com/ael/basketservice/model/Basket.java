package com.ael.basketservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Table(name="Baskets")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Basket {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer basketId;

        private Integer customerId;

        @ManyToOne
        @JoinColumn(name = "basketStatusId")
        private BasketStatus basketStatus;


        @OneToMany(mappedBy = "basket",cascade = CascadeType.ALL,orphanRemoval = true)
        private List<BasketProductUnit> products = new ArrayList<>();


        @Override
        public String toString() {
                return "Basket{" +
                        "basketId=" + basketId +
                        ", customerId=" + customerId +
                        ", basketStatus=" + basketStatus +
                        ", products=" + products +
                        '}';
        }
}
