package com.ael.productservice.service;

import com.ael.productservice.enums.ProductType;
import com.ael.productservice.model.*;
import com.ael.productservice.model.Property;
import com.ael.productservice.repository.*;
import com.ael.productservice.request.FilterRequest;
import com.ael.productservice.request.MultipleProductRequest;
import com.ael.productservice.request.SimpleProductRequest;
import com.ael.productservice.request.VariantProductRequest;
import com.ael.productservice.response.*;
import com.ael.productservice.dto.ImageUploadMessage;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@Slf4j
public class ProductService {

    private final IProductRepository productRepository;
    private final IProductImageRepository productImageFileRepository;
    private final IProductPropertyRepository productPropertyRepository;
    private final IProductVariantImagesRepository productVariantImagesRepository;
    private final IPropertyRepository propertyRepository;
    private final IProductVariantRepository productVariantRepository;
    private final IProductDetailRepository productDetailRepository;
    private final IVariantPropertyRepository varaintPropertyRepository;

    private final S3Service s3Service;
    private final RabbitMQProducerService rabbitMQProducerService;
    
    @Value("${aws.s3.cloudfront-url}")
    private String cloudfrontUrl;

    public ProductService(IProductRepository productRepository,
                         IProductImageRepository productImageFileRepository,
                         IProductPropertyRepository productPropertyRepository,
                         IProductVariantImagesRepository productVariantImagesRepository,
                         IPropertyRepository propertyRepository,
                         IProductVariantRepository productVariantRepository,
                         IProductDetailRepository productDetailRepository,
                         IVariantPropertyRepository varaintPropertyRepository,
                         S3Service s3Service,
                         RabbitMQProducerService rabbitMQProducerService) {
        this.productRepository = productRepository;
        this.productImageFileRepository = productImageFileRepository;
        this.productPropertyRepository = productPropertyRepository;
        this.productVariantImagesRepository = productVariantImagesRepository;
        this.propertyRepository = propertyRepository;
        this.productVariantRepository = productVariantRepository;
        this.productDetailRepository = productDetailRepository;
        this.varaintPropertyRepository = varaintPropertyRepository;
        this.s3Service = s3Service;
        this.rabbitMQProducerService = rabbitMQProducerService;
    }

