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
    const [editingVariants, setEditingVariants] = useState([]);

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
            // Varyantları da kopyala
            if (response.data.variants) {
                setEditingVariants([...response.data.variants]);
            }
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
            console.log('📝 Güncellenmiş Ürün:', formData);

            let response;
            
            if (product.productType === 'SIMPLE') {
                // Basit ürün güncelleme
                const simpleProductRequest = {
                    productName: formData.productName,
                    productBrand: formData.productBrand,
                    productDescription: formData.productDescription,
                    productPrice: formData.productPrice,
                    productType: 'SIMPLE',
                    productQuantity: formData.productQuantity,
                    categoryId: formData.categoryId,
                    categoryName: formData.categoryName,
                    parentCategoryName: null, // Eğer parent kategori varsa buraya eklenebilir
                    images: [], // Şimdilik boş, fotoğraf güncelleme eklenebilir
                    simpleProductProperties: [] // Şimdilik boş, özellik güncelleme eklenebilir
                };
                
                console.log('📤 Basit Ürün Güncelleme İsteği:', simpleProductRequest);
                response = await axios.put(`http://localhost:8072/ael/productservice/product/update/simpleProduct/${productId}`, simpleProductRequest);
            } else {
                // Varyantlı ürün güncelleme
                const multipleProductRequest = {
                    productName: formData.productName,
                    productBrand: formData.productBrand,
                    productDescription: formData.productDescription,
                    categoryId: formData.categoryId,
                    productVariants: editingVariants.map(variant => ({
                        variantId: variant.variantId,
                        sku: variant.sku,
                        price: variant.price,
                        stockQuantity: variant.stockQuantity,
                        isActive: variant.isActive,
                        variantImageUrls: variant.variantImageUrls || [],
                        properties: variant.properties?.map(prop => ({
                            id: prop.id,
                            propertyId: prop.propertyId,
                            propertyName: prop.propertyName,
                            value: prop.value
                        })) || []
                    }))
                };
                
                console.log('📤 Varyantlı Ürün Güncelleme İsteği:', multipleProductRequest);
                response = await axios.put(`http://localhost:8072/ael/productservice/product/update/multipleProduct/${productId}`, multipleProductRequest);
            }
            
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
        // Varyantları da geri yükle
        if (product.variants) {
            setEditingVariants([...product.variants]);
        }
    };

    // Varyant düzenleme fonksiyonları
    const updateVariant = (variantIndex, field, value) => {
        const updatedVariants = [...editingVariants];
        updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            [field]: value
        };
        setEditingVariants(updatedVariants);
    };

    const addVariantImage = (variantIndex) => {
        const updatedVariants = [...editingVariants];
        if (!updatedVariants[variantIndex].variantImageUrls) {
            updatedVariants[variantIndex].variantImageUrls = [];
        }
        updatedVariants[variantIndex].variantImageUrls.push(''); // Boş URL ekle
        setEditingVariants(updatedVariants);
    };

    const updateVariantImageUrl = (variantIndex, imageIndex, value) => {
        const updatedVariants = [...editingVariants];
        updatedVariants[variantIndex].variantImageUrls[imageIndex] = value;
        setEditingVariants(updatedVariants);
    };

    const removeVariantImage = (variantIndex, imageIndex) => {
        const updatedVariants = [...editingVariants];
        updatedVariants[variantIndex].variantImageUrls.splice(imageIndex, 1);
        setEditingVariants(updatedVariants);
    };

    const updateVariantImage = (variantIndex, imageIndex, value) => {
        const updatedVariants = [...editingVariants];
        updatedVariants[variantIndex].variantImageUrls[imageIndex] = value;
        setEditingVariants(updatedVariants);
    };

    const addVariantProperty = (variantIndex) => {
        const updatedVariants = [...editingVariants];
        if (!updatedVariants[variantIndex].properties) {
            updatedVariants[variantIndex].properties = [];
        }
        updatedVariants[variantIndex].properties.push({
            id: Date.now(), // Geçici ID
            propertyId: 1,
            propertyName: '',
            value: ''
        });
        setEditingVariants(updatedVariants);
    };

    const removeVariantProperty = (variantIndex, propertyIndex) => {
        const updatedVariants = [...editingVariants];
        updatedVariants[variantIndex].properties.splice(propertyIndex, 1);
        setEditingVariants(updatedVariants);
    };

    const updateVariantProperty = (variantIndex, propertyIndex, field, value) => {
        const updatedVariants = [...editingVariants];
        updatedVariants[variantIndex].properties[propertyIndex] = {
            ...updatedVariants[variantIndex].properties[propertyIndex],
            [field]: value
        };
        setEditingVariants(updatedVariants);
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {isEditing ? 'Ürün Düzenle' : 'Ürün Detayı'}
                    </h1>
                    
                    <div className="flex items-center justify-between">
                        <span
                            onClick={handleBack}
                            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 cursor-pointer"
                        >
                            <span className="text-2xl">‹</span>
                            <span className="font-medium">Geri Dön</span>
                        </span>
                        
                        <div className="flex items-center space-x-3">
                            {!isEditing ? (
                                <span
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer"
                                >
                                    Düzenle
                                </span>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                                    >
                                        Kaydet
                                    </span>
                                    <span
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                    >
                                        İptal
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ürün Bilgileri */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sol Taraf - Temel Bilgiler */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
                            
                            {/* Ürün ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ürün ID
                                </label>
                                <p className="text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded-lg">
                                    {product.productId}
                                </p>
                            </div>
                            
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

                        {/* Sağ Taraf - Fiyat, Stok ve Fotoğraflar */}
                        <div className="space-y-6">
                            {product.productType === 'SIMPLE' ? (
                                <>
                                    {/* Basit Ürün - Fiyat ve Stok */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fiyat ve Stok</h2>
                                        <div className="space-y-4">
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
                                        </div>
                                    </div>

                                    {/* Basit Ürün - Fotoğraflar */}
                                    {product.imageFiles && product.imageFiles.length > 0 && (
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ürün Fotoğrafları</h2>
                                            <div className="grid grid-cols-2 gap-4">
                                                {product.imageFiles.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img 
                                                            src={image.imageUrl} 
                                                            alt={`Ürün fotoğrafı ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        {isEditing && (
                                                            <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {isEditing && (
                                                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                                                    Fotoğraf Ekle
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Varyantlı Ürün - Varyantlar */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Varyantlar ({product.variants?.length || 0})</h2>
                                        <div className="space-y-4">
                                            {(isEditing ? editingVariants : product.variants)?.map((variant, index) => (
                                                <div key={variant.variantId} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-medium text-sm">Varyant {index + 1}</span>
                                                        {isEditing ? (
                                                            <label className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={variant.isActive}
                                                                    onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                                                                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                                                />
                                                                <span className="text-xs text-gray-600">Aktif</span>
                                                            </label>
                                                        ) : (
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                variant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {variant.isActive ? 'Aktif' : 'Pasif'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                                        <div>
                                                            <span className="text-gray-600">SKU:</span>
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={variant.sku || ''}
                                                                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                                    className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                                                />
                                                            ) : (
                                                                <span> {variant.sku}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Fiyat:</span>
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={variant.price || ''}
                                                                    onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                                                                    className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                                                />
                                                            ) : (
                                                                <span> {variant.price} TL</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Stok:</span>
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    value={variant.stockQuantity || ''}
                                                                    onChange={(e) => updateVariant(index, 'stockQuantity', parseInt(e.target.value))}
                                                                    className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                                                />
                                                            ) : (
                                                                <span> {variant.stockQuantity} adet</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Varyant Özellikleri */}
                                                    <div className="mb-3">
                                                        <span className="text-gray-600 text-sm">Özellikler:</span>
                                                        {isEditing ? (
                                                            <div className="space-y-2 mt-2">
                                                                {(variant.properties || []).map((prop, propIndex) => (
                                                                    <div key={prop.id} className="flex items-center space-x-2">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Özellik adı"
                                                                            value={prop.propertyName || ''}
                                                                            onChange={(e) => updateVariantProperty(index, propIndex, 'propertyName', e.target.value)}
                                                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Değer"
                                                                            value={prop.value || ''}
                                                                            onChange={(e) => updateVariantProperty(index, propIndex, 'value', e.target.value)}
                                                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                                                                        />
                                                                        <button
                                                                            onClick={() => removeVariantProperty(index, propIndex)}
                                                                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    onClick={() => addVariantProperty(index)}
                                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                                >
                                                                    + Özellik Ekle
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {(variant.properties || []).map((prop) => (
                                                                    <span key={prop.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                        {prop.propertyName}: {prop.value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Varyant Fotoğrafları */}
                                                    <div>
                                                        <span className="text-gray-600 text-sm">Fotoğraflar:</span>
                                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                                            {(variant.variantImageUrls || []).map((imageUrl, imgIndex) => (
                                                                <div key={imgIndex} className="relative">
                                                                    {imageUrl ? (
                                                                        <img 
                                                                            src={imageUrl} 
                                                                            alt={`Varyant fotoğrafı ${imgIndex + 1}`}
                                                                            className="w-full h-20 object-cover rounded border border-gray-200"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                                                            <span className="text-xs text-gray-500">Fotoğraf yok</span>
                                                                        </div>
                                                                    )}
                                                                    {isEditing && (
                                                                        <button 
                                                                            onClick={() => removeVariantImage(index, imgIndex)}
                                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => addVariantImage(index)}
                                                                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors duration-200"
                                                            >
                                                                + Fotoğraf Ekle
                                                            </button>
                                                        )}
                                                    </div>
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
