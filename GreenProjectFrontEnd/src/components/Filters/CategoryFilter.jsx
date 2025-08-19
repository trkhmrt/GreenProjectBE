import React, { useState } from 'react';

const CategoryFilter = ({ hierarchicalCategories = [], filters, updateFilter }) => {
    const [expandedCategories, setExpandedCategories] = useState({});

    // Sadece root kategorileri filtrele (parentId: null, 0 veya undefined)
    const rootCategories = hierarchicalCategories.filter(category => 
        !category.parentId || category.parentId === 0 || category.parentId === null
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
        return categories.map((category) => {
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedCategories[category.categoryId];
            const isSelected = filters.categoryId === category.categoryId;
            
            console.log(`🌳 Render Category: ${category.categoryName} (ID: ${category.categoryId}, Level: ${level}, Children: ${hasChildren ? category.children.length : 0})`);
            
            return (
                <div key={category.categoryId} className="w-full">
                    <div 
                        className="flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer"
                        style={{ paddingLeft: `${level * 20 + 16}px` }}
                        onClick={() => handleCategorySelect(category)}
                    >
                        <span 
                            className={`flex items-center gap-2 font-medium transition-all duration-200 px-3 py-1 rounded-lg cursor-pointer ${
                                isSelected
                                    ? 'text-purple-700 bg-purple-50/80'
                                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/40'
                            }`}
                        >
                            {hasChildren && (
                                <svg 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleExpand(category.categoryId);
                                    }}
                                    className={`w-4 h-4 transition-transform duration-200 text-purple-600 cursor-pointer ${isExpanded ? 'rotate-90' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            {!hasChildren && <div className="w-4 h-4"></div>}
                            {category.categoryName}
                            {hasChildren && (
                                <span className="text-xs text-purple-500 bg-purple-100/60 px-2 py-1 rounded-full font-medium">
                                    {category.children.length}
                                </span>
                            )}
                        </span>
                    </div>
                    
                    {hasChildren && isExpanded && (
                        <div className="mt-1 ml-2 border-l border-purple-200/30">
                            {renderCategoryTree(category.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-purple-800">Kategoriler</h3>
                {filters.categoryId && (
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
                    className={`block py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        !filters.categoryId
                            ? 'text-purple-700 bg-purple-50/80'
                            : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/40'
                    }`}
                >
                    Tümü
                </span>
                
                                       {/* Hierarchical categories */}
                       <div className="mt-3">
                           {renderCategoryTree(rootCategories)}
                       </div>
            </div>
        </div>
    );
};

export default CategoryFilter;

