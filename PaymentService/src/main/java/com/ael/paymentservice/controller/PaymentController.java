package com.ael.paymentservice.controller;

import com.ael.paymentservice.config.rabbitmq.producer.PaymentEventPublisher;

import com.ael.paymentservice.model.ThreedsFormData;
import com.ael.paymentservice.response.PaymentInitializeResponse;
import com.ael.paymentservice.service.PaymentService;
import com.iyzipay.model.InstallmentInfo;
import com.iyzipay.model.ThreedsPayment;
import com.iyzipay.request.CreatePaymentRequest;
import com.iyzipay.request.CreateThreedsPaymentRequest;
import com.iyzipay.request.RetrieveInstallmentInfoRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


@RestController
@AllArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentEventPublisher publishToOrder;
    PaymentService paymentService;


    @PostMapping("/installment")
    public ResponseEntity<InstallmentInfo> installment(@RequestBody RetrieveInstallmentInfoRequest retrieveInstallmentInfoRequest) {
        InstallmentInfo installmentResponse = paymentService.installment(retrieveInstallmentInfoRequest);
        return ResponseEntity.ok().body(installmentResponse);
    }

    @PostMapping("/3ds/Initialize")
    public ResponseEntity<PaymentInitializeResponse> createThreedsInitialize(@RequestBody CreatePaymentRequest paymentRequest, @RequestHeader("X-Customer-Id") String customerId) {


      PaymentInitializeResponse paymentInitializeResponse = paymentService.createThreedsInitialize(paymentRequest, customerId);

      if(paymentInitializeResponse.getStatus().equals("success")){
          return ResponseEntity.ok().body(paymentInitializeResponse);
      }
      else{
          return ResponseEntity.ok().body(paymentInitializeResponse);
      }
    }

    public ThreedsFormData parseHtmlContent(String htmlContent) {
        Document doc = Jsoup.parse(htmlContent);

        String action = doc.select("form").attr("action");
        Elements inputs = doc.select("input[type=hidden]");

        Map<String, String> fields = new HashMap<>();
        for (Element input : inputs) {
            fields.put(input.attr("name"), input.attr("value"));
        }

        ThreedsFormData formData = new ThreedsFormData();
        formData.setAction(action);
        formData.setFields(fields);

        return formData;
    }

    @PostMapping("/3ds/callback")
    public void handle3dsCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Parametreleri logla
        request.getParameterMap().forEach((k, v) -> System.out.println(k + " = " + Arrays.toString(v)));
        String customerId = request.getParameter("customerId");
        String paymentId = request.getParameter("paymentId");
        String basketId = request.getParameter("basketId");

        String conversationId = request.getParameter("conversationId");
        String status = request.getParameter("status");
        String mdStatus = request.getParameter("mdStatus");


        // Başarılı ise 3DS tamamla isteği at
        if ("success".equals(status) && "1".equals(mdStatus)) {
            // 3DS tamamla (auth) isteği
            CreateThreedsPaymentRequest createThreedsPaymentRequest = new CreateThreedsPaymentRequest();
            createThreedsPaymentRequest.setPaymentId(paymentId);
            ThreedsPayment threedsPayment = paymentService.createThreedsPayment(createThreedsPaymentRequest,customerId,basketId);
            if ("success".equals(threedsPayment.getStatus())) {
                // Ödeme kesin olarak başarılı!
                 paymentService.updateInternalPaymentSatatus(conversationId);
                response.sendRedirect(String.format("http://3.126.72.60:5173/PaymentResult?status=success&paymentId=%s", paymentId));

                /*ÖDEME BAŞARILI OLDUĞUNDA ORDER KUYRUĞUNA BIRAKILACAK*/
               /* publishToOrder.sendOrderDetails(
                        OrderDetail.builder().orderAddress(createThreedsPaymentRequest)
                );*/
            } else {
                // Limit yetersiz veya başka bir hata
                response.sendRedirect(String.format(
                        "http://3.126.72.60:5173/PaymentResult?status=failure&paymentId=%s",
                        paymentId
                ));
            }
            System.out.println(threedsPayment);
            // Kullanıcıya başarılı sayfa göster
        } else {
            // Kullanıcıya hata sayfası göster
            response.sendRedirect(String.format("http://3.126.72.60:5173/PaymentResult?status=failure&paymentId=%s", paymentId));
        }
    }


}
