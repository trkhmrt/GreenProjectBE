package com.ael.paymentservice.response;

import com.ael.paymentservice.model.ThreedsFormData;
import com.iyzipay.model.ThreedsInitialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
public class PaymentInitializeResponse {
    private Integer paymentId;
    private String htmlContent;
    private String conversationId;
    private String status;
}