    // Varyantsız ürün oluştur
    @Transactional
    public ResponseEntity<ProductCreateResponse> createSimpleProduct(SimpleProductRequest simpleProductRequest) {
        try {

            // Varyantsız ürün oluştur
            Product newProduct = Product.builder()
                    .productDescription(simpleProductRequest.getProductDescription())
                    .productName(simpleProductRequest.getProductName())
                    .productPrice(simpleProductRequest.getProductPrice())
                    .productBrand(simpleProductRequest.getProductBrand())
                    .productQuantity(simpleProductRequest.getProductQuantity())
                    .categoryId(simpleProductRequest.getCategoryId())
                    .productType(ProductType.SIMPLE)
                    .isActive(true)
                    .isDeleted(false)
                    .build();

            Product savedProduct = productRepository.save(newProduct);
            Integer productId = savedProduct.getProductId();

            //ProductDetailslar ekleniyor.
            ProductDetail productDetail = ProductDetail.builder()
                    .productType(simpleProductRequest.getProductType())
                    .stockQuantity(simpleProductRequest.getProductQuantity())
                    .price(simpleProductRequest.getProductPrice())
                    .isActive(true)
                    .isDeleted(false)
                    .sku("")
                    .productId(newProduct.getProductId())
                    .build();

            productDetailRepository.save(productDetail);

            //ProductPropertyler Ekleniyor.
            if (simpleProductRequest.getSimpleProductProperties() != null && !simpleProductRequest.getSimpleProductProperties().isEmpty()) {
                log.info("Adding {} properties to simple product", simpleProductRequest.getSimpleProductProperties().size());
                simpleProductRequest.getSimpleProductProperties()
                        .stream()
                        .map(spp -> ProductProperty.builder()
                                .propertyId(spp.getPropertyId())
                                .productId(newProduct.getProductId())
                                .value(spp.getValue())
                                .detailId(productDetail.getId())
                                .build()).forEach(productPropertyRepository::save);
            } else {
                log.info("No properties provided for simple product");
            }


            // Fotoğraflar varsa önce database'e kaydet, sonra RabbitMQ'ya gönder
            if (simpleProductRequest.getImages() != null && !simpleProductRequest.getImages().isEmpty()) {
                List<ImageUploadMessage.ImageData> imageDataList = new ArrayList<>();
                
                for (int i = 0; i < simpleProductRequest.getImages().size(); i++) {
                    try {
                        var file = simpleProductRequest.getImages().get(i);
                        String imageId = UUID.randomUUID().toString();
                        
                        // Image path oluştur: productId/foto_adi
                        String imagePath = productId + "/" + file.getOriginalFilename();
                        
                        // ProductImage'e kaydet
                        ProductImage productImage = ProductImage.builder()
                                .product(savedProduct)
                                .imagePath(imagePath)
                                .isActive(true)
                                .isDeleted(false)
                                .build();
                        
                        productImageFileRepository.save(productImage);
                        
                        // RabbitMQ için image data hazırla
                        ImageUploadMessage.ImageData imageData = ImageUploadMessage.ImageData.builder()
                                .imageId(imageId)
                                .imageBytes(file.getBytes())
                                .originalFileName(file.getOriginalFilename())
                                .contentType(file.getContentType())
                                .build();
                        
                        imageDataList.add(imageData);
                        
                        log.info("Product image saved to database with path: {}", imagePath);
                    } catch (Exception e) {
                        log.error("Error processing product image: {}", e.getMessage());
                    }
                }
                
                // RabbitMQ'ya gönder
                if (!imageDataList.isEmpty()) {
                    rabbitMQProducerService.sendProductImageUploadMessage(productId, imageDataList);
                }
            }

            return ResponseEntity.ok(ProductCreateResponse.builder()
                    .message("Simple product created successfully")
                    .productId(productId)
                    .productType(ProductType.SIMPLE)
                    .build());

        } catch (Exception e) {
            log.error("Error creating simple product: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ProductCreateResponse.builder()
                    .message("Error creating simple product: " + e.getMessage())
                    .build());
        }
    }

