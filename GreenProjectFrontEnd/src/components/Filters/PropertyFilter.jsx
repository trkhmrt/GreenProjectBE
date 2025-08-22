import React, { useState, useEffect } from 'react';

const PropertyFilter = ({ selectedCategoryId, filters, updateFilter }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedCategoryId) {
            // For now, we'll use a simple approach without the API call
            // since getPropertiesByCategoryId doesn't exist
            setProperties([]);
            setLoading(false);
        } else {
            setProperties([]);
        }
    }, [selectedCategoryId]);

    const handlePropertyChange = (propertyId, value) => {
        const newProperties = { ...filters.properties };
        
        if (value.trim()) {
            newProperties[propertyId] = value.trim();
        } else {
            delete newProperties[propertyId];
        }
        
        updateFilter('properties', newProperties);
    };

    const clearProperties = () => {
        console.log('🧹 PropertyFilter: Property\'ler temizleniyor');
        updateFilter('properties', {});
    };

    const hasActiveProperties = Object.keys(filters.properties).length > 0;

    return (
        <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-purple-800">Kategori Filtreleri</h3>
                {hasActiveProperties && (
                    <span
                        onClick={clearProperties}
                        className="text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Temizle
                    </span>
                )}
            </div>

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-sm text-purple-600">Filtreler yükleniyor...</p>
                </div>
            )}

            {error && (
                <div className="text-center py-4">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {!loading && !error && !selectedCategoryId && (
                <div className="text-center py-4">
                    <p className="text-sm text-purple-600">Filtreleri görmek için bir kategori seçin</p>
                </div>
            )}

            {!loading && !error && selectedCategoryId && properties.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-sm text-purple-600">Bu kategori için filtre bulunamadı</p>
                </div>
            )}

            {!loading && !error && selectedCategoryId && properties.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                    {properties.map((property) => (
                        <div key={property.propertyId} className="space-y-2">
                            <label className="block text-sm font-medium text-purple-700">
                                {property.propertyName}
                            </label>
                            <input
                                type="text"
                                placeholder={`${property.propertyName} değeri girin...`}
                                value={filters.properties[property.propertyId] || ''}
                                onChange={(e) => handlePropertyChange(property.propertyId, e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-purple-50/60 border border-purple-200/30 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-purple-200/50 focus:border-purple-200/50 transition-all duration-200 placeholder-purple-400"
                            />
                        </div>
                    ))}
                    
                    {/* Filtre Uygula Butonu */}
                    <div className="pt-4">
                        <button
                            onClick={() => {
                                console.log('🎯 PropertyFilter: Filtre uygulandı');
                                // Filtreler zaten otomatik uygulanıyor, burada ek işlem yapılabilir
                            }}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                        >
                            Filtre Uygula
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyFilter;