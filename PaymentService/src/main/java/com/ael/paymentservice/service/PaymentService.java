package com.ael.paymentservice.service;

import com.ael.paymentservice.clients.ClientModel.Customer;
import com.ael.paymentservice.clients.CustomerClient;
import com.ael.paymentservice.config.rabbitmq.model.BasketStatusUpdateEvent;
import com.ael.paymentservice.config.rabbitmq.model.OrderDetail;
import com.ael.paymentservice.config.rabbitmq.producer.PaymentEventPublisher;
import com.ael.paymentservice.model.PaymentInternal;
import com.ael.paymentservice.repository.IPaymentRepository;
import com.ael.paymentservice.clients.BasketClient;
import com.ael.paymentservice.request.BasketItem;
import com.ael.paymentservice.response.PaymentInitializeResponse;
import com.iyzipay.Options;
import com.iyzipay.model.*;
import com.iyzipay.request.CreatePaymentRequest;
import com.iyzipay.request.CreateThreedsPaymentRequest;
import com.iyzipay.request.RetrieveInstallmentInfoRequest;
import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import com.ael.paymentservice.response.BasketProductUnitResponse;
import com.ael.paymentservice.response.ProductUnitResponse;


@Service
@AllArgsConstructor
public class PaymentService {


    private final PaymentEventPublisher publisher;
    private final Options iyzicoOptions;
    private final IPaymentRepository paymentRepository;
    private final PaymentEventPublisher paymentEventPublisher;
    private final BasketClient basketClient;
    private final CustomerClient customerClient;



    public void updateInternalPaymentSatatus(String conversationId) {

        PaymentInternal paymentInternal = paymentRepository.findByConversationId(conversationId).orElseThrow(() -> new NotFoundException("Payment not found"));
        paymentInternal.setPaymentStatus("COMPLETED");
        paymentRepository.save(paymentInternal);
    }

    public PaymentInitializeResponse createThreedsInitialize(CreatePaymentRequest paymentRequest, String customerId) {


        //paymentRequest.setConversationId(generateConversationId(paymentRequest.getBasketId(),customerId));

        Customer customer = customerClient.getCustomer(customerId);

        paymentRequest.getBuyer().setId(customerId);
        paymentRequest.getBuyer().setEmail(customer.getEmail());
        paymentRequest.getBuyer().setIdentityNumber("1234567");
        paymentRequest.getBuyer().setGsmNumber(customer.getPhoneNumber());
        paymentRequest.getBuyer().setName(customer.getFirstName());
        paymentRequest.getBuyer().setSurname(customer.getLastName());
        paymentRequest.getBuyer().setCity("İstanbul");
        paymentRequest.getBuyer().setCountry("Türkiye");
        paymentRequest.getBuyer().setZipCode("34295");
        paymentRequest.getBuyer().setIp("123.323.23.23");
        paymentRequest.getBuyer().setRegistrationAddress("Gültepe");
        paymentRequest.getBuyer().setRegistrationDate(null);

        paymentRequest.getShippingAddress().setCity("İstanbul");
        paymentRequest.getShippingAddress().setCountry("Türkiye");
        paymentRequest.getShippingAddress().setZipCode("34295");
        paymentRequest.getShippingAddress().setContactName(customer.getFirstName());

        paymentRequest.getBillingAddress().setCity("İstanbul");
        paymentRequest.getBillingAddress().setCountry("Türkiye");
        paymentRequest.getBillingAddress().setZipCode("34295");
        paymentRequest.getBillingAddress().setContactName(customer.getLastName());






        if (StringUtils.isBlank(paymentRequest.getConversationId())) {
            paymentRequest.setConversationId((generateConversationId(paymentRequest.getBasketId(), customerId)));
        }

        ThreedsInitialize threedsInitialize = ThreedsInitialize.create(paymentRequest, iyzicoOptions);

        if(threedsInitialize.getStatus().equals("failure")){
            return PaymentInitializeResponse.builder()
                    .status("failure")
                    .message(threedsInitialize.getErrorMessage())
                    .build();
        }



        PaymentInternal paymentInternal = PaymentInternal.builder()
                .cardNumber(paymentRequest.getPaymentCard().getCardNumber())
                .price(paymentRequest.getPrice())
                .paidPrice(paymentRequest.getPaidPrice())
                .customerId(paymentRequest.getBuyer().getId())
                .basketId(paymentRequest.getBasketId())
                .gsmNumber(paymentRequest.getGsmNumber())
                .paymentStatus("INITIALIZED")
                .conversationId(paymentRequest.getConversationId())
                .build();

        paymentRepository.save(paymentInternal);


        return PaymentInitializeResponse.builder()
                .paymentId(paymentInternal.getPaymentId())
                .conversationId(paymentInternal.getConversationId())
                .htmlContent(threedsInitialize.getHtmlContent())
                .status("success")
                .build();

    }

