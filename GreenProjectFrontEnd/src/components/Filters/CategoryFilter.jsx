import React, { useState } from 'react';

const CategoryFilter = ({ hierarchicalCategories = [], filters = {}, updateFilter = () => {} }) => {
    const [expandedCategories, setExpandedCategories] = useState({});

    // hierarchicalCategories kontrolü
    if (!hierarchicalCategories || !Array.isArray(hierarchicalCategories)) {
        console.warn('CategoryFilter: hierarchicalCategories geçersiz:', hierarchicalCategories);
        return (
            <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-3 sm:p-4 shadow-lg">
                <div className="text-center text-gray-500 py-4">
                    Kategoriler yükleniyor...
                </div>
            </div>
        );
    }

    // Sadece root kategorileri filtrele (parentId: null, 0 veya undefined)
    const rootCategories = hierarchicalCategories.filter(category => 
        category && (!category.parentId || category.parentId === 0 || category.parentId === null)
    );

    console.log('🔍 CategoryFilter: Root kategoriler:', rootCategories);
    console.log('🔍 CategoryFilter: Toplam kategori sayısı:', hierarchicalCategories.length);
    console.log('🔍 CategoryFilter: Root kategori sayısı:', rootCategories.length);

    // Alt kategorinin en üstteki parent kategorisini bul
    const findRootParent = (categoryId, categories) => {
        const findCategory = (id, cats) => {
            for (const cat of cats) {
                if (cat.categoryId === id) {
                    return cat;
                }
                if (cat.children && cat.children.length > 0) {
                    const found = findCategory(id, cat.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const category = findCategory(categoryId, categories);
        if (!category) return categoryId;

        // Eğer parentId null, 0 veya undefined ise bu root kategoridir
        if (!category.parentId || category.parentId === 0 || category.parentId === null) {
            return category.categoryId;
        }

        // Parent kategorisini bul
        return findRootParent(category.parentId, categories);
    };

    const handleCategorySelect = (category) => {
        console.log('🎯 CategoryFilter: Kategori seçildi:', category);
        console.log('🔍 CategoryFilter: Kategori detayları:', {
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            type: typeof category.categoryId,
            isAll: category.categoryId === 'all'
        });
        
        if (category.categoryId === 'all') {
            console.log('🔄 CategoryFilter: Tümü seçildi, filtreler temizleniyor');
            updateFilter('categoryId', null);
            updateFilter('subCategoryId', null);
        } else {
            console.log('✅ CategoryFilter: Kategori seçildi, ID:', category.categoryId);
            console.log('📡 CategoryFilter: Filter güncelleniyor...');
            console.log('🔍 CategoryFilter: updateFilter fonksiyonu:', updateFilter);
            console.log('🔍 CategoryFilter: Mevcut filters:', filters);
            
            updateFilter('categoryId', category.categoryId); // Seçilen kategorinin kendi ID'sini kullan
            updateFilter('subCategoryId', null);
            
            // Eğer kategorinin alt kategorileri varsa, expand/collapse durumunu değiştir
            if (category.children && category.children.length > 0) {
                setExpandedCategories(prev => ({
                    ...prev,
                    [category.categoryId]: !prev[category.categoryId]
                }));
            }
            
            console.log('✅ CategoryFilter: Filter güncellendi');
            console.log('🔍 CategoryFilter: Güncellenmiş filters:', filters);
            console.log('🔄 CategoryFilter: PropertyFilter tetiklenecek, selectedCategoryId:', category.categoryId);
        }
    };

    const handleToggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const renderCategoryTree = (categories, level = 0) => {
        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return null;
        }
        
        return categories.map((category) => {
            if (!category) {
                return null;
            }
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedCategories[category.categoryId];
            const isSelected = filters && filters.categoryId === category.categoryId;
            
            console.log(`🌳 Render Category: ${category.categoryName} (ID: ${category.categoryId}, Level: ${level}, Children: ${hasChildren ? category.children.length : 0})`);
            
            return (
                <div key={category.categoryId} className="w-full">
                    <div 
                        className={`group flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-purple-50/40 ${
                            isSelected ? 'bg-purple-50/80 text-purple-700' : 'text-gray-700'
                        }`}
                        onClick={() => handleCategorySelect(category)}
                    >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {/* Level indicator - daha kompakt */}
                            {level > 0 && (
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: level }, (_, i) => (
                                        <div key={i} className="w-1 h-1 bg-purple-300 rounded-full"></div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Expand/Collapse icon */}
                            {hasChildren && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleExpand(category.categoryId);
                                    }}
                                    className={`text-purple-500 text-lg transition-transform duration-200 cursor-pointer hover:text-purple-700 ${
                                        isExpanded ? 'rotate-90' : ''
                                    }`}
                                >
                                    ›
                                </span>
                            )}
                            
                            {/* Category name */}
                            <span className="truncate font-medium">
                                {category.categoryName}
                            </span>
                            
                            {/* Children count */}
                            {hasChildren && (
                                <span className="text-xs text-purple-500 bg-purple-100/60 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                                    {category.children.length}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Subcategories - direkt altında, boşluksuz */}
                    {hasChildren && isExpanded && (
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                            {renderCategoryTree(category.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-3 sm:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-purple-800">Kategoriler</h3>
                {filters && filters.categoryId && (
                    <span
                        onClick={() => {
                            updateFilter('categoryId', null);
                            updateFilter('subCategoryId', null);
                        }}
                        className="text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Temizle
                    </span>
                )}
            </div>
            
            <div className="space-y-1">
                {/* Tümü seçeneği */}
                <span
                    onClick={() => handleCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}
                    className={`block py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        !filters || !filters.categoryId
                            ? 'text-purple-700 bg-purple-50/80'
                            : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/40'
                    }`}
                >
                    Tümü
                </span>
                
                                       {/* Hierarchical categories */}
                <div className="mt-3">
                    {rootCategories && rootCategories.length > 0 ? (
                        renderCategoryTree(rootCategories)
                    ) : (
                        <div className="text-gray-500 text-sm py-2">Kategori bulunamadı</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;

                    >
                        Temizle
                    </span>
                )}
            </div>
            
            <div className="space-y-1">
                {/* Tümü seçeneği */}
                <span
                    onClick={() => handleCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}
                    className={`block py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        !filters || !filters.categoryId
                            ? 'text-purple-700 bg-purple-50/80'
                            : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/40'
                    }`}
                >
                    Tümü
                </span>
                
                                       {/* Hierarchical categories */}
                <div className="mt-3">
                    {rootCategories && rootCategories.length > 0 ? (
                        renderCategoryTree(rootCategories)
                    ) : (
                        <div className="text-gray-500 text-sm py-2">Kategori bulunamadı</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;
