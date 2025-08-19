import React, { useState } from 'react';
import ProductFilterContainer from './ProductFilters/ProductFilterContainer';

const FilterHeader = ({ filters, onClearFilters, productCount, onToggleFilters, selectedCategory, onFilterChange }) => {
    const [isVisible, setIsVisible] = useState(false);

    console.log('FilterHeader - selectedCategory:', selectedCategory);
    console.log('FilterHeader - filters:', filters);

    const activeFilters = Object.entries(filters).filter(([key, value]) => 
        value && value !== '' && key !== 'category'
    );

    const handleToggleFilters = () => {
        setIsVisible(!isVisible);
        onToggleFilters && onToggleFilters(!isVisible);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Ürünler ({productCount})
                        </h2>
                        
                        {/* Aktif Filtreler */}
                        {activeFilters.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Aktif filtreler:</span>
                                {activeFilters.map(([key, value]) => (
                                    <span key={key} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                        {key}: {value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sıralama Butonu */}
                        <div className="relative">
                            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">Sırala</option>
                                <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                                <option value="name-asc">İsim (A-Z)</option>
                                <option value="name-desc">İsim (Z-A)</option>
                            </select>
                        </div>

                        {/* Kategori Filtreleri - Kompakt */}
                        {selectedCategory && selectedCategory !== 'Tümü' && (
                            <div className="flex items-center gap-2">
                                {/* Beden Filtresi - Giyim için */}
                                {selectedCategory === 'Giyim' && (
                                    <select
                                        value={filters.size || ''}
                                        onChange={(e) => onFilterChange({ ...filters, size: e.target.value })}
                                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Beden</option>
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                )}

                                {/* Renk Filtresi - Giyim için */}
                                {selectedCategory === 'Giyim' && (
                                    <select
                                        value={filters.color || ''}
                                        onChange={(e) => onFilterChange({ ...filters, color: e.target.value })}
                                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Renk</option>
                                        <option value="Kırmızı">Kırmızı</option>
                                        <option value="Mavi">Mavi</option>
                                        <option value="Yeşil">Yeşil</option>
                                        <option value="Sarı">Sarı</option>
                                        <option value="Siyah">Siyah</option>
                                        <option value="Beyaz">Beyaz</option>
                                        <option value="Gri">Gri</option>
                                        <option value="Kahverengi">Kahverengi</option>
                                    </select>
                                )}

                                {/* Fiyat Filtresi - Tüm kategoriler için */}
                                <input
                                    type="number"
                                    placeholder="Min Fiyat"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                                    className="w-20 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max Fiyat"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                                    className="w-20 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Mobil Filtre Toggle */}
                        <button
                            onClick={handleToggleFilters}
                            className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filtreler
                        </button>

                        {/* Filtreleri Temizle */}
                        {activeFilters.length > 0 && (
                            <button
                                onClick={onClearFilters}
                                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Temizle
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterHeader; 