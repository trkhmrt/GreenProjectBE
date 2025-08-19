import React, { useState } from 'react';

const ClothingFilters = ({ onFilterChange, filters }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            ...filters,
            size: '',
            color: '',
            minPrice: '',
            maxPrice: ''
        };
        onFilterChange(clearedFilters);
    };

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Siyah', 'Beyaz', 'Gri', 'Kahverengi'];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Giyim Filtreleri</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isExpanded && (
                <div className="p-4 space-y-6">
                    {/* Beden Filtresi */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Beden</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                        filters.size === size
                                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Renk Filtresi */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Renk</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleFilterChange('color', filters.color === color ? '' : color)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                        filters.color === color
                                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fiyat Aralığı */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Minimum Fiyat</label>
                                <input
                                    type="number"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Maksimum Fiyat</label>
                                <input
                                    type="number"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    placeholder="∞"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filtreleri Temizle */}
                    <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        Filtreleri Temizle
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClothingFilters; 