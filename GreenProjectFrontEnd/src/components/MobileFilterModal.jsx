import React, { useState, useEffect } from 'react';

const MobileFilterModal = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  filters, 
  onFilterChange, 
  selectedCategory,
  categories = [],
  hierarchicalCategories = []
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    // Seçili kategoriye göre filtreleri getir
    if (selectedCategory && hierarchicalCategories.length > 0) {
      const category = hierarchicalCategories.find(cat => cat.categoryName === selectedCategory);
      if (category) {
        // Kategori özel filtrelerini belirle
        const categorySpecificFilters = getCategorySpecificFilters(category);
        setSelectedCategoryFilters(categorySpecificFilters);
      }
    }
  }, [selectedCategory, hierarchicalCategories]);

  // Ana kategorileri al
  const getMainCategories = () => {
    return hierarchicalCategories.filter(cat => 
      !cat.parentId || cat.parentId === 0 || cat.parentId === null
    );
  };

  // Alt kategorileri al
  const getSubCategories = (parentId) => {
    return hierarchicalCategories.filter(cat => cat.parentId === parentId);
  };

  const getCategorySpecificFilters = (category) => {
    const filters = [];
    
    // Giyim kategorisi için özel filtreler
    if (category.categoryName === 'Giyim' || category.categoryName.includes('Giyim')) {
      filters.push(
        { id: 'size', label: 'Beden', type: 'size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        { id: 'color', label: 'Renk', type: 'color', options: [
          { value: 'red', label: 'Kırmızı', color: '#ef4444' },
          { value: 'blue', label: 'Mavi', color: '#3b82f6' },
          { value: 'green', label: 'Yeşil', color: '#10b981' },
          { value: 'black', label: 'Siyah', color: '#000000' },
          { value: 'white', label: 'Beyaz', color: '#ffffff' },
          { value: 'gray', label: 'Gri', color: '#6b7280' }
        ]},
        { id: 'material', label: 'Materyal', type: 'select', options: ['Pamuk', 'Polyester', 'Yün', 'Deri', 'Keten'] },
        { id: 'style', label: 'Stil', type: 'select', options: ['Casual', 'Formal', 'Spor', 'Vintage', 'Modern'] }
      );
    }
    
    // Elektronik kategorisi için özel filtreler
    if (category.categoryName === 'Elektronik' || category.categoryName.includes('Elektronik')) {
      filters.push(
        { id: 'brand', label: 'Marka', type: 'select', options: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Sony', 'LG', 'Asus', 'Lenovo'] },
        { id: 'condition', label: 'Durum', type: 'select', options: ['Yeni', 'Az Kullanılmış', 'İkinci El'] },
        { id: 'warranty', label: 'Garanti', type: 'select', options: ['Var', 'Yok'] }
      );
    }

    // Telefon alt kategorisi için özel filtreler
    if (category.categoryName === 'Telefon' || category.categoryName.includes('Telefon')) {
      filters.push(
        { id: 'brand', label: 'Marka', type: 'select', options: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'OnePlus'] },
        { id: 'storage', label: 'Depolama', type: 'select', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
        { id: 'color', label: 'Renk', type: 'color', options: [
          { value: 'black', label: 'Siyah', color: '#000000' },
          { value: 'white', label: 'Beyaz', color: '#ffffff' },
          { value: 'gold', label: 'Altın', color: '#ffd700' },
          { value: 'silver', label: 'Gümüş', color: '#c0c0c0' },
          { value: 'blue', label: 'Mavi', color: '#3b82f6' },
          { value: 'green', label: 'Yeşil', color: '#10b981' }
        ]},
        { id: 'condition', label: 'Durum', type: 'select', options: ['Yeni', 'Az Kullanılmış', 'İkinci El'] }
      );
    }

    // Bilgisayar alt kategorisi için özel filtreler
    if (category.categoryName === 'Bilgisayar' || category.categoryName.includes('Bilgisayar')) {
      filters.push(
        { id: 'brand', label: 'Marka', type: 'select', options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'] },
        { id: 'processor', label: 'İşlemci', type: 'select', options: ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
        { id: 'ram', label: 'RAM', type: 'select', options: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
        { id: 'storage', label: 'Depolama', type: 'select', options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '1TB HDD', '2TB HDD'] },
        { id: 'condition', label: 'Durum', type: 'select', options: ['Yeni', 'Az Kullanılmış', 'İkinci El'] }
      );
    }

    return filters;
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategorySelect = (category) => {
    if (category.categoryId === 'all') {
      handleFilterChange('category', '');
    } else {
      handleFilterChange('category', category.categoryId);
    }
  };

  const handleToggleExpand = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryClick = (category, e) => {
    // Eğer alt kategorisi varsa, sadece aç/kapat
    const hasChildren = getSubCategories(category.categoryId).length > 0;
    
    if (hasChildren) {
      e.stopPropagation();
      setExpandedCategories(prev => ({
        ...prev,
        [category.categoryId]: !prev[category.categoryId]
      }));
    } else {
      // Alt kategorisi yoksa kategori seç
      handleCategorySelect(category);
    }
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: '',
      maxPrice: '',
      category: '',
      color: '',
      size: '',
      brand: '',
      material: '',
      style: '',
      condition: '',
      warranty: '',
      sortBy: 'name',
      inStock: false
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const sortOptions = [
    { value: 'name', label: 'İsme Göre' },
    { value: 'price_asc', label: 'Fiyat (Düşükten Yükseğe)' },
    { value: 'price_desc', label: 'Fiyat (Yüksekten Düşüğe)' },
    { value: 'newest', label: 'En Yeniler' },
    { value: 'popular', label: 'Popüler' }
  ];

  const renderFilterComponent = (filter) => {
    switch (filter.type) {
      case 'size':
        return (
          <div className="flex flex-wrap gap-2">
            {filter.options.map((size) => (
              <button
                key={size}
                onClick={() => handleFilterChange(filter.id, localFilters[filter.id] === size ? '' : size)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  localFilters[filter.id] === size
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        );

      case 'color':
        return (
          <div className="flex flex-wrap gap-3">
            {filter.options.map((color) => (
              <button
                key={color.value}
                onClick={() => handleFilterChange(filter.id, localFilters[filter.id] === color.value ? '' : color.value)}
                className={`relative p-2 rounded-full transition-all duration-150 ${
                  localFilters[filter.id] === color.value
                    ? 'ring-2 ring-purple-600 ring-offset-2'
                    : 'hover:scale-105'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.color }}
                />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={localFilters[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
          >
            <option value="">Seçiniz</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'price':
        return (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                />
              </div>
            </div>

          </div>
        );

      case 'stock':
        return (
          <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors duration-150"
            />
            <span className="text-gray-700">Sadece stokta olanlar</span>
          </label>
        );

      case 'sort':
        return (
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <span
                key={option.value}
                onClick={() => handleFilterChange('sortBy', option.value)}
                className={`w-full p-4 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                  localFilters.sortBy === option.value
                    ? 'bg-purple-100/70 text-purple-700 border-b-2 border-purple-500'
                    : 'bg-white text-gray-700 hover:bg-purple-50/50'
                }`}
              >
                {option.label}
              </span>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => {
      const hasChildren = getSubCategories(category.categoryId).length > 0;
      const isExpanded = expandedCategories[category.categoryId];
      const isSelected = localFilters.category === category.categoryId;
      
      return (
        <div key={category.categoryId} className="w-full">
          <div 
            className={`group flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
              isSelected 
                ? 'bg-purple-50/80 text-purple-700' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            onClick={(e) => handleCategoryClick(category, e)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Level indicator - kompakt nokta sistemi */}
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
                  className={`text-purple-500 text-lg transition-transform duration-300 ease-in-out cursor-pointer hover:text-purple-700 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                >
                  ›
                </span>
              )}
              
              {/* Category name */}
              <span className={`truncate font-medium ${isSelected ? 'text-purple-600 font-semibold border-b-2 border-purple-500' : 'text-gray-800'}`}>
                {category.categoryName}
              </span>
              
              {/* Children count */}
              {hasChildren && (
                <span className="text-xs text-purple-500 bg-purple-100/60 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  {getSubCategories(category.categoryId).length}
                </span>
              )}
            </div>
          </div>
          
          {/* Subcategories - direkt altında, boşluksuz */}
          {hasChildren && (
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {renderCategoryTree(getSubCategories(category.categoryId), level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with Blur */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Left Side Drawer */}
      <div className={`fixed top-0 left-0 h-full w-96 z-50 bg-white shadow-2xl transition-transform duration-200 ease-out ${
        isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
      }`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Filtreler</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedCategory || 'Tüm Kategoriler'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors duration-150 shadow-sm"
            >
              <span className="text-gray-600 text-lg">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="p-6 space-y-6">
            {/* Kategoriler */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kategoriler</h3>
              
              {/* Tümü Butonu */}
              <div 
                className={`flex items-center py-3 px-4 rounded-lg text-sm font-medium cursor-pointer mb-3 ${
                  !localFilters.category 
                    ? 'text-purple-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => handleCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}
              >
                <span className={`${!localFilters.category ? 'text-purple-600 font-semibold border-b-2 border-purple-500' : 'text-gray-800'}`}>
                  Tüm Kategoriler
                </span>
              </div>

              {/* Kategori Ağacı */}
              <div className="space-y-1">
                {renderCategoryTree(getMainCategories())}
              </div>
            </div>

            {/* Kategori Özel Filtreleri */}
            {selectedCategoryFilters.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Filtreler</h3>
                {selectedCategoryFilters.map((filter) => (
                  <div key={filter.id}>
                    <h4 className="text-base font-medium text-gray-800 mb-3">{filter.label}</h4>
                    {renderFilterComponent(filter)}
                  </div>
                ))}
              </div>
            )}

            {/* Genel Filtreler - Her Zaman Görünür */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Genel Filtreler</h3>
              
              {/* Fiyat Aralığı */}
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Fiyat Aralığı</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Stok Durumu */}
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Stok Durumu</h4>
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock || false}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors duration-150"
                  />
                  <span className="text-gray-700">Sadece stokta olanlar</span>
                </label>
              </div>


            </div>

            {/* Aktif Filtreler */}
            {Object.keys(localFilters).some(key => localFilters[key] && localFilters[key] !== '') && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Aktif Filtreler</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(localFilters).map(([key, value]) => {
                    if (!value || value === '') return null;
                    return (
                      <div
                        key={key}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm transition-colors duration-150"
                      >
                        <span>{key}: {value}</span>
                        <button
                          onClick={() => handleFilterChange(key, '')}
                          className="text-purple-500 hover:text-purple-700 transition-colors duration-150"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-white">
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-150"
            >
              Sıfırla
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors duration-150 shadow-lg"
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterModal;

const MobileFilterModal = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  filters, 
  onFilterChange, 
  selectedCategory,
  categories = [],
  hierarchicalCategories = []
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    // Seçili kategoriye göre filtreleri getir
    if (selectedCategory && hierarchicalCategories.length > 0) {
      const category = hierarchicalCategories.find(cat => cat.categoryName === selectedCategory);
      if (category) {
        // Kategori özel filtrelerini belirle
        const categorySpecificFilters = getCategorySpecificFilters(category);
        setSelectedCategoryFilters(categorySpecificFilters);
      }
    }
  }, [selectedCategory, hierarchicalCategories]);

  // Ana kategorileri al
  const getMainCategories = () => {
    return hierarchicalCategories.filter(cat => 
      !cat.parentId || cat.parentId === 0 || cat.parentId === null
    );
  };

  // Alt kategorileri al
  const getSubCategories = (parentId) => {
    return hierarchicalCategories.filter(cat => cat.parentId === parentId);
  };

  const getCategorySpecificFilters = (category) => {
    const filters = [];
    
    // Giyim kategorisi için özel filtreler
    if (category.categoryName === 'Giyim' || category.categoryName.includes('Giyim')) {
      filters.push(
        { id: 'size', label: 'Beden', type: 'size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        { id: 'color', label: 'Renk', type: 'color', options: [
          { value: 'red', label: 'Kırmızı', color: '#ef4444' },
          { value: 'blue', label: 'Mavi', color: '#3b82f6' },
          { value: 'green', label: 'Yeşil', color: '#10b981' },
          { value: 'black', label: 'Siyah', color: '#000000' },
          { value: 'white', label: 'Beyaz', color: '#ffffff' },
          { value: 'gray', label: 'Gri', color: '#6b7280' }
        ]},
        { id: 'material', label: 'Materyal', type: 'select', options: ['Pamuk', 'Polyester', 'Yün', 'Deri', 'Keten'] },
        { id: 'style', label: 'Stil', type: 'select', options: ['Casual', 'Formal', 'Spor', 'Vintage', 'Modern'] }
      );
    }
    
    // Elektronik kategorisi için özel filtreler
    if (category.categoryName === 'Elektronik' || category.categoryName.includes('Elektronik')) {
      filters.push(
        { id: 'brand', label: 'Marka', type: 'select', options: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Sony', 'LG', 'Asus', 'Lenovo'] },
        { id: 'condition', label: 'Durum', type: 'select', options: ['Yeni', 'Az Kullanılmış', 'İkinci El'] },
        { id: 'warranty', label: 'Garanti', type: 'select', options: ['Var', 'Yok'] }
      );
    }

    // Telefon alt kategorisi için özel filtreler
    if (category.categoryName === 'Telefon' || category.categoryName.includes('Telefon')) {
      filters.push(
        { id: 'brand', label: 'Marka', type: 'select', options: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'OnePlus'] },
        { id: 'storage', label: 'Depolama', type: 'select', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
        { id: 'color', label: 'Renk', type: 'color', options: [
          { value: 'black', label: 'Siyah', color: '#000000' },
          { value: 'white', label: 'Beyaz', color: '#ffffff' },
          { value: 'gold', label: 'Altın', color: '#ffd700' },
          { value: 'silver', label: 'Gümüş', color: '#c0c0c0' },
          { value: 'blue', label: 'Mavi', color: '#3b82f6' },
          { value: 'green', label: 'Yeşil', color: '#10b981' }
        ]},
        { id: 'condition', label: 'Durum', type: 'select', options: ['Yeni', 'Az Kullanılmış', 'İkinci El'] }
      );
    }

    // Bilgisayar alt kategorisi için özel filtreler
    if (category.categoryName === 'Bilgisayar' || category.categoryName.includes('Bilgisayar')) {
      filters.push(
        { id: 'brand', label: 'Marka', type: 'select', options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'] },
        { id: 'processor', label: 'İşlemci', type: 'select', options: ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
        { id: 'ram', label: 'RAM', type: 'select', options: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
        { id: 'storage', label: 'Depolama', type: 'select', options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '1TB HDD', '2TB HDD'] },
        { id: 'condition', label: 'Durum', type: 'select', options: ['Yeni', 'Az Kullanılmış', 'İkinci El'] }
      );
    }

    return filters;
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategorySelect = (category) => {
    if (category.categoryId === 'all') {
      handleFilterChange('category', '');
    } else {
      handleFilterChange('category', category.categoryId);
    }
  };

  const handleToggleExpand = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryClick = (category, e) => {
    // Eğer alt kategorisi varsa, sadece aç/kapat
    const hasChildren = getSubCategories(category.categoryId).length > 0;
    
    if (hasChildren) {
      e.stopPropagation();
      setExpandedCategories(prev => ({
        ...prev,
        [category.categoryId]: !prev[category.categoryId]
      }));
    } else {
      // Alt kategorisi yoksa kategori seç
      handleCategorySelect(category);
    }
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: '',
      maxPrice: '',
      category: '',
      color: '',
      size: '',
      brand: '',
      material: '',
      style: '',
      condition: '',
      warranty: '',
      sortBy: 'name',
      inStock: false
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const sortOptions = [
    { value: 'name', label: 'İsme Göre' },
    { value: 'price_asc', label: 'Fiyat (Düşükten Yükseğe)' },
    { value: 'price_desc', label: 'Fiyat (Yüksekten Düşüğe)' },
    { value: 'newest', label: 'En Yeniler' },
    { value: 'popular', label: 'Popüler' }
  ];

  const renderFilterComponent = (filter) => {
    switch (filter.type) {
      case 'size':
        return (
          <div className="flex flex-wrap gap-2">
            {filter.options.map((size) => (
              <button
                key={size}
                onClick={() => handleFilterChange(filter.id, localFilters[filter.id] === size ? '' : size)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  localFilters[filter.id] === size
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        );

      case 'color':
        return (
          <div className="flex flex-wrap gap-3">
            {filter.options.map((color) => (
              <button
                key={color.value}
                onClick={() => handleFilterChange(filter.id, localFilters[filter.id] === color.value ? '' : color.value)}
                className={`relative p-2 rounded-full transition-all duration-150 ${
                  localFilters[filter.id] === color.value
                    ? 'ring-2 ring-purple-600 ring-offset-2'
                    : 'hover:scale-105'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.color }}
                />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={localFilters[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
          >
            <option value="">Seçiniz</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'price':
        return (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                />
              </div>
            </div>

          </div>
        );

      case 'stock':
        return (
          <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors duration-150"
            />
            <span className="text-gray-700">Sadece stokta olanlar</span>
          </label>
        );

      case 'sort':
        return (
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <span
                key={option.value}
                onClick={() => handleFilterChange('sortBy', option.value)}
                className={`w-full p-4 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                  localFilters.sortBy === option.value
                    ? 'bg-purple-100/70 text-purple-700 border-b-2 border-purple-500'
                    : 'bg-white text-gray-700 hover:bg-purple-50/50'
                }`}
              >
                {option.label}
              </span>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => {
      const hasChildren = getSubCategories(category.categoryId).length > 0;
      const isExpanded = expandedCategories[category.categoryId];
      const isSelected = localFilters.category === category.categoryId;
      
      return (
        <div key={category.categoryId} className="w-full">
          <div 
            className={`group flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
              isSelected 
                ? 'bg-purple-50/80 text-purple-700' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            onClick={(e) => handleCategoryClick(category, e)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Level indicator - kompakt nokta sistemi */}
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
                  className={`text-purple-500 text-lg transition-transform duration-300 ease-in-out cursor-pointer hover:text-purple-700 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                >
                  ›
                </span>
              )}
              
              {/* Category name */}
              <span className={`truncate font-medium ${isSelected ? 'text-purple-600 font-semibold border-b-2 border-purple-500' : 'text-gray-800'}`}>
                {category.categoryName}
              </span>
              
              {/* Children count */}
              {hasChildren && (
                <span className="text-xs text-purple-500 bg-purple-100/60 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  {getSubCategories(category.categoryId).length}
                </span>
              )}
            </div>
          </div>
          
          {/* Subcategories - direkt altında, boşluksuz */}
          {hasChildren && (
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {renderCategoryTree(getSubCategories(category.categoryId), level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with Blur */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Left Side Drawer */}
      <div className={`fixed top-0 left-0 h-full w-96 z-50 bg-white shadow-2xl transition-transform duration-200 ease-out ${
        isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
      }`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Filtreler</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedCategory || 'Tüm Kategoriler'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors duration-150 shadow-sm"
            >
              <span className="text-gray-600 text-lg">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="p-6 space-y-6">
            {/* Kategoriler */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kategoriler</h3>
              
              {/* Tümü Butonu */}
              <div 
                className={`flex items-center py-3 px-4 rounded-lg text-sm font-medium cursor-pointer mb-3 ${
                  !localFilters.category 
                    ? 'text-purple-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => handleCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}
              >
                <span className={`${!localFilters.category ? 'text-purple-600 font-semibold border-b-2 border-purple-500' : 'text-gray-800'}`}>
                  Tüm Kategoriler
                </span>
              </div>

              {/* Kategori Ağacı */}
              <div className="space-y-1">
                {renderCategoryTree(getMainCategories())}
              </div>
            </div>

            {/* Kategori Özel Filtreleri */}
            {selectedCategoryFilters.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Filtreler</h3>
                {selectedCategoryFilters.map((filter) => (
                  <div key={filter.id}>
                    <h4 className="text-base font-medium text-gray-800 mb-3">{filter.label}</h4>
                    {renderFilterComponent(filter)}
                  </div>
                ))}
              </div>
            )}

            {/* Genel Filtreler - Her Zaman Görünür */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Genel Filtreler</h3>
              
              {/* Fiyat Aralığı */}
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Fiyat Aralığı</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Stok Durumu */}
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Stok Durumu</h4>
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock || false}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors duration-150"
                  />
                  <span className="text-gray-700">Sadece stokta olanlar</span>
                </label>
              </div>


            </div>

            {/* Aktif Filtreler */}
            {Object.keys(localFilters).some(key => localFilters[key] && localFilters[key] !== '') && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Aktif Filtreler</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(localFilters).map(([key, value]) => {
                    if (!value || value === '') return null;
                    return (
                      <div
                        key={key}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm transition-colors duration-150"
                      >
                        <span>{key}: {value}</span>
                        <button
                          onClick={() => handleFilterChange(key, '')}
                          className="text-purple-500 hover:text-purple-700 transition-colors duration-150"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-white">
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-150"
            >
              Sıfırla
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors duration-150 shadow-lg"
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterModal;
