package com.ael.customerservice.dataLoader;

import com.ael.customerservice.model.Customer;
import com.ael.customerservice.repository.ICustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CustomerDataLoader implements CommandLineRunner {

    private final ICustomerRepository customerRepository;

    public CustomerDataLoader(ICustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (customerRepository.count() == 0) {
            Customer customer = Customer.builder()
                    .firstName("Tarık")
                    .lastName("Hamarat")
                    .email("tarik.hamarat@example.com")
                    .phoneNumber("+905551112233")
                    .address("Örnek Mah. No:123")
                    .city("İstanbul")
                    .userName("tarikhamarat")
                    .password("güçlüŞifre123")
                    .build();

            customerRepository.save(customer);
            System.out.println("Seed customer created!");
        }
    }
}
