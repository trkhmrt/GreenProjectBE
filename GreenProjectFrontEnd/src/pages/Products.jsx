import React, { useState, useEffect } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import CategoryFilter from '../components/Filters/CategoryFilter';
import PropertyFilter from '../components/Filters/PropertyFilter';
import { getAllProducts } from '../services/ProductService';
import { getHierarchicalNestedCategories } from '../services/CategoryService';
import ProductCard from '../components/ProductCard';
import MobileFilterModal from '../components/MobileFilterModal';
import MobileFilterButton from '../components/MobileFilterButton';

const Products = () => {
    const { filters, updateFilter, clearFilters, getActiveFiltersCount } = useProductFilters();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [mainCategories, setMainCategories] = useState([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [showSortButton, setShowSortButton] = useState(false);
    const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);
    const [showDesktopFilterButton, setShowDesktopFilterButton] = useState(false);

    const sortOptions = [
        { value: 'name', label: 'İsme Göre' },
        { value: 'price_asc', label: 'Fiyat (Düşükten Yükseğe)' },
        { value: 'price_desc', label: 'Fiyat (Yüksekten Düşüğe)' },
        { value: 'newest', label: 'En Yeniler' },
        { value: 'popular', label: 'Popüler' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    getAllProducts(),
                    getHierarchicalNestedCategories()
                ]);
                
                setProducts(productsData);
                setHierarchicalCategories(categoriesData.data || categoriesData);
                
                // Ana kategorileri ayarla (root kategoriler)
                const rootCategories = (categoriesData.data || categoriesData).filter(category => 
                    !category.parentId || category.parentId === 0 || category.parentId === null
                );
                setMainCategories(rootCategories);
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Dropdown dışına tıklandığında kapatma
    useEffect(() => {
        const handleClickOutside = (event) => {
            // if (isSortDropdownOpen && !event.target.closest('.sort-dropdown')) {
            //     setIsSortDropdownOpen(false);
            // }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Scroll handler - sıralama divi ekrandan kaybolduğunda buton göster
    useEffect(() => {
        const handleScroll = () => {
            const sortDivs = document.querySelectorAll('.sort-div');
            let shouldShowSortButton = false;
            
            sortDivs.forEach(div => {
                const rect = div.getBoundingClientRect();
                if (rect.bottom < 0) {
                    shouldShowSortButton = true;
                }
            });
            
            setShowSortButton(shouldShowSortButton);
            // Filtre butonu da sıralama butonu ile aynı anda çıksın
            setShowDesktopFilterButton(shouldShowSortButton);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Filtreleme işlemi
    useEffect(() => {
        let filtered = [...products];

        // Kategori filtresi
        if (filters.categoryId) {
            filtered = filtered.filter(product => 
                product.categoryId === filters.categoryId
            );
        }

        // Alt kategori filtresi
        if (filters.subCategoryId) {
            filtered = filtered.filter(product => 
                product.categoryId === filters.subCategoryId
            );
        }

        // Fiyat filtresi
        if (filters.priceRange.max) {
            filtered = filtered.filter(product => {
                const price = product.productType === 'VARIANT' 
                    ? Math.min(...product.variants.map(v => v.price))
                    : product.productPrice;
                return price >= filters.priceRange.min && price <= filters.priceRange.max;
            });
        }

        // Ürün tipi filtresi
        if (filters.productType !== 'ALL') {
            filtered = filtered.filter(product => 
                product.productType === filters.productType
            );
        }

        // Arama filtresi
        if (filters.searchQuery) {
            filtered = filtered.filter(product => 
                product.productName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                product.productDescription.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                product.productBrand?.toLowerCase().includes(filters.searchQuery.toLowerCase())
            );
        }

        // Özellik filtreleri (varyantlı ürünler için)
        Object.entries(filters.properties).forEach(([propertyId, value]) => {
            if (value) {
                filtered = filtered.filter(product => {
                    if (product.productType !== 'VARIANT') return false;
                    return product.variants?.some(variant =>
                        variant.properties?.some(prop => 
                            prop.propertyId.toString() === propertyId && prop.value === value
                        )
                    );
                });
            }
        });

        setFilteredProducts(filtered);
    }, [products, filters]);

    const handleCategorySelect = (category) => {
        if (category.categoryId === 'all') {
            updateFilter('categoryId', null);
            updateFilter('subCategoryId', null);
        } else {
            updateFilter('categoryId', category.categoryId);
            updateFilter('subCategoryId', null);
        }
    };

    const getSelectedCategory = () => {
        if (!filters.categoryId) return null;
        return mainCategories.find(cat => cat.categoryId === filters.categoryId);
    };

    // Mobil filtreleme fonksiyonları
    const handleMobileFilterChange = (newFilters) => {
        // Fiyat aralığı
        if (newFilters.minPrice || newFilters.maxPrice) {
            updateFilter('priceRange', {
                min: Number(newFilters.minPrice) || 0,
                max: Number(newFilters.maxPrice) || null
            });
        }

        // Kategori
        if (newFilters.category) {
            updateFilter('categoryId', newFilters.category);
        }

        // Tüm özellik filtrelerini güncelle
        const updatedProperties = { ...filters.properties };
        
        if (newFilters.color) updatedProperties.color = newFilters.color;
        if (newFilters.size) updatedProperties.size = newFilters.size;
        if (newFilters.brand) updatedProperties.brand = newFilters.brand;
        if (newFilters.material) updatedProperties.material = newFilters.material;
        if (newFilters.style) updatedProperties.style = newFilters.style;
        if (newFilters.condition) updatedProperties.condition = newFilters.condition;
        if (newFilters.warranty) updatedProperties.warranty = newFilters.warranty;
        if (newFilters.storage) updatedProperties.storage = newFilters.storage;
        if (newFilters.processor) updatedProperties.processor = newFilters.processor;
        if (newFilters.ram) updatedProperties.ram = newFilters.ram;

        updateFilter('properties', updatedProperties);

        // Stok durumu
        if (newFilters.inStock !== undefined) {
            // Stok filtresi implementasyonu
        }

        // Sıralama
        if (newFilters.sortBy) {
            setSortBy(newFilters.sortBy);
        }
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.categoryId) count++;
        if (filters.priceRange.min > 0 || filters.priceRange.max) count++;
        if (filters.searchQuery) count++;
        if (Object.keys(filters.properties).length > 0) count++;
        return count;
    };

    const handleSort = (sortValue) => {
        setSortBy(sortValue);
        let sorted = [...filteredProducts];
        
        switch (sortValue) {
            case 'name':
                sorted.sort((a, b) => a.productName.localeCompare(b.productName));
                break;
            case 'price_asc':
                sorted.sort((a, b) => {
                    const priceA = a.productType === 'VARIANT' 
                        ? Math.min(...a.variants.map(v => v.price))
                        : a.productPrice;
                    const priceB = b.productType === 'VARIANT' 
                        ? Math.min(...b.variants.map(v => v.price))
                        : b.productPrice;
                    return priceA - priceB;
                });
                break;
            case 'price_desc':
                sorted.sort((a, b) => {
                    const priceA = a.productType === 'VARIANT' 
                        ? Math.min(...a.variants.map(v => v.price))
                        : a.productPrice;
                    const priceB = b.productType === 'VARIANT' 
                        ? Math.min(...b.variants.map(v => v.price))
                        : b.productPrice;
                    return priceB - priceA;
                });
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                // Popülerlik sıralaması için örnek implementasyon
                sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                break;
            default:
                break;
        }
        
        setFilteredProducts(sorted);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20">
            {/* Desktop Layout */}
            <div className="hidden md:block">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex gap-8">
                        {/* Sol Taraf - Filtreler */}
                        <div className="w-[230px] space-y-4 desktop-filters flex-shrink-0">
                            {/* Kategori Filtresi */}
                            <CategoryFilter 
                                hierarchicalCategories={hierarchicalCategories}
                                filters={filters}
                                updateFilter={updateFilter}
                            />

                            {/* Property Filtresi */}
                            <PropertyFilter 
                                selectedCategoryId={filters.categoryId}
                                filters={filters}
                                updateFilter={updateFilter}
                                hierarchicalCategories={hierarchicalCategories}
                            />

                            {/* Fiyat Filtresi */}
                            <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-3 sm:p-4 shadow-lg">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-bold text-purple-800">Fiyat Aralığı</h3>
                                    {(filters.priceRange.min > 0 || filters.priceRange.max) && (
                                        <span
                                            onClick={() => updateFilter('priceRange', { min: 0, max: null })}
                                            className="text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors duration-200 cursor-pointer"
                                    >
                                        Temizle
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex gap-2 sm:gap-3">
                                        <div className="flex-1">
                                                <input
                                                    type="number"
                                                placeholder="Min"
                                                value={filters.priceRange.min}
                                                onChange={(e) => updateFilter('priceRange', {
                                                    ...filters.priceRange,
                                                    min: Number(e.target.value) || 0
                                                })}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-purple-50/60 border border-purple-200/30 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-purple-200/50 focus:border-purple-200/50 transition-all duration-200 placeholder-purple-400"
                                                />
                                            </div>
                                        <div className="flex-1">
                                                <input
                                                    type="number"
                                                placeholder="Max"
                                                value={filters.priceRange.max || ''}
                                                onChange={(e) => updateFilter('priceRange', {
                                                    ...filters.priceRange,
                                                    max: Number(e.target.value) || null
                                                })}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-purple-50/60 border border-purple-200/30 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-purple-200/50 focus:border-purple-200/50 transition-all duration-200 placeholder-purple-400"
                                                />
                                            </div>
                                        </div>
                                </div>
                                </div>

                            {/* Arama */}
                            <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-3 sm:p-4 shadow-lg">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-bold text-purple-800">Arama</h3>
                                    {filters.searchQuery && (
                                        <span
                                            onClick={() => updateFilter('searchQuery', '')}
                                            className="text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors duration-200 cursor-pointer"
                                        >
                                            Temizle
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ürün ara..."
                                        value={filters.searchQuery}
                                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                                        className="w-full px-4 py-3 bg-purple-50/60 border border-purple-200/30 rounded-xl text-sm focus:ring-2 focus:ring-purple-200/50 focus:border-purple-200/50 transition-all duration-200 placeholder-purple-400"
                                    />
                                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Sağ Taraf - Ürünler */}
                        <div className="flex-1">
                            {/* Başlık */}
                            <div className="mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-2">
                                    {getSelectedCategory()?.categoryName || 'Tüm Ürünler'}
                                </h1>
                                <p className="text-purple-600">
                                    {filteredProducts.length} ürün bulundu
                                </p>
                            </div>

                            {/* Sıralama Alanı */}
                            <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200/30 p-4 shadow-sm sort-div">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-purple-700 whitespace-nowrap">Sıralama:</span>
                                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                                        {sortOptions.map((option) => (
                                            <span
                                                key={option.value}
                                                onClick={() => handleSort(option.value)}
                                                className={`whitespace-nowrap px-4 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer ${
                                                    sortBy === option.value
                                                        ? 'text-purple-600 font-medium'
                                                        : 'text-gray-600 hover:text-purple-600'
                                                }`}
                                            >
                                                {option.label}
                                            </span>
                                        ))}
                                    </div>
                                                    </div>
                                            </div>

                            {/* Ürün Grid */}
                            {loading ? (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[...Array(12)].map((_, index) => (
                                        <div key={index} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 animate-pulse">
                                            <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-purple-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Ürün Bulunamadı</h3>
                                    <p className="text-gray-500">Seçtiğiniz kriterlere uygun ürün bulunamadı.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.productId} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobil Layout */}
            <div className="md:hidden">
                <div className="container mx-auto px-4 py-6">
                    {/* Başlık */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-purple-800 mb-2">
                            {getSelectedCategory()?.categoryName || 'Tüm Ürünler'}
                        </h1>
                        <p className="text-purple-600">
                            {filteredProducts.length} ürün bulundu
                        </p>
                    </div>

                    {/* Sıralama Alanı - Mobil */}
                    <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200/30 p-4 shadow-sm sort-div">
                        <div className="flex flex-col space-y-3">
                            <span className="text-sm font-medium text-purple-700">Sıralama:</span>
                            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                                {sortOptions.map((option) => (
                                    <span
                                        key={option.value}
                                        onClick={() => handleSort(option.value)}
                                        className={`whitespace-nowrap px-4 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer ${
                                            sortBy === option.value
                                                ? 'text-purple-600 font-medium'
                                                : 'text-gray-600 hover:text-purple-600'
                                        }`}
                                    >
                                        {option.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ürün Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 animate-pulse">
                                    <div className="bg-gray-200 rounded-xl h-32 mb-3"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-purple-400 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ürün Bulunamadı</h3>
                            <p className="text-gray-500">Seçtiğiniz kriterlere uygun ürün bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobil Filtreleme Bileşenleri */}
            <div className="md:hidden">
                {/* Mobil Filtre Butonu */}
                <MobileFilterButton
                                onClick={() => {
                        console.log('Filtre butonuna tıklandı');
                        setIsMobileFilterOpen(true);
                    }}
                    filterCount={getActiveFilterCount()}
                    isActive={getActiveFilterCount() > 0}
                />
            </div>

            {/* Mobil Filtre Modal - Hem Mobil Hem Desktop */}
            <MobileFilterModal
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                onApplyFilters={handleMobileFilterChange}
                filters={{
                    minPrice: filters.priceRange.min || '',
                    maxPrice: filters.priceRange.max || '',
                    category: filters.categoryId || '',
                    color: filters.properties.color || '',
                    size: filters.properties.size || '',
                    brand: filters.properties.brand || '',
                    material: filters.properties.material || '',
                    style: filters.properties.style || '',
                    condition: filters.properties.condition || '',
                    warranty: filters.properties.warranty || '',
                    storage: filters.properties.storage || '',
                    processor: filters.properties.processor || '',
                    ram: filters.properties.ram || '',
                    sortBy: sortBy,
                    inStock: false
                }}
                onFilterChange={() => {}}
                selectedCategory={getSelectedCategory()?.categoryName || ''}
                categories={mainCategories.map(cat => ({
                    id: cat.categoryId,
                    name: cat.categoryName,
                    icon: cat.categoryIcon || '📦'
                }))}
                hierarchicalCategories={hierarchicalCategories}
            />

                        {/* Desktop Filtre Butonu */}
            {showSortButton && (
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm text-purple-600 border border-purple-200/30 shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                </button>
            )}

            {/* Sıralama Butonu - Filtre butonunun üstünde */}
            {showSortButton && (
                <button
                    onClick={() => setIsSortPopupOpen(true)}
                    className="fixed bottom-28 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm text-purple-600 border border-purple-200/30 shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                            </button>
            )}

            {/* Sıralama Popup */}
            {isSortPopupOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setIsSortPopupOpen(false)}>
                    <div className="bg-white rounded-t-2xl w-full max-w-md mx-4 mb-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Sıralama</h3>
                                        <button
                                    onClick={() => setIsSortPopupOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4">
                            <div className="space-y-3">
                                {sortOptions.map((option) => (
                                    <span
                                        key={option.value}
                                                        onClick={() => {
                                            handleSort(option.value);
                                            setIsSortPopupOpen(false);
                                        }}
                                        className={`w-full p-4 rounded-xl transition-all duration-200 cursor-pointer text-left block ${
                                            sortBy === option.value
                                                ? 'text-purple-600 font-medium'
                                                : 'text-gray-700 hover:text-purple-600'
                                        }`}
                                    >
                                        {option.label}
                                    </span>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
