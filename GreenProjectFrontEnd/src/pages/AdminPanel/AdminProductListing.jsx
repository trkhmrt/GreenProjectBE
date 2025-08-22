import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryFilter from '../../components/Filters/CategoryFilter';
import ProductFilterContainer from '../../components/ProductFilters/ProductFilterContainer';
import ProductGrid from '../../components/ProductGrid';
import { getAllProducts } from '../../services/ProductService';
import { getHierarchicalNestedCategories } from '../../services/CategoryService';

const AdminProductListing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        categoryId: null,
        subCategoryId: null,
        searchQuery: '',
        priceRange: { min: 0, max: null },
        productTypes: [],
        inStock: false,
        outOfStock: false,
        properties: {}
    });
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showMobileCategories, setShowMobileCategories] = useState(false);

    // URL'den filtreleri yükle
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get('categoryId');
        const searchQuery = params.get('searchQuery');
        
        if (categoryId) {
            setFilters(prev => ({ ...prev, categoryId }));
        }
        if (searchQuery) {
            setFilters(prev => ({ ...prev, searchQuery }));
        }
    }, [location.search]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters(filters);
    }, [sortBy, filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            setError('Ürünler yüklenirken hata oluştu');
            console.error('Products fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getHierarchicalNestedCategories();
            setHierarchicalCategories(data);
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const handleCategorySelect = (category) => {
        if (category.categoryId === 'all') {
            setSelectedCategory('Tümü');
            setSelectedCategoryPath([]);
            setFilters(prev => ({ ...prev, categoryId: null, subCategoryId: null }));
        } else {
            setSelectedCategory(category.categoryName);
            const path = findCategoryPath(category.categoryId);
            setSelectedCategoryPath(path);
            setFilters(prev => ({ ...prev, categoryId: category.categoryId, subCategoryId: null }));
        }
    };

    const handleToggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const updateFilter = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const applySorting = (products, sortType) => {
        const sortedProducts = [...products];
        
        switch (sortType) {
            case 'newest':
                return sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'price-asc':
                return sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
            case 'price-desc':
                return sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
            case 'name-asc':
                return sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
            case 'name-desc':
                return sortedProducts.sort((a, b) => b.productName.localeCompare(a.productName));
            default:
                return sortedProducts;
        }
    };

    const applyFilters = (currentFilters) => {
        let filtered = [...products];

        if (currentFilters.categoryId && currentFilters.categoryId !== 'all') {
            filtered = filtered.filter(product => 
                product.categoryId === currentFilters.categoryId
            );
        }

        if (currentFilters.searchQuery) {
            filtered = filtered.filter(product =>
                product.productName.toLowerCase().includes(currentFilters.searchQuery.toLowerCase())
            );
        }

        if (currentFilters.priceRange.min > 0 || currentFilters.priceRange.max) {
            filtered = filtered.filter(product => {
                const price = product.productPrice;
                return price >= currentFilters.priceRange.min && 
                       (!currentFilters.priceRange.max || price <= currentFilters.priceRange.max);
            });
        }

        if (currentFilters.inStock && !currentFilters.outOfStock) {
            filtered = filtered.filter(product => {
                const stock = product.productType === 'SIMPLE' ? product.productQuantity : 
                    product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
                return stock > 0;
            });
        } else if (currentFilters.outOfStock && !currentFilters.inStock) {
            filtered = filtered.filter(product => {
                const stock = product.productType === 'SIMPLE' ? product.productQuantity : 
                    product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
                return stock === 0;
            });
        }

        if (currentFilters.productTypes && currentFilters.productTypes.length > 0) {
            filtered = filtered.filter(product => 
                currentFilters.productTypes.includes(product.productType)
            );
        }

        filtered = applySorting(filtered, sortBy);
        setFilteredProducts(filtered);
    };

    const findCategoryPath = (categoryId) => {
        const path = [];
        
        const searchInCategories = (categories) => {
            for (const category of categories) {
                if (category.categoryId === categoryId) {
                    path.push(category);
                    return true;
                }
                if (category.children && category.children.length > 0) {
                    path.push(category);
                    if (searchInCategories(category.children)) {
                        return true;
                    }
                    path.pop();
                }
            }
            return false;
        };
        
        searchInCategories(hierarchicalCategories);
        return path;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Modern Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                Ürün Yönetimi
                            </h1>
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                                <span>•</span>
                                <span>{filteredProducts.length} ürün</span>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                                onClick={() => navigate('/admin/products?tab=add')}
                                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden sm:inline">Yeni Ürün</span>
                                <span className="sm:hidden">Ekle</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex space-x-8 border-b border-gray-200">
                        <button
                            onClick={() => navigate('/admin/products?tab=add')}
                            className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
                        >
                            Ürün Ekle
                        </button>
                        <button className="py-3 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm">
                            Ürünleri Listele
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                {/* Mobile Filter Buttons */}
                <div className="lg:hidden mb-4 flex space-x-3">
                    <button
                        onClick={() => setShowMobileCategories(!showMobileCategories)}
                        className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7" />
                        </svg>
                        Kategoriler
                    </button>
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtreler
                    </button>
                </div>

                {/* Mobile Categories */}
                {showMobileCategories && (
                    <div className="lg:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <CategoryFilter
                                hierarchicalCategories={hierarchicalCategories}
                                filters={filters}
                                updateFilter={updateFilter}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Filters */}
                {showMobileFilters && (
                    <div className="lg:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <ProductFilterContainer
                                onFilterChange={handleFilterChange}
                                filters={filters}
                                selectedCategory={selectedCategory}
                                hierarchicalCategories={hierarchicalCategories}
                            />
                        </div>
                    </div>
                )}

                {/* Desktop Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar - Categories */}
                    <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Kategoriler</h2>
                                </div>
                                <div className="p-4">
                                    <CategoryFilter
                                        hierarchicalCategories={hierarchicalCategories}
                                        filters={filters}
                                        updateFilter={updateFilter}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Breadcrumb & Stats */}
                        <div className="mb-6">
                            {selectedCategoryPath.length > 0 && (
                                <nav className="flex mb-4" aria-label="Breadcrumb">
                                    <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm text-gray-500">
                                        <li>
                                            <button
                                                onClick={() => handleCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}
                                                className="hover:text-purple-600 transition-colors"
                                            >
                                                Tümü
                                            </button>
                                        </li>
                                        {selectedCategoryPath.map((category, index) => (
                                            <li key={category.categoryId} className="flex items-center">
                                                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <button
                                                    onClick={() => index < selectedCategoryPath.length - 1 ? handleCategorySelect(category) : null}
                                                    className={`${index === selectedCategoryPath.length - 1 
                                                        ? 'text-purple-600 font-medium' 
                                                        : 'hover:text-purple-600'} transition-colors`}
                                                >
                                                    {category.categoryName}
                                                </button>
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            )}

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-gray-900">{filteredProducts.length}</div>
                                    <div className="text-sm text-gray-500">Toplam Ürün</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-green-600">
                                        {filteredProducts.filter(p => p.productType === 'SIMPLE' ? p.productQuantity > 0 : p.variants?.some(v => v.stockQuantity > 0)).length}
                                    </div>
                                    <div className="text-sm text-gray-500">Stokta</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {filteredProducts.filter(p => p.productType === 'SIMPLE').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Basit Ürün</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {filteredProducts.filter(p => p.productType === 'VARIANT').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Varyantlı</div>
                                </div>
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Ürünler
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {filteredProducts.length} sonuç
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <label className="text-sm text-gray-700">Sırala:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                    >
                                        <option value="newest">En Yeni</option>
                                        <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
                                        <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
                                        <option value="name-asc">İsim (A-Z)</option>
                                        <option value="name-desc">İsim (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <ProductGrid
                                products={filteredProducts}
                                loading={loading}
                                error={error}
                                isAdmin={true}
                            />
                        </div>
                    </div>

                    {/* Right Sidebar - Filters */}
                    <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
                                </div>
                                <div className="p-4">
                                    <ProductFilterContainer
                                        onFilterChange={handleFilterChange}
                                        filters={filters}
                                        selectedCategory={selectedCategory}
                                        hierarchicalCategories={hierarchicalCategories}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductListing;


import CategoryFilter from '../../components/Filters/CategoryFilter';
import ProductFilterContainer from '../../components/ProductFilters/ProductFilterContainer';
import ProductGrid from '../../components/ProductGrid';
import { getAllProducts } from '../../services/ProductService';
import { getHierarchicalNestedCategories } from '../../services/CategoryService';

const AdminProductListing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        categoryId: null,
        subCategoryId: null,
        searchQuery: '',
        priceRange: { min: 0, max: null },
        productTypes: [],
        inStock: false,
        outOfStock: false,
        properties: {}
    });
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showMobileCategories, setShowMobileCategories] = useState(false);

    // URL'den filtreleri yükle
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get('categoryId');
        const searchQuery = params.get('searchQuery');
        
        if (categoryId) {
            setFilters(prev => ({ ...prev, categoryId }));
        }
        if (searchQuery) {
            setFilters(prev => ({ ...prev, searchQuery }));
        }
    }, [location.search]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters(filters);
    }, [sortBy, filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            setError('Ürünler yüklenirken hata oluştu');
            console.error('Products fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getHierarchicalNestedCategories();
            setHierarchicalCategories(data);
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const handleCategorySelect = (category) => {
        if (category.categoryId === 'all') {
            setSelectedCategory('Tümü');
            setSelectedCategoryPath([]);
            setFilters(prev => ({ ...prev, categoryId: null, subCategoryId: null }));
        } else {
            setSelectedCategory(category.categoryName);
            const path = findCategoryPath(category.categoryId);
            setSelectedCategoryPath(path);
            setFilters(prev => ({ ...prev, categoryId: category.categoryId, subCategoryId: null }));
        }
    };

    const handleToggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const updateFilter = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const applySorting = (products, sortType) => {
        const sortedProducts = [...products];
        
        switch (sortType) {
            case 'newest':
                return sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'price-asc':
                return sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
            case 'price-desc':
                return sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
            case 'name-asc':
                return sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
            case 'name-desc':
                return sortedProducts.sort((a, b) => b.productName.localeCompare(a.productName));
            default:
                return sortedProducts;
        }
    };

    const applyFilters = (currentFilters) => {
        let filtered = [...products];

        if (currentFilters.categoryId && currentFilters.categoryId !== 'all') {
            filtered = filtered.filter(product => 
                product.categoryId === currentFilters.categoryId
            );
        }

        if (currentFilters.searchQuery) {
            filtered = filtered.filter(product =>
                product.productName.toLowerCase().includes(currentFilters.searchQuery.toLowerCase())
            );
        }

        if (currentFilters.priceRange.min > 0 || currentFilters.priceRange.max) {
            filtered = filtered.filter(product => {
                const price = product.productPrice;
                return price >= currentFilters.priceRange.min && 
                       (!currentFilters.priceRange.max || price <= currentFilters.priceRange.max);
            });
        }

        if (currentFilters.inStock && !currentFilters.outOfStock) {
            filtered = filtered.filter(product => {
                const stock = product.productType === 'SIMPLE' ? product.productQuantity : 
                    product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
                return stock > 0;
            });
        } else if (currentFilters.outOfStock && !currentFilters.inStock) {
            filtered = filtered.filter(product => {
                const stock = product.productType === 'SIMPLE' ? product.productQuantity : 
                    product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
                return stock === 0;
            });
        }

        if (currentFilters.productTypes && currentFilters.productTypes.length > 0) {
            filtered = filtered.filter(product => 
                currentFilters.productTypes.includes(product.productType)
            );
        }

        filtered = applySorting(filtered, sortBy);
        setFilteredProducts(filtered);
    };

    const findCategoryPath = (categoryId) => {
        const path = [];
        
        const searchInCategories = (categories) => {
            for (const category of categories) {
                if (category.categoryId === categoryId) {
                    path.push(category);
                    return true;
                }
                if (category.children && category.children.length > 0) {
                    path.push(category);
                    if (searchInCategories(category.children)) {
                        return true;
                    }
                    path.pop();
                }
            }
            return false;
        };
        
        searchInCategories(hierarchicalCategories);
        return path;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Modern Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                Ürün Yönetimi
                            </h1>
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                                <span>•</span>
                                <span>{filteredProducts.length} ürün</span>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                                onClick={() => navigate('/admin/products?tab=add')}
                                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden sm:inline">Yeni Ürün</span>
                                <span className="sm:hidden">Ekle</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex space-x-8 border-b border-gray-200">
                        <button
                            onClick={() => navigate('/admin/products?tab=add')}
                            className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
                        >
                            Ürün Ekle
                        </button>
                        <button className="py-3 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm">
                            Ürünleri Listele
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                {/* Mobile Filter Buttons */}
                <div className="lg:hidden mb-4 flex space-x-3">
                    <button
                        onClick={() => setShowMobileCategories(!showMobileCategories)}
                        className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7" />
                        </svg>
                        Kategoriler
                    </button>
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtreler
                    </button>
                </div>

                {/* Mobile Categories */}
                {showMobileCategories && (
                    <div className="lg:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <CategoryFilter
                                hierarchicalCategories={hierarchicalCategories}
                                filters={filters}
                                updateFilter={updateFilter}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Filters */}
                {showMobileFilters && (
                    <div className="lg:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <ProductFilterContainer
                                onFilterChange={handleFilterChange}
                                filters={filters}
                                selectedCategory={selectedCategory}
                                hierarchicalCategories={hierarchicalCategories}
                            />
                        </div>
                    </div>
                )}

                {/* Desktop Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar - Categories */}
                    <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Kategoriler</h2>
                                </div>
                                <div className="p-4">
                                    <CategoryFilter
                                        hierarchicalCategories={hierarchicalCategories}
                                        filters={filters}
                                        updateFilter={updateFilter}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Breadcrumb & Stats */}
                        <div className="mb-6">
                            {selectedCategoryPath.length > 0 && (
                                <nav className="flex mb-4" aria-label="Breadcrumb">
                                    <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm text-gray-500">
                                        <li>
                                            <button
                                                onClick={() => handleCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}
                                                className="hover:text-purple-600 transition-colors"
                                            >
                                                Tümü
                                            </button>
                                        </li>
                                        {selectedCategoryPath.map((category, index) => (
                                            <li key={category.categoryId} className="flex items-center">
                                                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <button
                                                    onClick={() => index < selectedCategoryPath.length - 1 ? handleCategorySelect(category) : null}
                                                    className={`${index === selectedCategoryPath.length - 1 
                                                        ? 'text-purple-600 font-medium' 
                                                        : 'hover:text-purple-600'} transition-colors`}
                                                >
                                                    {category.categoryName}
                                                </button>
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            )}

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-gray-900">{filteredProducts.length}</div>
                                    <div className="text-sm text-gray-500">Toplam Ürün</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-green-600">
                                        {filteredProducts.filter(p => p.productType === 'SIMPLE' ? p.productQuantity > 0 : p.variants?.some(v => v.stockQuantity > 0)).length}
                                    </div>
                                    <div className="text-sm text-gray-500">Stokta</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {filteredProducts.filter(p => p.productType === 'SIMPLE').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Basit Ürün</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {filteredProducts.filter(p => p.productType === 'VARIANT').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Varyantlı</div>
                                </div>
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Ürünler
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {filteredProducts.length} sonuç
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <label className="text-sm text-gray-700">Sırala:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                    >
                                        <option value="newest">En Yeni</option>
                                        <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
                                        <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
                                        <option value="name-asc">İsim (A-Z)</option>
                                        <option value="name-desc">İsim (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <ProductGrid
                                products={filteredProducts}
                                loading={loading}
                                error={error}
                                isAdmin={true}
                            />
                        </div>
                    </div>

                    {/* Right Sidebar - Filters */}
                    <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
                                </div>
                                <div className="p-4">
                                    <ProductFilterContainer
                                        onFilterChange={handleFilterChange}
                                        filters={filters}
                                        selectedCategory={selectedCategory}
                                        hierarchicalCategories={hierarchicalCategories}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductListing;