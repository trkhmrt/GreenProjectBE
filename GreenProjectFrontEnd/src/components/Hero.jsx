import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from "../services/CategoryService.js";

const HeroSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Varsayılan kategoriler
    const defaultCategories = [
        { categoryId: 1, name: 'Kadın Giyim' },
        { categoryId: 2, name: 'Erkek Giyim' },
        { categoryId: 3, name: 'Elektronik' },
        { categoryId: 4, name: 'Ev & Yaşam' },
        { categoryId: 5, name: 'Spor & Outdoor' },
        { categoryId: 6, name: 'Kozmetik' }
    ];

    // Kategorileri yükle
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await getAllCategories();
                // API'den gelen ana kategorileri doğrudan kullan
                const apiCategories = (categoriesData.data || []).map(cat => ({
                    id: cat.categoryId,
                    name: cat.categoryName
                }));
                setCategories(apiCategories);
            } catch (error) {
                console.error('Categories loading error:', error);
                // Hata durumunda örnek kategoriler
                setCategories([
                    { id: 1, name: 'Telefon' },
                    { id: 2, name: 'Tablet' },
                    { id: 3, name: 'Bilgisayar' },
                    { id: 4, name: 'Aksesuar' },
                    { id: 5, name: 'Giyim' },
                    { id: 6, name: 'Eğlence' },
                    { id: 7, name: 'Gıda & İçecek' },
                    { id: 8, name: 'Ev & Yaşam' },
                    { id: 9, name: 'Spor & Fitness' },
                    { id: 10, name: 'Müzik & Ses' },
                    { id: 11, name: 'Otomotiv' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    // Kategoriye git
    const goToCategory = (categoryId, categoryName) => {
        navigate(`/category/${categoryId}`, { state: { categoryName, selectedCategoryId: categoryId } });
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Modern Alışveriş</span>
                        <span className="block text-[#6C2BD7]">Deneyimi</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        En yeni ürünler, en iyi fiyatlar ve hızlı teslimat ile alışveriş deneyiminizi yeniden tanımlayın.
                    </p>
                </div>

                {/* Kategoriler */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Popüler Kategoriler
                    </h2>
                    
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#6C2BD7] rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                            {categories.slice(0, 6).map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => goToCategory(category.id, category.name)}
                                    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#6C2BD7] transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#6C2BD7] transition-colors duration-200 leading-tight">
                                            {category.name}
                                        </h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => navigate('/category/1')}
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#6C2BD7] hover:bg-[#4B1C8C] md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Hemen Alışverişe Başla
                    </button>
                    <button
                        onClick={() => navigate('/category/1')}
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border-2 border-[#6C2BD7] text-base font-medium rounded-lg text-[#6C2BD7] bg-white hover:bg-[#6C2BD7] hover:text-white md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                    >
                        Kampanyaları Keşfet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;