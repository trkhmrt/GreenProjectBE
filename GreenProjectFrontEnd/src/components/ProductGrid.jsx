import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, isAdmin = false }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-gray-500 text-lg mb-4">Ürün bulunamadı</div>
                <div className="text-gray-400 text-sm">Filtrelerinizi değiştirmeyi deneyin</div>
            </div>
        );
    }

    if (isAdmin) {
        return (
            <>
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div key={product.productId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4">
                                    {/* Header with Image and Basic Info */}
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className="flex-shrink-0">
                                            <img 
                                                className="h-16 w-16 rounded-lg object-cover" 
                                                src={product.imageFiles?.[0] || product.variantImageUrls?.[0] || '/placeholder-image.jpg'} 
                                                alt={product.productName}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                {product.productName}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                ID: {product.productId}
                                            </p>
                                            <div className="flex items-center mt-2 space-x-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₺{product.productPrice?.toFixed(2) || '0.00'}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    product.productType === 'SIMPLE' 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {product.productType === 'SIMPLE' ? 'Basit' : 'Varyant'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                                        <div>
                                            <span className="text-gray-500">Kategori:</span>
                                            <p className="font-medium text-gray-900 truncate">
                                                {product.categoryName || 'Kategori Yok'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Stok:</span>
                                            <p className="font-medium">
                                                {product.productType === 'SIMPLE' ? (
                                                    <span className={`${
                                                        product.productQuantity > 0 
                                                            ? 'text-green-600' 
                                                            : 'text-red-600'
                                                    }`}>
                                                        {product.productQuantity || 0}
                                                    </span>
                                                ) : (
                                                    <span className="text-blue-600">
                                                        {product.variants?.length || 0} varyant
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => window.location.href = `/admin/products/${product.productId}`}
                                            className="flex-1 px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => window.location.href = `/products/${product.productId}`}
                                            className="flex-1 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Görüntüle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ürün
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fiyat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tip
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                                        {/* Ürün Kolonu */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img 
                                                        className="h-12 w-12 rounded-lg object-cover" 
                                                        src={product.imageFiles?.[0] || product.variantImageUrls?.[0] || '/placeholder-image.jpg'} 
                                                        alt={product.productName}
                                                    />
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {product.productName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {product.productId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Kategori Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="truncate block max-w-[120px]">
                                                {product.categoryName || 'Kategori Yok'}
                                            </span>
                                        </td>
                                        
                                        {/* Fiyat Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="font-semibold text-gray-900">
                                                ₺{product.productPrice?.toFixed(2) || '0.00'}
                                            </span>
                                        </td>
                                        
                                        {/* Stok Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.productType === 'SIMPLE' ? (
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    product.productQuantity > 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.productQuantity || 0} adet
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.variants?.length || 0} varyant
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Tip Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.productType === 'SIMPLE' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {product.productType === 'SIMPLE' ? 'Basit Ürün' : 'Varyantlı Ürün'}
                                            </span>
                                        </td>
                                        
                                        {/* İşlemler Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => window.location.href = `/admin/products/${product.productId}`}
                                                    className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => window.location.href = `/products/${product.productId}`}
                                                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    Görüntüle
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
export default ProductGrid; 
    if (isAdmin) {
        return (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ürün
                                </th>
                                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    Kategori
                                </th>
                                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fiyat
                                </th>
                                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Stok
                                </th>
                                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                    Tip
                                </th>
                                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                                                <img 
                                                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg object-cover" 
                                                    src={product.imageFiles?.[0] || product.variantImageUrls?.[0] || '/placeholder-image.jpg'} 
                                                    alt={product.productName}
                                                />
                                            </div>
                                            <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                                                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                    {product.productName}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-500">
                                                    ID: {product.productId}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-500 sm:hidden">
                                                    {product.categoryName || 'Kategori Yok'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                                        {product.categoryName || 'Kategori Yok'}
                                    </td>
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        <span className="font-medium">₺{product.productPrice?.toFixed(2) || '0.00'}</span>
                                    </td>
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                                        {product.productType === 'SIMPLE' ? (
                                            <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                                                product.productQuantity > 0 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.productQuantity || 0}
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {product.variants?.length || 0} Varyant
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                                        <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                                            product.productType === 'SIMPLE' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {product.productType === 'SIMPLE' ? 'Basit' : 'Varyantlı'}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                                            <button
                                                onClick={() => window.location.href = `/admin/products/${product.productId}`}
                                                className="text-purple-600 hover:text-purple-900 transition-colors whitespace-nowrap"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => window.location.href = `/products/${product.productId}`}
                                                className="text-blue-600 hover:text-blue-900 transition-colors whitespace-nowrap"
                                            >
                                                Görüntüle
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {product.productName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {product.productId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Kategori Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="truncate block max-w-[120px]">
                                                {product.categoryName || 'Kategori Yok'}
                                            </span>
                                        </td>
                                        
                                        {/* Fiyat Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="font-semibold text-gray-900">
                                                ₺{product.productPrice?.toFixed(2) || '0.00'}
                                            </span>
                                        </td>
                                        
                                        {/* Stok Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.productType === 'SIMPLE' ? (
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    product.productQuantity > 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.productQuantity || 0} adet
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.variants?.length || 0} varyant
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Tip Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.productType === 'SIMPLE' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {product.productType === 'SIMPLE' ? 'Basit Ürün' : 'Varyantlı Ürün'}
                                            </span>
                                        </td>
                                        
                                        {/* İşlemler Kolonu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => window.location.href = `/admin/products/${product.productId}`}
                                                    className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => window.location.href = `/products/${product.productId}`}
                                                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    Görüntüle
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;