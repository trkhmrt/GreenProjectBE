import React from 'react';

const CategorySidebar = ({ 
    hierarchicalCategories, 
    selectedCategoryPath, 
    onCategorySelect, 
    expandedCategories, 
    onToggleExpand 
}) => {
    const renderCategoryTree = (categories, level = 0) => {
        return categories.map((category) => {
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedCategories[category.categoryId];
            const isSelected = selectedCategoryPath.some(cat => cat.categoryId === category.categoryId);
            
            return (
                <div key={category.categoryId} className="w-full">
                    <div 
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        style={{ paddingLeft: `${level * 16 + 12}px` }}
                        onClick={() => onCategorySelect(category)}
                    >
                        <span className="flex items-center gap-2">
                            {hasChildren && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleExpand(category.categoryId);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <svg 
                                        className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                            {!hasChildren && <div className="w-3 h-3"></div>}
                            <span>{category.categoryName}</span>
                            {hasChildren && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {category.childrenCount}
                                </span>
                            )}
                        </span>
                    </div>
                    
                    {hasChildren && isExpanded && (
                        <div className="mt-1">
                            {renderCategoryTree(category.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
            <div className="space-y-1">
                {/* Tümü seçeneği */}
                <button
                    onClick={() => onCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategoryPath.length === 0
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    Tümü
                </button>
                
                {/* Hierarchical categories */}
                {renderCategoryTree(hierarchicalCategories)}
            </div>
        </div>
    );
};

export default CategorySidebar;

