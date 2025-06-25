package com.ael.paymentservice.service;

import com.ael.paymentservice.config.rabbitmq.model.BasketStatusUpdateEvent;
import com.ael.paymentservice.config.rabbitmq.model.OrderDetail;
import com.ael.paymentservice.config.rabbitmq.producer.PaymentEventPublisher;
import com.ael.paymentservice.dto.request.PaymentRequest;
import com.ael.paymentservice.dto.response.PaymentResponse;
import com.ael.paymentservice.model.Payment;
import com.ael.paymentservice.repository.IPaymentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class PaymentService implements IPaymentService {

    private final PaymentEventPublisher publisher;
    IPaymentRepository paymentRepository;


    @Override
    public PaymentResponse createPayment(PaymentRequest paymentRequest) {

        Payment newpPayment = Payment.builder()
                .amount(paymentRequest.getCheckOutRequest()
                        .getAmount()).customerId(paymentRequest.getCustomerId())
                .cardNumber(paymentRequest.getCheckOutRequest().getCardNumber())
                .basketId(paymentRequest.getBasketId()).build();


        paymentRepository.save(newpPayment);


        OrderDetail orderDetail = OrderDetail.builder()
                .orderAddress(paymentRequest.getAddress())
                .basketItems(paymentRequest.getBasketItems())
                .basketId(paymentRequest.getBasketId())
                .customerId(paymentRequest.getCustomerId())
                .build();


        publisher.sendOrderDetails(orderDetail);


        BasketStatusUpdateEvent basketStatusUpdateEvent = BasketStatusUpdateEvent.builder()
                .basketId(paymentRequest.getBasketId())
                .customerId(paymentRequest.getCustomerId())
                .newStatus(4) // Ödendi
                .paymentId(newpPayment.getPaymentId().toString())
                .message("Payment completed successfully")
                .build();

        publisher.sendBasketStatusUpdate(basketStatusUpdateEvent);

        return PaymentResponse.builder()
                .responseCode("00")
                .responseMessage("Success")
                .build();
    }


}
