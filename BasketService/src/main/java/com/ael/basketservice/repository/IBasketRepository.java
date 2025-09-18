package com.ael.basketservice.repository;

import com.ael.basketservice.model.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface IBasketRepository extends JpaRepository<Basket, Integer> {




    Basket findBasketByCustomerId(Integer customerId);
    Basket findBasketByBasketId(Integer basketId);
    Optional<Basket> findByCustomerIdAndBasketStatusId(Integer customerId, Integer basketStatusId);


    @Query("SELECT b FROM Basket b LEFT JOIN FETCH b.products WHERE " +
            "(:basketId IS NULL OR b.basketId = :basketId) AND " +
            "(:customerId IS NULL OR b.customerId = :customerId) AND " +
            "(:statusId IS NULL OR b.basketStatusId = :statusId)")
    List<Basket> findBasketsByCriteria(
            @Param("basketId") Integer basketId,
            @Param("customerId") Integer customerId,
            @Param("statusId") Integer statusId);

}
