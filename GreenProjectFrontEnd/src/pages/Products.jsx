import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PropertyFilter from '../components/Filters/PropertyFilter';
import { getAllProducts } from '../services/ProductService';
import { getHierarchicalNestedCategories } from '../services/CategoryService';

const Products = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState({
        categoryId: null,
        subCategoryId: null,
        searchQuery: '',
        priceRange: { min: 0, max: null },
        productTypes: [],
        inStock: false,
        outOfStock: false
    });

    // Load products and categories
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getAllProducts(),
                    getHierarchicalNestedCategories()
                ]);
                
                setProducts(productsData);
                setFilteredProducts(productsData);
                setHierarchicalCategories(categoriesData.data || []);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...products];

        // Category filter
        if (filters.categoryId) {
            filtered = filtered.filter(product => product.categoryId === filters.categoryId);
        }

        // Search filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(product => 
                product.productName.toLowerCase().includes(query) ||
                product.productDescription?.toLowerCase().includes(query)
            );
        }

        // Price range filter
        if (filters.priceRange.min > 0) {
            filtered = filtered.filter(product => product.productPrice >= filters.priceRange.min);
        }
        if (filters.priceRange.max) {
            filtered = filtered.filter(product => product.productPrice <= filters.priceRange.max);
        }

        // Stock filter
        if (filters.inStock) {
            filtered = filtered.filter(product => product.productQuantity > 0);
        }
        if (filters.outOfStock) {
            filtered = filtered.filter(product => product.productQuantity === 0);
        }

        setFilteredProducts(filtered);
    }, [products, filters]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            categoryId: null,
            subCategoryId: null,
            searchQuery: '',
            priceRange: { min: 0, max: null },
            productTypes: [],
            inStock: false,
            outOfStock: false
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
                    <p className="text-gray-600 mt-1">Tüm ürünlerimizi keşfedin</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filter Button */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {filteredProducts.length} ürün bulundu
                        </span>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Filtreler
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Ürünler yükleniyor...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <p className="text-gray-600 mb-2">Ürün bulunamadı</p>
                            <p className="text-sm text-gray-500">Filtrelerinizi değiştirmeyi deneyin</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <ProductCard key={product.productId} product={product} />
                        ))
                    )}
                </div>

                {/* Filter Modal */}
                {showFilters && (
                    <div className="fixed inset-0 bg-black/50 z-50">
                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Filtreler</h3>
                                <button 
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Property Filter */}
                                <PropertyFilter 
                                    selectedCategoryId={filters.categoryId}
                                    filters={filters}
                                    updateFilter={updateFilter}
                                    hierarchicalCategories={hierarchicalCategories}
                                />

                                {/* Price Filter */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-900 mb-4">Fiyat Aralığı</h4>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.priceRange.min}
                                            onChange={(e) => updateFilter('priceRange', {
                                                ...filters.priceRange,
                                                min: Number(e.target.value) || 0
                                            })}
                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.priceRange.max || ''}
                                            onChange={(e) => updateFilter('priceRange', {
                                                ...filters.priceRange,
                                                max: Number(e.target.value) || null
                                            })}
                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-900 mb-4">Arama</h4>
                                    <input
                                        type="text"
                                        placeholder="Ürün ara..."
                                        value={filters.searchQuery}
                                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-8">
                                <button 
                                    onClick={() => {
                                        clearFilters();
                                        setShowFilters(false);
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
                                >
                                    Temizle
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium"
                                >
                                    Uygula
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
