import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from "../routes/Routes.js";
import { useAuth } from '../context/AuthContext';
import { getAllProducts } from "../services/ProductService.js";
import { getHierarchicalNestedCategories } from "../services/CategoryService.js";
// import { Transition } from 'react-transition-group'; // KALDIRILDI

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState(3);
    const [notifications, setNotifications] = useState(2);
    const [showBanner, setShowBanner] = useState(true);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // Arama state'leri
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [products, setProducts] = useState([]);

    // Kategori state'leri
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    // Refs
    const searchRef = useRef(null);
    const categoryRef = useRef(null);

    // Kategori dışına tıklama ile kapanma
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
                setExpandedCategories({});
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Ürünleri ve kategorileri yükle
    useEffect(() => {
        const loadData = async () => {
            try {
                const productsData = await getAllProducts();
                setProducts(productsData);
                
                const hierarchicalData = await getHierarchicalNestedCategories();
                // Sadece ana kategorileri al
                const mainCategories = (hierarchicalData.data || [])
                    .filter(cat => cat.isActive === true)
                    .map(cat => ({
                        categoryId: cat.categoryId,
                        categoryName: cat.categoryName,
                        subcategories: cat.children || []
                    }));
                setCategories(mainCategories);
            } catch (error) {
                console.error('Data loading error:', error);
            }
        };
        loadData();
    }, []);

    // Arama fonksiyonu
    const handleSearch = (query) => {
        setSearchQuery(query);
        setIsSearching(true);

        if (query.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
            setIsSearching(false);
            return;
        }

        const results = products.filter(product => {
            const searchLower = query.toLowerCase();
            const productName = product.productName?.toLowerCase() || '';
            const productDesc = product.productDescription?.toLowerCase() || '';
            const categoryName = product.categoryName?.toLowerCase() || '';

            return productName.includes(searchLower) ||
                productDesc.includes(searchLower) ||
                categoryName.includes(searchLower);
        }).slice(0, 5); // En fazla 5 sonuç göster

        setSearchResults(results);
        setShowSearchResults(true);
        setIsSearching(false);
    };

    // Arama sonucu seçildiğinde
    const handleSearchResultSelect = (product) => {
        setSearchQuery(product.productName);
        setShowSearchResults(false);
        // Ürün detay sayfasına yönlendir (gelecekte)
        navigate(`/product/${product.productId}`);
    };

    // Kategori toggle
    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => {
            const newState = { ...prev };
            if (newState[categoryId]) {
                delete newState[categoryId];
            } else {
                Object.keys(newState).forEach(key => {
                    delete newState[key];
                });
                newState[categoryId] = true;
            }
            return newState;
        });
    };

    // Kategoriye git
    const goToCategory = (categoryId, categoryName) => {
        setIsCategoryDropdownOpen(false);
        setExpandedCategories({});
        navigate(`/category/${categoryId}`, { state: { categoryName } });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsMenuVisible(true);
        } else {
            const timeout = setTimeout(() => setIsMenuVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                                <span className="text-2xl font-bold text-[#6C2BD7] hover:text-[#4B1C8C] transition-colors duration-200">
                                    HOPE-HUB
                                </span>
                        </Link>
                    </div>

                        {/* Kategoriler Menüsü - Desktop */}
                        {/* Kategoriler butonu ve dropdown tamamen kaldırıldı */}

                        {/* Arama Çubuğu - Ortada */}
                        <div className="hidden md:flex md:items-center md:justify-center md:flex-1 md:max-w-xl md:mx-8">
                            <div className="relative w-full" ref={searchRef}>
                            <input
                                type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Ürün ara..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C2BD7] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                            <div className="absolute left-3 top-2.5">
                                    {isSearching ? (
                                        <div className="w-5 h-5 border-2 border-[#6C2BD7] border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                    )}
                            </div>

                                {/* Arama Sonuçları */}
                                {showSearchResults && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-2">
                                            {searchResults.map((product) => (
                                                <button
                                                    key={product.productId}
                                                    onClick={() => handleSearchResultSelect(product)}
                                                    className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-left"
                                                >
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg mr-3 flex-shrink-0">
                                                        {product.productImageUrl && (
                                                            <img src={product.productImageUrl} alt={product.productName} className="w-full h-full object-cover rounded-lg" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-800 truncate">{product.productName}</div>
                                                        <div className="text-sm text-gray-500">{product.productPrice} ₺</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Sağ Menü */}
                    <div className="flex items-center space-x-4">
                        {/* Sepet */}
                        <div className="relative hidden md:block">
                            <Link to={routes.Basket} className="group">
                                <span className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-purple-700 hover:bg-purple-100/50 hover:underline transition-all duration-300 cursor-pointer">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </span>
                            </Link>
                        </div>

                            {/* Giriş Yap / Profil - Desktop */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <span
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-purple-700 hover:bg-purple-100/50 hover:underline transition-all duration-300 cursor-pointer"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>

                                        {/* Profil Dropdown - şeffaf, minimal, modern */}
                                    {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-purple-100/50 overflow-hidden z-50 transition-all duration-300">
                                                <div className="bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
                                                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">Hoş geldiniz</p>
                                                        <p className="text-purple-100 text-xs">Hesabınızı yönetin</p>
                                                </div>
                                            </div>

                                                <div className="py-2 px-2 flex flex-col gap-1">
                                                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100/50 hover:text-purple-700 transition-all duration-200 text-sm" onClick={() => setIsProfileOpen(false)}>
                                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    <span className="font-medium">Profilim</span>
                                                </Link>
                                                    <Link to="/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100/50 hover:text-purple-700 transition-all duration-200 text-sm" onClick={() => setIsProfileOpen(false)}>
                                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor"/>
                                                            <path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor"/>
                                                        </svg>
                                                    <span className="font-medium">Siparişlerim</span>
                                                </Link>
                                            </div>

                                                <div className="border-t border-purple-100/30 mx-2"></div>

                                                <div className="py-2 px-2">
                                                <span
                                                    onClick={() => {
                                                        handleLogout();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50/50 transition-all duration-200 font-medium text-sm cursor-pointer"
                                                >
                                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Çıkış Yap
                                                    </span>
                                                    </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to={routes.Login} className="group">
                                        <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-100/50 hover:underline transition-all duration-300 cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Giriş Yap</span>
                                        </span>
                                    </Link>
                                    <Link to={routes.Register} className="group">
                                        <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-100/50 hover:underline transition-all duration-300 cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            <span>Kayıt Ol</span>
                                        </span>
                                    </Link>
                                </>
                            )}
                        </div>

                            {/* Mobil Menü Butonu */}
                        <div className="md:hidden">
                            <span
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-purple-700 hover:bg-purple-100/50 hover:underline transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative w-6 h-6">
                                    {/* Üst çizgi */}
                                    <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                    {/* Orta çizgi */}
                                    <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                    {/* Alt çizgi */}
                                    <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            </nav>

            {/* İndirim Banner */}
            {showBanner && (
                <div className="bg-gradient-to-r from-[#6C2BD7] via-[#8B5CF6] to-[#A855F7] text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        <span className="md:hidden">🎉 %50'ye Varan İndirim!</span>
                                        <span className="hidden md:inline">🎉 Tüm ürünlerde %50'ye varan indirim! Sınırlı süre için geçerli.</span>
                                    </p>
                        </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/category/1" 
                                    className="text-sm font-medium text-white hover:text-yellow-200 transition-colors duration-200 underline"
                                >
                                    Alışverişe Başla
                                </Link>
                                <button
                                    onClick={() => setShowBanner(false)}
                                    className="text-white hover:text-yellow-200 transition-colors duration-200"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobil Menü */}
            <div className={`fixed top-16 left-0 w-full z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-8 opacity-0 pointer-events-none'}`}
                style={{willChange: 'transform, opacity'}}>
                <div className="bg-white/95 backdrop-blur-md border-t border-purple-100/50 shadow-lg rounded-b-xl px-4 py-4 flex flex-col gap-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-100/50 hover:text-purple-700 transition-all duration-200 text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hesabım
                    </Link>
                    <Link to={routes.Basket} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-100/50 hover:text-purple-700 transition-all duration-200 text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>Sepetim</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;