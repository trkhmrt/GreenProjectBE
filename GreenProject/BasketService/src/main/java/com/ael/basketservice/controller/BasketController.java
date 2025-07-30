package com.ael.basketservice.controller;

import com.ael.basketservice.configuration.rabbit.publisher.BasketProducer;
import com.ael.basketservice.dto.response.BasketProductUnitResponse;
import com.ael.basketservice.model.BasketStatus;
import com.ael.basketservice.service.BasketProductUnitService;
import com.ael.basketservice.service.BasketService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/basket")
@AllArgsConstructor
public class BasketController {

    private static final Logger log = LoggerFactory.getLogger(BasketController.class);

    BasketService basketService;
    BasketProducer basketProducer;
    BasketProductUnitService basketProductUnitService;




    @GetMapping("/addProductToCustomerBasket/{productId}")
    public ResponseEntity<String> addProductToCustomerBasket(@RequestHeader("X-Customer-Id") Integer customerId,@PathVariable Integer productId) {
        log.info("Adding product {} to customer {} active basket", productId, customerId);
        try {
            basketService.addProductToCustomerBasket(customerId, productId);
            return ResponseEntity.ok("Product successfully added to customer " + customerId + " active basket");
        } catch (Exception e) {
            log.error("Error adding product to customer basket: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/removeProductFromBasket/{basketProductUnitId}")
    public String removeProductFromBasket(@PathVariable Integer basketProductUnitId){
        basketService.removeProductFromBasket(basketProductUnitId);
        return "success";
    }


    @GetMapping("/getBasketStatus/{basketId}")
    public ResponseEntity<BasketStatus> getBasketStatus(@PathVariable Integer basketId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(basketService.getBasketStatus(basketId));
    }

    @PutMapping("/incrementProductQuantity/{basketProductUnitId}")
    public ResponseEntity<String> incrementProductQuantity(@PathVariable Integer basketProductUnitId)
    {
        basketProductUnitService.incrementProductQuantity(basketProductUnitId);
        return ResponseEntity.ok("Success");
    }

    @PutMapping("/decrementProductQuantity/{basketProductUnitId}")
    public ResponseEntity<String> decrementProductQuantity(@PathVariable Integer basketProductUnitId)
    {
        basketProductUnitService.decrementProductQuantity(basketProductUnitId);
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/getCustomerbasket")
    public ResponseEntity<BasketProductUnitResponse> getCustomerbasket(
            @RequestParam(required = false) Integer basketId,
            @RequestHeader("X-Customer-Id") Integer customerId,
            @RequestParam(required = false) Integer statusId) {

        log.info(customerId.toString());
        return ResponseEntity.ok(
                basketService.getBasketDetailsByCriteria(basketId, customerId, statusId)
        );
    }
}
