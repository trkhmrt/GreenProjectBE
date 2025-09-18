package com.ael.basketservice.service;

import com.ael.basketservice.client.ProductClient;
import com.ael.basketservice.dto.response.BasketProductUnitResponse;
import com.ael.basketservice.dto.response.ProductUnitResponse;
import com.ael.basketservice.enums.BasketStatusEnum;
import com.ael.basketservice.exception.BasketNotFoundException;
import com.ael.basketservice.model.Basket;
import com.ael.basketservice.model.BasketProductUnit;
import com.ael.basketservice.repository.IBasketProductUnitRepository;
import com.ael.basketservice.repository.IBasketRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class BasketService {
    private static final Logger logger = LoggerFactory.getLogger(BasketService.class);
    private final IBasketRepository basketRepository;
    private final IBasketProductUnitRepository basketProductUnitRepository;
    private final ProductClient productClient;


    public Basket createNewBasket(Integer customerId) {


        Basket newBasket = Basket.builder()
                .customerId(customerId)
                .basketStatus(BasketStatusEnum.ACTIVE)
                .build();

        basketRepository.save(newBasket);

        return newBasket;

    }

    @Transactional
    public void addProductToBasket(Integer basketId, Integer productId) {

        Basket basket = basketRepository.findById(basketId).orElseThrow(() -> new BasketNotFoundException("Sepet Bulunamadı"));
        ProductUnitResponse productUnitResponse = productClient.getProductById(productId);
        // Sadece aktif sepetlere ürün eklenebilir
        if (basket.getBasketStatusId().equals(BasketStatusEnum.ACTIVE.getId())) {

            // Yeni method kullan - Optional döndürür
            Optional<BasketProductUnit> existingProductOpt = basketProductUnitRepository
                    .findFirstByBasketIdAndProductIdOrderByIdDesc(basketId, productId);

            if (existingProductOpt.isPresent()) {
                // Ürün zaten sepette varsa miktarını artır
                BasketProductUnit basketProductUnits = existingProductOpt.get();
                basketProductUnits.setProductQuantity(basketProductUnits.getProductQuantity() + 1);
                basketProductUnits.setProductTotalPrice((basketProductUnits.getProductQuantity()) * productUnitResponse.getProductPrice());
                basketProductUnitRepository.save(basketProductUnits);
                logger.info("Product quantity increased in basket {}", basketId);
            } else {
                // Yeni ürün ekle
                BasketProductUnit newBasketProductUnit = BasketProductUnit.builder()
                        .basket(basket)
                        .productUnitPrice(productUnitResponse.getProductPrice())
                        .productId(productUnitResponse.getProductId())
                        .productName(productUnitResponse.getProductName())
                        .productTotalPrice(productUnitResponse.getProductPrice() * 1)
                        .productQuantity(1).build();
                basketProductUnitRepository.save(newBasketProductUnit);
                logger.info("New product added to basket {}", basketId);
            }
        } else {
            logger.warn("Cannot add product to basket {} - basket is not active", basketId);
            throw new RuntimeException("Sepet aktif değil, ürün eklenemez");
        }



    }


    public void addProductToCustomerBasket(Integer customerId, Integer productId) {
        logger.info("Adding product {} to customer {} basket", productId, customerId);

        // Müşterinin aktif sepetini bul veya yeni oluştur
        Basket activeBasket = getActiveBasket(customerId);

        // Ürünü sepete ekle
        addProductToBasket(activeBasket.getBasketId(), productId);

        logger.info("Product {} successfully added to customer {} basket {}",
                productId, customerId, activeBasket.getBasketId());
    }


    public void removeProductFromBasket(Integer basketProductUnitId) {
        basketProductUnitRepository.removeProductByBasketProductUnitId(basketProductUnitId);
    }


    public Basket getActiveBasket(Integer customerId) {
        logger.info("Getting active basket for customer: {}", customerId);

        Optional<Basket> existingBasket = basketRepository.findByCustomerIdAndBasketStatusId(customerId, 1);

        if (existingBasket.isPresent()) {
            logger.info("Found existing active basket: {}", existingBasket.get().getBasketId());
            return existingBasket.get();
        } else {
            logger.info("No active basket found, creating new one for customer: {}", customerId);
            return createNewBasket(customerId);
        }
    }


    public Basket getActiveBasketOrNull(Integer customerId) {
        logger.info("Getting active basket for customer: {} (will return null if not exists)", customerId);

        Optional<Basket> existingBasket = basketRepository.findByCustomerIdAndBasketStatusId(customerId, 1);

        if (existingBasket.isPresent()) {
            logger.info("Found existing active basket: {}", existingBasket.get().getBasketId());
            return existingBasket.get();
        } else {
            logger.info("No active basket found for customer: {}", customerId);
            return null;
        }
    }






    public void updateBasketStatus(Integer basketId, BasketStatusEnum newStatus) {
        Basket basket = basketRepository.findById(basketId)
                .orElseThrow(() -> new BasketNotFoundException("Sepet bulunamadı: " + basketId));


        basket.setBasketStatus(newStatus);

        basketRepository.save(basket);
    }


    public BasketProductUnitResponse getBasketDetailsByCriteria(Integer basketId, Integer customerId, Integer statusId) {

        List<Basket> baskets = basketRepository.findBasketsByCriteria(
                basketId, customerId, statusId == null ? 1 : statusId
        );

        if (baskets.isEmpty()) {
            throw new BasketNotFoundException(
                    "Kriterlere uygun sepet bulunamadı. " +
                            "basketId: " + basketId + ", " +
                            "customerId: " + customerId + ", " +
                            "statusId: " + statusId
            );
        }

        // Sadece ilk sepeti döndür
        return convertToBasketProductUnitResponse(baskets.getFirst());
    }

    private BasketProductUnitResponse convertToBasketProductUnitResponse(Basket basket) {
        List<ProductUnitResponse> productResponses = basket.getProducts().stream()
                .map(this::convertToProductUnitResponse)
                .collect(Collectors.toList());

        return BasketProductUnitResponse.builder()
                .basketId(basket.getBasketId())
                .customerId(basket.getCustomerId())
                .basketProducts(productResponses)
                .build();
    }

    private ProductUnitResponse convertToProductUnitResponse(BasketProductUnit bpu) {
        try {
            ProductUnitResponse productInfo = productClient.getProductById(bpu.getProductId());
            return ProductUnitResponse.builder()
                    .productId(bpu.getProductId())
                    .basketProductUnitId(bpu.getBasketProductUnitId())
                    .productName(bpu.getProductName())
                    .productDescription(productInfo.getProductDescription())
                    .subCategoryId(productInfo.getSubCategoryId())
                    .categoryName(productInfo.getCategoryName())
                    .subCategoryName(productInfo.getSubCategoryName())
                    .productPrice(bpu.getProductUnitPrice())
                    .productQuantity(bpu.getProductQuantity())
                    .productModel(bpu.getProductModel())
                    .productModelYear(bpu.getProductModelYear())
                    .productImageUrl(productInfo.getProductImageUrl())
                    .build();
        } catch (Exception e) {
            logger.error("Error getting product info for product ID: {}", bpu.getProductId(), e);
            return ProductUnitResponse.builder()
                    .productId(bpu.getProductId())
                    .basketProductUnitId(bpu.getBasketProductUnitId())
                    .productName(bpu.getProductName())
                    .productDescription("Product information unavailable")
                    .productPrice(bpu.getProductUnitPrice())
                    .productQuantity(bpu.getProductQuantity())
                    .productModel(bpu.getProductModel())
                    .productModelYear(bpu.getProductModelYear())
                    .build();
        }
    }

}