    @Transactional
    public ResponseEntity<ProductCreateResponse> createMultipleProduct(MultipleProductRequest multipleProductRequest) {
        try {


            Product newProduct = Product.builder()
                    .productDescription(multipleProductRequest.getProductDescription())
                    .productName(multipleProductRequest.getProductName())
                    .productBrand(multipleProductRequest.getProductBrand())
                    .productType(ProductType.VARIANT)
                    .categoryId(multipleProductRequest.getCategoryId())
                    .isActive(true)
                    .isDeleted(false)
                    .build();

            Product savedProduct = productRepository.save(newProduct);

            // Varyantları oluştur
            List<ProductVariant> savedVariants = new ArrayList<>();

            for (VariantProductRequest variantRequest : multipleProductRequest.getProductVariants()) {
                // Varyant oluştur
                ProductVariant variant = ProductVariant.builder()
                        .productId(savedProduct.getProductId())
                        .sku(variantRequest.getSKU())
                        .variantPrice(variantRequest.getVariantPrice())
                        .variantQuantity(variantRequest.getStockQuantity())
                        .isActive(true)
                        .isDeleted(false)
                        .build();

                ProductVariant savedVariant = productVariantRepository.save(variant);
                savedVariants.add(savedVariant);

                // Varyant property'lerini kaydet
                if (variantRequest.getVariantProperties() != null && !variantRequest.getVariantProperties().isEmpty()) {
                    List<VariantProperty> variantProperties = variantRequest.getVariantProperties()
                            .stream()
                            .map(cp -> VariantProperty.builder()
                                    .productId(savedProduct.getProductId())
                                    .variantId(variant.getVariantId())
                                    .propertyId(cp.getPropertyId())
                                    .variantPropertyValue(cp.getValue())
                                    .isActive(true)
                                    .isDeleted(false)
                                    .build())
                            .collect(toList());

                    varaintPropertyRepository.saveAll(variantProperties);
                }

                // Variant image'ları varsa önce database'e kaydet, sonra RabbitMQ'ya gönder
                if (variantRequest.getVariantImages() != null && !variantRequest.getVariantImages().isEmpty()) {
                    List<ImageUploadMessage.ImageData> variantImageDataList = new ArrayList<>();
                    
                    for (int i = 0; i < variantRequest.getVariantImages().size(); i++) {
                        try {
                            var file = variantRequest.getVariantImages().get(i);
                            String imageId = UUID.randomUUID().toString();
                            
                            // Image path oluştur: productId/variantId/foto_adi
                            String imagePath = savedProduct.getProductId() + "/" + savedVariant.getVariantId() + "/" + file.getOriginalFilename();
                            
                            // ProductVariantImages'e kaydet
                            ProductVariantImages variantImage = ProductVariantImages.builder()
                                    .productId(savedProduct.getProductId())
                                    .variantId(savedVariant.getVariantId())
                                    .imagePath(imagePath)
                                    .isActive(true)
                                    .isDeleted(false)
                                    .build();
                            
                            productVariantImagesRepository.save(variantImage);
                            
                            // RabbitMQ için image data hazırla
                            ImageUploadMessage.ImageData imageData = ImageUploadMessage.ImageData.builder()
                                    .imageId(imageId)
                                    .imageBytes(file.getBytes())
                                    .originalFileName(file.getOriginalFilename())
                                    .contentType(file.getContentType())
                                    .build();
                            
                            variantImageDataList.add(imageData);
                            
                            log.info("Variant image saved to database with path: {}", imagePath);
                        } catch (Exception e) {
                            log.error("Error processing variant image: {}", e.getMessage());
                        }
                    }
                    
                    // RabbitMQ'ya gönder
                    if (!variantImageDataList.isEmpty()) {
                        rabbitMQProducerService.sendVariantImageUploadMessage(
                                savedProduct.getProductId(), 
                                savedVariant.getVariantId(), 
                                variantImageDataList
                        );
                    }
                }
            }

            return ResponseEntity.ok(ProductCreateResponse.builder()
                    .message("Product created successfully with " + savedVariants.size() + " variants")
                    .productId(savedProduct.getProductId())
                    .productType(ProductType.VARIANT)
                    .productQuantity(savedVariants.size())
                    .build());

        } catch (Exception e) {
            log.error("Error creating product with variants: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ProductCreateResponse.builder()
                    .message("Error creating product with variants: " + e.getMessage())
                    .build());
        }
    }

