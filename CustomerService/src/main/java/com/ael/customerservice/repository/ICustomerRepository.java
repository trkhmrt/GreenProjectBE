package com.ael.customerservice.repository;

import com.ael.customerservice.dto.response.AddressResponse;
import com.ael.customerservice.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findCustomerByUsernameOrEmail(String email, String username);
    Optional<Customer> findCustomerByUsernameOrPassword(String username,String password);
    Optional<Boolean> existsByEmailOrUsername(String email, String username);
    
    // Email'in başka bir kullanıcıda olup olmadığını kontrol et
    boolean existsByEmailAndCustomerIdNot(String email, Integer customerId);
    
    // Telefon numarasının başka bir kullanıcıda olup olmadığını kontrol et
    boolean existsByPhoneNumberAndCustomerIdNot(String phoneNumber, Integer customerId);
}
