import React, { useState } from 'react';

const VariantGallery = ({ variantImagePaths = [], imageFiles = [] }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Varyant resimleri için S3 URL'lerini oluştur
    const getVariantImageUrl = (imagePath) => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // S3 base URL'ini ekle
        return `https://d2asj86e04rqv6.cloudfront.net/products/${imagePath}`;
    };

    // Kullanılacak resimleri belirle
    const images = variantImagePaths.length > 0 
        ? variantImagePaths.map(path => ({ url: getVariantImageUrl(path) }))
        : imageFiles.map(file => ({ url: file.imageUrl }));

    if (images.length === 0) {
        return (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Bu varyant için fotoğraf bulunmuyor</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Ana Görsel */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={images[selectedImageIndex]?.url}
                    alt={`Ürün görseli ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Resim+Yüklenemedi';
                    }}
                />
            </div>
            
            {/* Küçük Görseller */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                selectedImageIndex === index
                                    ? 'border-blue-500'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <img
                                src={image.url}
                                alt={`Ürün görseli ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/80x80?text=Resim+Yüklenemedi';
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
            
            {/* Resim Sayısı */}
            <div className="text-center text-sm text-gray-500">
                {selectedImageIndex + 1} / {images.length}
            </div>
        </div>
    );
};

export default VariantGallery;