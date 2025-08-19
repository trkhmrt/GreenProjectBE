import React, { useState, useEffect } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import CategoryFilter from '../components/Filters/CategoryFilter';
import PropertyFilter from '../components/Filters/PropertyFilter';
import { getAllProducts } from '../services/ProductService';
import { getHierarchicalNestedCategories } from '../services/CategoryService';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const { filters, updateFilter, clearFilters, getActiveFiltersCount } = useProductFilters();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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



    const getUniqueProperties = () => {
        const properties = new Map();
        products.forEach(product => {
            if (product.productType === 'VARIANT' && product.variants) {
                product.variants.forEach(variant => {
                    variant.properties?.forEach(prop => {
                        if (!properties.has(prop.propertyId)) {
                            properties.set(prop.propertyId, {
                                propertyId: prop.propertyId,
                                propertyName: prop.propertyName
                            });
                        }
                    });
                });
            }
        });
        return Array.from(properties.values());
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
                {/* Sol Sidebar - Filtreler */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-bold text-purple-800">Filtreler</h2>
                        {getActiveFiltersCount > 0 && (
                            <span
                                        onClick={clearFilters}
                                className="text-xs sm:text-sm text-purple-500 hover:text-purple-700 font-medium transition-colors duration-200 bg-purple-50/60 px-2 sm:px-3 py-1 rounded-lg cursor-pointer"
                                    >
                                Temizle ({getActiveFiltersCount})
                            </span>
                        )}
                                </div>

                    {/* Kategori Filtresi */}
                    <CategoryFilter 
                        hierarchicalCategories={hierarchicalCategories} 
                        filters={filters}
                        updateFilter={updateFilter}
                    />

                    {/* Kategori Özellikleri Filtresi */}
                    {console.log('🔍 Products: PropertyFilter render ediliyor, selectedCategoryId:', filters.categoryId, 'type:', typeof filters.categoryId)}
                                    <PropertyFilter 
                    selectedCategoryId={filters.categoryId}
                    filters={filters}
                    updateFilter={updateFilter}
                    hierarchicalCategories={hierarchicalCategories}
                />

                                {/* Fiyat Filtresi */}
                    <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-bold text-purple-800">Fiyat Aralığı</h3>
                            {filters.priceRange.max && (
                                <span
                                    onClick={() => updateFilter('priceRange', { min: 0, max: null })}
                                    className="text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors duration-200 cursor-pointer"
                                >
                                    Temizle
                                </span>
                            )}
                                            </div>
                        <div className="space-y-3 sm:space-y-4">
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
                    <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-200/30 p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
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
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-purple-50/60 border border-purple-200/30 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-purple-200/50 focus:border-purple-200/50 transition-all duration-200 placeholder-purple-400"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                                </div>
                    </div>
                </div>

                {/* Sağ Taraf - Ürünler */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold">Ürünler</h1>
                        <span className="text-sm sm:text-base text-gray-600">
                            {filteredProducts.length} ürün bulundu
                        </span>
            </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Ürünler yükleniyor...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                            </div>
                            <p className="text-gray-600 mb-2">Ürün bulunamadı</p>
                            <p className="text-sm text-gray-500">Filtrelerinizi değiştirmeyi deneyin</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;