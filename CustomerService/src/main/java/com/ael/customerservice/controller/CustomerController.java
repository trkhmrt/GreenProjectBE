package com.ael.customerservice.controller;

import com.ael.customerservice.client.IBasketClient;
import com.ael.customerservice.dto.request.AddressRequest;
import com.ael.customerservice.dto.request.PhoneUpdateRequest;
import com.ael.customerservice.dto.request.EmailUpdateRequest;
import com.ael.customerservice.dto.request.PasswordUpdateRequest;
import com.ael.customerservice.dto.response.AddressResponse;
import com.ael.customerservice.dto.response.CheckoutInfoResponse;
import com.ael.customerservice.dto.response.CreditCardResponse;
import com.ael.customerservice.dto.response.CustomerProfileResponse;
import com.ael.customerservice.dto.response.CustomerResponse;
import com.ael.customerservice.model.Customer;
import com.ael.customerservice.service.CustomerService;
import com.ael.customerservice.service.ICustomerCreditCardService;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    ICustomerCreditCardService customerCreditCardService;
    IBasketClient basketClient;


    @PostMapping("/createCustomer")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @GetMapping("/getCustomer/{customerId}")
    public ResponseEntity<Customer> getCustomer(@PathVariable("customerId") Integer customerId) {
        return ResponseEntity.ok(customerService.findCustomerById(customerId));
    }

    @PostMapping("/authenticateCustomer")
    public ResponseEntity<CustomerResponse> authenticateCustomer(@RequestParam String username, @RequestParam String password) {
        return ResponseEntity.ok(customerService.findCustomerByUserNameAndPassword(username, password));
    }

    @GetMapping("/customerCreditCards/{customerId}")
    public ResponseEntity<List<CreditCardResponse>> getCustomerCreditCards(@PathVariable Integer customerId) {
        return ResponseEntity.ok(customerCreditCardService.getAllCreditCardsByCustomerId(customerId));
    }

    @GetMapping("/getCustomerAddress")
    public ResponseEntity<List<AddressResponse>> getCustomerAddress(@RequestHeader("X-Customer-Id") Integer customerId) {
        try {
            List<AddressResponse> addresses = customerService.getCustomerAddress(customerId);
            return ResponseEntity.ok(addresses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getCustomerInfoForCheckOut/{customerId}")
    public ResponseEntity<CheckoutInfoResponse> getCustomerInfoForCheckOut(@PathVariable Integer customerId) {
        return ResponseEntity.ok(customerService.getCustomerInfoForCheckout(customerId));
    }


    @GetMapping("/getCustomerProfile")
    public ResponseEntity<CustomerProfileResponse> getCustomerProfile(@RequestHeader("X-Customer-Id") Integer customerId) {
        try {
            CustomerProfileResponse profile = customerService.getCustomerProfile(customerId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== ADRES ENDPOINT'LERİ ==========

    @PostMapping("/addAddress")
    public ResponseEntity<AddressResponse> addCustomerAddress(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @RequestBody AddressRequest addressRequest) {
        try {
            AddressResponse address = customerService.addCustomerAddress(customerId, addressRequest);
            return ResponseEntity.ok(address);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/updateAddress/{addressId}")
    public ResponseEntity<AddressResponse> updateCustomerAddress(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @PathVariable Integer addressId,
            @RequestBody AddressRequest addressRequest) {
        try {
            AddressResponse address = customerService.updateCustomerAddress(customerId, addressId, addressRequest);
            return ResponseEntity.ok(address);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/deleteAddress/{addressId}")
    public ResponseEntity<String> deleteCustomerAddress(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @PathVariable Integer addressId) {
        try {
            customerService.deleteCustomerAddress(customerId, addressId);
            return ResponseEntity.ok("Adres başarıyla silindi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Adres silinirken hata oluştu: " + e.getMessage());
        }
    }

    @PutMapping("/toggleAddressStatus/{addressId}")
    public ResponseEntity<String> toggleAddressStatus(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @PathVariable Integer addressId) {
        try {
            customerService.toggleAddressStatus(customerId, addressId);
            return ResponseEntity.ok("Adres durumu başarıyla değiştirildi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Adres durumu değiştirilirken hata oluştu: " + e.getMessage());
        }
    }
    
    @PutMapping("/setAddressAsInUse/{addressId}")
    public ResponseEntity<String> setAddressAsInUse(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @PathVariable Integer addressId) {
        try {
            customerService.setAddressAsInUse(customerId, addressId);
            return ResponseEntity.ok("Adres aktif adres olarak ayarlandı");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Adres aktif adres olarak ayarlanırken hata oluştu: " + e.getMessage());
        }
    }

    @PutMapping("/updatePhone")
    public ResponseEntity<String> updateCustomerPhone(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @RequestBody PhoneUpdateRequest phoneUpdateRequest) {
        try {
            customerService.updateCustomerPhone(customerId, phoneUpdateRequest.getPhoneNumber());
            return ResponseEntity.ok("Telefon numarası başarıyla güncellendi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Telefon numarası güncellenirken hata oluştu: " + e.getMessage());
        }
    }

    @PutMapping("/updateEmail")
    public ResponseEntity<String> updateCustomerEmail(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @RequestBody EmailUpdateRequest emailUpdateRequest) {
        try {
            customerService.updateCustomerEmail(customerId, emailUpdateRequest.getEmail());
            return ResponseEntity.ok("E-posta adresi başarıyla güncellendi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("E-posta adresi güncellenirken hata oluştu: " + e.getMessage());
        }
    }
    
    @PutMapping("/updatePassword")
    public ResponseEntity<String> updateCustomerPassword(
            @RequestHeader("X-Customer-Id") Integer customerId,
            @RequestBody PasswordUpdateRequest passwordUpdateRequest) {
        try {
            customerService.updateCustomerPassword(customerId, passwordUpdateRequest.getCurrentPassword(), passwordUpdateRequest.getNewPassword());
            return ResponseEntity.ok("Şifre başarıyla güncellendi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Şifre güncellenirken hata oluştu: " + e.getMessage());
        }
    }
    
    // ========== SİPARİŞ ENDPOINT'LERİ ==========
    
    @GetMapping("/orders")
    public ResponseEntity<?> getCustomerOrders(@RequestHeader("X-Customer-Id") Integer customerId) {
        return customerService.getCustomerOrders(customerId);
    }
    
    @GetMapping("/orders/withDetails")
    public ResponseEntity<?> getCustomerOrdersWithDetails(@RequestHeader("X-Customer-Id") Integer customerId) {
        return customerService.getCustomerOrdersWithDetails(customerId);
    }
    
    @GetMapping("/orders/{orderId}/details")
    public ResponseEntity<?> getOrderDetails(@RequestHeader("X-Customer-Id") Integer customerId, @PathVariable Integer orderId) {
        return customerService.getOrderDetails(customerId, orderId);
    }
}
