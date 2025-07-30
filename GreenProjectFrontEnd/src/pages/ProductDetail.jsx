import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/ProductService';
import { addProductToBasket } from '../services/BasketService';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToBasket, setAddingToBasket] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productData = await getProductById(productId);
                console.log(productData);
                setProduct(productData);
            } catch (error) {
                console.error('Ürün yüklenirken hata:', error);
                showToast('Ürün yüklenirken bir hata oluştu', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, showToast]);

    const handleAddToBasket = async () => {
        try {
            setAddingToBasket(true);
            await addProductToBasket(productId);
            showToast('Ürün sepete eklendi!', 'success');
        } catch (error) {
            console.error('Sepete eklenirken hata:', error);
            showToast('Ürün sepete eklenirken bir hata oluştu', 'error');
        } finally {
            setAddingToBasket(false);
        }
    };

    const handleGoToBasket = () => {
        navigate('/Basket');
    };

    // Fotoğraf sayısını kontrol et (maksimum 5)
    const getImages = () => {
        if (!product || !product.imageFiles || product.imageFiles.length === 0) {
            return [];
        }
        // imageFiles array'inden path'leri al ve maksimum 5 fotoğraf döndür
        return product.imageFiles.slice(0, 5).map(image => image.path);
    };

    const images = getImages();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C2BD7]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ürün bulunamadı</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-[#6C2BD7] text-white px-6 py-2 rounded-lg hover:bg-[#5A1FC7] transition-colors"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li>
                            <button 
                                onClick={() => navigate('/')}
                                className="hover:text-[#6C2BD7] transition-colors"
                            >
                                Ana Sayfa
                            </button>
                        </li>
                        <li>/</li>
                        <li>
                            <button 
                                onClick={() => navigate(`/category/${product.subCategoryId}`)}
                                className="hover:text-[#6C2BD7] transition-colors"
                            >
                                {product.categoryName}
                            </button>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{product.productName}</li>
                    </ol>
                </nav>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Ürün Görseli - Galeri */}
                        <div className="bg-gray-100 p-8">
                            {/* Büyük Görsel Alanı */}
                            <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                                {images.length > 0 ? (
                                    <img 
                                        src={images[selectedImageIndex]} 
                                        alt={`${product.productName} - ${selectedImageIndex + 1}`}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <svg className="mx-auto h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p>Ürün görseli bulunmuyor</p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail'lar */}
                            {images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImageIndex === index 
                                                    ? 'border-[#6C2BD7] ring-2 ring-[#6C2BD7]/20' 
                                                    : 'border-gray-200 hover:border-[#6C2BD7]/50'
                                            }`}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`${product.productName} thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Fotoğraf Sayısı Göstergesi */}
                            {images.length > 0 && (
                                <div className="text-center mt-2">
                                    <span className="text-sm text-gray-500">
                                        {selectedImageIndex + 1} / {images.length}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Ürün Bilgileri */}
                        <div className="p-8">
                            {/* Kategori Bilgisi */}
                            <div className="mb-4">
                                <span className="inline-block bg-[#6C2BD7]/10 text-[#6C2BD7] px-3 py-1 rounded-full text-sm font-medium">
                                    {product.categoryName} / {product.subCategoryName}
                                </span>
                            </div>

                            {/* Ürün Adı */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.productName}
                            </h1>

                            {/* Model Bilgileri */}
                            {(product.productModel || product.productModelYear) && (
                                <div className="mb-6">
                                    {product.productModel && (
                                        <p className="text-gray-600 mb-1">
                                            <span className="font-medium">Model:</span> {product.productModel}
                                        </p>
                                    )}
                                    {product.productModelYear && (
                                        <p className="text-gray-600">
                                            <span className="font-medium">Model Yılı:</span> {product.productModelYear}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Fiyat */}
                            <div className="mb-6">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-bold text-[#6C2BD7]">
                                        ₺{product.productPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Stok Durumu */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${product.productQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm font-medium ${product.productQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.productQuantity > 0 ? `${product.productQuantity} adet stokta` : 'Stokta yok'}
                                    </span>
                                </div>
                            </div>

                            {/* Açıklama */}
                            {product.productDescription && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.productDescription}
                                    </p>
                                </div>
                            )}

                            {/* Ürün Özellikleri */}
                            {product.productProperties && product.productProperties.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ürün Özellikleri</h3>
                                    <div className="space-y-2">
                                        {product.productProperties.map((property, index) => (
                                            <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600 font-medium">{property.propertyName}:</span>
                                                <span className="text-gray-900">{property.propertyValue}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Aksiyon Butonları */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleAddToBasket}
                                    disabled={product.productQuantity === 0 || addingToBasket}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                                        product.productQuantity === 0 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-[#6C2BD7] text-white hover:bg-[#5A1FC7] hover:shadow-lg transform hover:-translate-y-0.5'
                                    }`}
                                >
                                    {addingToBasket ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Sepete Ekleniyor...</span>
                                        </div>
                                    ) : (
                                        product.productQuantity === 0 ? 'Stokta Yok' : 'Sepete Ekle'
                                    )}
                                </button>

                                <button
                                    onClick={handleGoToBasket}
                                    className="w-full py-3 px-6 border-2 border-[#6C2BD7] text-[#6C2BD7] rounded-xl font-semibold hover:bg-[#6C2BD7] hover:text-white transition-all duration-200"
                                >
                                    Sepete Git
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail; 