    public ThreedsPayment createThreedsPayment(CreateThreedsPaymentRequest paymentRequest, String customerId) {

        ThreedsPayment threedsPayment = ThreedsPayment.create(paymentRequest, iyzicoOptions);

        if (threedsPayment.getStatus().equals("success")) {
            System.out.println("=== PAYMENT SUCCESS DEBUG ===");
            System.out.println("BasketId: " + threedsPayment.getBasketId());
            System.out.println("CustomerId: " + customerId);
            System.out.println("PaymentId: " + threedsPayment.getPaymentId());
            System.out.println("=============================");
            
            paymentEventPublisher.sendBasketStatusUpdate(
                    BasketStatusUpdateEvent.builder()
                            .basketId(Integer.valueOf(threedsPayment.getBasketId()))
                            .customerId(Integer.valueOf(customerId))
                            .paymentId(threedsPayment.getPaymentId())
                            .newStatus(4)
                            .build()
            );

            // BasketService'den sepet bilgilerini çek
            try {
                System.out.println("=== FETCHING BASKET DETAILS ===");
                System.out.println("BasketId: " + threedsPayment.getBasketId());
                System.out.println("CustomerId: " + customerId);
                
                BasketProductUnitResponse basketResponse = basketClient.getCustomerBasket(
                        Integer.valueOf(threedsPayment.getBasketId()),
                        Integer.valueOf(customerId),
                        1 // Aktif sepet
                ).getBody();

                List<BasketItem> basketItems = new ArrayList<>();
                
                if (basketResponse != null && basketResponse.getBasketProducts() != null) {
                    System.out.println("Basket products found: " + basketResponse.getBasketProducts().size());
                    for (ProductUnitResponse product : basketResponse.getBasketProducts()) {
                        System.out.println("Product: " + product.getProductId() + ", Quantity: " + product.getProductQuantity());
                        BasketItem basketItem = BasketItem.builder()
                                .productId(product.getProductId().toString())
                                .productName(product.getProductName() != null ? product.getProductName() : "Ürün")
                                .productDescription(product.getProductDescription() != null ? product.getProductDescription() : "Ürün açıklaması")
                                .productPrice(product.getProductPrice() != null ? product.getProductPrice().toString() : "0.0")
                                .productQuantity(product.getProductQuantity() != null ? product.getProductQuantity().toString() : "1")
                                .build();
                        basketItems.add(basketItem);
                        System.out.println("Created BasketItem - ProductId: " + basketItem.getProductId() + ", Quantity: " + basketItem.getProductQuantity());
                    }
                } else {
                    System.out.println("No basket products found or basket response is null");
                    // BasketService'den veri gelmezse fallback kullan
                    throw new RuntimeException("Basket response is null or empty");
                }

                System.out.println("=== SENDING ORDER DETAILS ===");
                System.out.println("Total basket items to send: " + basketItems.size());
                for (BasketItem item : basketItems) {
                    System.out.println("Sending item - ProductId: " + item.getProductId() + ", Quantity: " + item.getProductQuantity());
                }
                
                paymentEventPublisher.sendOrderDetails(
                        OrderDetail.builder()
                                .basketId(Integer.valueOf(threedsPayment.getBasketId()))
                                .orderAddress("ADRES YOK")
                                .customerId(Integer.valueOf(customerId))
                                .paymentId(threedsPayment.getPaymentId())
                                .basketItems(basketItems)
                                .build());
                System.out.println("Order details sent successfully");

            } catch (Exception e) {
                System.err.println("Error fetching basket details: " + e.getMessage());
                e.printStackTrace();
                // Fallback: Sadece productId ile basit basket item oluştur
                List<BasketItem> fallbackItems = new ArrayList<>();
                for (com.iyzipay.model.PaymentItem paymentItem : threedsPayment.getPaymentItems()) {
                    BasketItem fallbackItem = BasketItem.builder()
                            .productId(paymentItem.getItemId())
                            .productName("Ürün")
                            .productDescription("Ürün açıklaması")
                            .productPrice("0.0")
                            .productQuantity("1") // Varsayılan quantity
                            .build();
                    fallbackItems.add(fallbackItem);
                    System.out.println("Fallback item created - ProductId: " + fallbackItem.getProductId() + ", Quantity: " + fallbackItem.getProductQuantity());
                }
                
                paymentEventPublisher.sendOrderDetails(
                        OrderDetail.builder()
                                .basketId(Integer.valueOf(threedsPayment.getBasketId()))
                                .orderAddress("ADRES YOK")
                                .customerId(Integer.valueOf(customerId))
                                .paymentId(threedsPayment.getPaymentId())
                                .basketItems(fallbackItems)
                                .build());
                System.out.println("Fallback order details sent successfully");
            }
        }

        return threedsPayment;
    }

    public InstallmentInfo installment(RetrieveInstallmentInfoRequest retrieveInstallmentInfoRequest) {

        Options options = new Options();
        options.setApiKey("sandbox-kaRR3Llj55mtPTPgxRgjRO9EG3fmPijW");
        options.setSecretKey("sandbox-8mrerFZWc60bveHsnJxxEOKe0GGfBMRQ");
        options.setBaseUrl("https://sandbox-api.iyzipay.com");


        InstallmentInfo info = InstallmentInfo.retrieve(retrieveInstallmentInfoRequest, options);


        List<InstallmentDetail> details = info.getInstallmentDetails();
        for (InstallmentDetail detail : details) {
            System.out.println("Banka: " + detail.getBankName());
            System.out.println("Kart Ailesi: " + detail.getCardFamilyName());
            System.out.println("Taksit Seçenekleri:");
            for (InstallmentPrice price : detail.getInstallmentPrices()) {
                System.out.println(
                        price.getInstallmentNumber() + " taksit: " +
                                price.getInstallmentPrice() + " x " +
                                price.getInstallmentNumber() + " = " +
                                price.getTotalPrice()
                );
            }

        }
        return info;
    }

    public String generateConversationId(String customerId, String basketId) {


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        String fullTime = LocalDateTime.now().format(formatter);

        String conversationId = customerId + basketId + fullTime;

        return conversationId;
    }
}
