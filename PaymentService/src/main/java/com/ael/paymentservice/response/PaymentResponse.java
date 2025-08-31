package com.ael.paymentservice.response;

import com.ael.paymentservice.model.SeedDonation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PaymentResponse {
    private String paymentStatus;
    private String conversationId;
    private String authCode;
    private String hostReference;
    private String responseCode;
    private String responseMessage;
    private String couponCode;
}
