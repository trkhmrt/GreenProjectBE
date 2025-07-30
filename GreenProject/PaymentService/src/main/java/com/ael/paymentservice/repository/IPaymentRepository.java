package com.ael.paymentservice.repository;

import com.ael.paymentservice.model.PaymentInternal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPaymentRepository extends JpaRepository<PaymentInternal, Integer> {
    Optional<PaymentInternal> findByConversationId(String conversationId);
}
