package com.ael.customerservice.repository;

import com.ael.customerservice.dto.response.AddressResponse;
import com.ael.customerservice.model.CustomerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICustomerAddressRepository extends JpaRepository<CustomerAddress, Integer> {

    // Aktif ve silinmemiş adresleri getir
    List<CustomerAddress> findAddressByCustomer_CustomerIdAndIsDeletedFalseAndIsActiveTrue(Integer customerId);
    
    // Tüm adresleri getir (soft delete dahil)
    List<CustomerAddress> findAddressByCustomer_CustomerId(Integer customerId);
    
    // Soft delete için adres bul
    Optional<CustomerAddress> findByIdAndIsDeletedFalse(Integer addressId);
    
    // Soft delete işlemi
    @Modifying
    @Transactional
    @Query("UPDATE CustomerAddress ca SET ca.isDeleted = true WHERE ca.id = :addressId AND ca.customer.customerId = :customerId")
    int softDeleteAddress(@Param("addressId") Integer addressId, @Param("customerId") Integer customerId);
    
    // Aktif/pasif durumu değiştir
    @Modifying
    @Transactional
    @Query("UPDATE CustomerAddress ca SET ca.isActive = :isActive WHERE ca.id = :addressId AND ca.customer.customerId = :customerId")
    void updateAddressStatus(@Param("addressId") Integer addressId, @Param("customerId") Integer customerId, @Param("isActive") Boolean isActive);
    
    // inUse durumunu değiştir
    @Modifying
    @Transactional
    @Query("UPDATE CustomerAddress ca SET ca.inUse = :inUse WHERE ca.id = :addressId AND ca.customer.customerId = :customerId")
    void updateAddressInUseStatus(@Param("addressId") Integer addressId, @Param("customerId") Integer customerId, @Param("inUse") Boolean inUse);
    
    // Diğer adreslerin inUse durumunu false yap (sadece bir adres aktif olabilir)
    @Modifying
    @Transactional
    @Query("UPDATE CustomerAddress ca SET ca.inUse = false WHERE ca.customer.customerId = :customerId AND ca.id != :addressId AND ca.isDeleted = false")
    void setOtherAddressesInactive(@Param("customerId") Integer customerId, @Param("addressId") Integer addressId);
}
