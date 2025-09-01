package com.ael.paymentservice.clients;

import com.ael.paymentservice.clients.ClientModel.Customer;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "CustomerService")
public interface CustomerClient {

    @GetMapping("/customer/getCustomer/{customerId}")
    Customer getCustomer(@PathVariable("customerId") String customerId);

}
