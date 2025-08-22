import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllProducts } from '../../services/ProductService';
import { getHierarchicalNestedCategories } from '../../services/CategoryService';
import AdminLayout from '../../layout/AdminLayout';

const AdminProductList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for products and categories
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [nameFilter, setNameFilter] = useState('');
    const [idFilter, setIdFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortBy, setSortBy] = useState('productId');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [paginatedProducts, setPaginatedProducts] = useState([]);

    // Load state from URL parameters
    const loadStateFromURL = useCallback(() => {
        const searchParams = new URLSearchParams(location.search);
        
        if (searchParams.get('nameFilter')) setNameFilter(searchParams.get('nameFilter'));
        if (searchParams.get('idFilter')) setIdFilter(searchParams.get('idFilter'));
        if (searchParams.get('categoryId')) setCategoryFilter(searchParams.get('categoryId'));
        if (searchParams.get('minPrice')) setMinPrice(searchParams.get('minPrice'));
        if (searchParams.get('maxPrice')) setMaxPrice(searchParams.get('maxPrice'));
        if (searchParams.get('stockFilter')) setStockFilter(searchParams.get('stockFilter'));
        if (searchParams.get('typeFilter')) setTypeFilter(searchParams.get('typeFilter'));
        if (searchParams.get('sortBy')) setSortBy(searchParams.get('sortBy'));
        if (searchParams.get('currentPage')) setCurrentPage(parseInt(searchParams.get('currentPage')));
        
        // Restore scroll position
        setTimeout(() => {
            if (searchParams.get('scrollPosition')) {
                window.scrollTo(0, parseInt(searchParams.get('scrollPosition')));
            }
        }, 100);
    }, [location.search]);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const data = await getHierarchicalNestedCategories();
            setHierarchicalCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    // Apply filters
    const applyFilters = useCallback(() => {
        let filtered = [...products];

        // Name filter
        if (nameFilter) {
            filtered = filtered.filter(product =>
                product.productName?.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        // ID filter
        if (idFilter) {
            filtered = filtered.filter(product => 
                product.productId.toString().includes(idFilter)
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(product => 
                product.categoryId === parseInt(categoryFilter)
            );
        }

        // Price filter
        if (minPrice) {
            filtered = filtered.filter(product => 
                Number(product.productPrice || 0) >= Number(minPrice)
            );
        }
        if (maxPrice) {
            filtered = filtered.filter(product => 
                Number(product.productPrice || 0) <= Number(maxPrice)
            );
        }

        // Stock filter
        if (stockFilter === 'inStock') {
            filtered = filtered.filter(product => {
                if (product.productType === 'SIMPLE') {
                    return Number(product.productQuantity || 0) > 0;
                } else if (product.productType === 'VARIANT') {
                    if (product.productQuantity && Number(product.productQuantity) > 0) {
                        return true;
                    }
                    if (product.variants && product.variants.length > 0) {
                        return product.variants.some(variant => Number(variant.stockQuantity || 0) > 0);
                    }
                    return false;
                }
                return false;
            });
        } else if (stockFilter === 'outOfStock') {
            filtered = filtered.filter(product => {
                if (product.productType === 'SIMPLE') {
                    return Number(product.productQuantity || 0) === 0;
                } else if (product.productType === 'VARIANT') {
                    const hasProductStock = product.productQuantity && Number(product.productQuantity) > 0;
                    const hasVariantStock = product.variants && product.variants.length > 0 && 
                                          product.variants.some(variant => Number(variant.stockQuantity || 0) > 0);
                    return !hasProductStock && !hasVariantStock;
                }
                return true;
            });
        }

        // Type filter
        if (typeFilter) {
            filtered = filtered.filter(product => 
                product.productType === typeFilter
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'productId':
                    aValue = a.productId;
                    bValue = b.productId;
                    break;
                case 'productName':
                    aValue = a.productName || '';
                    bValue = b.productName || '';
                    break;
                case 'productPrice':
                    aValue = Number(a.productPrice || 0);
                    bValue = Number(b.productPrice || 0);
                    break;
                case 'categoryId':
                    aValue = a.categoryId || 0;
                    bValue = b.categoryId || 0;
                    break;
                default:
                    aValue = a.productId;
                    bValue = b.productId;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return bValue - aValue; // Descending
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return bValue.localeCompare(aValue); // Descending
            }

            return 0;
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [products, nameFilter, idFilter, categoryFilter, minPrice, maxPrice, stockFilter, typeFilter, sortBy]);

    // Apply pagination
    const applyPagination = useCallback(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredProducts.slice(startIndex, endIndex);
        setPaginatedProducts(paginated);
    }, [filteredProducts, currentPage, itemsPerPage]);

    // Effects
    useEffect(() => {
        fetchProducts();
        fetchCategories();
        loadStateFromURL();
    }, [fetchProducts, fetchCategories, loadStateFromURL]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    useEffect(() => {
        applyPagination();
    }, [applyPagination]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Ürünler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Ürün Listesi</h1>
                    <p className="text-gray-600 mt-1">Tüm ürünleri görüntüleyin ve yönetin</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Product Name Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                            <input
                                type="text"
                                placeholder="Ürün adı ara..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Product ID Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün ID</label>
                            <input
                                type="text"
                                placeholder="Ürün ID ara..."
                                value={idFilter}
                                onChange={(e) => setIdFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Tüm Kategoriler</option>
                                {Array.isArray(hierarchicalCategories) && hierarchicalCategories.map(category => (
                                    <React.Fragment key={category.categoryId}>
                                        <option value={category.categoryId}>{category.categoryName}</option>
                                        {category.subCategories && category.subCategories.map(subCategory => (
                                            <option key={subCategory.categoryId} value={subCategory.categoryId}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;├ {subCategory.categoryName}
                                            </option>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Product Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Tipi</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Tüm Tipler</option>
                                <option value="SIMPLE">Basit Ürün</option>
                                <option value="VARIANT">Varyantlı Ürün</option>
                            </select>
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stok Durumu</label>
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Tümü</option>
                                <option value="inStock">Stokta Var</option>
                                <option value="outOfStock">Stokta Yok</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="productId">Ürün ID</option>
                                <option value="productName">Ürün Adı</option>
                                <option value="productPrice">Fiyat</option>
                                <option value="categoryId">Kategori</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={() => {
                                setNameFilter('');
                                setIdFilter('');
                                setCategoryFilter('');
                                setMinPrice('');
                                setMaxPrice('');
                                setStockFilter('');
                                setTypeFilter('');
                                setSortBy('productId');
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Filtreleri Temizle
                        </button>
                        <span className="text-sm text-gray-600">
                            <span className="font-medium">{filteredProducts.length}</span> ürün bulundu
                        </span>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ürün Adı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fiyat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tip
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedProducts.map((product) => (
                                    <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{product.productId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.productName || 'İsimsiz Ürün'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.productPrice ? `${product.productPrice} ₺` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.productType === 'SIMPLE' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {product.productType === 'SIMPLE' ? 'Basit' : 'Varyantlı'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.productType === 'SIMPLE' 
                                                ? (product.productQuantity || 0)
                                                : (product.variants?.length || 0) + ' varyant'
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams();
                                                    if (nameFilter) params.set('nameFilter', nameFilter);
                                                    if (idFilter) params.set('idFilter', idFilter);
                                                    if (categoryFilter) params.set('categoryId', categoryFilter);
                                                    if (minPrice) params.set('minPrice', minPrice);
                                                    if (maxPrice) params.set('maxPrice', maxPrice);
                                                    if (stockFilter) params.set('stockFilter', stockFilter);
                                                    if (typeFilter) params.set('typeFilter', typeFilter);
                                                    if (sortBy) params.set('sortBy', sortBy);
                                                    params.set('currentPage', currentPage);
                                                    params.set('scrollPosition', window.pageYOffset);
                                                    
                                                    const queryString = params.toString();
                                                    navigate(`/admin/products/${product.productId}${queryString ? `?${queryString}` : ''}`);
                                                }}
                                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                Düzenle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    Sonraki
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                        {' '}-{' '}
                                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span>
                                        {' '}arası, toplam{' '}
                                        <span className="font-medium">{filteredProducts.length}</span>
                                        {' '}ürün gösteriliyor
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <span className="sr-only">Önceki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            pageNumber === currentPage
                                                                ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage + 2
                                            ) {
                                                return (
                                                    <span
                                                        key={pageNumber}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                        
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <span className="sr-only">Sonraki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminProductList;
