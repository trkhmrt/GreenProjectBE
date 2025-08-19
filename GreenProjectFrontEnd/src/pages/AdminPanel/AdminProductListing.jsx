import React, { useState, useEffect } from 'react';
import CategorySidebar from '../../components/CategorySidebar';
import ProductFilterContainer from '../../components/ProductFilters/ProductFilterContainer';
import FilterHeader from '../../components/FilterHeader';
import ProductGrid from '../../components/ProductGrid';

const AdminProductListing = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [hierarchicalCategories, setHierarchicalCategories] = useState([]);
    const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [filters, setFilters] = useState({
        category: '',
        size: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        productType: '',
        inStock: false
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            // Gerçek API çağrısı yerine örnek veri kullanıyoruz
            // const response = await getAllProducts();
            setProducts(sampleProducts);
            setFilteredProducts(sampleProducts);
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
            setHierarchicalCategories(response.data);
            console.log('Hierarchical categories loaded:', response.data);
        } catch (error) {
            console.error('Hierarchical categories loading error:', error);
        }
    };

    // Kategorileri çıkar
    const categories = ['Tümü', ...new Set(products.map(product => product.categoryName))];

    // Filtreleme fonksiyonu
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const applyFilters = (currentFilters) => {
        let filtered = [...products];

        // Kategori filtresi
        if (selectedCategory !== 'Tümü') {
            filtered = filtered.filter(product => 
                product.categoryName === selectedCategory
            );
        }

        // Ürün tipi filtresi
        if (currentFilters.productType) {
            filtered = filtered.filter(product => 
                product.productType === currentFilters.productType
            );
        }

        // Beden filtresi (Giyim kategorisi için)
        if (currentFilters.size) {
            filtered = filtered.filter(product => 
                product.productProperties?.some(prop => 
                    prop.propertyName === 'Beden' && prop.value === currentFilters.size
                )
            );
        }

        // Renk filtresi (Giyim kategorisi için)
        if (currentFilters.color) {
            filtered = filtered.filter(product => 
                product.productProperties?.some(prop => 
                    prop.propertyName === 'Renk' && prop.value === currentFilters.color
                )
            );
        }

        // Fiyat aralığı filtresi
        if (currentFilters.minPrice) {
            filtered = filtered.filter(product => {
                const price = product.productType === 'SIMPLE' ? product.productPrice : 
                    (product.variants?.[0]?.price || 0);
                return price >= parseFloat(currentFilters.minPrice);
            });
        }

        if (currentFilters.maxPrice) {
            filtered = filtered.filter(product => {
                const price = product.productType === 'SIMPLE' ? product.productPrice : 
                    (product.variants?.[0]?.price || 0);
                return price <= parseFloat(currentFilters.maxPrice);
            });
        }

        // Stok durumu filtresi
        if (currentFilters.inStock) {
            filtered = filtered.filter(product => {
                const stock = product.productType === 'SIMPLE' ? product.productQuantity : 
                    product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
                return stock > 0;
            });
        }

        setFilteredProducts(filtered);
    };

    // Kategori seçimi
    const handleCategorySelect = (category) => {
        console.log('Kategori seçildi:', category);
        
        if (category.categoryId === 'all') {
            // Tümü seçildi
            setSelectedCategory('Tümü');
            setSelectedCategoryPath([]);
            const newFilters = {
                category: '',
                size: '',
                color: '',
                minPrice: '',
                maxPrice: '',
                productType: '',
                inStock: false
            };
            setFilters(newFilters);
            applyFilters(newFilters);
        } else {
            // Belirli bir kategori seçildi
            setSelectedCategory(category.categoryName);
            
            // Kategori path'ini oluştur
            const path = buildCategoryPath(category);
            setSelectedCategoryPath(path);
            
            const newFilters = {
                category: category.categoryName,
                size: '',
                color: '',
                minPrice: '',
                maxPrice: '',
                productType: '',
                inStock: false
            };
            setFilters(newFilters);
            applyFilters(newFilters);
        }
    };

    // Kategori path'ini oluştur
    const buildCategoryPath = (category) => {
        const path = [category];
        let currentCategory = category;
        
        // Parent kategorileri bul
        while (currentCategory.parentId) {
            const parent = findCategoryById(currentCategory.parentId);
            if (parent) {
                path.unshift(parent);
                currentCategory = parent;
            } else {
                break;
            }
        }
        
        return path;
    };

    // ID'ye göre kategori bul
    const findCategoryById = (categoryId) => {
        const searchInCategories = (categories) => {
            for (const category of categories) {
                if (category.categoryId === categoryId) {
                    return category;
                }
                if (category.children && category.children.length > 0) {
                    const found = searchInCategories(category.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        return searchInCategories(hierarchicalCategories);
    };

    // Kategori genişletme/daraltma
    const handleToggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Filtreleri temizle
    const clearFilters = () => {
        const clearedFilters = {
            category: selectedCategory === 'Tümü' ? '' : selectedCategory,
            size: '',
            color: '',
            minPrice: '',
            maxPrice: '',
            productType: '',
            inStock: false
        };
        setFilters(clearedFilters);
        setFilteredProducts(products);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                {/* Tab Menu */}
                <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
                    <button
                        className="px-4 sm:px-6 py-3 text-[14px] sm:text-[16px] font-semibold focus:outline-none transition-colors border-b-2 whitespace-nowrap border-transparent text-gray-500 hover:text-purple-600"
                        onClick={() => window.location.href = '/admin/products?tab=add'}
                    >
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            Ürün Ekle
                        </span>
                    </button>
                    <button
                        className="px-4 sm:px-6 py-3 text-[14px] sm:text-[16px] font-semibold focus:outline-none transition-colors border-b-2 whitespace-nowrap border-purple-600 text-purple-700 bg-gray-50"
                    >
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            Ürünleri Listele
                        </span>
                    </button>
                </div>

                {/* Başlık */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürün Yönetimi</h1>
                    <p className="text-gray-600">Ürünlerinizi görüntüleyin ve yönetin</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sol Sidebar - Kategoriler */}
                    <div className="lg:w-64 flex-shrink-0">
                        <CategorySidebar
                            hierarchicalCategories={hierarchicalCategories}
                            selectedCategoryPath={selectedCategoryPath}
                            onCategorySelect={handleCategorySelect}
                            expandedCategories={expandedCategories}
                            onToggleExpand={handleToggleExpand}
                        />
                    </div>

                    {/* Ana İçerik */}
                    <div className="flex-1">
                        {/* Ürün Başlığı */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                            <div className="p-4">
                                {/* Breadcrumb */}
                                {selectedCategoryPath.length > 0 && (
                                    <div className="mb-4 flex items-center text-sm text-gray-600">
                                        <span className="hover:text-purple-600 cursor-pointer" onClick={() => handleCategorySelect({ categoryId: 'all', categoryName: 'Tümü' })}>
                                            Tümü
                                        </span>
                                        {selectedCategoryPath.map((category, index) => (
                                            <React.Fragment key={category.categoryId}>
                                                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                                <span 
                                                    className={`${index === selectedCategoryPath.length - 1 ? 'text-purple-600 font-medium' : 'hover:text-purple-600 cursor-pointer'}`}
                                                    onClick={() => index < selectedCategoryPath.length - 1 ? handleCategorySelect(category) : null}
                                                >
                                                    {category.categoryName}
                                                </span>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Ürünler ({filteredProducts.length})
                                    </h2>
                                    
                                    {/* Sıralama Butonu */}
                                    <div className="flex items-center gap-3">
                                        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                            <option value="">Sırala</option>
                                            <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                                            <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                                            <option value="name-asc">İsim (A-Z)</option>
                                            <option value="name-desc">İsim (Z-A)</option>
                                        </select>
                                        
                                        {/* Mobil Filtre Toggle */}
                                        <button
                                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                                            className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                            Filtreler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kategori Filtreleri - Ürünlerin üzerinde */}
                        {console.log('Render - selectedCategory:', selectedCategory)}
                        {/* Test için zorla göster */}
                        {true && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{selectedCategory} Filtreleri</h3>
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                        >
                                            Filtreleri Temizle
                                        </button>
                                    </div>
                                    <div className="bg-red-100 p-4 rounded-lg">
                                        <h4 className="font-bold text-red-800">Test: Filtreler Burada Olmalı</h4>
                                        <p className="text-red-600">selectedCategory: {selectedCategory}</p>
                                        <p className="text-red-600">filters: {JSON.stringify(filters)}</p>
                                    </div>
                                    
                                    {/* Test: Direkt ClothingFilters */}
                                    {selectedCategory === 'Giyim' && (
                                        <div className="bg-blue-100 p-4 rounded-lg mb-4">
                                            <h4 className="font-bold text-blue-800">Giyim Filtreleri Test</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => handleFilterChange({ ...filters, size: filters.size === size ? '' : size })}
                                                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                                            filters.size === size
                                                                ? 'bg-purple-100 border-purple-300 text-purple-700'
                                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <ProductFilterContainer
                                        onFilterChange={handleFilterChange}
                                        filters={filters}
                                        selectedCategory={selectedCategory}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mobil Filtreler - Tüm kategoriler için */}
                        {showMobileFilters && (
                            <div className="lg:hidden mb-6">
                                <ProductFilterContainer
                                    onFilterChange={handleFilterChange}
                                    filters={filters}
                                    selectedCategory={selectedCategory}
                                />
                            </div>
                        )}

                        {/* Ürün Grid */}
                        <ProductGrid
                            products={filteredProducts}
                            loading={loading}
                            error={error}
                        />
                    </div>

                    {/* Sağ Sidebar - Filtreler (Desktop) - Sadece Tümü kategorisi için */}
                    {selectedCategory === 'Tümü' && (
                        <div className="lg:w-80 flex-shrink-0 lg:block">
                            <ProductFilterContainer
                                onFilterChange={handleFilterChange}
                                filters={filters}
                                selectedCategory={selectedCategory}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProductListing;