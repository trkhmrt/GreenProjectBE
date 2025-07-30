import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAllProducts } from "../services/ProductService.js";
import { getAllCategories } from "../services/CategoryService.js";
import { addProductToBasket } from "../services/BasketService.js";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const categoryName = location.state?.categoryName || 'Kategori';
    const initialSelectedCategoryId = location.state?.selectedCategoryId;

    // State'ler
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    // Filtre state'leri
    const [selectedFilters, setSelectedFilters] = useState({
        boy: [],
        beden: [],
        renk: [],
        fiyatMin: '',
        fiyatMax: '',
        marka: [],
        kategori: [],
        subcategory: [] // yeni: alt kategori seçimi
    });

    // Collapse state'leri - kategori filtresi her zaman açık
    const [collapsedFilters, setCollapsedFilters] = useState({
        kategori: false,
        boy: true,
        beden: true,
        renk: true,
        fiyat: true,
        marka: true
    });

    // Kategori arama state'i
    const [categorySearch, setCategorySearch] = useState('');

    // Sıralama state'i
    const [sortOption, setSortOption] = useState('default');

    // Dummy filtre seçenekleri
    const filterOptions = {
        boy: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        beden: ['36', '38', '40', '42', '44', '46', '48'],
        renk: ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Siyah', 'Beyaz', 'Gri', 'Mor'],
        marka: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok', 'New Balance']
    };

    // Mobil modal state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Dinamik sticky bar top değeri için ref ve state kaldırıldı

    // Add a new state to hold dynamic filters for the selected category
    const [categoryDynamicFilters, setCategoryDynamicFilters] = useState([]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Ana kategorileri ve alt kategorileri endpointten çek
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const productsData = await getAllProducts();
                console.log(productsData);
                const categoriesData = await getAllCategories();
                console.log(categoriesData);
                // Ana kategoriler ve alt kategoriler - SADECE AKTİF OLANLAR
                const mainCategories = (categoriesData.data || [])
                    .filter(cat => cat.isActive === true) // Sadece aktif kategorileri al
                    .map(cat => ({
                        id: cat.categoryId,
                        name: cat.categoryName,
                        subcategories: (cat.subcategories || []).filter(sub => sub.isActive === true), // Sadece aktif alt kategorileri al
                        filters: cat.filters || [] // <-- filters eklendi
                    }));
                setCategories(mainCategories);
                // Kategoriye göre ürünleri filtrele (ilk açılışta, route ile gelirse)
                let categoryProducts = productsData;
                if (categoryId) {
                    // Seçili ana kategorinin alt kategorilerini bul
                    const selectedCat = mainCategories.find(cat => cat.id === parseInt(categoryId));
                    if (selectedCat && selectedCat.subcategories.length > 0) {
                        const subIds = selectedCat.subcategories.map(sub => sub.id);
                        categoryProducts = productsData.filter(product => subIds.includes(product.subCategoryId));
                    }
                }
                setProducts(categoryProducts);
                setFilteredProducts(categoryProducts);
            } catch (error) {
                console.error('Data loading error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [categoryId]);

    // İlk yüklemede Hero'dan gelen kategori seçimini uygula
    useEffect(() => {
        if (initialSelectedCategoryId && categories.length > 0) {
            setSelectedFilters(prev => ({
                ...prev,
                kategori: [initialSelectedCategoryId],
                subcategory: []
            }));
        }
    }, [initialSelectedCategoryId, categories]);

    // Update dynamic filters when selected category changes
    useEffect(() => {
        if (selectedFilters.kategori.length === 1) {
            const selectedCat = categories.find(cat => cat.id === selectedFilters.kategori[0]);
            setCategoryDynamicFilters(selectedCat?.filters || []);
        } else {
            setCategoryDynamicFilters([]);
        }
    }, [selectedFilters.kategori, categories]);

    // Filtreleme fonksiyonu
    const applyFilters = () => {
        let filtered = [...products];

        // Kategori ve alt kategori filtresi
        if (selectedFilters.kategori.length > 0) {
            // Seçili ana kategorilerin alt kategori id'lerini topla
            const selectedMainCats = categories.filter(cat => selectedFilters.kategori.includes(cat.id));
            const allSubIds = selectedMainCats.flatMap(cat => cat.subcategories.map(sub => sub.id));
            // Eğer alt kategori seçiliyse sadece onları filtrele
            if (selectedFilters.subcategory.length > 0) {
                filtered = filtered.filter(product => selectedFilters.subcategory.includes(product.subCategoryId));
            } else {
                filtered = filtered.filter(product => allSubIds.includes(product.subCategoryId));
            }
        }

        // Boy filtresi
        if (selectedFilters.boy.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.boy.some(boy => 
                    product.productName?.toLowerCase().includes(boy.toLowerCase())
                )
            );
        }

        // Beden filtresi
        if (selectedFilters.beden.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.beden.some(beden => 
                    product.productName?.toLowerCase().includes(beden.toLowerCase())
                )
            );
        }

        // Renk filtresi
        if (selectedFilters.renk.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.renk.some(renk => 
                    product.productName?.toLowerCase().includes(renk.toLowerCase())
                )
            );
        }

        // Fiyat filtresi
        if (selectedFilters.fiyatMin) {
            filtered = filtered.filter(product => 
                product.productPrice >= parseFloat(selectedFilters.fiyatMin)
            );
        }
        if (selectedFilters.fiyatMax) {
            filtered = filtered.filter(product => 
                product.productPrice <= parseFloat(selectedFilters.fiyatMax)
            );
        }

        // Marka filtresi
        if (selectedFilters.marka.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.marka.some(marka => 
                    product.productName?.toLowerCase().includes(marka.toLowerCase())
                )
            );
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    // Filtre değişikliklerini uygula
    useEffect(() => {
        applyFilters();
    }, [selectedFilters]);

    // Filtre toggle
    const toggleFilter = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    };

    // Collapse toggle
    const toggleCollapse = (filterType) => {
        setCollapsedFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
    };

    // Filtreleri temizle
    const clearFilters = () => {
        setSelectedFilters({
            boy: [],
            beden: [],
            renk: [],
            fiyatMin: '',
            fiyatMax: '',
            marka: [],
            kategori: [],
            subcategory: []
        });
        setCategorySearch('');
    };

    // Sepete ekle
    const handleAddToBasket = async (productId) => {
        try {
            await addProductToBasket(productId);
            alert('Ürün sepete eklendi!');
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            alert('Ürün sepete eklenirken bir hata oluştu.');
        }
    };

    // Kategori arama ile filtrelenmiş liste
    const filteredCategoryList = categories.filter(cat =>
        cat.name && cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Sıralama fonksiyonu
    const sortProducts = (products) => {
        if (sortOption === 'price-asc') {
            return [...products].sort((a, b) => a.productPrice - b.productPrice);
        } else if (sortOption === 'price-desc') {
            return [...products].sort((a, b) => b.productPrice - a.productPrice);
        } else if (sortOption === 'latest') {
            return [...products].sort((a, b) => new Date(b.createdAt || b.created_date) - new Date(a.createdAt || a.created_date));
        }
        return products;
    };

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const sortedProducts = sortProducts(filteredProducts);
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-[#6C2BD7] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Ürünler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
                            <p className="text-gray-600 mt-1">{filteredProducts.length} ürün bulundu</p>
                        </div>
                        {/* Mobilde kategori modal butonu */}
                        {isMobile && (
                            <button
                                onClick={() => setShowCategoryModal(true)}
                                className="ml-auto px-4 py-2 bg-[#6C2BD7] text-white rounded-lg hover:bg-[#4B1C8C] transition-colors duration-200"
                            >
                                Kategoriler
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/basket')}
                            className="px-4 py-2 bg-[#6C2BD7] text-white rounded-lg hover:bg-[#4B1C8C] transition-colors duration-200"
                        >
                            Sepete Git
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filtreler - Masaüstü */}
                    {!isMobile && (
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[#6C2BD7] hover:text-[#4B1C8C] transition-colors duration-200"
                                    >
                                        Temizle
                                    </button>
                                </div>

                                {/* Kategori Filtresi */}
                                <div className="mb-4 border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleCollapse('kategori')}
                                        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-[#6C2BD7] transition-colors duration-200"
                                    >
                                        <span>Kategori</span>
                                        <svg 
                                            className={`h-4 w-4 transition-transform duration-200 ${collapsedFilters.kategori ? 'rotate-0' : 'rotate-180'}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {!collapsedFilters.kategori && (
                                        <div className="mt-3 space-y-2">
                                            <input
                                                type="text"
                                                value={categorySearch}
                                                onChange={e => setCategorySearch(e.target.value)}
                                                placeholder="Kategori ara..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#6C2BD7] focus:border-[#6C2BD7] text-sm mb-2"
                                            />
                                            <div className="max-h-40 overflow-y-auto pr-1">
                                                {filteredCategoryList.length === 0 ? (
                                                    <div className="text-gray-400 text-sm text-center py-2">Kategori bulunamadı</div>
                                                ) : (
                                                    filteredCategoryList.map(cat => (
                                                        <div key={cat.id}>
                                                            <label className="flex items-center cursor-pointer py-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedFilters.kategori.includes(cat.id)}
                                                                    onChange={() => toggleFilter('kategori', cat.id)}
                                                                    className="rounded border-gray-300 text-[#6C2BD7] focus:ring-[#6C2BD7]"
                                                                />
                                                                <span className="ml-2 text-sm text-gray-600">{cat.name}</span>
                                                            </label>
                                                            {/* Alt kategoriler: sadece ana kategori seçiliyse göster */}
                                                            {selectedFilters.kategori.includes(cat.id) && cat.subcategories && cat.subcategories.length > 0 && (
                                                                <div className="ml-6 mt-1 space-y-1">
                                                                    {cat.subcategories.map(sub => (
                                                                        <label key={sub.id} className="flex items-center cursor-pointer py-0.5">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedFilters.subcategory.includes(sub.id)}
                                                                                onChange={() => toggleFilter('subcategory', sub.id)}
                                                                                className="rounded border-gray-300 text-[#6C2BD7] focus:ring-[#6C2BD7]"
                                                                            />
                                                                            <span className="ml-2 text-xs text-gray-500">{sub.name}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Dinamik Kategoriye Özel Filtreler */}
                                {categoryDynamicFilters.length > 0 && (
                                    <div className="mb-4 border-b border-gray-100 pb-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Kategoriye Özel Filtreler</h3>
                                        {categoryDynamicFilters.map(filter => (
                                            <label key={filter.propertyId} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[filter.propertyValue]?.includes(filter.propertyValue)}
                                                    onChange={() => {
                                                        setSelectedFilters(prev => ({
                                                            ...prev,
                                                            [filter.propertyValue]: prev[filter.propertyValue]?.includes(filter.propertyValue)
                                                                ? prev[filter.propertyValue].filter(v => v !== filter.propertyValue)
                                                                : [...(prev[filter.propertyValue] || []), filter.propertyValue]
                                                        }));
                                                    }}
                                                    className="rounded border-gray-300 text-[#6C2BD7] focus:ring-[#6C2BD7]"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">{filter.propertyValue}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Fiyat Filtresi */}
                                <div className="mb-4 border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleCollapse('fiyat')}
                                        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-[#6C2BD7] transition-colors duration-200"
                                    >
                                        <span>Fiyat Aralığı</span>
                                        <svg 
                                            className={`h-4 w-4 transition-transform duration-200 ${collapsedFilters.fiyat ? 'rotate-0' : 'rotate-180'}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {!collapsedFilters.fiyat && (
                                        <div className="mt-3 space-y-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Min Fiyat</label>
                                                <input
                                                    type="number"
                                                    value={selectedFilters.fiyatMin}
                                                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, fiyatMin: e.target.value }))}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#6C2BD7] focus:border-[#6C2BD7] text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Max Fiyat</label>
                                                <input
                                                    type="number"
                                                    value={selectedFilters.fiyatMax}
                                                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, fiyatMax: e.target.value }))}
                                                    placeholder="1000"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#6C2BD7] focus:border-[#6C2BD7] text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Marka Filtresi */}
                                <div className="mb-4">
                                    <button
                                        onClick={() => toggleCollapse('marka')}
                                        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-[#6C2BD7] transition-colors duration-200"
                                    >
                                        <span>Marka</span>
                                        <svg 
                                            className={`h-4 w-4 transition-transform duration-200 ${collapsedFilters.marka ? 'rotate-0' : 'rotate-180'}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {!collapsedFilters.marka && (
                                        <div className="mt-3 space-y-2">
                                            {filterOptions.marka.map((marka) => (
                                                <label key={marka} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.marka.includes(marka)}
                                                        onChange={() => toggleFilter('marka', marka)}
                                                        className="rounded border-gray-300 text-[#6C2BD7] focus:ring-[#6C2BD7]"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">{marka}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ürün Listesi */}
                    <div className="lg:w-3/4">
                        {/* Sticky üst bar */}
                        <div className="sticky top-16 z-40 bg-gray-50 flex items-center gap-2 justify-end py-3 px-4 border-b border-gray-200" style={{borderRadius: '0.75rem 0.75rem 0 0'}}>
                            {isMobile && (
                                <button
                                    onClick={() => setShowCategoryModal(true)}
                                    className="px-4 py-2 bg-[#6C2BD7] text-white rounded-lg hover:bg-[#4B1C8C] transition-colors duration-200"
                                >
                                    Kategoriler
                                </button>
                            )}
                            <select
                                value={sortOption}
                                onChange={e => setSortOption(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#6C2BD7] focus:border-[#6C2BD7] bg-white"
                            >
                                <option value="default">Sıralama: Varsayılan</option>
                                <option value="price-asc">Fiyat: Artan</option>
                                <option value="price-desc">Fiyat: Azalan</option>
                                <option value="latest">Son Eklenen</option>
                            </select>
                        </div>
                        <div style={{paddingTop: '0px'}}></div>
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
                                <p className="text-gray-500">Seçtiğiniz filtrelere uygun ürün bulunmuyor.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 bg-[#6C2BD7] text-white rounded-lg hover:bg-[#4B1C8C] transition-colors duration-200"
                                >
                                    Filtreleri Temizle
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {currentProducts.map((product) => (
                                        <div key={product.productId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                            {/* Ürün görseli - tıklanabilir */}
                                            <div 
                                                className="aspect-square bg-gray-100 cursor-pointer"
                                                onClick={() => navigate(`/product/${product.productId}`)}
                                            >
                                                {product.productImageUrl ? (
                                                    <img
                                                        src={product.productImageUrl}
                                                        alt={product.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                {/* Ürün adı - tıklanabilir */}
                                                <h3 
                                                    className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-[#6C2BD7] transition-colors duration-200"
                                                    onClick={() => navigate(`/product/${product.productId}`)}
                                                >
                                                    {product.productName}
                                                </h3>
                                                <p className="text-lg font-bold text-[#6C2BD7] mb-3">
                                                    {product.productPrice} ₺
                                                </p>
                                                <button
                                                    onClick={() => handleAddToBasket(product.productId)}
                                                    className="w-full bg-[#6C2BD7] text-white py-2 px-4 rounded-lg hover:bg-[#4B1C8C] transition-colors duration-200 text-sm font-medium"
                                                >
                                                    Sepete Ekle
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {/* Pagination kaldırıldı */}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobilde kategori modalı */}
            {isMobile && showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                    <div
                        className="w-full max-w-md mx-auto rounded-t-2xl shadow-2xl p-6 relative animate-slideUpMobileModal bg-white pointer-events-auto"
                        style={{maxHeight: '90vh'}}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-[#6C2BD7] text-xl"
                            aria-label="Kapat"
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Kategoriler</h2>
                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                            {filteredCategoryList.length === 0 ? (
                                <div className="text-gray-400 text-sm text-center py-2">Kategori bulunamadı</div>
                            ) : (
                                filteredCategoryList.map(cat => (
                                    <div key={cat.id}>
                                        <label className="flex items-center cursor-pointer py-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.kategori.includes(cat.id)}
                                                onChange={() => toggleFilter('kategori', cat.id)}
                                                className="rounded border-gray-300 text-[#6C2BD7] focus:ring-[#6C2BD7]"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">{cat.name}</span>
                                        </label>
                                        {/* Alt kategoriler: sadece ana kategori seçiliyse göster */}
                                        {selectedFilters.kategori.includes(cat.id) && cat.subcategories && cat.subcategories.length > 0 && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {cat.subcategories.map(sub => (
                                                    <label key={sub.id} className="flex items-center cursor-pointer py-0.5">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters.subcategory.includes(sub.id)}
                                                            onChange={() => toggleFilter('subcategory', sub.id)}
                                                            className="rounded border-gray-300 text-[#6C2BD7] focus:ring-[#6C2BD7]"
                                                        />
                                                        <span className="ml-2 text-xs text-gray-500">{sub.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="px-4 py-2 bg-[#6C2BD7] text-white rounded-lg hover:bg-[#4B1C8C] transition-colors duration-200"
                            >
                                Filtreyi Uygula
                            </button>
                        </div>
                    </div>
                    {/* Dış tıklama ile kapama */}
                    <div
                        className="fixed inset-0 z-40"
                        style={{background: 'transparent'}}
                        onClick={() => setShowCategoryModal(false)}
                    />
                    <style>{`
                        @keyframes slideUpMobileModal {
                            0% { opacity: 0; transform: translateY(100%); }
                            100% { opacity: 1; transform: translateY(0); }
                        }
                        .animate-slideUpMobileModal { animation: slideUpMobileModal 0.3s cubic-bezier(0.4,0,0.2,1); }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default CategoryPage; 