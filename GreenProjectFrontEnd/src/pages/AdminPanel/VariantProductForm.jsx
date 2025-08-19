import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllCategoryProperty } from '../../services/CategoryPropertyService';
import { addVariantProduct } from '../../services/ProductService';
import { getHierarchicalNestedCategories } from '../../services/CategoryService';

const VariantProductForm = ({ isSubmitting, setIsSubmitting, setUploadProgress, selectedImages, setSelectedImages, mainImageIdx, setMainImageIdx }) => {
    const [categories, setCategories] = useState([]);
    const [categoryLevels, setCategoryLevels] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [openPanels, setOpenPanels] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [categoryProperties, setCategoryProperties] = useState([]);
    const [categoryPropertyValues, setCategoryPropertyValues] = useState({});
    const [productVariants, setProductVariants] = useState([]);
    const [showVariantForm, setShowVariantForm] = useState(false);
    const [currentVariant, setCurrentVariant] = useState({
        sku: '',
        price: '',
        stockQuantity: '',
        categoryProperties: {}
    });
    const [currentVariantImages, setCurrentVariantImages] = useState([]);
    const [editingVariantIndex, setEditingVariantIndex] = useState(null);
    const [expandedVariantIndex, setExpandedVariantIndex] = useState(null);

    const categoryPanelRef = React.useRef();
    const subCategoryPanelRef = React.useRef();
    const categoryInputRef = React.useRef();
    const subCategoryInputRef = React.useRef();

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                categoryPanelRef.current &&
                !categoryPanelRef.current.contains(event.target) &&
                categoryInputRef.current &&
                !categoryInputRef.current.contains(event.target)
            ) {
                // Panel kapatma işlemi artık togglePanel ile yapılıyor
            }
            if (
                subCategoryPanelRef.current &&
                !subCategoryPanelRef.current.contains(event.target) &&
                subCategoryInputRef.current &&
                !subCategoryInputRef.current.contains(event.target)
            ) {
                // Panel kapatma işlemi artık togglePanel ile yapılıyor
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('🔄 Hierarchical kategoriler yükleniyor...');
                const response = await getHierarchicalNestedCategories();
                console.log('📦 Kategori response:', response);
                console.log('📋 Kategori verisi:', response.data);
                setCategories(response.data);
                
                // İlk seviye kategorileri ayarla
                console.log('📋 İlk seviye kategoriler ayarlanıyor:', response.data);
                setCategoryLevels([response.data]);
                setSelectedCategories([]);
                setOpenPanels([false]);
            } catch (error) {
                console.error('Kategori verisi alınamadı:', error);
            }
        };
        fetchCategories();
    }, []);

    const initialValues = {
        productName: '',
        productBrand: '',
        productDescription: '',
        categoryId: '',
        subCategoryId: ''
    };

    // Validation schema
    const validationSchema = Yup.object({
        productName: Yup.string().required('Ürün adı zorunludur'),
        productBrand: Yup.string().required('Marka zorunludur'),
        productDescription: Yup.string().required('Ürün açıklaması zorunludur'),
        categoryId: Yup.string().required('Kategori seçimi zorunludur')
    });

    // Kategori seçim fonksiyonu (seviye bazlı)
    const handleCategoryLevelSelect = async (levelIndex, categoryId, categoryName, setFieldValue) => {
        console.log(`🔄 Seviye ${levelIndex} kategori seçildi:`, categoryId, categoryName);
        
        // Seçilen kategoriyi kaydet
        const newSelectedCategories = [...selectedCategories];
        newSelectedCategories[levelIndex] = { categoryId, categoryName };
        
        // Sonraki seviyeleri temizle
        newSelectedCategories.splice(levelIndex + 1);
        setSelectedCategories(newSelectedCategories);
        
        // Panel'i kapat
        const newOpenPanels = [...openPanels];
        newOpenPanels[levelIndex] = false;
        setOpenPanels(newOpenPanels);
        
        // Son seçilen kategoriyi form'a ata
        setFieldValue('categoryId', categoryId);
        
        // Eğer bu kategorinin alt kategorileri varsa, sonraki seviyeyi ekle
        const selectedCategory = (categoryLevels[levelIndex] || []).find(cat => cat.categoryId === categoryId);
        if (selectedCategory && selectedCategory.children && selectedCategory.children.length > 0) {
            console.log('📋 Alt kategoriler bulundu:', selectedCategory.children);
            
            // Yeni seviye ekle
            const newCategoryLevels = [...categoryLevels];
            newCategoryLevels[levelIndex + 1] = selectedCategory.children;
            newCategoryLevels.splice(levelIndex + 2);
            setCategoryLevels(newCategoryLevels);
            
            // Yeni panel ekle
            const newOpenPanels = [...openPanels];
            newOpenPanels[levelIndex + 1] = false;
            newOpenPanels.splice(levelIndex + 2);
            setOpenPanels(newOpenPanels);
        } else {
            // Alt kategori yoksa, sonraki seviyeleri temizle
            const newCategoryLevels = [...categoryLevels];
            newCategoryLevels.splice(levelIndex + 1);
            setCategoryLevels(newCategoryLevels);
            
            const newOpenPanels = [...openPanels];
            newOpenPanels.splice(levelIndex + 1);
            setOpenPanels(newOpenPanels);
            
            // Kategori özelliklerini getir
            try {
                console.log('🔍 Kategori özellikleri getiriliyor:', categoryId);
                const propertiesResponse = await getAllCategoryProperty(categoryId);
                console.log('📋 Kategori özellikleri:', propertiesResponse.data);
                setCategoryProperties(propertiesResponse.data || []);
            } catch (error) {
                console.error('❌ Kategori özellikleri alınamadı:', error);
                setCategoryProperties([]);
            }
        }
    };

    // Panel toggle fonksiyonu
    const togglePanel = (levelIndex) => {
        const newOpenPanels = [...openPanels];
        newOpenPanels[levelIndex] = !newOpenPanels[levelIndex];
        setOpenPanels(newOpenPanels);
    };

    // Fotoğraf ekleme fonksiyonu
    const handleImageUpload = (event, setFieldValue) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        
        setSelectedImages(prev => [...(prev || []), ...newImages]);
        
        // Ana fotoğraf indeksini ayarla (ilk fotoğraf)
        if ((selectedImages || []).length === 0) {
            setMainImageIdx(0);
        }
    };

    // Fotoğraf silme fonksiyonu
    const removeImage = (index, setFieldValue) => {
        const newImages = (selectedImages || []).filter((_, i) => i !== index);
        setSelectedImages(newImages);
        
        // Ana fotoğraf indeksini güncelle
        if (newImages.length === 0) {
            setMainImageIdx(null);
        } else if ((mainImageIdx || 0) >= newImages.length) {
            setMainImageIdx(newImages.length - 1);
        }
    };

    // Varyant fotoğraf ekleme
    const handleVariantImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        
        setCurrentVariantImages(prev => [...prev, ...newImages]);
    };

    // Varyant fotoğraf silme
    const removeVariantImage = (index) => {
        setCurrentVariantImages(prev => prev.filter((_, i) => i !== index));
    };

    // Varyant ekleme
    const addVariant = () => {
        if (!currentVariant.sku || !currentVariant.price || !currentVariant.stockQuantity) {
            alert('Lütfen tüm varyant bilgilerini doldurun!');
            return;
        }

        const newVariant = {
            ...currentVariant,
            images: currentVariantImages,
            id: editingVariantIndex !== null ? productVariants[editingVariantIndex].id : Date.now()
        };

        if (editingVariantIndex !== null) {
            // Varyantı güncelle
            const newVariants = [...productVariants];
            newVariants[editingVariantIndex] = newVariant;
            setProductVariants(newVariants);
            setEditingVariantIndex(null);
        } else {
            // Yeni varyant ekle
            setProductVariants(prev => [...prev, newVariant]);
        }

        // Form'u temizle
        setCurrentVariant({
            sku: '',
            price: '',
            stockQuantity: '',
            categoryProperties: {}
        });
        setCurrentVariantImages([]);
        setShowVariantForm(false);
    };

    // Varyant düzenleme
    const editVariant = (index) => {
        const variant = productVariants[index];
        setCurrentVariant({
            sku: variant.sku,
            price: variant.price,
            stockQuantity: variant.stockQuantity,
            categoryProperties: variant.categoryProperties || {}
        });
        setCurrentVariantImages(variant.images || []);
        setEditingVariantIndex(index);
        setShowVariantForm(true);
    };

    // Varyant silme
    const removeVariant = (index) => {
        setProductVariants(prev => prev.filter((_, i) => i !== index));
    };

    // Form submit fonksiyonu
    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log('=== VARIANT PRODUCT FORM SUBMIT BAŞLADI ===');
        console.log('Form values:', values);
        console.log('Selected images:', selectedImages);
        console.log('Main image index:', mainImageIdx);
        console.log('Product variants:', productVariants);
        
        if (productVariants.length === 0) {
            alert('En az bir varyant eklemelisiniz!');
            return;
        }
        
        try {
            setIsSubmitting(true);
            setUploadProgress(0);
            
            // Form verilerini hazırla
            const formData = new FormData();
            
            // Temel ürün bilgileri
            formData.append('productName', values.productName);
            formData.append('productBrand', values.productBrand);
            formData.append('productDescription', values.productDescription);
            formData.append('categoryId', values.categoryId);
            
            // Ana ürün fotoğrafları
            if (selectedImages && selectedImages.length > 0) {
                selectedImages.forEach((image, index) => {
                    formData.append('images', image.file);
                    if (index === (mainImageIdx || 0)) {
                        formData.append('mainImageIndex', index.toString());
                    }
                });
            }
            
            // Varyant bilgileri
            formData.append('variants', JSON.stringify(productVariants));
            
            console.log('📤 API\'ye gönderilecek veriler hazırlandı');
            
            // API çağrısı
            const response = await addVariantProduct(formData, (progress) => {
                setUploadProgress(progress);
            });
            
            console.log('✅ API yanıtı:', response);
            
            // Başarılı
            alert('Varyant ürün başarıyla eklendi!');
            
            // Form'u temizle
            resetForm();
            setSelectedImages([]);
            setMainImageIdx(null);
            setSelectedCategories([]);
            setCategoryLevels([categories]);
            setOpenPanels([false]);
            setProductVariants([]);
            setShowVariantForm(false);
            setCurrentVariant({
                sku: '',
                price: '',
                stockQuantity: '',
                categoryProperties: {}
            });
            setCurrentVariantImages([]);
            setEditingVariantIndex(null);
            
        } catch (error) {
            console.error('❌ Varyant ürün ekleme hatası:', error);
            alert('Varyant ürün eklenirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
            console.log('=== VARIANT PRODUCT FORM SUBMIT BİTTİ ===');
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                <Form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Temel Ürün Bilgileri */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Ürün Bilgileri</h3>
                        
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                                <Field name="productName" type="text" className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition text-sm" placeholder="Ürün adını girin" disabled={isSubmitting} />
                                <ErrorMessage name="productName" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <label htmlFor="productBrand" className="block text-sm font-medium text-gray-700 mb-1">Marka *</label>
                                <Field name="productBrand" type="text" className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition text-sm" placeholder="Marka adını girin" disabled={isSubmitting} />
                                <ErrorMessage name="productBrand" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Ürün Açıklaması *</label>
                                <Field name="productDescription" as="textarea" rows={3} className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition resize-none text-sm" placeholder="Ürün açıklamasını girin" disabled={isSubmitting} />
                                <ErrorMessage name="productDescription" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            
                            {/* Hierarchical Kategori Seçim Panelleri */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Seçimi *</label>
                                
                                {/* Seçilen Kategoriler Gösterimi */}
                                {(selectedCategories || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(selectedCategories || []).map((selected, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                                {selected?.categoryName || 'Bilinmeyen Kategori'}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newSelectedCategories = (selectedCategories || []).slice(0, index);
                                                        setSelectedCategories(newSelectedCategories);
                                                        const newCategoryLevels = (categoryLevels || []).slice(0, index + 1);
                                                        setCategoryLevels(newCategoryLevels);
                                                        setFieldValue('categoryId', newSelectedCategories.length > 0 ? newSelectedCategories[newSelectedCategories.length - 1]?.categoryId : '');
                                                    }}
                                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Kategori Seviyeleri */}
                                {(categoryLevels || []).map((levelCategories, levelIndex) => (
                                    <div key={levelIndex} className="relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-gray-600">
                                                Seviye {levelIndex + 1}:
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => togglePanel(levelIndex)}
                                                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm transition"
                                            >
                                                <span>
                                                    {(selectedCategories || [])[levelIndex] 
                                                        ? (selectedCategories || [])[levelIndex].categoryName 
                                                        : 'Kategori Seçin'}
                                                </span>
                                                <svg 
                                                    className={`w-4 h-4 transition-transform ${(openPanels || [])[levelIndex] ? 'rotate-180' : ''}`} 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        {/* Kategori Panel */}
                                        {(openPanels || [])[levelIndex] && (
                                            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                <div className="p-2">
                                                    {(levelCategories || []).map((category) => (
                                                        <button
                                                            key={category.categoryId}
                                                            type="button"
                                                            onClick={() => handleCategoryLevelSelect(levelIndex, category.categoryId, category.categoryName, setFieldValue)}
                                                            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                                                        >
                                                            {category.categoryName}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <ErrorMessage name="categoryId" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            
                            {/* Fotoğraf Yükleme */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Fotoğrafları</label>
                                <div className="space-y-4">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Fotoğraf yüklemek için tıklayın</span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={(e) => handleImageUpload(e, setFieldValue)}
                                            disabled={isSubmitting}
                                        />
                                    </label>
                                </div>
                                
                                {/* Fotoğraf Önizleme */}
                                {(selectedImages || []).length > 0 && (
                                    <div className="mt-4 flex flex-col items-center">
                                        {/* Büyük Ana Fotoğraf */}
                                        <div className="w-56 h-56 rounded-xl border-2 border-purple-200 shadow-lg flex items-center justify-center overflow-hidden mb-3 bg-gray-50 relative">
                                            <img
                                                src={(selectedImages || [])[mainImageIdx || 0]?.url}
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
                                            {(selectedImages || []).map((img, idx) => (
                                                <div key={idx} className="relative">
                                                    <button
                                                        type="button"
                                                        className={`w-16 h-16 rounded-lg border-2 ${(mainImageIdx || 0) === idx ? 'border-purple-500' : 'border-gray-200'} overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
                                                        onClick={() => setMainImageIdx(idx)}
                                                    >
                                                        <img src={img?.url} alt={`Fotoğraf ${idx + 1}`} className="object-cover w-full h-full" />
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
                        </div>
                    </div>

                    {/* Varyant Yönetimi */}
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                        <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Varyant Yönetimi
                            <span className="text-sm font-normal text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                                {productVariants.length} varyant
                            </span>
                        </h3>

                        {/* Mevcut Varyantlar */}
                        {productVariants.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {productVariants.map((variant, index) => (
                                    <div key={variant.id} className="bg-white rounded-lg border border-orange-200 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-orange-900">SKU: {variant.sku}</span>
                                                    <span className="text-sm text-orange-700">Fiyat: {variant.price} TL</span>
                                                    <span className="text-sm text-orange-700">Stok: {variant.stockQuantity}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => editVariant(index)}
                                                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Varyant Ekleme Formu */}
                        {showVariantForm && (
                            <div className="bg-orange-100 rounded-xl p-6 border border-orange-300">
                                <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    {editingVariantIndex !== null ? 'Varyant Düzenle' : 'Varyant Ekle'}
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-orange-800 mb-1">SKU</label>
                                        <input
                                            type="text"
                                            value={currentVariant.sku}
                                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, sku: e.target.value }))}
                                            className="border border-orange-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-sm"
                                            placeholder="SKU girin"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-orange-800 mb-1">Fiyat</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={currentVariant.price}
                                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, price: e.target.value }))}
                                            className="border border-orange-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-sm"
                                            placeholder="0.00"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-orange-800 mb-1">Stok Miktarı</label>
                                        <input
                                            type="number"
                                            value={currentVariant.stockQuantity}
                                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, stockQuantity: e.target.value }))}
                                            className="border border-orange-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-sm"
                                            placeholder="0"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                
                                {/* Varyant Fotoğrafları */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-orange-800 mb-2">Varyant Fotoğrafları</label>
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-6 h-6 mb-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-xs text-orange-600">Varyant fotoğrafı ekle</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleVariantImageUpload}
                                            disabled={isSubmitting}
                                        />
                                    </label>
                                    
                                    {/* Varyant Fotoğraf Önizleme */}
                                    {currentVariantImages.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {currentVariantImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={image.url || URL.createObjectURL(image)}
                                                        alt={`Varyant fotoğrafı ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-orange-200"
                                                    />
                                                    <span
                                                        onClick={() => removeVariantImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        ×
                                                    </span>
                                                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Butonlar */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        disabled={!currentVariant.sku || !currentVariant.price || !currentVariant.stockQuantity || isSubmitting}
                                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {editingVariantIndex !== null ? 'Varyantı Güncelle' : 'Varyantı Ekle'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowVariantForm(false);
                                            setCurrentVariant({
                                                sku: '',
                                                price: '',
                                                stockQuantity: '',
                                                categoryProperties: {}
                                            });
                                            setCurrentVariantImages([]);
                                            setEditingVariantIndex(null);
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm font-medium"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Yeni Varyant Ekle Butonu */}
                        <div className="mt-4 pt-4 border-t border-orange-200">
                            <button
                                type="button"
                                onClick={() => setShowVariantForm(true)}
                                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Yeni Varyant Ekle
                            </button>
                        </div>
                    </div>
                    
                    {/* Kaydet Butonu */}
                    <div className="flex">
                        <button
                            type="submit"
                            disabled={isSubmitting || productVariants.length === 0}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-semibold text-base flex items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
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
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Ürünü Kaydet
                                </>
                            )}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default VariantProductForm;

