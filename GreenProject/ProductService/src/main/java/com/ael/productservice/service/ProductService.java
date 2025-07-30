package com.ael.productservice.service;

import com.ael.productservice.model.*;
import com.ael.productservice.model.ProductPropertyValue;
import com.ael.productservice.repository.*;
import com.ael.productservice.request.ProductRequest;
import com.ael.productservice.request.ProductUpdateRequest;
import com.ael.productservice.response.*;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class ProductService {

    private final IProductRepository productRepository;
    private final IProductImageFileRepository productImageFileRepository;
    private final ISubCategoryRepository subCategoryRepository;
    private final IPropertyRepository propertyRepository;
    private final IProductPropertyValueRepository productPropertyValueRepository;
    private final S3Service s3Service;



    public ProductCreateResponse createProduct(ProductRequest productRequest) {
        try {
            SubCategory subCategory = subCategoryRepository.findById(productRequest.getSubCategoryId())
                    .orElseThrow(() -> new RuntimeException("SubCategory not found"));

            // Önce ürünü oluştur
            Product newProduct = Product.builder()
                    .productDescription(productRequest.getProductDescription())
                    .productName(productRequest.getProductName())
                    .productPrice(productRequest.getProductPrice())
                    .productQuantity(productRequest.getProductQuantity())
                    .subcategory(subCategory)
                     // Boş image listesi ile başlat
                    .build();

            Product savedProduct = productRepository.save(newProduct);
            Integer productId = savedProduct.getProductId();

            // Fotoğraflar varsa yükle
            List<String> uploadedImageUrls = new ArrayList<>();
            if (productRequest.getImages() != null && !productRequest.getImages().isEmpty()) {
                uploadedImageUrls = s3Service.uploadMultipleProductImagesToEuCentral(productRequest.getImages(), productId);

                // Ürün model'ine fotoğraf URL'lerini ekle
                for (String imageUrl : uploadedImageUrls) {
                    ProductImageFile imageFile = ProductImageFile.builder()
                            .product(savedProduct)
                            .path(imageUrl)
                            .isActive(true)
                            .isDeleted(false)
                            .build();

                    productImageFileRepository.save(imageFile);
                }
            }

            return ProductCreateResponse.builder()
                    .message("Product created successfully with " + uploadedImageUrls.size() + " images")
                    .productId(productId)
                    .imageUrls(uploadedImageUrls)
                    .build();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ProductCreateResponse.builder()
                    .message("Error creating product: " + e.getMessage())
                    .build();
        }
    }

    @Cacheable("products")
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProductsWithImages() {
        log.info("�� Tüm ürünler çekiliyor");

        // Ana ürün bilgileri
        List<Product> products = productRepository.findAllWithCategory();

        log.info("✅ {} ürün çekildi", products.size());

        return products.stream()
                .map(this::buildProductResponseWithDetails)
                .collect(Collectors.toList());
    }

    private ProductResponse buildProductResponseWithDetails(Product product) {
        log.info("�� Ürün detayları çekiliyor: {}", product.getProductName());

        // Resimleri çek
        Product productWithImages = productRepository.findByIdWithImages(product.getProductId())
                .orElse(product);

        // Özellikleri çek
        Product productWithProperties = productRepository.findByIdWithProperties(product.getProductId())
                .orElse(product);

        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productModel(product.getProductModel())
                .productModelYear(product.getProductModelYear())
                .productDescription(product.getProductDescription())
                .productPrice(product.getProductPrice())
                .productQuantity(product.getProductQuantity())
                .subCategoryId(product.getSubcategory().getSubCategoryId())
                .subCategoryName(product.getSubcategory().getSubCategoryName())
                .categoryName(product.getSubcategory().getCategory().getCategoryName())
                .productProperties(productWithProperties.getProductPropertyValues() != null ?
                        productWithProperties.getProductPropertyValues().stream()
                                .map(ppv -> ProductPropertyValueResponse.builder()
                                        .id(ppv.getId())
                                        .propertyId(ppv.getProperty().getId())
                                        .propertyName(ppv.getProperty().getName())
                                        .value(ppv.getValue())
                                        .build())
                                .collect(Collectors.toList()) : new ArrayList<>())
                .imageFiles(productWithImages.getImageFiles() != null ?
                        productWithImages.getImageFiles().stream()
                                .map(file -> ImageFileResponse.builder()
                                        .fileId(file.getFileId())
                                        .path(file.getPath())
                                        .build())
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Integer productId) {
        log.info("�� Ürün detayı çekiliyor. ID: {}", productId);

        // Ana ürün bilgileri
        Product product = productRepository.findByIdWithCategory(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Resimleri ayrı çek
        Product productWithImages = productRepository.findByIdWithImages(productId)
                .orElse(product);

        // Özellikleri ayrı çek
        Product productWithProperties = productRepository.findByIdWithProperties(productId)
                .orElse(product);

        // Koleksiyonları birleştir
        product.setImageFiles(productWithImages.getImageFiles());
        product.setProductPropertyValues(productWithProperties.getProductPropertyValues());

        return buildProductResponse(product);
    }

    private ProductResponse buildProductResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productModel(product.getProductModel())
                .productModelYear(product.getProductModelYear())
                .productDescription(product.getProductDescription())
                .productPrice(product.getProductPrice())
                .productQuantity(product.getProductQuantity())
                .subCategoryId(product.getSubcategory().getSubCategoryId())
                .subCategoryName(product.getSubcategory().getSubCategoryName())
                .categoryName(product.getSubcategory().getCategory().getCategoryName())
                .productProperties(product.getProductPropertyValues() != null ?
                        product.getProductPropertyValues().stream()
                                .map(ppv -> ProductPropertyValueResponse.builder()
                                        .id(ppv.getId())
                                        .propertyId(ppv.getProperty().getId())
                                        .propertyName(ppv.getProperty().getName())
                                        .value(ppv.getValue())
                                        .build())
                                .collect(Collectors.toList()) : new ArrayList<>())
                .imageFiles(product.getImageFiles() != null ?
                        product.getImageFiles().stream()
                                .map(file -> ImageFileResponse.builder()
                                        .fileId(file.getFileId())
                                        .path(file.getPath())
                                        .build())
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }




    public String deleteProduct(Integer productId) {
        productRepository.deleteById(productId);
        return String.format("%d Product deleted successfully", productId);
    }


    public ProductUpdateResponse updateProduct(Integer productId, ProductUpdateRequest productUpdateRequest) {
        return null;
    }

    public void addPropertyToProduct(Integer propertyId, Integer productId) {
        Product product = productRepository.findById(productId).orElseThrow(()->new RuntimeException("Product not found"));
        Property property = propertyRepository.findById(propertyId).orElseThrow(()->new RuntimeException("Property id not found"));

        ProductPropertyValue productPropertyValue =  ProductPropertyValue.builder().product(product).property(property).build();
        productPropertyValueRepository.save(productPropertyValue);
    }

}
