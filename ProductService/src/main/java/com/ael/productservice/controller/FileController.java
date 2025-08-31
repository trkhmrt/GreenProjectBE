package com.ael.productservice.controller;

import com.ael.productservice.service.ProductService;
import com.ael.productservice.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final S3Service s3Service;
    private final ProductService productService;

    /**
     * EU-Central-1'e toplu ürün fotoğrafı yükleme
     */
//    @PostMapping("/upload-multiple-product-images-eu-central")
//    public ResponseEntity<List<String>> uploadMultipleProductImagesToEuCentral(
//            @RequestParam("files") List<MultipartFile> files,
//            @RequestParam("productId") Integer productId) throws IOException {
//
//        // Ürünün var olduğunu kontrol et
//        productService.getProductById(productId);
//
//        List<String> imageUrls = s3Service.uploadMultipleProductImagesToEuCentral(files, productId);
//
//        return ResponseEntity.ok(imageUrls);
//    }

    /**
     * EU-Central-1'deki ürün fotoğraflarını listele
     */
    @GetMapping("/product-images-eu-central/{productId}")
    public ResponseEntity<List<String>> getProductImagesFromEuCentral(@PathVariable Integer productId) {
        List<String> imageUrls = s3Service.getProductImagesFromEuCentral(productId);
        return ResponseEntity.ok(imageUrls);
    }
}