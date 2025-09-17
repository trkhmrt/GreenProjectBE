package com.ael.paymentservice.request;


import com.iyzipay.request.CreatePaymentRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
  private CreatePaymentRequest createPaymentRequest;

}
