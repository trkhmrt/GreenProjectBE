import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addProductToBasket } from '../services/BasketService';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const getProductPrice = () => {
        if (product.productType === 'VARIANT' && product.variants?.length > 0) {
            const prices = product.variants.map(v => v.price).filter(price => price > 0);
            if (prices.length > 0) {
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                return minPrice === maxPrice ? `${minPrice} TL` : `${minPrice} - ${maxPrice} TL`;
            }
        }
        return product.productPrice ? `${product.productPrice} TL` : 'Fiyat belirtilmemiş';
    };

    const getProductImage = () => {
        // Varyantlı ürünler için ilk varyantın ilk resmi
        if (product.productType === 'VARIANT' && product.variants?.length > 0) {
            const firstVariant = product.variants[0];
            if (firstVariant.variantImagePaths?.length > 0) {
                const imagePath = firstVariant.variantImagePaths[0];
                return imagePath.startsWith('http') 
                    ? imagePath 
                    : `https://d2asj86e04rqv6.cloudfront.net/products/${imagePath}`;
            }
        }
        
        // Basit ürünler için ilk resim
        if (product.imageFiles?.length > 0) {
            return product.imageFiles[0].imageUrl;
        }
        
        return null;
    };

    const getProductStock = () => {
        if (product.productType === 'VARIANT' && product.variants?.length > 0) {
            const totalStock = product.variants.reduce((sum, variant) => sum + (variant.stockQuantity || 0), 0);
            return totalStock;
        }
        return product.productQuantity || 0;
    };

    const handleCardClick = () => {
        navigate(`/product/${product.productId}`);
    };

    const handleAddToBasket = async (e) => {
        e.stopPropagation();
        try {
            // Varyantlı ürünse ilk varyantın ID'sini, değilse ürün ID'sini kullan
            const productIdToAdd = product.productType === 'VARIANT' && product.variants?.length > 0
                ? product.variants[0].variantId 
                : product.productId;
            
            await addProductToBasket(productIdToAdd);
            alert('Ürün sepete eklendi!');
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            alert('Ürün sepete eklenirken bir hata oluştu.');
        }
    };

    const imageUrl = getProductImage();
    const price = getProductPrice();
    const stock = getProductStock();

    return (
        <div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 w-[230px] h-[552px]"
            onClick={handleCardClick}
        >
            {/* Ürün Görseli */}
            <div className="w-full h-[300px] bg-gray-100 relative">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=Resim+Yüklenemedi';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                
                {/* Ürün Tipi Badge */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        product.productType === 'VARIANT' 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                        {product.productType === 'VARIANT' ? 'Varyantlı' : 'Basit'}
                    </span>
                </div>
                
                {/* Stok Durumu Badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        stock > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                        {stock > 0 ? `${stock} adet` : 'Stokta yok'}
                    </span>
                </div>
            </div>

            {/* Ürün Bilgileri */}
            <div className="p-3 h-[252px] flex flex-col justify-between">
                {/* Ürün Adı */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors text-sm">
                    {product.productName}
                </h3>
                
                {/* Marka */}
                {product.productBrand && (
                    <p className="text-sm text-gray-500 mb-2 font-medium">
                        {product.productBrand}
                    </p>
                )}
                
                {/* Fiyat */}
                <p className="text-base font-bold text-purple-600 mb-2">
                    {price}
                </p>
                
                {/* Kategori */}
                {product.categoryName && (
                    <p className="text-xs text-gray-500 mb-2 font-medium">
                        {product.categoryName}
                    </p>
                )}
                
                {/* Varyant Bilgisi */}
                {product.productType === 'VARIANT' && product.variants?.length > 0 && (
                    <p className="text-xs text-gray-500 mb-2">
                        {product.variants.length} varyant mevcut
                    </p>
                )}
                
                {/* Sepete Ekle Butonu */}
                <button
                    onClick={handleAddToBasket}
                    disabled={stock === 0}
                    className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 text-xs font-semibold shadow-sm hover:shadow-md mt-auto"
                >
                    {stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard; 