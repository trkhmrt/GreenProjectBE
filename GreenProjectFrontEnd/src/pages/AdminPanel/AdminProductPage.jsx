import React, { useEffect, useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllCategories } from '../../services/categoryService';
import { addProduct } from '../../services/productService';

const AdminProductPage = () => {
    const [categories, setCategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [activeTab, setActiveTab] = useState('add');
    const [selectedImages, setSelectedImages] = useState([]); // [{file, url}]
    const [mainImageIdx, setMainImageIdx] = useState(0);
    const [categorySearch, setCategorySearch] = useState('');
    const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
    const categoryInputRef = useRef(null);
    const categoryPanelRef = useRef(null);
    const [isSubCategoryPanelOpen, setIsSubCategoryPanelOpen] = useState(false);
    const subCategoryInputRef = useRef(null);
    const subCategoryPanelRef = useRef(null);
    const [subCategorySearch, setSubCategorySearch] = useState('');
    const [showSubCategoryWarning, setShowSubCategoryWarning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Panel dışına tıklanınca kapat (kategori ve alt kategori için)
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                categoryPanelRef.current &&
                !categoryPanelRef.current.contains(event.target) &&
                categoryInputRef.current &&
                !categoryInputRef.current.contains(event.target)
            ) {
                setIsCategoryPanelOpen(false);
            }
            if (
                subCategoryPanelRef.current &&
                !subCategoryPanelRef.current.contains(event.target) &&
                subCategoryInputRef.current &&
                !subCategoryInputRef.current.contains(event.target)
            ) {
                setIsSubCategoryPanelOpen(false);
            }
        }
        if (isCategoryPanelOpen || isSubCategoryPanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCategoryPanelOpen, isSubCategoryPanelOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Kategori verisi alınamadı:', error);
            }
        };
        fetchCategories();
    }, []);

    const initialValues = {
        productName: '',
        productDescription: '',
        productPrice: '',
        productQuantity: '',
        categoryId: '',
        subCategoryId: '',
        images: [] // for validation only
    };

    const validationSchema = Yup.object({
        productName: Yup.string().required('Ürün adı zorunludur'),
        productDescription: Yup.string().required('Ürün Açıklaması zorunludur'),
        productPrice: Yup.string().required('Ürün Fiyat Alanı zorunludur'),
        productQuantity: Yup.string().required('Ürün Miktar Alanı zorunludur'),
        categoryId: Yup.string().required('Kategori seçiniz'),
        subCategoryId: Yup.string().required('Alt kategori seçiniz')
        // images validasyonunu geçici olarak kaldırdım
    });

    const handleCategoryChange = (e, setFieldValue) => {
        const selectedCategoryId = parseInt(e.target.value);
        setFieldValue('categoryId', selectedCategoryId);
        setFieldValue('subCategoryId', '');
        const selectedCategory = categories.find(cat => cat.categoryId === selectedCategoryId);
        setFilteredSubcategories(selectedCategory ? selectedCategory.subcategories : []);
    };

    const handleImageChange = (e, setFieldValue) => {
        const newFiles = Array.from(e.target.files);
        const currentCount = selectedImages.length;
        const remainingSlots = 5 - currentCount;
        
        if (remainingSlots <= 0) {
            alert('Maksimum 5 fotoğraf seçebilirsiniz!');
            return;
        }
        
        // Yeni dosyaları mevcut listeye ekle (maksimum 5'e kadar)
        const filesToAdd = newFiles.slice(0, remainingSlots);
        const newImages = filesToAdd.map(file => ({ file, url: URL.createObjectURL(file) }));
        
        const updatedImages = [...selectedImages, ...newImages];
        setSelectedImages(updatedImages);
        
        // Formik'e tüm dosyaları gönder
        const allFiles = updatedImages.map(img => img.file);
        setFieldValue('images', allFiles);
        
        // Input'u temizle (aynı dosyayı tekrar seçebilmek için)
        e.target.value = '';
    };

    // Fotoğraf silme fonksiyonu
    const removeImage = (indexToRemove, setFieldValue) => {
        const updatedImages = selectedImages.filter((_, index) => index !== indexToRemove);
        setSelectedImages(updatedImages);
        
        // Ana fotoğraf indeksini güncelle
        if (mainImageIdx >= updatedImages.length) {
            setMainImageIdx(Math.max(0, updatedImages.length - 1));
        }
        
        // Formik'e güncellenmiş dosyaları gönder
        const allFiles = updatedImages.map(img => img.file);
        setFieldValue('images', allFiles);
    };

    const onSubmit = async (values, { setSubmitting: setFormikSubmitting }) => {
        console.log('=== FORM SUBMIT BAŞLADI ===');
        console.log('Form değerleri:', values);
        console.log('Seçilen fotoğraflar:', selectedImages);
        
        setIsSubmitting(true);
        setUploadProgress(0);
        
        try {
            // Ürün verisi
            const productData = {
                productName: values.productName,
                productDescription: values.productDescription,
                productPrice: parseFloat(values.productPrice),
                productQuantity: parseInt(values.productQuantity),
                subCategoryId: values.subCategoryId
            };
            
            console.log('Ürün verisi:', productData);
            
            // Fotoğrafları al
            const filesToUpload = selectedImages.map(img => img.file);
            console.log('Yüklenecek dosyalar:', filesToUpload);
            
            setUploadProgress(30);
            
            // Ürün ve fotoğrafları tek seferde gönder
            const response = await addProduct(productData, filesToUpload);
            console.log('Backend response:', response);
            
            setUploadProgress(100);
            
            // Başarı mesajı göster
            alert('Ürün ve fotoğraflar başarıyla kaydedildi!');
            
            // Formu temizle
            setSelectedImages([]);
            setMainImageIdx(0);
            
        } catch (error) {
            console.error('Ürün oluşturma hatası:', error);
            alert('Ürün oluşturulurken bir hata oluştu: ' + error.message);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
            setFormikSubmitting(false);
            console.log('=== FORM SUBMIT BİTTİ ===');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            {/* Tab Menu */}
            <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
                <button
                    className={`px-4 sm:px-6 py-3 text-[14px] sm:text-[16px] font-semibold focus:outline-none transition-colors border-b-2 whitespace-nowrap ${activeTab === 'add' ? 'border-purple-600 text-purple-700 bg-gray-50' : 'border-transparent text-gray-500 hover:text-purple-600'}`}
                    onClick={() => setActiveTab('add')}
                >
                    <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        Ürün Ekle
                    </span>
                </button>
                <button
                    className={`px-4 sm:px-6 py-3 text-[14px] sm:text-[16px] font-semibold focus:outline-none transition-colors border-b-2 whitespace-nowrap ${activeTab === 'list' ? 'border-purple-600 text-purple-700 bg-gray-50' : 'border-transparent text-gray-500 hover:text-purple-600'}`}
                    onClick={() => setActiveTab('list')}
                >
                    <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        Ürünleri Listele
                    </span>
                </button>
            </div>
            
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
            {activeTab === 'add' && (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                >
                    {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                        <Form className="space-y-6" onSubmit={(e) => {
                            console.log('Form submit event tetiklendi');
                            console.log('Form errors:', errors);
                            console.log('Form values:', values);
                            handleSubmit(e);
                        }}>
                            {/* Fotoğraf Yükleme Alanı */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ürün Fotoğrafları <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-500 ml-2">(Maksimum 5 fotoğraf)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={e => handleImageChange(e, setFieldValue)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    disabled={isSubmitting || selectedImages.length >= 5}
                                />
                                <ErrorMessage name="images" component="div" className="text-red-500 text-xs mt-1" />
                                
                                {/* Seçilen fotoğraf sayısı */}
                                {selectedImages.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {selectedImages.length}/5 fotoğraf seçildi
                                        {selectedImages.length >= 5 && (
                                            <span className="text-orange-600 ml-2">(Maksimum sayıya ulaştınız)</span>
                                        )}
                                    </div>
                                )}
                                
                                {/* Fotoğraf Önizleme */}
                                {selectedImages.length > 0 && (
                                    <div className="mt-4 flex flex-col items-center">
                                        {/* Büyük Ana Fotoğraf */}
                                        <div className="w-56 h-56 rounded-xl border-2 border-purple-200 shadow-lg flex items-center justify-center overflow-hidden mb-3 bg-gray-50 relative">
                                            <img
                                                src={selectedImages[mainImageIdx]?.url}
                                                alt="Ana Fotoğraf"
                                                className="object-contain w-full h-full transition-all duration-300"
                                            />
                                            {/* Ana fotoğraf etiketi */}
                                            <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                                Ana Fotoğraf
                                            </div>
                                        </div>
                                        {/* Küçük Fotoğraf Kutuları */}
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {selectedImages.map((img, idx) => (
                                                <div key={idx} className="relative">
                                                    <button
                                                        type="button"
                                                        className={`w-16 h-16 rounded-lg border-2 ${mainImageIdx === idx ? 'border-purple-500' : 'border-gray-200'} overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
                                                        onClick={() => setMainImageIdx(idx)}
                                                    >
                                                        <img src={img.url} alt={`Fotoğraf ${idx + 1}`} className="object-cover w-full h-full" />
                                                    </button>
                                                    {/* Silme butonu */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx, setFieldValue)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        title="Fotoğrafı sil"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    {/* Fotoğraf numarası */}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-0.5">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Ana fotoğraf seçme talimatı */}
                                        <p className="text-xs text-gray-500 mt-2">
                                            Ana fotoğrafı seçmek için küçük fotoğraflara tıklayın
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Diğer Form Alanları */}
                            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                <div>
                                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                                    <Field name="productName" type="text" className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition text-sm" placeholder="Ürün adını girin" disabled={isSubmitting} />
                                    <ErrorMessage name="productName" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Ürün Açıklaması</label>
                                    <Field name="productDescription" as="textarea" rows={3} className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition resize-none text-sm" placeholder="Ürün açıklamasını girin" disabled={isSubmitting} />
                                    <ErrorMessage name="productDescription" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Ürün Fiyatı</label>
                                        <Field name="productPrice" type="number" step="0.01" className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition text-sm" placeholder="0.00" disabled={isSubmitting} />
                                        <ErrorMessage name="productPrice" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700 mb-1">Ürün Miktarı</label>
                                        <Field name="productQuantity" type="number" className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition text-sm" placeholder="0" disabled={isSubmitting} />
                                        <ErrorMessage name="productQuantity" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                
                                {/* Kategori ve Alt Kategori Seçim Panelleri - Yan Yana */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Kategori Seçim Paneli */}
                                    <div className="relative">
                                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                        <input
                                            type="text"
                                            ref={categoryInputRef}
                                            readOnly
                                            value={categories.find(cat => cat.categoryId === values.categoryId)?.categoryName || ''}
                                            onClick={() => setIsCategoryPanelOpen(true)}
                                            placeholder="Kategori seçiniz"
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition cursor-pointer bg-white"
                                            disabled={isSubmitting}
                                        />
                                        <ErrorMessage name="categoryId" component="div" className="text-red-500 text-xs mt-1" />
                                        {isCategoryPanelOpen && (
                                            <div ref={categoryPanelRef} className="absolute z-30 left-0 mt-1 w-full max-w-xs bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-fade-in origin-top" style={{minWidth: '200px'}}>
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Kategori ara..."
                                                    value={categorySearch}
                                                    onChange={e => setCategorySearch(e.target.value)}
                                                    className="mb-3 border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition text-sm"
                                                />
                                                <div className="max-h-56 overflow-y-auto">
                                                    {categories.filter(cat => cat.categoryName.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                                                        <div className="text-gray-400 text-sm py-4 text-center">Kategori bulunamadı</div>
                                                    )}
                                                    {categories
                                                        .filter(cat => cat.categoryName.toLowerCase().includes(categorySearch.toLowerCase()))
                                                        .map(cat => (
                                                            <button
                                                                type="button"
                                                                key={cat.categoryId}
                                                                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition font-medium text-sm mb-1"
                                                                onClick={() => {
                                                                    setFieldValue('categoryId', cat.categoryId);
                                                                    setFieldValue('subCategoryId', '');
                                                                    setFilteredSubcategories(cat.subcategories || []);
                                                                    setIsCategoryPanelOpen(false);
                                                                    setCategorySearch('');
                                                                }}
                                                            >
                                                                {cat.categoryName}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Alt Kategori Seçim Paneli */}
                                    <div className="relative">
                                        <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700 mb-1">Alt Kategori</label>
                                        <input
                                            type="text"
                                            ref={subCategoryInputRef}
                                            readOnly
                                            value={filteredSubcategories.find(sub => sub.id === values.subCategoryId)?.name || ''}
                                            onClick={() => {
                                                if (!values.categoryId) {
                                                    alert('Önce kategori seçiniz!');
                                                } else {
                                                    setIsSubCategoryPanelOpen(true);
                                                }
                                            }}
                                            placeholder="Alt kategori seçiniz"
                                            className={`border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition cursor-pointer ${!values.categoryId ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                                            disabled={isSubmitting}
                                        />
                                        <ErrorMessage name="subCategoryId" component="div" className="text-red-500 text-xs mt-1" />
                                        {isSubCategoryPanelOpen && (
                                            <div ref={subCategoryPanelRef} className="absolute z-30 left-0 mt-1 w-full max-w-xs bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-fade-in origin-top" style={{minWidth: '200px'}}>
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Alt kategori ara..."
                                                    value={subCategorySearch}
                                                    onChange={e => setSubCategorySearch(e.target.value)}
                                                    className="mb-3 border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition text-sm"
                                                />
                                                <div className="max-h-56 overflow-y-auto">
                                                    {filteredSubcategories.filter(sub => sub.name.toLowerCase().includes(subCategorySearch.toLowerCase())).length === 0 && (
                                                        <div className="text-gray-400 text-sm py-4 text-center">Alt kategori bulunamadı</div>
                                                    )}
                                                    {filteredSubcategories
                                                        .filter(sub => sub.name.toLowerCase().includes(subCategorySearch.toLowerCase()))
                                                        .map(sub => (
                                                            <button
                                                                type="button"
                                                                key={sub.id}
                                                                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition font-medium text-sm mb-1"
                                                                onClick={() => {
                                                                    setFieldValue('subCategoryId', sub.id);
                                                                    setIsSubCategoryPanelOpen(false);
                                                                    setSubCategorySearch('');
                                                                }}
                                                            >
                                                                {sub.name}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                        {!values.categoryId && (
                                            <div className="mt-1 text-xs text-orange-600">
                                                Önce kategori seçiniz
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            console.log('Kaydet butonuna tıklandı');
                                            console.log('isSubmitting:', isSubmitting);
                                            console.log('Form errors:', errors);
                                        }}
                                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-2 rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-600 transition font-semibold text-base flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Kaydediliyor...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                Kaydet
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
            {activeTab === 'list' && (
                <div className="text-center text-gray-400 py-16 text-lg font-medium">Ürün listeleme yakında burada olacak.</div>
            )}
        </div>
    );
};

export default AdminProductPage;
