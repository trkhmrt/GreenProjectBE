import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleProductForm from './SimpleProductForm';
import VariantProductForm from './VariantProductForm';

const AdminProductPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('add');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [productType, setProductType] = useState('simple'); // 'simple' veya 'variant'
    const [selectedImages, setSelectedImages] = useState([]);
    const [mainImageIdx, setMainImageIdx] = useState(0);

    return (
        <div className="w-full">
            {/* Tab Menu - Her iki tab için de görünür */}
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
                    <span
                        onClick={() => setActiveTab('add')}
                        className={`px-4 sm:px-6 py-3 text-[14px] sm:text-[16px] font-semibold cursor-pointer transition-colors border-b-2 whitespace-nowrap hover-effect ${
                            activeTab === 'add' 
                                ? 'border-purple-600 text-purple-700 bg-gray-50' 
                                : 'border-transparent text-gray-500 hover:text-purple-600'
                        }`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            Ürün Ekle
                        </span>
                    </span>
                    <span
                        onClick={() => navigate('/admin/products')}
                        className="px-4 sm:px-6 py-3 text-[14px] sm:text-[16px] font-semibold cursor-pointer transition-colors border-b-2 whitespace-nowrap hover-effect border-transparent text-gray-500 hover:text-purple-600"
                    >
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            Ürünleri Listele
                        </span>
                    </span>
                </div>
            </div>

            {activeTab === 'add' && (
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                    
                    {/* Yükleme Progress Bar */}
                    {isSubmitting && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-700">
                                    {uploadProgress < 30 ? 'Ürün oluşturuluyor...' : 
                                     uploadProgress < 100 ? 'Fotoğraflar yükleniyor...' : 'Tamamlandı!'}
                                </span>
                                <span className="text-sm text-blue-600">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Tab Content */}
                    <div className="space-y-6">
                        {/* Ürün Tipi Seçimi */}
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ürün Tipi Seçimi
                            </h3>
                            <p className="text-sm text-purple-700 mb-4">Ürününüzün tipini seçin:</p>
                            
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="productType"
                                        value="simple"
                                        checked={productType === 'simple'}
                                        onChange={(e) => setProductType(e.target.value)}
                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 focus:ring-2"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-900">Varyantsız Ürün</span>
                                    </div>
                                    <span className="text-xs text-gray-500">Tek fiyat ve stok bilgisi</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="productType"
                                        value="variant"
                                        checked={productType === 'variant'}
                                        onChange={(e) => setProductType(e.target.value)}
                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 focus:ring-2"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-900">Varyantlı Ürün</span>
                                    </div>
                                    <span className="text-xs text-gray-500">Farklı özellikler ve fiyatlar</span>
                                </label>
                            </div>
                        </div>
                        
                        {/* Form Component */}
                        {productType === 'simple' ? (
                            <SimpleProductForm
                                isSubmitting={isSubmitting}
                                setIsSubmitting={setIsSubmitting}
                                setUploadProgress={setUploadProgress}
                                selectedImages={selectedImages}
                                setSelectedImages={setSelectedImages}
                                mainImageIdx={mainImageIdx}
                                setMainImageIdx={setMainImageIdx}
                            />
                        ) : (
                            <VariantProductForm
                                isSubmitting={isSubmitting}
                                setIsSubmitting={setIsSubmitting}
                                setUploadProgress={setUploadProgress}
                                selectedImages={selectedImages}
                                setSelectedImages={setSelectedImages}
                                mainImageIdx={mainImageIdx}
                                setMainImageIdx={setMainImageIdx}
                            />
                        )}
                    </div>
                </div>
            )}
            

        </div>
    );
};

export default AdminProductPage;
