package com.ael.customerservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerProfileResponse {
    // Temel bilgiler
    private Integer customerId;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String phoneNumber;
    private String address;
    private String city;
    private String identityNumber;
    private String vkn;
    private Integer customerTypeId;
    
    // Durum bilgileri
    private Boolean isDeleted;
    private Boolean isEmailConfirmed;
    private Boolean isSmsConfirmed;
    private String roles;
    
    // Aktif sepet
    private Integer activeBasketId;
    
    // Adres bilgileri
    private List<AddressResponse> addresses;
    
    // Kredi kartı bilgileri
    private List<CreditCardResponse> creditCards;
    
    // İstatistikler (opsiyonel - gelecekte eklenebilir)
    private Integer totalOrders;
    private Integer totalProducts;
    private String memberSince; // Kayıt tarihi
}


