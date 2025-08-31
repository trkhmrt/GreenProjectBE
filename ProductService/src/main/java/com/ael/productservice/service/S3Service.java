package com.ael.productservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class S3Service {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.access-key}")
    private String accessKey;

    @Value("${aws.s3.secret-key}")
    private String secretKey;

    @Value("${aws.s3.cloudfront-url}")
    private String cloudfrontUrl;

    /**
     * EU-Central-1 için S3Client oluştur
     */
    private S3Client getEuCentralS3Client() {
        return S3Client.builder()
                .region(Region.EU_CENTRAL_1)
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    /**
     * EU-Central-1'e toplu ürün fotoğrafı yükleme
     */
    public List<String> uploadMultipleProductImagesToEuCentral(List<MultipartFile> files, Integer productId) throws IOException {
        S3Client s3 = getEuCentralS3Client();
        List<String> uploadedUrls = new ArrayList<>();

        // products/ klasörü altında ürün ID'si ile alt klasör
        String folderKey = "products/" + productId + "/";

        // Mevcut dosya sayısını bul
        int nextFileNumber = getNextFileNumberInEuCentral(s3, folderKey);

        for (MultipartFile file : files) {
            // Dosya uzantısını al
            String fileExtension = getFileExtension(file.getOriginalFilename());

            // Dosya adı: productId-sıraNo.uzantı
            String fileName = productId + "-" + nextFileNumber + fileExtension;
            String fullKey = folderKey + fileName;

            // Dosyayı yükle
            s3.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fullKey)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes()));

            // CDN URL'i ekle
            uploadedUrls.add(cloudfrontUrl + "/" + fullKey);

            // Sonraki dosya numarası
            nextFileNumber++;
        }

        return uploadedUrls;
    }

    /**
     * EU-Central-1'de mevcut dosya sayısını bul
     */
    private int getNextFileNumberInEuCentral(S3Client s3, String folderKey) {
        try {
            // Klasördeki mevcut dosyaları listele
            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(folderKey)
                    .build();

            ListObjectsV2Response response = s3.listObjectsV2(request);

            if (response.contents().isEmpty()) {
                return 1; // İlk dosya
            }

            // En yüksek dosya numarasını bul
            int maxNumber = 0;
            for (S3Object obj : response.contents()) {
                String key = obj.key(); // products/1/1-1.jpg
                String fileName = key.substring(folderKey.length()); // 1-1.jpg

                // productId-sıraNo.uzantı formatını kontrol et
                if (fileName.matches("\\d+-\\d+\\..*")) {
                    String numberPart = fileName.split("-")[1].split("\\.")[0];
                    int fileNumber = Integer.parseInt(numberPart);
                    maxNumber = Math.max(maxNumber, fileNumber);
                }
            }

            return maxNumber + 1;
        } catch (Exception e) {
            System.err.println("Error getting next file number: " + e.getMessage());
            return 1; // Hata durumunda 1'den başla
        }
    }

    /**
     * Dosya uzantısını al
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".jpg"; // Varsayılan uzantı
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    /**
     * EU-Central-1'deki ürün fotoğraflarını listele
     */
    public List<String> getProductImagesFromEuCentral(Integer productId) {
        S3Client s3 = getEuCentralS3Client();

        String folderKey = "products/" + productId + "/";

        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .prefix(folderKey)
                .build();

        ListObjectsV2Response response = s3.listObjectsV2(request);

        return response.contents().stream()
                .map(obj -> cloudfrontUrl + "/" + obj.key())
                .collect(Collectors.toList());
    }

    public String uploadProductImageToEuCentral(MultipartFile file, Integer productId) throws IOException {
        S3Client s3 = getEuCentralS3Client();

        // products/ klasörü altında ürün ID'si ile alt klasör
        String folderKey = "products/" + productId + "/";

        // Mevcut dosya sayısını bul
        int nextFileNumber = getNextFileNumberInEuCentral(s3, folderKey);

        // Dosya uzantısını al
        String fileExtension = getFileExtension(file.getOriginalFilename());

        // Dosya adı: productId-sıraNo.uzantı
        String fileName = productId + "-" + nextFileNumber + fileExtension;
        String fullKey = folderKey + fileName;

        // Dosyayı yükle
        s3.putObject(PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fullKey)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes()));

        // CDN URL'i döndür
        return cloudfrontUrl + "/" + fullKey;
    }

    /**
     * Tek bir resmi S3'e yükle (RabbitMQ consumer için)
     */
    public String uploadImageToS3(byte[] imageBytes, String key, String contentType) {
        S3Client s3 = getEuCentralS3Client();
        
        try {
            s3.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(contentType)
                            .build(),
                    RequestBody.fromBytes(imageBytes));

            return cloudfrontUrl + "/" + key;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to S3: " + e.getMessage(), e);
        }
    }
}