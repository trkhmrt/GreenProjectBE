import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // URL'den filtreleri al
    const searchParams = new URLSearchParams(location.search);
    const filters = {
        categoryId: searchParams.get('categoryId'),
        subCategoryId: searchParams.get('subCategoryId'),
        searchQuery: searchParams.get('searchQuery'),
        productTypes: searchParams.get('productTypes')?.split(',') || [],
        inStock: searchParams.get('inStock') === 'true',
        outOfStock: searchParams.get('outOfStock') === 'true',
        sortBy: searchParams.get('sortBy'),
        scrollPosition: searchParams.get('scrollPosition')
    };

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8072/ael/productservice/product/${productId}`);
            setProduct(response.data);
            setFormData(response.data);
        } catch (error) {
            setError('Ürün yüklenirken hata oluştu');
            console.error('Ürün yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        // Filtreleri ve scroll pozisyonunu koruyarak geri dön
        const params = new URLSearchParams();
        
        if (filters.categoryId) params.set('categoryId', filters.categoryId);
        if (filters.subCategoryId) params.set('subCategoryId', filters.subCategoryId);
        if (filters.searchQuery) params.set('searchQuery', filters.searchQuery);
        if (filters.productTypes.length > 0) params.set('productTypes', filters.productTypes.join(','));
        if (filters.inStock) params.set('inStock', 'true');
        if (filters.outOfStock) params.set('outOfStock', 'true');
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        if (filters.scrollPosition) params.set('scrollPosition', filters.scrollPosition);

        const queryString = params.toString();
        navigate(`/admin/products${queryString ? `?${queryString}` : ''}`);
    };

    const handleSave = async () => {
        try {
            console.log('🚀 Kaydedilecek ürün verisi:');
            console.log('📦 Form Data:', formData);
            console.log('🔄 Orijinal Ürün:', product);
            console.log('📝 Değişiklikler:', {
                productName: {
                    from: product.productName,
                    to: formData.productName
                },
                productBrand: {
                    from: product.productBrand,
                    to: formData.productBrand
                },
                productModel: {
                    from: product.productModel,
                    to: formData.productModel
                },
                productDescription: {
                    from: product.productDescription,
                    to: formData.productDescription
                },
                productPrice: {
                    from: product.productPrice,
                    to: formData.productPrice
                },
                productQuantity: {
                    from: product.productQuantity,
                    to: formData.productQuantity
                }
            });

            // Ürün güncelleme API çağrısı
            const response = await axios.put(`http://localhost:8072/ael/productservice/product/${productId}`, formData);
            
            console.log('✅ API Yanıtı:', response.data);
            console.log('🎉 Ürün başarıyla güncellendi!');
            
            setIsEditing(false);
            loadProduct(); // Güncellenmiş veriyi yeniden yükle
        } catch (error) {
            console.error('❌ Ürün güncelleme hatası:', error);
            console.error('🔍 Hata detayları:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('Ürün güncellenirken hata oluştu');
        }
    };

    const handleCancel = () => {
        setFormData(product); // Orijinal veriyi geri yükle
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Ürün yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Ürün bulunamadı</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                            >
                                <span className="text-2xl">‹</span>
                                <span className="font-medium">Geri Dön</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                >
                                    Düzenle
                                </button>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                    >
                                        Kaydet
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        İptal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                        {isEditing ? 'Ürün Düzenle' : 'Ürün Detayı'}
                    </h1>
                </div>

                {/* Ürün Bilgileri */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sol Taraf - Temel Bilgiler */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
                            
                            {/* Ürün Adı */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ürün Adı
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.productName || ''}
                                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                    />
                                ) : (
                                    <p className="text-gray-900">{product.productName}</p>
                                )}
                            </div>

                            {/* Marka */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marka
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.productBrand || ''}
                                        onChange={(e) => setFormData({...formData, productBrand: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                    />
                                ) : (
                                    <p className="text-gray-900">{product.productBrand}</p>
                                )}
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Model
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.productModel || ''}
                                        onChange={(e) => setFormData({...formData, productModel: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                    />
                                ) : (
                                    <p className="text-gray-900">{product.productModel || 'Belirtilmemiş'}</p>
                                )}
                            </div>

                            {/* Ürün Tipi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ürün Tipi
                                </label>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    product.productType === 'SIMPLE' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-purple-100 text-purple-800'
                                }`}>
                                    {product.productType === 'SIMPLE' ? 'Basit Ürün' : 'Varyantlı Ürün'}
                                </span>
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori
                                </label>
                                <p className="text-gray-900">{product.categoryName || 'Belirtilmemiş'}</p>
                            </div>
                        </div>

                        {/* Sağ Taraf - Fiyat ve Stok */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fiyat ve Stok</h2>
                            
                            {product.productType === 'SIMPLE' ? (
                                <>
                                    {/* Basit Ürün Fiyatı */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fiyat (TL)
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.productPrice || ''}
                                                onChange={(e) => setFormData({...formData, productPrice: parseFloat(e.target.value)})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{product.productPrice ? `${product.productPrice} TL` : 'Belirtilmemiş'}</p>
                                        )}
                                    </div>

                                    {/* Basit Ürün Stok */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stok Miktarı
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={formData.productQuantity || ''}
                                                onChange={(e) => setFormData({...formData, productQuantity: parseInt(e.target.value)})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                            />
                                        ) : (
                                            <p className={`font-medium ${product.productQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.productQuantity || 0} adet
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Varyantlı Ürün Varyantları */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Varyantlar ({product.variants?.length || 0})
                                        </label>
                                        <div className="space-y-3">
                                            {product.variants?.map((variant, index) => (
                                                <div key={variant.variantId} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-sm">Varyant {index + 1}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            variant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {variant.isActive ? 'Aktif' : 'Pasif'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-600">SKU:</span> {variant.sku}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Fiyat:</span> {variant.price} TL
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Stok:</span> {variant.stockQuantity} adet
                                                        </div>
                                                    </div>
                                                    {variant.properties && variant.properties.length > 0 && (
                                                        <div className="mt-2">
                                                            <span className="text-gray-600 text-sm">Özellikler:</span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {variant.properties.map((prop) => (
                                                                    <span key={prop.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                        {prop.propertyName}: {prop.value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Açıklama */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ürün Açıklaması
                        </label>
                        {isEditing ? (
                            <textarea
                                value={formData.productDescription || ''}
                                onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                            />
                        ) : (
                            <p className="text-gray-900">{product.productDescription || 'Açıklama belirtilmemiş'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDetail;
