package com.ael.productservice.repository;

import com.ael.productservice.model.ProductImageFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IProductImageFileRepository extends JpaRepository<ProductImageFile, Integer> {
}
