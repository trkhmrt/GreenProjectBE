package com.ael.basketservice.controller;

import com.ael.basketservice.model.Basket;
import com.ael.basketservice.configuration.rabbit.publisher.BasketProducer;
import com.ael.basketservice.service.BasketProductUnitService;
import com.ael.basketservice.service.BasketService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BasketController.class)
class BasketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BasketService basketService;
    @MockBean
    private BasketProducer basketProducer;
    @MockBean
    private BasketProductUnitService basketProductUnitService;

    @Test
    @DisplayName("addProductToBasket endpoint returns 200")
    void addProductToBasket_ReturnsOk() throws Exception {
        Mockito.doNothing().when(basketService).addProductToBasket(anyInt(), anyInt());
        mockMvc.perform(MockMvcRequestBuilders.get("/basket/addProductToBasket/1/2"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("getActiveBasket endpoint returns 200")
    void getActiveBasket_ReturnsOk() throws Exception {
        Mockito.when(basketService.getActiveBasket(anyInt())).thenReturn(new Basket());
        mockMvc.perform(MockMvcRequestBuilders.get("/basket/getActiveBasket/1"))
                .andExpect(status().isOk());
    }



    @Test
    @DisplayName("addProductToCustomerBasket endpoint returns 400 on exception")
    void addProductToCustomerBasket_Exception_Returns400() throws Exception {
        Mockito.doThrow(new RuntimeException("Error")).when(basketService).addProductToCustomerBasket(anyInt(), anyInt());
        mockMvc.perform(MockMvcRequestBuilders.get("/basket/addProductToCustomerBasket/1/2"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("basketProductListing endpoint returns 200 with empty list on exception")
    void basketProductListing_Exception_ReturnsEmptyList() throws Exception {
        Mockito.when(basketProductUnitService.basketProductListing(anyInt())).thenThrow(new RuntimeException("Error"));
        mockMvc.perform(MockMvcRequestBuilders.get("/basket/basketProductListing/1"))
                .andExpect(status().isOk()); // Returns 200 with empty list
    }

    @Test
    @DisplayName("getActiveBasket endpoint returns 400 on exception")
    void getActiveBasket_Exception_Returns400() throws Exception {
        Mockito.when(basketService.getActiveBasket(anyInt())).thenThrow(new RuntimeException("Error"));
        mockMvc.perform(MockMvcRequestBuilders.get("/basket/getActiveBasket/1"))
                .andExpect(status().isBadRequest());
    }


} 