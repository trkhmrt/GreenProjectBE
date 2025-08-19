import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VariantSelector from '../components/Variants/VariantSelector';
import VariantGallery from '../components/Variants/VariantGallery';
import { getProductById } from '../services/ProductService';
import { addProductToBasket } from '../services/BasketService';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productData = await getProductById(productId);
                setProduct(productData);
                
                // Varyantlı ürünse ilk varyantı seç
                if (productData.productType === 'VARIANT' && productData.variants?.length > 0) {
                    setSelectedVariant(productData.variants[0]);
                }
            } catch (error) {
                console.error('Ürün yüklenirken hata:', error);
                setError('Ürün yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
    };

    const handleAddToBasket = async () => {
        try {
            // Varyantlı ürünse varyant ID'sini, değilse ürün ID'sini kullan
            const productIdToAdd = product.productType === 'VARIANT' && selectedVariant 
                ? selectedVariant.variantId 
                : product.productId;
            
            await addProductToBasket(productIdToAdd);
            
            // Başarılı mesajı göster (isteğe bağlı)
            alert('Ürün sepete eklendi!');
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            alert('Ürün sepete eklenirken bir hata oluştu.');
        }
    };

    const getProductPrice = () => {
        if (product.productType === 'VARIANT' && selectedVariant) {
            return selectedVariant.price;
        }
        return product.productPrice;
    };

    const getProductStock = () => {
        if (product.productType === 'VARIANT' && selectedVariant) {
            return selectedVariant.stockQuantity;
        }
        return product.productQuantity;
    };

    const getProductImages = () => {
        if (product.productType === 'VARIANT' && selectedVariant) {
            return {
                variantImagePaths: selectedVariant.variantImagePaths || [],
                imageFiles: []
            };
        }
        return {
            variantImagePaths: [],
            imageFiles: product.imageFiles || []
        };
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Ürün yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-gray-600">Ürün bulunamadı</p>
                </div>
            </div>
        );
    }

    const productImages = getProductImages();
    const productPrice = getProductPrice();
    const productStock = getProductStock();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sol Taraf - Görseller */}
                <div>
                    <VariantGallery 
                        variantImagePaths={productImages.variantImagePaths}
                        imageFiles={productImages.imageFiles}
                    />
                </div>

                {/* Sağ Taraf - Ürün Bilgileri */}
                <div className="space-y-6">
                    {/* Ürün Başlığı ve Açıklaması */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {product.productName}
                        </h1>
                        {product.productBrand && (
                            <p className="text-lg text-gray-600 mb-3">
                                Marka: <span className="font-medium">{product.productBrand}</span>
                            </p>
                        )}
                        <p className="text-gray-600 leading-relaxed">
                            {product.productDescription}
                        </p>
                    </div>

                    {/* Varyant Seçici (Sadece varyantlı ürünler için) */}
                    {product.productType === 'VARIANT' && product.variants?.length > 0 && (
                        <VariantSelector
                            productVariants={product.variants}
                            onVariantChange={handleVariantChange}
                        />
                    )}

                    {/* Fiyat ve Stok Bilgileri */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl font-bold text-purple-700">
                                {productPrice ? `${productPrice} TL` : 'Fiyat belirtilmemiş'}
                            </div>
                            {product.productType === 'VARIANT' && selectedVariant && (
                                <div className="text-sm text-purple-600 font-medium bg-purple-100 px-3 py-1 rounded-full">
                                    SKU: {selectedVariant.sku}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 font-medium">
                                Stok Durumu:
                            </div>
                            <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                productStock > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                            }`}>
                                {productStock > 0 ? `${productStock} adet` : 'Stokta yok'}
                            </div>
                        </div>
                    </div>

                    {/* Sepete Ekle Butonu */}
                    <button
                        onClick={handleAddToBasket}
                        disabled={!productPrice || productStock === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {productStock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                    </button>

                    {/* Ürün Özellikleri */}
                    {product.productType === 'VARIANT' && selectedVariant?.properties?.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Özellikleri</h3>
                            <div className="space-y-3">
                                {selectedVariant.properties.map(property => (
                                    <div key={property.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                        <span className="text-gray-600 font-medium">{property.propertyName}:</span>
                                        <span className="text-gray-900 font-semibold bg-gray-50 px-3 py-1 rounded-lg">
                                            {property.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ürün Tipi Badge */}
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                            product.productType === 'VARIANT' 
                                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                            {product.productType === 'VARIANT' ? 'Varyantlı Ürün' : 'Basit Ürün'}
                        </span>
                        {product.categoryName && (
                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                                {product.categoryName}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail; 