    public List<ProductResponseSimple> getAllProductsSimple() {
        return productRepository.findAll()
                .stream()
                .map(product -> ProductResponseSimple.builder()
                        .productId(product.getProductId())
                        .productName(product.getProductName())
                        .productPrice(product.getProductPrice())
                        .productDescription(product.getProductDescription())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProductsComplex() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(this::buildCompleteProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> filterProducts(FilterRequest filterRequest) {
        List<ProductDetail> productDetails = productDetailRepository.findAll();


        return null;
    }

    public ProductResponse getProductById(Integer productId) {
        Product foundedProduct = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Ürün tipine göre farklı veri çekme
        if (foundedProduct.getProductType() == ProductType.SIMPLE) {
            return buildSimpleProductResponse(foundedProduct);
        } else if (foundedProduct.getProductType() == ProductType.VARIANT) {
            return buildVariantProductResponse(foundedProduct);
        } else {
            return buildCompleteProductResponse(foundedProduct);
        }
    }

    private ProductResponse buildSimpleProductResponse(Product product) {
        // Simple ürün için sadece ürün bilgileri ve görselleri
        List<ProductImage> productImages = productImageFileRepository.findByProductId(product.getProductId());
        List<ProductProperty> productProperties = productPropertyRepository.findByProductId(product.getProductId());

        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productModel(null) // Product entity'sinde yok
                .productBrand(product.getProductBrand())
                .productType(product.getProductType())
                .productDescription(product.getProductDescription())
                .productPrice(product.getProductPrice())
                .productQuantity(product.getProductQuantity())
                .productImageUrl(null) // CDN URL'i frontend'de oluşturulacak
                .categoryId(product.getCategoryId())
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .level(product.getLevel())
                .imageFiles(convertToImagePathResponses(productImages)) // Sadece path'leri döndür
                .productProperties(convertToPropertyResponses(productProperties))
                .variants(null) // Simple ürün için variant yok
                .build();
    }

    private ProductResponse buildVariantProductResponse(Product product) {
        // Variant ürün için ürün bilgileri ve variant görselleri
        List<ProductVariant> productVariants = productVariantRepository.findByProductId(product.getProductId());

        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productModel(null) // Product entity'sinde yok
                .productBrand(product.getProductBrand())
                .productType(product.getProductType())
                .productDescription(product.getProductDescription())
                .categoryId(product.getCategoryId())
                .productPrice(product.getProductPrice())
                .productQuantity(product.getProductQuantity())
                .productImageUrl(null) // CDN URL'i frontend'de oluşturulacak
                .categoryId(product.getCategoryId())
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .level(product.getLevel())
                .productProperties(null) // Variant ürünlerde ürün seviyesinde property yok
                .imageFiles(null) // Variant ürünlerde ürün seviyesinde image yok
                .variants(convertToVariantResponsesWithImages(productVariants)) // Variant'ları görsellerle birlikte
                .build();
    }

    private ProductResponse buildCompleteProductResponse(Product product) {
        // Ürüne ait görselleri getir
        List<ProductImage> productImages = productImageFileRepository.findByProductId(product.getProductId());

        // Ürüne ait property'leri getir
        List<ProductProperty> productProperties = productPropertyRepository.findByProductId(product.getProductId());

        // Ürüne ait variant'ları getir
        List<ProductDetail> productVariants = productDetailRepository.findByProductId(product.getProductId());

        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productModel(null) // Product entity'sinde yok
                .productBrand(product.getProductBrand())
                .productType(product.getProductType())
                .productDescription(product.getProductDescription())
                .productPrice(product.getProductPrice())
                .productQuantity(product.getProductQuantity())
                .productImageUrl(null) // CDN URL'i frontend'de oluşturulacak
                .categoryId(product.getCategoryId())
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .level(product.getLevel())
                .imageFiles(convertToImageResponses(productImages))
                .productProperties(convertToPropertyResponses(productProperties))
                .variants(convertToVariantResponses(productVariants))
                .build();
    }

    private List<ImageFileResponse> convertToImageResponses(List<ProductImage> images) {
        if (images == null || images.isEmpty()) return new ArrayList<>();

        return images.stream()
                .map(img -> ImageFileResponse.builder()
                        .fileId(img.getId())
                        .imageUrl(img.getImagePath()) // imagePath zaten tam URL içeriyor
                        .build())
                .collect(Collectors.toList());
    }

    private List<ImageFileResponse> convertToImagePathResponses(List<ProductImage> images) {
        if (images == null || images.isEmpty()) return new ArrayList<>();

        return images.stream()
                .map(img -> ImageFileResponse.builder()
                        .fileId(img.getId())
                        .imageUrl(img.getImagePath()) // imagePath zaten tam URL içeriyor
                        .build())
                .collect(Collectors.toList());
    }

    private List<ProductPropertyValueResponse> convertToPropertyResponses(List<ProductProperty> properties) {
        if (properties == null || properties.isEmpty()) return new ArrayList<>();

        return properties.stream()
                .map(pp -> ProductPropertyValueResponse.builder()
                        .id(pp.getId())
                        .propertyId(pp.getPropertyId())
                        .propertyName(pp.getProperty() != null ? pp.getProperty().getName() : null)
                        .value(pp.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    private List<ProductPropertyValueResponse> convertToVariantPropertyResponses(List<VariantProperty> variantProperties) {
        if (variantProperties == null || variantProperties.isEmpty()) return new ArrayList<>();

        return variantProperties.stream()
                .map(vp -> ProductPropertyValueResponse.builder()
                        .id(vp.getVariantPropertyId())
                        .propertyId(vp.getPropertyId())
                        .propertyName(vp.getProperty() != null ? vp.getProperty().getName() : vp.getVariantPropertyName())
                        .value(vp.getVariantPropertyValue())
                        .build())
                .collect(Collectors.toList());
    }

    private List<ProductVariantResponse> convertToVariantResponses(List<ProductDetail> variants) {
        if (variants == null || variants.isEmpty()) return new ArrayList<>();

        return variants.stream()
                .map(variant -> ProductVariantResponse.builder()
                        .variantId(variant.getId())
                        .sku(variant.getSku())
                        .price(variant.getPrice())
                        .stockQuantity(variant.getStockQuantity())
                        .isActive(variant.getIsActive())
                        .properties(convertToPropertyResponses(variant.getProperties()))
                        .build())
                .collect(Collectors.toList());
    }

    private List<ProductVariantResponse> convertToVariantResponsesWithImages(List<ProductVariant> variants) {
        if (variants == null || variants.isEmpty()) return new ArrayList<>();

        return variants.stream()
                .map(variant -> {
                    // Her variant için görselleri getir
                    List<ProductVariantImages> variantImages = productVariantImagesRepository.findByProductIdAndVariantId(
                            variant.getProductId(), variant.getVariantId());
                    
                    // Her variant için property'leri getir (Property entity'si ile birlikte)
                    List<VariantProperty> variantProperties = varaintPropertyRepository.findByVariantIdWithProperty(variant.getVariantId());
                    
                    List<String> imageUrls = variantImages.stream()
                            .map(ProductVariantImages::getImagePath) // imagePath zaten tam URL içeriyor
                            .collect(Collectors.toList());

                    return ProductVariantResponse.builder()
                            .variantId(variant.getVariantId())
                            .productId(variant.getProductId())
                            .sku(variant.getSku())
                            .price(variant.getVariantPrice())
                            .stockQuantity(variant.getVariantQuantity())
                            .isActive(variant.getIsActive())
                            .properties(convertToVariantPropertyResponses(variantProperties))
                            .variantImageUrls(imageUrls) // Variant görsel URL'lerini ekle
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Elasticsearch senkronizasyon metodları
    public void syncAllProductsToElasticsearch() {
        try {
            List<Product> allProducts = productRepository.findAll();
            for (Product product : allProducts) {
                syncProductToElasticsearch(product.getProductId());
            }
            log.info("All products synced to Elasticsearch successfully");
        } catch (Exception e) {
            log.error("Error syncing all products to Elasticsearch: {}", e.getMessage());
            throw new RuntimeException("Failed to sync all products to Elasticsearch", e);
        }
    }

    public void syncProductToElasticsearch(Integer productId) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

            // Burada Elasticsearch senkronizasyon işlemi yapılacak
            // Şimdilik sadece log yazıyoruz
            log.info("Product synced to Elasticsearch: {}", product.getProductName());
        } catch (Exception e) {
            log.error("Error syncing product to Elasticsearch: {}", e.getMessage());
            throw new RuntimeException("Failed to sync product to Elasticsearch", e);
        }
    }

    // Level bazlı ürün getirme metodları
    public List<ProductResponse> getProductsByLevel(Integer level) {
        try {
            List<Product> products = productRepository.findByLevel(level);
            return products.stream()
                    .map(this::buildCompleteProductResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting products by level: {}", e.getMessage());
            throw new RuntimeException("Failed to get products by level", e);
        }
    }

    public List<ProductResponse> getProductsByCategoryAndLevel(Integer categoryId, Integer level) {
        try {
            List<Product> products = productRepository.findByCategoryIdAndLevel(categoryId, level);
            return products.stream()
                    .map(this::buildCompleteProductResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting products by category and level: {}", e.getMessage());
            throw new RuntimeException("Failed to get products by category and level", e);
        }
    }
}


