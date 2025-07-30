package com.ael.customerservice.service;

import com.ael.customerservice.client.IBasketClient;
import com.ael.customerservice.dto.response.AddressResponse;
import com.ael.customerservice.dto.response.CheckoutInfoResponse;
import com.ael.customerservice.dto.response.CustomerResponse;
import com.ael.customerservice.exception.CustomerAlreadyExistsException;
import com.ael.customerservice.exception.CustomerNotFoundException;
import com.ael.customerservice.exception.WrongUserNameOrPasswordException;
import com.ael.customerservice.model.Customer;
import com.ael.customerservice.model.CustomerAddress;
import com.ael.customerservice.repository.ICustomerAddressRepository;
import com.ael.customerservice.repository.ICustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTests {

    @Mock
    private ICustomerRepository customerRepository;

    @Mock
    private ICustomerAddressRepository customerAddressRepository;

    @Mock
    private CustomerCreditCardService customerCreditCardService;

    @Mock
    private IBasketClient basketClient;

    @InjectMocks
    private CustomerService customerService;

    private Customer testCustomer;
    private CustomerAddress testAddress;

    @BeforeEach
    void setUp() {
        testCustomer = Customer.builder()
                .customerId(1)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .username("johndoe")
                .password("password123")
                .phoneNumber("1234567890")
                .city("New York")
                .address("123 Main St")
                .build();

        testAddress = new CustomerAddress();
        testAddress.setId(1);
        testAddress.setAddress("123 Main St, Apt 4B");
        testAddress.setCustomer(testCustomer);
    }

    @Test
    void createCustomer_ShouldSuccessfullyCreateCustomer() {
        // Arrange
        when(customerRepository.existsByEmailOrUsername(anyString(), anyString()))
                .thenReturn(Optional.of(false));
        when(customerRepository.save(any(Customer.class))).thenReturn(testCustomer);

        // Act
        Customer result = customerService.createCustomer(testCustomer);

        // Assert
        assertNotNull(result);
        assertEquals(testCustomer.getEmail(), result.getEmail());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void createCustomer_ShouldThrowExceptionWhenCustomerExists() {
        // Arrange
        when(customerRepository.existsByEmailOrUsername(anyString(), anyString()))
                .thenReturn(Optional.of(true));

        // Act & Assert
        assertThrows(CustomerAlreadyExistsException.class, () -> {
            customerService.createCustomer(testCustomer);
        });
    }

    @Test
    void findCustomerById_ShouldReturnCustomer() {
        // Arrange
        when(customerRepository.findById(1)).thenReturn(Optional.of(testCustomer));

        // Act
        Customer result = customerService.findCustomerById(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getCustomerId());
    }

    @Test
    void findCustomerById_ShouldThrowExceptionWhenNotFound() {
        // Arrange
        when(customerRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CustomerNotFoundException.class, () -> {
            customerService.findCustomerById(1);
        });
    }

    @Test
    void findCustomerByUserNameAndPassword_ShouldReturnCustomerResponse() {
        // Arrange
        when(customerRepository.findCustomerByUsernameOrEmail("johndoe", null))
                .thenReturn(Optional.of(testCustomer));

        // Act
        CustomerResponse result = customerService.findCustomerByUserNameAndPassword("johndoe", "password123");

        // Assert
        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
    }

    @Test
    void findCustomerByUserNameAndPassword_ShouldThrowExceptionWhenWrongPassword() {
        // Arrange
        when(customerRepository.findCustomerByUsernameOrEmail("johndoe", null))
                .thenReturn(Optional.of(testCustomer));

        // Act & Assert
        assertThrows(WrongUserNameOrPasswordException.class, () -> {
            customerService.findCustomerByUserNameAndPassword("johndoe", "wrongpassword");
        });
    }

    @Test
    void getCustomerAddress_ShouldReturnAddressList() {
        // Arrange
        when(customerAddressRepository.findAddressByCustomer_CustomerId(1))
                .thenReturn(List.of(testAddress));

        // Act
        List<AddressResponse> result = customerService.getCustomerAddress(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("123 Main St, Apt 4B", result.get(0).getAddressContent());
    }

    @Test
    void getCustomerInfoForCheckout_ShouldReturnCheckoutInfo() {
        // Arrange
        when(customerAddressRepository.findAddressByCustomer_CustomerId(1))
                .thenReturn(List.of(testAddress));
        when(customerCreditCardService.getAllCreditCardsByCustomerId(1))
                .thenReturn(List.of());

        // Act
        CheckoutInfoResponse result = customerService.getCustomerInfoForCheckout(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getAddressResponse().size());
        assertTrue(result.getCreditCardResponses().isEmpty());
    }
}