import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryFilter from '../../components/Filters/CategoryFilter';
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
        productTypes: [], // Array olarak değiştirdim
        inStock: false,
        outOfStock: false,
        properties: {}
    });
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [sortBy, setSortBy] = useState('newest'); // Sıralama seçeneği

    // Örnek veri - gerçek API'den gelecek
    const sampleProducts = [
        {
            "productId": 1,
            "productName": "asdadas",
            "productModel": null,
            "productBrand": "asdasdas",
            "productType": "SIMPLE",
            "productDescription": "sadasdasadsadsadsad",
            "productPrice": 222,
            "productQuantity": 22,
            "productImageUrl": null,
            "subCategoryId": 25,
            "subCategoryName": "Unisex Giyim",
            "categoryName": "Giyim",
            "productProperties": [],
            "imageFiles": [],
            "variants": [
                {
                    "variantId": 1,
                    "productId": null,
                    "sku": "",
                    "price": 222,
                    "stockQuantity": 22,
                    "isActive": null,
                    "variantImagePaths": null,
                    "properties": null
                }
            ]
        },
        {
            "productId": 2,
            "productName": "asdasdsadsadsadsasadasdas",
            "productModel": null,
            "productBrand": "asdasdsadsadsadsasadasdas",
            "productType": "SIMPLE",
            "productDescription": "asdasdsadsadsadsasadasdas",
            "productPrice": 22,
            "productQuantity": 2,
            "productImageUrl": null,
            "subCategoryId": 17,
            "subCategoryName": "Erkek Giyim",
            "categoryName": "Giyim",
            "productProperties": [],
            "imageFiles": [],
            "variants": [
                {
                    "variantId": 2,
                    "productId": null,
                    "sku": "",
                    "price": 22,
                    "stockQuantity": 2,
                    "isActive": true,
                    "variantImagePaths": null,
                    "properties": null
                }
            ]
        },
        {
            "productId": 6,
            "productName": "dsadsadsadsadsa",
            "productModel": null,
            "productBrand": "sadsadsadsadsa",
            "productType": "SIMPLE",
            "productDescription": "dsadsadsadsa",
            "productPrice": 22,
            "productQuantity": 22,
            "productImageUrl": null,
            "subCategoryId": 25,
            "subCategoryName": "Unisex Giyim",
            "categoryName": "Giyim",
            "productProperties": [
                {
                    "id": 1,
                    "propertyId": 6,
                    "propertyName": "Beden",
                    "value": "M"
                },
                {
                    "id": 2,
                    "propertyId": 7,
                    "propertyName": "Renk",
                    "value": "Sarı"
                },
                {
                    "id": 3,
                    "propertyId": 8,
                    "propertyName": "Kalıp",
                    "value": "Slim Fit"
                }
            ],
            "imageFiles": [],
            "variants": [
                {
                    "variantId": 6,
                    "productId": null,
                    "sku": "",
                    "price": 22,
                    "stockQuantity": 22,
                    "isActive": true,
                    "variantImagePaths": null,
                    "properties": null
                }
            ]
        },
        {
            "productId": 7,
            "productName": "jajdasdlasldasldlajsldlakj",
            "productModel": null,
            "productBrand": "sajldasldlajajdasdlasldasldlajsldlakj",
            "productType": "VARIANT",
            "productDescription": "jajdasdlasldasldlajsldlakjjajdasdlasldasldlajsldlakj",
            "productPrice": null,
            "productQuantity": null,
            "productImageUrl": null,
            "subCategoryId": 1,
            "subCategoryName": "Telefon Kılıfı",
            "categoryName": "Telefon",
            "productProperties": [
                {
                    "id": 4,
                    "propertyId": 1,
                    "propertyName": "Ram",
                    "value": "8GB"
                },
                {
                    "id": 5,
                    "propertyId": 5,
                    "propertyName": "Ekran Boyutu",
                    "value": "6.1 inch"
                }
            ],
            "imageFiles": [],
            "variants": [
                {
                    "variantId": 7,
                    "productId": null,
                    "sku": "hajhdjhsajd",
                    "price": 22,
                    "stockQuantity": 2,
                    "isActive": true,
                    "variantImagePaths": null,
                    "properties": null
                }
            ]
        }
    ];

    useEffect(() => {
        loadProducts();
        loadHierarchicalCategories();
        loadFiltersFromURL();
    }, []);

    // URL'den filtreleri yükle
    const loadFiltersFromURL = () => {
        const searchParams = new URLSearchParams(location.search);
        const urlFilters = {
            categoryId: searchParams.get('categoryId'),
            subCategoryId: searchParams.get('subCategoryId'),
            searchQuery: searchParams.get('searchQuery') || '',
            productTypes: searchParams.get('productTypes')?.split(',').filter(Boolean) || [],
            inStock: searchParams.get('inStock') === 'true',
            outOfStock: searchParams.get('outOfStock') === 'true',
            sortBy: searchParams.get('sortBy') || 'newest'
        };

        // URL'den gelen filtreleri state'e uygula
        setFilters(prev => ({
            ...prev,
            ...urlFilters
        }));

        // Scroll pozisyonunu geri yükle
        const scrollPosition = searchParams.get('scrollPosition');
        if (scrollPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(scrollPosition));
            }, 100);
        }
    };

    // Filtreleme işlemi
    useEffect(() => {
        applyFilters(filters);
    }, [products, filters]);

    // Ürünler yüklendiğinde sıralama uygula
    useEffect(() => {
        if (products.length > 0 && sortBy) {
            handleSort(sortBy);
        }
    }, [products, sortBy]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            // Gerçek API'den ürünleri çek
            const response = await getAllProducts();
            console.log('🚀 API\'den gelen ürünler:');
            response.forEach((product, index) => {
                console.log(`${index + 1}. ${product.productName} - productType: "${product.productType}"`);
            });
            setProducts(response);
            setFilteredProducts(response);
        } catch (error) {
            setError('Ürünler yüklenirken hata oluştu');
            console.error('Ürün yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadHierarchicalCategories = async () => {
        try {
            const response = await getHierarchicalNestedCategories();
            setHierarchicalCategories(response.data || response);
            console.log('Hierarchical categories loaded:', response.data || response);
        } catch (error) {
            console.error('Hierarchical categories loading error:', error);
        }
    };

    // Filter update fonksiyonu
    const updateFilter = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        updateURLWithFilters({ ...filters, [filterName]: value });
    };

    // URL'yi filtrelerle güncelle
    const updateURLWithFilters = (currentFilters) => {
        const params = new URLSearchParams();
        
        if (currentFilters.categoryId) params.set('categoryId', currentFilters.categoryId);
        if (currentFilters.subCategoryId) params.set('subCategoryId', currentFilters.subCategoryId);
        if (currentFilters.searchQuery) params.set('searchQuery', currentFilters.searchQuery);
        if (currentFilters.productTypes.length > 0) params.set('productTypes', currentFilters.productTypes.join(','));
        if (currentFilters.inStock) params.set('inStock', 'true');
        if (currentFilters.outOfStock) params.set('outOfStock', 'true');
        if (currentFilters.sortBy) params.set('sortBy', currentFilters.sortBy);

        const queryString = params.toString();
        navigate(`/admin/products${queryString ? `?${queryString}` : ''}`, { replace: true });
    };

    // Filtreleme fonksiyonu
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const applyFilters = (currentFilters) => {
        let filtered = [...products];

        // Kategori filtresi
        if (currentFilters.categoryId) {
            filtered = filtered.filter(product => 
                product.categoryId === currentFilters.categoryId
            );
        }

        // Alt kategori filtresi
        if (currentFilters.subCategoryId) {
            filtered = filtered.filter(product => 
                product.categoryId === currentFilters.subCategoryId
            );
        }

        // Arama filtresi
        if (currentFilters.searchQuery) {
            filtered = filtered.filter(product => 
                product.productName.toLowerCase().includes(currentFilters.searchQuery.toLowerCase()) ||
                product.productDescription.toLowerCase().includes(currentFilters.searchQuery.toLowerCase()) ||
                product.productBrand?.toLowerCase().includes(currentFilters.searchQuery.toLowerCase())
            );
        }

        // Fiyat filtresi
        if (currentFilters.priceRange.max) {
            filtered = filtered.filter(product => {
                const price = product.productType === 'VARIANT' 
                    ? Math.min(...product.variants.map(v => v.price))
                    : product.productPrice;
                return price >= currentFilters.priceRange.min && price <= currentFilters.priceRange.max;
            });
        }

        // Ürün tipi filtresi
        if (currentFilters.productTypes && currentFilters.productTypes.length > 0) {
            filtered = filtered.filter(product => 
                currentFilters.productTypes.includes(product.productType)
            );
        }

        // Stok durumu filtresi
        if (currentFilters.inStock && !currentFilters.outOfStock) {
            // Sadece stokta olanlar
            filtered = filtered.filter(product => {
                const stock = product.productType === 'SIMPLE' ? product.productQuantity : 
                    product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
                return stock > 0;
            });
        } else if (currentFilters.outOfStock && !currentFilters.inStock) {
            // Sadece stokta olmayanlar
            filtered = filtered.filter(product => {
                const stock = product.productType === 'SIMPLE' ? product.productQuantity : 
                    product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
                return stock === 0;
            });
        } else if (currentFilters.inStock && currentFilters.outOfStock) {
            // Hem stokta olanlar hem stokta olmayanlar (tümü)
            // Filtreleme yapmıyoruz, tüm ürünler gösteriliyor
        }
        // Eğer hiçbiri seçili değilse de tüm ürünler gösteriliyor

        // Özellik filtreleri (varyantlı ürünler için)
        Object.entries(currentFilters.properties).forEach(([propertyId, value]) => {
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

        // Filtreleme sonrası mevcut sıralamayı uygula
        if (sortBy) {
            // Sıralama için filtrelenmiş ürünleri kullan
            let sorted = [...filtered];
            
            switch (sortBy) {
                case 'name':
                    sorted.sort((a, b) => a.productName.localeCompare(b.productName));
                    break;
                case 'price_asc':
                    sorted.sort((a, b) => {
                        const priceA = a.productType === 'SIMPLE' ? a.productPrice : (a.variants?.[0]?.price || 0);
                        const priceB = b.productType === 'SIMPLE' ? b.productPrice : (b.variants?.[0]?.price || 0);
                        return priceA - priceB;
                    });
                    break;
                case 'price_desc':
                    sorted.sort((a, b) => {
                        const priceA = a.productType === 'SIMPLE' ? a.productPrice : (a.variants?.[0]?.price || 0);
                        const priceB = b.productType === 'SIMPLE' ? b.productPrice : (b.variants?.[0]?.price || 0);
                        return priceB - priceA;
                    });
                    break;
                case 'newest':
                    sorted.sort((a, b) => b.productId - a.productId);
                    break;
                case 'category':
                    sorted.sort((a, b) => {
                        const categoryA = a.categoryName || '';
                        const categoryB = b.categoryName || '';
                        return categoryA.localeCompare(categoryB);
                    });
                    break;
                default:
                    break;
            }
            
            setFilteredProducts(sorted);
        } else {
            setFilteredProducts(filtered);
        }
    };



    // Sıralama fonksiyonu
    const handleSort = (sortType) => {
        setSortBy(sortType);
        // Mevcut filtrelenmiş ürünleri sırala
        applyFilters(filters);
    };

    // Filtreleri temizle
    const clearFilters = () => {
        const clearedFilters = {
            categoryId: null,
            subCategoryId: null,
            searchQuery: '',
            priceRange: { min: 0, max: null },
            productTypes: [],
            inStock: false,
            outOfStock: false,
            properties: {}
        };
        setFilters(clearedFilters);
        updateURLWithFilters(clearedFilters);
    };

    // Ürün düzenleme sayfasına git
    const handleEditProduct = (productId) => {
        // Mevcut scroll pozisyonunu kaydet
        const scrollPosition = window.pageYOffset;
        
        // Filtreleri ve scroll pozisyonunu URL'de koru
        const params = new URLSearchParams();
        
        if (filters.categoryId) params.set('categoryId', filters.categoryId);
        if (filters.subCategoryId) params.set('subCategoryId', filters.subCategoryId);
        if (filters.searchQuery) params.set('searchQuery', filters.searchQuery);
        if (filters.productTypes.length > 0) params.set('productTypes', filters.productTypes.join(','));
        if (filters.inStock) params.set('inStock', 'true');
        if (filters.outOfStock) params.set('outOfStock', 'true');
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        params.set('scrollPosition', scrollPosition.toString());

        const queryString = params.toString();
        navigate(`/admin/products/${productId}${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <div className="w-full">
            {/* Başlık */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürün Yönetimi</h1>
                <p className="text-gray-600">Ürünlerinizi görüntüleyin ve yönetin</p>
            </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sol Sidebar - Kategoriler */}
                    <div className="lg:w-64 flex-shrink-0">
                        <CategoryFilter
                            hierarchicalCategories={hierarchicalCategories}
                            filters={filters}
                            updateFilter={updateFilter}
                        />
                    </div>

                    {/* Ana İçerik */}
                    <div className="flex-1">
                        {/* Ürün Başlığı */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Ürünler ({filteredProducts.length})
                                    </h2>
                                    
                                    {/* Sıralama Seçenekleri */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700">Sırala:</span>
                                        <div className="flex space-x-2">
                                            <span
                                                onClick={() => handleSort('newest')}
                                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                                                    sortBy === 'newest'
                                                        ? 'text-purple-600 font-medium'
                                                        : 'text-gray-600 hover:text-purple-600'
                                                }`}
                                            >
                                                Son Eklenen
                                            </span>
                                            <span
                                                onClick={() => handleSort('name')}
                                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                                                    sortBy === 'name'
                                                        ? 'text-purple-600 font-medium'
                                                        : 'text-gray-600 hover:text-purple-600'
                                                }`}
                                            >
                                                Ada Göre
                                            </span>
                                            <span
                                                onClick={() => handleSort('category')}
                                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                                                    sortBy === 'category'
                                                        ? 'text-purple-600 font-medium'
                                                        : 'text-gray-600 hover:text-purple-600'
                                                }`}
                                            >
                                                Kategoriye Göre
                                            </span>
                                            <span
                                                onClick={() => handleSort('price_asc')}
                                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                                                    sortBy === 'price_asc'
                                                        ? 'text-purple-600 font-medium'
                                                        : 'text-gray-600 hover:text-purple-600'
                                                }`}
                                            >
                                                Fiyat (Düşük)
                                            </span>
                                            <span
                                                onClick={() => handleSort('price_desc')}
                                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                                                    sortBy === 'price_desc'
                                                        ? 'text-purple-600 font-medium'
                                                        : 'text-gray-600 hover:text-purple-600'
                                                }`}
                                            >
                                                Fiyat (Yüksek)
                                            </span>
                                        </div>
                                        

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Arama Filtresi */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Arama</h3>
                                    {filters.searchQuery && (
                                        <button
                                            onClick={() => updateFilter('searchQuery', '')}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                        >
                                            Temizle
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ürün ara..."
                                        value={filters.searchQuery}
                                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-200 transition-all duration-200"
                                    />
                                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Ürün Tipi Filtreleri */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Ürün Tipi Filtreleri</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                    >
                                        Filtreleri Sıfırla
                                    </button>
                                </div>
                                
                                {/* Ürün Tipi Checkbox'ları */}
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.productTypes.includes('SIMPLE')}
                                            onChange={(e) => {
                                                const newProductTypes = e.target.checked
                                                    ? [...filters.productTypes, 'SIMPLE']
                                                    : filters.productTypes.filter(type => type !== 'SIMPLE');
                                                updateFilter('productTypes', newProductTypes);
                                            }}
                                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-900">Basit Ürünler</span>
                                        </div>
                                    </label>
                                    
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.productTypes.includes('VARIANT')}
                                            onChange={(e) => {
                                                const newProductTypes = e.target.checked
                                                    ? [...filters.productTypes, 'VARIANT']
                                                    : filters.productTypes.filter(type => type !== 'VARIANT');
                                                updateFilter('productTypes', newProductTypes);
                                            }}
                                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-900">Varyantlı Ürünler</span>
                                        </div>
                                    </label>
                                </div>
                                
                                {/* Stok Durumu Filtresi */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.inStock}
                                                onChange={(e) => updateFilter('inStock', e.target.checked)}
                                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-900">Stokta Olanlar</span>
                                            </div>
                                        </label>
                                        
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.outOfStock}
                                                onChange={(e) => updateFilter('outOfStock', e.target.checked)}
                                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-900">Stokta Olmayanlar</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Ürün Listesi */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            {loading && (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Ürünler yükleniyor...</p>
                                </div>
                            )}

                            {error && (
                                <div className="p-8 text-center">
                                    <div className="text-red-400 mb-4">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">{error}</p>
                                </div>
                            )}

                            {!loading && !error && filteredProducts.length === 0 && (
                                <div className="p-8 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Ürün bulunamadı</p>
                                </div>
                            )}

                            {!loading && !error && filteredProducts.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ürün Bilgileri
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kategori
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fiyat
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stok
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tip
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İşlemler
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredProducts.map((product) => (
                                                <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                {product.imageFiles && product.imageFiles.length > 0 ? (
                                                                    <img 
                                                                        className="h-12 w-12 rounded-lg object-cover" 
                                                                        src={product.imageFiles[0]} 
                                                                        alt={product.productName}
                                                                    />
                                                                ) : (
                                                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {product.productName}
                                                                </div>
                                                                {product.productBrand && (
                                                                    <div className="text-sm text-gray-500">
                                                                        {product.productBrand}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{product.categoryName}</div>
                                                        {product.subCategoryName && (
                                                            <div className="text-sm text-gray-500">{product.subCategoryName}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.productType === 'SIMPLE' 
                                                                ? `${product.productPrice} TL`
                                                                : product.variants && product.variants.length > 0
                                                                    ? `${product.variants[0].price} TL`
                                                                    : 'Fiyat belirtilmemiş'
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`text-sm font-medium ${
                                                            (product.productType === 'SIMPLE' ? product.productQuantity : 
                                                             product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0) || 0) > 0
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}>
                                                            {product.productType === 'SIMPLE' 
                                                                ? product.productQuantity
                                                                : product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0) || 0
                                                            } adet
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            product.productType === 'VARIANT'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {product.productType === 'VARIANT' ? 'Varyantlı' : 'Basit'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button 
                                                                onClick={() => handleEditProduct(product.productId)}
                                                                className="text-purple-600 hover:text-purple-900 transition-colors"
                                                            >
                                                                Düzenle
                                                            </button>
                                                            <button className="text-red-600 hover:text-red-900 transition-colors">
                                                                Sil
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
        </div>
    );
};

export default AdminProductListing;