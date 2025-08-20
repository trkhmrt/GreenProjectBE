import React, { useState, useEffect } from 'react';

const PropertyFilter = ({ selectedCategoryId, filters, updateFilter, hierarchicalCategories = [] }) => {
    console.log('🚀 PropertyFilter: Komponent başlatılıyor');
    console.log('🚀 PropertyFilter: Props:', { selectedCategoryId, filters, updateFilter, hierarchicalCategories });
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastShownProperties, setLastShownProperties] = useState([]); // Son gösterilen property'ler

    console.log('🔍 PropertyFilter Render:', {
        selectedCategoryId,
        filtersCategoryId: filters.categoryId,
        propertiesCount: properties.length,
        loading,
        error,
        hasSelectedCategory: !!selectedCategoryId
    });

    // Kategori seçildiğinde property'leri getir
    useEffect(() => {
        console.log('🔄 PropertyFilter: useEffect tetiklendi, selectedCategoryId:', selectedCategoryId);
        
        if (!selectedCategoryId) {
            console.log('❌ PropertyFilter: Kategori ID yok, property\'ler temizleniyor');
            setProperties([]);
            setLastShownProperties([]);
            setError(null);
            return;
        }

        // Kategori verisini bul
        const findCategory = (categories, categoryId) => {
            for (const category of categories) {
                if (category.categoryId === categoryId) {
                    return category;
                }
                if (category.children && category.children.length > 0) {
                    const found = findCategory(category.children, categoryId);
                    if (found) return found;
                }
            }
            return null;
        };

        const selectedCategory = findCategory(hierarchicalCategories, selectedCategoryId);
        console.log('🔍 PropertyFilter: Seçilen kategori bulundu:', selectedCategory);

        if (!selectedCategory) {
            console.log('❌ PropertyFilter: Kategori bulunamadı');
            setProperties([]);
            setError('Kategori bulunamadı');
            return;
        }

        // Kategorinin property'lerini al
        const categoryProperties = selectedCategory.properties || [];
        console.log('📋 PropertyFilter: Kategori property\'leri:', categoryProperties);

        if (categoryProperties.length > 0) {
            // Kategorinin kendi property'leri var
            console.log('✅ PropertyFilter: Kategori property\'leri yüklendi, sayı:', categoryProperties.length);
            setProperties(categoryProperties);
            setLastShownProperties(categoryProperties);
            setError(null);
        } else {
            // Kategorinin property'si yok, parent kategorisini bul
            const findParentCategory = (categories, parentId) => {
                for (const category of categories) {
                    if (category.categoryId === parentId) {
                        return category;
                    }
                    if (category.children && category.children.length > 0) {
                        const found = findCategory(category.children, parentId);
                        if (found) return found;
                    }
                }
                return null;
            };

            const parentCategory = findParentCategory(hierarchicalCategories, selectedCategory.parentId);
            console.log('🔍 PropertyFilter: Parent kategori bulundu:', parentCategory);

            if (parentCategory && parentCategory.properties && parentCategory.properties.length > 0) {
                // Parent kategorinin property'leri var
                console.log('✅ PropertyFilter: Parent kategori property\'leri yüklendi, sayı:', parentCategory.properties.length);
                setProperties(parentCategory.properties);
                setLastShownProperties(parentCategory.properties);
                setError(null);
            } else {
                // Parent kategorinin de property'si yok, son gösterilen property'leri koru
                if (lastShownProperties.length > 0) {
                    console.log('💾 PropertyFilter: Property bulunamadı, son gösterilen property\'ler korunuyor');
                    setProperties(lastShownProperties);
                } else {
                    console.log('⚠️ PropertyFilter: Property bulunamadı, property\'ler temizleniyor');
                    setProperties([]);
                }
            }
        }

        setLoading(false);
    }, [selectedCategoryId, hierarchicalCategories]);

    const handlePropertyChange = (propertyId, value) => {
        console.log('🎯 PropertyFilter: Property değişti:', { propertyId, value });
        
        const newProperties = { ...filters.properties };
        
        if (value) {
            newProperties[propertyId] = value;
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
