package com.ael.customerservice.service;


import com.ael.customerservice.client.IBasketClient;
import com.ael.customerservice.dto.request.AddressRequest;
import com.ael.customerservice.dto.response.AddressResponse;
import com.ael.customerservice.dto.response.CheckoutInfoResponse;
import com.ael.customerservice.dto.response.CustomerProfileResponse;
import com.ael.customerservice.dto.response.CustomerResponse;
import com.ael.customerservice.dto.response.CreditCardResponse;
import com.ael.customerservice.exception.CustomerAlreadyExistsException;
import com.ael.customerservice.exception.CustomerNotFoundException;
import com.ael.customerservice.exception.WrongUserNameOrPasswordException;
import com.ael.customerservice.model.Customer;
import com.ael.customerservice.model.CustomerAddress;
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
    public void updateCustomerPhone(Integer customerId, String newPhoneNumber) {
        Customer customer = findCustomerById(customerId);
        customer.setPhoneNumber(newPhoneNumber);
        customerRepository.save(customer);
    }

    @Transactional
    public void updateCustomerEmail(Integer customerId, String newEmail) {
        Customer customer = findCustomerById(customerId);
        customer.setEmail(newEmail);
        customerRepository.save(customer);
    }
}
