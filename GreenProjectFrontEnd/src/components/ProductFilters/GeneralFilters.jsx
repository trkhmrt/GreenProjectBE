import React, { useState } from 'react';

const GeneralFilters = ({ onFilterChange, filters }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            ...filters,
            minPrice: '',
            maxPrice: '',
            productType: '',
            inStock: false
        };
        onFilterChange(clearedFilters);
    };

    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Genel Filtreler</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isExpanded && (
                <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                    {/* Ürün Tipi Filtresi */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Ürün Tipi</h4>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                            <label className="flex items-center flex-1 min-w-0">
                                <input
                                    type="radio"
                                    name="productType"
                                    value=""
                                    checked={filters.productType === ''}
                                    onChange={(e) => handleFilterChange('productType', e.target.value)}
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 focus:ring-purple-500 border-gray-300 flex-shrink-0"
                                />
                                <span className="ml-2 text-xs sm:text-sm text-gray-700 truncate">Tümü</span>
                            </label>
                            <label className="flex items-center flex-1 min-w-0">
                                <input
                                    type="radio"
                                    name="productType"
                                    value="SIMPLE"
                                    checked={filters.productType === 'SIMPLE'}
                                    onChange={(e) => handleFilterChange('productType', e.target.value)}
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 focus:ring-purple-500 border-gray-300 flex-shrink-0"
                                />
                                <span className="ml-2 text-xs sm:text-sm text-gray-700 truncate">Basit</span>
                            </label>
                            <label className="flex items-center flex-1 min-w-0">
                                <input
                                    type="radio"
                                    name="productType"
                                    value="VARIANT"
                                    checked={filters.productType === 'VARIANT'}
                                    onChange={(e) => handleFilterChange('productType', e.target.value)}
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 focus:ring-purple-500 border-gray-300 flex-shrink-0"
                                />
                                <span className="ml-2 text-xs sm:text-sm text-gray-700 truncate">Varyant</span>
                            </label>
                        </div>
                    </div>

                    {/* Fiyat Aralığı */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Fiyat Aralığı</h4>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0">
                                <label className="block text-xs text-gray-600 mb-1">Min</label>
                                <input
                                    type="number"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="block text-xs text-gray-600 mb-1">Max</label>
                                <input
                                    type="number"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    placeholder="∞"
                                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stok Durumu */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Stok Durumu</h4>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.inStock || false}
                                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-xs sm:text-sm text-gray-700">Sadece stokta olanlar</span>
                        </label>
                    </div>

                    {/* Filtreleri Temizle */}
                    <button
                        onClick={clearFilters}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        Filtreleri Temizle
                    </button>
                </div>
            )}
        </div>
    );
};

export default GeneralFilters; 