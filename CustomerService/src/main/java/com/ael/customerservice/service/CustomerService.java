package com.ael.customerservice.service;


import com.ael.customerservice.client.IBasketClient;
import com.ael.customerservice.client.IOrderClient;
import com.ael.customerservice.dto.request.AddressRequest;
import com.ael.customerservice.dto.response.AddressResponse;
import com.ael.customerservice.dto.response.CheckoutInfoResponse;
import com.ael.customerservice.dto.response.CustomerProfileResponse;
import com.ael.customerservice.dto.response.CustomerResponse;
import com.ael.customerservice.dto.response.CreditCardResponse;
import com.ael.customerservice.exception.CustomerAlreadyExistsException;
import com.ael.customerservice.exception.CustomerNotFoundException;
import com.ael.customerservice.exception.EmailAlreadyExistsException;
import com.ael.customerservice.exception.PhoneNumberAlreadyExistsException;
import com.ael.customerservice.exception.WrongUserNameOrPasswordException;
import com.ael.customerservice.model.Customer;
import com.ael.customerservice.model.CustomerAddress;
import org.springframework.http.ResponseEntity;
import com.ael.customerservice.repository.ICustomerAddressRepository;
import com.ael.customerservice.repository.ICustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class CustomerService {


    ICustomerRepository customerRepository;
    ICustomerAddressRepository customerAddressRepository;
    CustomerCreditCardService customerCreditCardService;
    IBasketClient basketClient;
    IOrderClient orderClient;


    public Customer createCustomer(Customer customer) {

        existsByEmailOrUserName(customer.getEmail(), customer.getUsername());

        Customer newCustomer = Customer.builder()
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .username(customer.getUsername())
                .password(customer.getPassword())
                .phoneNumber(customer.getPhoneNumber())
                .city(customer.getCity())
                .address(customer.getAddress())
                .build();

        customerRepository.save(newCustomer);

        return newCustomer;
    }


    public Boolean existsByEmailOrUserName(String email, String username) {

        return customerRepository.existsByEmailOrUsername(email, username)
                .filter(e -> !e)
                .orElseThrow(() -> new CustomerAlreadyExistsException("Bu kullanıcı zaten mevcut."));

    }


    public Customer findCustomerById(Integer customerId) {
        return customerRepository.findById(customerId).orElseThrow(() -> new CustomerNotFoundException("Müşteri bulunamadı"));
    }


    public Customer findCustomerByUserNameOrEmail(String email, String userName) {
        return customerRepository.findCustomerByUsernameOrEmail(userName, email).orElseThrow(() -> new CustomerNotFoundException("Müşteri bulunamadı"));
    }


    public CustomerResponse findCustomerByUserNameAndPassword(String username, String password) {
        //İlk etapta kullanıcıyı buluyor sonra gelen kullanıcının şifresi girilen şifreyle eşleşiyor mu ona bakılıyor
        Customer foundedCustomer = customerRepository.findCustomerByUsernameOrEmail(username, null)
                .filter(customer -> customer.getPassword().equals(password))
                .orElseThrow(() -> new WrongUserNameOrPasswordException("Kullanıcı adı veya şifre hatalı."));



        return CustomerResponse.builder()
                .firstName(foundedCustomer.getFirstName())
                .lastName(foundedCustomer.getLastName())
                .email(foundedCustomer.getEmail())
                .phoneNumber(foundedCustomer.getPhoneNumber())
                .address(foundedCustomer.getAddress())
                .city(foundedCustomer.getCity())
                .customerId(foundedCustomer.getCustomerId())
                .roles(foundedCustomer.getRoles())
                .build();
    }


    public List<AddressResponse> getCustomerAddress(Integer customerId) {
        return customerAddressRepository.findAddressByCustomer_CustomerIdAndIsDeletedFalseAndIsActiveTrue(customerId)
                .stream()
                .map(address ->
                        AddressResponse.builder()
                                .AddressContent(address.getAddress())
                                .AddressId(address.getId())
                                .title(address.getTitle())
                                .isActive(address.getIsActive())
                                .isDeleted(address.getIsDeleted())
                                .inUse(address.getInUse())
                                .build())
                .collect(Collectors.toList());
    }


    public CheckoutInfoResponse getCustomerInfoForCheckout(Integer customerId) {
        return CheckoutInfoResponse.builder()
                .addressResponse(getCustomerAddress(customerId))
                .creditCardResponses(customerCreditCardService.getAllCreditCardsByCustomerId(customerId))
                .build();
    }

    public CustomerProfileResponse getCustomerProfile(Integer customerId) {
        Customer customer = findCustomerById(customerId);
        List<AddressResponse> addresses = getCustomerAddress(customerId);
        List<CreditCardResponse> creditCards = customerCreditCardService.getAllCreditCardsByCustomerId(customerId);

        return CustomerProfileResponse.builder()
                // Temel bilgiler
                .customerId(customer.getCustomerId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .username(customer.getUsername())
                .phoneNumber(customer.getPhoneNumber())
                .address(customer.getAddress())
                .city(customer.getCity())
                .identityNumber(customer.getIdentityNumber())
                .vkn(customer.getVkn())
                .customerTypeId(customer.getCustomerTypeId())
                
                // Durum bilgileri
                .isDeleted(customer.getIsDeleted())
                .isEmailConfirmed(customer.getIsEmailConfirmed())
                .isSmsConfirmed(customer.getIsSmsConfirmed())
                .roles(customer.getRoles())
                

                
                // Adres ve kredi kartı bilgileri
                .addresses(addresses)
                .creditCards(creditCards)
                
                // İstatistikler (şimdilik 0, gelecekte OrderService'den alınabilir)
                .totalOrders(0)
                .totalProducts(0)
                .memberSince("2024") // Şimdilik sabit, gelecekte customer.getCreatedDate() kullanılabilir
                .build();
    }

    @Transactional
    public AddressResponse addCustomerAddress(Integer customerId, AddressRequest addressRequest) {
        Customer customer = findCustomerById(customerId);
        
        CustomerAddress newAddress = CustomerAddress.builder()
                .title(addressRequest.getTitle())
                .address(addressRequest.getAddress())
                .customer(customer)
                .isActive(true)
                .isDeleted(false)
                .build();
        
        CustomerAddress savedAddress = customerAddressRepository.save(newAddress);
        
        return AddressResponse.builder()
                .AddressId(savedAddress.getId())
                .title(savedAddress.getTitle())
                .AddressContent(savedAddress.getAddress())
                .isActive(savedAddress.getIsActive())
                .isDeleted(savedAddress.getIsDeleted())
                .inUse(savedAddress.getInUse())
                .build();
    }

    @Transactional
    public AddressResponse updateCustomerAddress(Integer customerId, Integer addressId, AddressRequest addressRequest) {
        // Önce adresin bu müşteriye ait olup olmadığını ve silinmemiş olduğunu kontrol et
        CustomerAddress existingAddress = customerAddressRepository.findByIdAndIsDeletedFalse(addressId)
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı"));
        
        if (!existingAddress.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Bu adres bu müşteriye ait değil");
        }
        
        existingAddress.setTitle(addressRequest.getTitle());
        existingAddress.setAddress(addressRequest.getAddress());
        CustomerAddress updatedAddress = customerAddressRepository.save(existingAddress);
        
        return AddressResponse.builder()
                .AddressId(updatedAddress.getId())
                .title(updatedAddress.getTitle())
                .AddressContent(updatedAddress.getAddress())
                .isActive(updatedAddress.getIsActive())
                .isDeleted(updatedAddress.getIsDeleted())
                .inUse(updatedAddress.getInUse())
                .build();
    }

    @Transactional
    public void deleteCustomerAddress(Integer customerId, Integer addressId) {
        // Soft delete işlemi
        int updatedRows = customerAddressRepository.softDeleteAddress(addressId, customerId);
        if (updatedRows == 0) {
            throw new RuntimeException("Adres bulunamadı veya bu müşteriye ait değil");
        }
    }

    @Transactional
    public void toggleAddressStatus(Integer customerId, Integer addressId) {
        // Önce adresin bu müşteriye ait olup olmadığını ve silinmemiş olduğunu kontrol et
        CustomerAddress existingAddress = customerAddressRepository.findByIdAndIsDeletedFalse(addressId)
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı"));
        
        if (!existingAddress.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Bu adres bu müşteriye ait değil");
        }
        
        // Aktif/pasif durumunu değiştir
        Boolean newStatus = !existingAddress.getIsActive();
        customerAddressRepository.updateAddressStatus(addressId, customerId, newStatus);
    }
    
    @Transactional
    public void setAddressAsInUse(Integer customerId, Integer addressId) {
        // Önce adresin bu müşteriye ait olup olmadığını ve silinmemiş olduğunu kontrol et
        CustomerAddress existingAddress = customerAddressRepository.findByIdAndIsDeletedFalse(addressId)
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı"));
        
        if (!existingAddress.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Bu adres bu müşteriye ait değil");
        }
        
        // Önce diğer adreslerin inUse durumunu false yap
        customerAddressRepository.setOtherAddressesInactive(customerId, addressId);
        
        // Sonra bu adresin inUse durumunu true yap
        customerAddressRepository.updateAddressInUseStatus(addressId, customerId, true);
    }

    @Transactional
    public void updateCustomerPhone(Integer customerId, String newPhoneNumber) {
        Customer customer = findCustomerById(customerId);
        
        // Telefon numarasının başka bir kullanıcıda olup olmadığını kontrol et
        if (customerRepository.existsByPhoneNumberAndCustomerIdNot(newPhoneNumber, customerId)) {
            throw new PhoneNumberAlreadyExistsException("Bu telefon numarası başka bir kullanıcı tarafından kullanılıyor: " + newPhoneNumber);
        }
        
        customer.setPhoneNumber(newPhoneNumber);
        customerRepository.save(customer);
    }

    @Transactional
    public void updateCustomerEmail(Integer customerId, String newEmail) {
        Customer customer = findCustomerById(customerId);
        
        // Email'in başka bir kullanıcıda olup olmadığını kontrol et
        if (customerRepository.existsByEmailAndCustomerIdNot(newEmail, customerId)) {
            throw new EmailAlreadyExistsException("Bu email adresi başka bir kullanıcı tarafından kullanılıyor: " + newEmail);
        }
        
        customer.setEmail(newEmail);
        customerRepository.save(customer);
    }
    
    @Transactional
    public void updateCustomerPassword(Integer customerId, String currentPassword, String newPassword) {
        Customer customer = findCustomerById(customerId);
        
        // Mevcut şifrenin doğru olup olmadığını kontrol et
        if (!customer.getPassword().equals(currentPassword)) {
            throw new WrongUserNameOrPasswordException("Mevcut şifre hatalı");
        }
        
        // Yeni şifre validasyonu (AuthService'teki gibi)
        if (newPassword == null || newPassword.length() < 8 ||
            !newPassword.matches(".*[A-Z].*") ||
            !newPassword.matches(".*[a-z].*") ||
            !newPassword.matches(".*\\d.*")) {
            throw new RuntimeException("Yeni şifre en az 8 karakter olmalı ve büyük harf, küçük harf ve rakam içermelidir");
        }
        
        customer.setPassword(newPassword);
        customerRepository.save(customer);
    }
    
    // ========== SİPARİŞ ENDPOINT'LERİ ==========
    
    /**
     * Müşterinin tüm siparişlerini getir
     */
    public ResponseEntity<?> getCustomerOrders(Integer customerId) {
        try {
            return orderClient.getCustomerOrders(customerId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Siparişler alınırken hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Müşterinin tüm siparişlerini detaylarıyla birlikte getir
     */
    public ResponseEntity<?> getCustomerOrdersWithDetails(Integer customerId) {
        try {
            return orderClient.getCustomerOrdersWithDetails(customerId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Sipariş detayları alınırken hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Belirli bir siparişin detaylarını getir (ürün bilgileri dahil)
     */
    public ResponseEntity<?> getOrderDetails(Integer customerId, Integer orderId) {
        try {
            return orderClient.getOrderDetails(customerId, orderId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Sipariş detayı alınırken hata oluştu: " + e.getMessage());
        }
    }
}
