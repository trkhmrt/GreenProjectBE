package com.ael.paymentservice.service;

import com.ael.paymentservice.clients.CustomerClient;
import com.ael.paymentservice.config.rabbitmq.model.BasketStatusUpdateEvent;
import com.ael.paymentservice.config.rabbitmq.model.OrderDetail;
import com.ael.paymentservice.config.rabbitmq.model.OrderProductUnit;
import com.ael.paymentservice.config.rabbitmq.producer.PaymentEventPublisher;
import com.ael.paymentservice.enums.PaymentStatus;
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
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

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
        paymentInternal.setPaymentStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(paymentInternal);
    }

    public PaymentInitializeResponse createThreedsInitialize(CreatePaymentRequest paymentRequest, String customerId) {


        paymentRequest.getBuyer().setId(customerId);
        paymentRequest.setCallbackUrl(String.format("http://localhost:8072/ael/paymentservice/payment/3ds/callback?customerId=%s&basketId=%s", customerId, paymentRequest.getBasketId()));
        //paymentRequest.setConversationId(generateConversationId(paymentRequest.getBasketId(),customerId));


        if (StringUtils.isBlank(paymentRequest.getConversationId())) {
            paymentRequest.setConversationId((generateConversationId(paymentRequest.getBasketId(), customerId)));
        }

        ThreedsInitialize threedsInitialize = ThreedsInitialize.create(paymentRequest, iyzicoOptions);

        if (threedsInitialize.getStatus().equals("failure")) {
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
                .paymentStatus(PaymentStatus.PENDING)
                .conversationId(paymentRequest.getConversationId())
                .build();

        paymentRepository.save(paymentInternal);


        paymentEventPublisher.sendOrderDetails(
                OrderDetail.builder()
                        .paymentId(String.valueOf(paymentInternal.getPaymentId()))
                        .customerId(paymentRequest.getBuyer().getId())
                        .orderAddress(paymentRequest.getShippingAddress().getAddress())
                        .orderCity(paymentRequest.getShippingAddress().getCity())
                        .basketItems(paymentRequest.getBasketItems().stream().map(bi->
                                        OrderProductUnit.builder()
                                                .id(bi.getId())
                                                .name(bi.getName())
                                                .category1(bi.getCategory1())
                                                .category2(bi.getCategory2())
                                                .price(bi.getPrice())
                                                .itemType(bi.getItemType())
                                                .build()
                                ).collect(Collectors.toList())
                        )
                        .build());




        return PaymentInitializeResponse.builder()
                .paymentId(paymentInternal.getPaymentId())
                .conversationId(paymentInternal.getConversationId())
                .htmlContent(threedsInitialize.getHtmlContent())
                .status("success")
                .build();

    }

    public ThreedsPayment createThreedsPayment(CreateThreedsPaymentRequest paymentRequest, String customerId, String basketId) {

        ThreedsPayment threedsPayment = ThreedsPayment.create(paymentRequest, iyzicoOptions);

        if (threedsPayment.getStatus().equals("success")) {


            paymentEventPublisher.sendBasketStatusUpdate(
                    BasketStatusUpdateEvent.builder()
                            .basketId(Integer.valueOf(basketId))
                            .customerId(Integer.valueOf(customerId))
                            .paymentId(threedsPayment.getPaymentId())
                            .newStatus(4)
                            .build()
            );


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
