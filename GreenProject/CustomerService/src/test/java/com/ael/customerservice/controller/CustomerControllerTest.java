package com.ael.customerservice.controller;

import com.ael.customerservice.client.IBasketClient;
import com.ael.customerservice.dto.response.AddressResponse;
import com.ael.customerservice.dto.response.CheckoutInfoResponse;
import com.ael.customerservice.dto.response.CreditCardResponse;
import com.ael.customerservice.dto.response.CustomerResponse;
import com.ael.customerservice.model.Customer;
import com.ael.customerservice.service.CustomerService;
import com.ael.customerservice.service.ICustomerCreditCardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {

    @Mock
    private CustomerService customerService;

    @Mock
    private ICustomerCreditCardService customerCreditCardService;

    @Mock
    private IBasketClient basketClient;

    @InjectMocks
    private CustomerController customerController;

    private Customer testCustomer;
    private CustomerResponse testCustomerResponse;
    private AddressResponse testAddressResponse;
    private CreditCardResponse testCreditCardResponse;

    @BeforeEach
    void setUp() {
        testCustomer = Customer.builder()
                .customerId(1)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .city("New York")
                .address("123 Main St")
                .build();

        testCustomerResponse = CustomerResponse.builder()
                .customerId(1)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .city("New York")
                .address("123 Main St")
                .activeBasketId(100)
                .build();

        testAddressResponse = AddressResponse.builder()
                .AddressId(1)
                .AddressContent("123 Main St, Apt 4B")
                .build();

        testCreditCardResponse = CreditCardResponse.builder()
                .cardNumber("**** **** **** 1234")
                .build();
    }

    @Test
    void createCustomer_ShouldReturnCreatedCustomer() {

        // Arrange
        when(customerService.createCustomer(any(Customer.class))).thenReturn(testCustomer);

        // Act
        ResponseEntity<Customer> response = customerController.createCustomer(testCustomer);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(testCustomer, response.getBody());
    }

    @Test
    void getCustomer_ShouldReturnCustomer() {
        // Arrange
        when(customerService.findCustomerById(1)).thenReturn(testCustomer);

        // Act
        ResponseEntity<Customer> response = customerController.getCustomer(1);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(testCustomer, response.getBody());
    }

    @Test
    void authenticateCustomer_ShouldReturnCustomerResponse() {
        // Arrange
        when(customerService.findCustomerByUserNameAndPassword("johndoe", "password123"))
                .thenReturn(testCustomerResponse);

        // Act
        ResponseEntity<CustomerResponse> response = customerController.authenticateCustomer("johndoe", "password123");

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(testCustomerResponse, response.getBody());
    }

    @Test
    void getCustomerCreditCards_ShouldReturnCreditCardList() {
        // Arrange
        when(customerCreditCardService.getAllCreditCardsByCustomerId(1))
                .thenReturn(Collections.singletonList(testCreditCardResponse));

        // Act
        ResponseEntity<List<CreditCardResponse>> response = customerController.getCustomerCreditCards(1);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals(testCreditCardResponse, response.getBody().get(0));
    }

    @Test
    void getCustomerAddress_ShouldReturnAddressList() {
        // Arrange
        when(customerService.getCustomerAddress(1))
                .thenReturn(Collections.singletonList(testAddressResponse));

        // Act
        ResponseEntity<List<AddressResponse>> response = customerController.getCustomerAddress(1);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals(testAddressResponse, response.getBody().get(0));
    }

    @Test
    void getCustomerInfoForCheckOut_ShouldReturnCheckoutInfo() {
        // Arrange
        CheckoutInfoResponse checkoutInfo = CheckoutInfoResponse.builder()
                .addressResponse(Collections.singletonList(testAddressResponse))
                .creditCardResponses(Collections.singletonList(testCreditCardResponse))
                .build();

        when(customerService.getCustomerInfoForCheckout(1)).thenReturn(checkoutInfo);

        // Act
        ResponseEntity<CheckoutInfoResponse> response = customerController.getCustomerInfoForCheckOut(1);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(checkoutInfo, response.getBody());
    }

    @Test
    void getAllCustomerInfo_ShouldReturnCustomerResponseWithBasketId() {
        // Arrange
        when(customerService.findCustomerById(1)).thenReturn(testCustomer);
        when(basketClient.getActiveBasketId(1)).thenReturn(100);

        // Act
        ResponseEntity<CustomerResponse> response = customerController.getAllCustomerInfo(1);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(100, response.getBody().getActiveBasketId());
    }
}