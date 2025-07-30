import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from "../routes/Routes.js";
import { useAuth } from '../context/AuthContext';
import { getAllCategories } from "../services/CategoryService.js";
import { getAllProducts } from "../services/ProductService.js";
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
                
                const categoriesData = await getAllCategories();
                setCategories(categoriesData.data || []);
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
                        <div className="relative">
                            <Link to={routes.Basket} className="group p-2 rounded-full text-gray-500 hover:text-[#6C2BD7] hover:bg-gray-50 focus:outline-none transition-all duration-200">
                                <div className="relative">
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {cartItems > 0 && (
                                        <span
                                            className="absolute top-0 right-0 min-w-[12px] h-[12px] px-0.5 bg-[#6C2BD7] text-white text-[9px] leading-[12px] rounded-full flex items-center justify-center shadow ring-2 ring-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-200 select-none"
                                            style={{ maxWidth: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                            title={cartItems > 99 ? String(cartItems) : undefined}
                                        >
                                            {cartItems > 99 ? '99+' : cartItems}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </div>

                            {/* Giriş Yap / Profil - Desktop */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="p-2 rounded-full text-gray-500 hover:text-[#6C2BD7] hover:bg-gray-50 focus:outline-none transition-all duration-200"
                                    >
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6C2BD7] to-[#8B5CF6] flex items-center justify-center shadow-md border border-white">
                                                {/* Modern, soft, minimal, futuristik profil SVG */}
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor"/>
                                                    <path d="M4.5 19c0-3.038 3.134-5.5 7.5-5.5s7.5 2.462 7.5 5.5" stroke="currentColor"/>
                                            </svg>
                                        </div>
                                    </button>

                                        {/* Profil Dropdown - daha soft, modern, minimal */}
                                    {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-[#fafaff] rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transition-all duration-300 animate-softDrop">
                                                <div className="bg-gradient-to-r from-[#6C2BD7] to-[#8B5CF6] px-5 py-4 rounded-t-2xl flex items-center gap-3">
                                                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center shadow-md border border-white">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="8.5" r="3.5" stroke="currentColor"/>
                                                            <path d="M4.5 19c0-3.038 3.134-5.5 7.5-5.5s7.5 2.462 7.5 5.5" stroke="currentColor"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold text-base">Hoş geldiniz</p>
                                                        <p className="text-purple-100 text-xs">Hesabınızı yönetin</p>
                                                </div>
                                            </div>

                                                <div className="py-2 px-3 flex flex-col gap-0.5">
                                                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#f3eaff] hover:text-[#6C2BD7] transition-all duration-200 text-sm" onClick={() => setIsProfileOpen(false)}>
                                                        <svg className="w-4 h-4 text-[#6C2BD7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="8.5" r="3.5" stroke="currentColor"/>
                                                            <path d="M4.5 19c0-3.038 3.134-5.5 7.5-5.5s7.5 2.462 7.5 5.5" stroke="currentColor"/>
                                                        </svg>
                                                    <span className="font-medium">Profilim</span>
                                                </Link>
                                                    <Link to="/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#f3eaff] hover:text-[#6C2BD7] transition-all duration-200 text-sm" onClick={() => setIsProfileOpen(false)}>
                                                        <svg className="w-4 h-4 text-[#6C2BD7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor"/>
                                                            <path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor"/>
                                                        </svg>
                                                    <span className="font-medium">Siparişlerim</span>
                                                </Link>
                                                    <Link to={routes.Donation} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#f3eaff] hover:text-[#6C2BD7] transition-all duration-200 text-sm" onClick={() => setIsProfileOpen(false)}>
                                                        <svg className="w-4 h-4 text-[#6C2BD7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor"/>
                                                        </svg>
                                                    <span className="font-medium">Bağış Puanları</span>
                                                </Link>
                                            </div>

                                                <div className="border-t border-gray-100 mx-3"></div>

                                                <div className="py-2 px-3">
                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                        setIsProfileOpen(false);
                                                    }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm"
                                                >
                                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Çıkış Yap
                                                    </button>
                                                    </div>
                                                <style>{`
                                                    .animate-softDrop { animation: softDrop 0.25s cubic-bezier(0.4,0,0.2,1); }
                                                    @keyframes softDrop {
                                                        0% { opacity: 0; transform: translateY(-16px) scale(0.98); }
                                                        100% { opacity: 1; transform: translateY(0) scale(1); }
                                                    }
                                                `}</style>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                        <Link to={routes.Login} className="px-4 py-2 rounded-full text-sm font-medium text-white bg-[#6C2BD7] hover:bg-[#4B1C8C] transition-colors duration-200">
                                        Giriş Yap
                                    </Link>
                                        <Link to={routes.Register} className="px-4 py-2 rounded-full text-sm font-medium text-[#6C2BD7] border border-[#6C2BD7] hover:bg-[#6C2BD7] hover:text-white transition-colors duration-200">
                                        Kayıt ol
                                    </Link>
                                </>
                            )}
                        </div>

                            {/* Mobil Menü Butonu */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 rounded-full text-gray-500 hover:text-[#6C2BD7] hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
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
                <div className="bg-white border-t border-gray-200 shadow-xl rounded-b-2xl px-4 py-6 flex flex-col gap-4">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#f3eaff] hover:text-[#6C2BD7] transition-all duration-200 text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg className="w-5 h-5 text-[#6C2BD7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="8.5" r="3.5" stroke="currentColor"/>
                            <path d="M4.5 19c0-3.038 3.134-5.5 7.5-5.5s7.5 2.462 7.5 5.5" stroke="currentColor"/>
                        </svg>
                        Hesabım
                    </Link>
                    <Link to={routes.Basket} className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#f3eaff] hover:text-[#6C2BD7] transition-all duration-200 text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg className="w-5 h-5 text-[#6C2BD7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Sepetim
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;