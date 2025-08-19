import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/ProductService';
import { addProductToBasket } from '../services/BasketService';
import VariantGallery from '../components/Variants/VariantGallery';
import VariantSelector from '../components/Variants/VariantSelector';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
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

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleAddToBasket = async () => {
        try {
            // Varyantlı ürünse seçili varyantın ID'sini, değilse ürün ID'sini kullan
            const productIdToAdd = selectedVariant ? selectedVariant.variantId : product.productId;
            
            await addProductToBasket(productIdToAdd);
            alert('Ürün sepete eklendi!');
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            alert('Ürün sepete eklenirken bir hata oluştu.');
        }
    };

    const getProductPrice = () => {
        if (selectedVariant) {
            return `${selectedVariant.price} TL`;
        }
        return product?.productPrice ? `${product.productPrice} TL` : 'Fiyat belirtilmemiş';
    };

    const getProductStock = () => {
        if (selectedVariant) {
            return selectedVariant.stockQuantity || 0;
        }
        return product?.productQuantity || 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Ürün yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-gray-600">{error || 'Ürün bulunamadı'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sol Taraf - Ürün Görselleri */}
                    <div className="space-y-6">
                        {product.productType === 'VARIANT' && selectedVariant ? (
                            <VariantGallery 
                                variantImagePaths={selectedVariant.variantImagePaths || []}
                                imageFiles={[]}
                            />
                        ) : (
                            <VariantGallery 
                                variantImagePaths={[]}
                                imageFiles={product.imageFiles || []}
                            />
                        )}
                    </div>

                    {/* Sağ Taraf - Ürün Bilgileri */}
                    <div className="space-y-6">
                        {/* Ürün Başlığı */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {product.productName}
                            </h1>
                            {product.productBrand && (
                                <p className="text-lg text-gray-600 mb-4">
                                    {product.productBrand}
                                </p>
                            )}
                        </div>

                        {/* Fiyat */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fiyat</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {getProductPrice()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Stok</p>
                                    <p className={`text-lg font-semibold ${getProductStock() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {getProductStock() > 0 ? `${getProductStock()} adet` : 'Stokta yok'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Varyant Seçici */}
                        {product.productType === 'VARIANT' && product.variants?.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Varyant Seçin</h3>
                                <VariantSelector 
                                    productVariants={product.variants}
                                    onVariantChange={setSelectedVariant}
                                />
                            </div>
                        )}

                        {/* Ürün Açıklaması */}
                        {product.productDescription && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Açıklaması</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.productDescription}
                                </p>
                            </div>
                        )}

                        {/* Kategori Bilgisi */}
                        {product.categoryName && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h3>
                                <p className="text-gray-700">{product.categoryName}</p>
                            </div>
                        )}

                        {/* Sepete Ekle Butonu */}
                        <button
                            onClick={handleAddToBasket}
                            disabled={getProductStock() === 0}
                            className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            {getProductStock() > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                        </button>

                        {/* Ürün Tipi Badge */}
                        <div className="flex justify-center">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                product.productType === 'VARIANT' 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                    : 'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                                {product.productType === 'VARIANT' ? 'Varyantlı Ürün' : 'Basit Ürün'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
