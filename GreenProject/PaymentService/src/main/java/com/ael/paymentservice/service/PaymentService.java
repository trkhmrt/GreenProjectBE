package com.ael.paymentservice.service;

import com.ael.paymentservice.config.rabbitmq.model.BasketStatusUpdateEvent;
import com.ael.paymentservice.config.rabbitmq.model.OrderDetail;
import com.ael.paymentservice.config.rabbitmq.producer.PaymentEventPublisher;
import com.ael.paymentservice.model.PaymentInternal;
import com.ael.paymentservice.repository.IPaymentRepository;

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


@Service
@AllArgsConstructor
public class PaymentService {


    private final PaymentEventPublisher publisher;
    private final Options iyzicoOptions;
    IPaymentRepository paymentRepository;
    PaymentEventPublisher paymentEventPublisher;


    public void updateInternalPaymentSatatus(String conversationId) {

        PaymentInternal paymentInternal = paymentRepository.findByConversationId(conversationId).orElseThrow(() -> new NotFoundException("Payment not found"));
        paymentInternal.setPaymentStatus("COMPLETED");
        paymentRepository.save(paymentInternal);
    }

    public PaymentInitializeResponse createThreedsInitialize(CreatePaymentRequest paymentRequest, String customerId) {


        //paymentRequest.setConversationId(generateConversationId(paymentRequest.getBasketId(),customerId));
        //Buyer buyer = paymentRequest.getBuyer();
        //buyer.setId(customerId);

        if (StringUtils.isBlank(paymentRequest.getConversationId())) {
            paymentRequest.setConversationId((generateConversationId(paymentRequest.getBasketId(), customerId)));
        }

        ThreedsInitialize threedsInitialize = ThreedsInitialize.create(paymentRequest, iyzicoOptions);


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
            paymentEventPublisher.sendBasketStatusUpdate(
                    BasketStatusUpdateEvent.builder()
                            .basketId(Integer.valueOf(threedsPayment.getBasketId()))
                            .customerId(Integer.valueOf(customerId))
                            .paymentId(threedsPayment.getPaymentId())
                            .newStatus(4)
                            .build()
            );

            paymentEventPublisher.sendOrderDetails(
                    OrderDetail.builder()
                            .basketId(Integer.valueOf(threedsPayment.getBasketId()))
                            .orderAddress("ADRES YOK")
                            .customerId(Integer.valueOf(customerId))
                            .paymentId(threedsPayment.getPaymentId())
                            .basketItems(threedsPayment.getPaymentItems().stream().map(
                                    paymentItem -> BasketItem.builder().productId(paymentItem.getItemId()).build()).collect(Collectors.toList()
                            )).build());

        }

        return threedsPayment;


//
//
//
//
//
//
//
//        /*DONATION EKLEME */
//
//        OrderDetail orderDetail = OrderDetail.builder()
//                .orderAddress(paymentRequest.getAddress())
//                .basketItems(paymentRequest.getBasketItems())
//                .basketId(paymentRequest.getBasketId())
//                .customerId(paymentRequest.getCustomerId())
//                .build();
//
//
//        publisher.sendOrderDetails(orderDetail);
//
//
//        BasketStatusUpdateEvent basketStatusUpdateEvent = BasketStatusUpdateEvent.builder()
//                .basketId(paymentRequest.getBasketId())
//                .customerId(paymentRequest.getCustomerId())
//                .newStatus(4) // Ödendi
//                .paymentId(newPayment.getPaymentId().toString())
//                .message("PaymentInternal completed successfully")
//                .build();
//
//        publisher.sendBasketStatusUpdate(basketStatusUpdateEvent);
//
//        return PaymentResponse.builder()
//                .responseCode("00")
//                .responseMessage("Success")
//                .couponCode(paymentRequest.getCouponCode())
//                .build();
//    }

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
