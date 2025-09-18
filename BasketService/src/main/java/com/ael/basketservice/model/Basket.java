package com.ael.basketservice.model;

import com.ael.basketservice.enums.BasketStatusEnum;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
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

        // Veritabanında ID olarak saklanır
        @Column(name = "basket_status_id")
        private Integer basketStatusId;

        // Enum olarak kullanılır (transient - veritabanına kaydedilmez)
        @Transient
        private BasketStatusEnum basketStatus;

        @CreationTimestamp // Bu anotasyon, nesne veritabanına kaydedildiğinde alanı otomatik olarak doldurur
        private Instant createDate;

        @UpdateTimestamp
        private Instant updateDate;

        @OneToMany(mappedBy = "basket",cascade = CascadeType.ALL,orphanRemoval = true)
        private List<BasketProductUnit> products = new ArrayList<>();

        // BasketStatusEnum setter'ı - otomatik olarak ID'yi de günceller
        public void setBasketStatus(BasketStatusEnum status) {
                this.basketStatus = status;
                this.basketStatusId = BasketStatusEnum.toId(status);
        }

        // BasketStatusId setter'ı - otomatik olarak enum'ı da günceller
        public void setBasketStatusId(Integer statusId) {
                this.basketStatusId = statusId;
                this.basketStatus = BasketStatusEnum.fromId(statusId);
        }

        // Builder için özel metod
        @PostConstruct
        @PrePersist
        public void updateBasketStatusId() {
                if (basketStatus != null && basketStatusId == null) {
                        basketStatusId = BasketStatusEnum.toId(basketStatus);
                }
        }

}
