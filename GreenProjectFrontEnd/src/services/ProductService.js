import axios from "../lib/axios.js";
//const gatewayServiceUrl = "http://localhost:8072/ael/productservice/product"

export const getAllProducts = async () => {
    const response = await axios.get(`/productservice/product/getAllProductsComplex`);
    return response.data;
}

export const getProductById = async (productId) => {
    const response = await axios.get(`/productservice/product/productDetails?productId=${productId}`);
    return response.data;
}

export const addProduct = async (productData, images = []) => {
    const formData = new FormData();
    
    // Ürün bilgilerini ekle
    formData.append('productName', productData.productName);
    formData.append('productBrand', productData.productBrand);
    formData.append('productDescription', productData.productDescription);
    formData.append('productPrice', productData.productPrice.toString());
    formData.append('productQuantity', productData.productQuantity.toString());
    formData.append('subCategoryId', productData.subCategoryId.toString());
    
    // Product Properties'i ayrı parametreler olarak ekle
    if (productData.productProperties && Object.keys(productData.productProperties).length > 0) {
        Object.entries(productData.productProperties).forEach(([key, value]) => {
            formData.append(`productProperties[${key}]`, value);
        });
    }
    
    // Variants'ları ayrı parametreler olarak ekle
    if (productData.variants && productData.variants.length > 0) {
        productData.variants.forEach((variant, variantIndex) => {
            formData.append(`variants[${variantIndex}].sku`, variant.sku);
            formData.append(`variants[${variantIndex}].price`, variant.price.toString());
            formData.append(`variants[${variantIndex}].stockQuantity`, variant.stockQuantity.toString());
            
            // Variant properties
            if (variant.properties && Object.keys(variant.properties).length > 0) {
                Object.entries(variant.properties).forEach(([key, value]) => {
                    formData.append(`variants[${variantIndex}].properties[${key}]`, value);
                });
            }
            
            // Variant images
            if (variant.variantImages && variant.variantImages.length > 0) {
                variant.variantImages.forEach((file, imageIndex) => {
                    formData.append(`variants[${variantIndex}].variantImages`, file);
                });
            }
        });
    }
    
    // Ana ürün fotoğraflarını ekle
    if (images && images.length > 0) {
        images.forEach((file, index) => {
            formData.append('images', file);
        });
    }
    
    console.log('FormData içeriği:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    return await axios.post(`/productservice/product/createProduct`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
    });
}

export const addSimpleProduct = async (formData) => {
    console.log('🚀 addSimpleProduct fonksiyonu çağrıldı');
    console.log('📦 Gelen formData:', formData);
    
    console.log('SimpleProduct FormData içeriği:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    try {
        const response = await axios.post(`/productservice/product/create/simpleProduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        
        console.log('✅ SimpleProduct API çağrısı başarılı:', response);
        return response;
    } catch (error) {
        console.error('❌ SimpleProduct API çağrısı hatası:', error);
        console.error('❌ Hata detayı:', error.response?.data);
        console.error('❌ Hata status:', error.response?.status);
        console.error('❌ Hata headers:', error.response?.headers);
        console.error('❌ Request config:', error.config);
        console.error('❌ FormData içeriği:');
        for (let [key, value] of formData.entries()) {
            console.error(`  ${key}:`, value);
        }
        throw error;
    }
}

export const uploadProductImages = async (productId, images = []) => {
    const formData = new FormData();
    
    // Fotoğrafları ekle
    if (images && images.length > 0) {
        images.forEach((file, index) => {
            if (file) {
                formData.append('images', file);
            }
        });
    }
    
    return await axios.post(`/productservice/product/uploadImages/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
    });
}

export const addMultipleProduct = async (productData) => {
    console.log('🚀 addMultipleProduct fonksiyonu çağrıldı');
    console.log('📦 Gelen productData:', productData);
    
    const formData = new FormData();
    
    // Ürün bilgilerini ekle
    formData.append('productName', productData.productName || '');
    formData.append('productBrand', productData.productBrand || '');
    formData.append('productDescription', productData.productDescription || '');
    formData.append('categoryId', (productData.categoryId || '').toString());
    
    console.log('📝 Ürün bilgileri eklendi');
    
    // Varyant ürünleri ekle (productVariants olarak)
    if (productData.productVariants && productData.productVariants.length > 0) {
        console.log(`🔄 ${productData.productVariants.length} varyant işleniyor...`);
        
        productData.productVariants.forEach((variant, variantIndex) => {
            console.log(`📦 Varyant ${variantIndex}:`, variant);
            
            formData.append(`productVariants[${variantIndex}].SKU`, variant.SKU || '');
            formData.append(`productVariants[${variantIndex}].variantPrice`, (variant.variantPrice || 0).toString());
            formData.append(`productVariants[${variantIndex}].stockQuantity`, (variant.stockQuantity || 0).toString());
            
            // Varyant özellikleri (variantProperties olarak)
            if (variant.variantProperties && variant.variantProperties.length > 0) {
                console.log(`🏷️ Varyant ${variantIndex} için ${variant.variantProperties.length} özellik işleniyor`);
                
                variant.variantProperties.forEach((property, propertyIndex) => {
                    console.log(`📝 Özellik ${propertyIndex}:`, property);
                    formData.append(`productVariants[${variantIndex}].variantProperties[${propertyIndex}].categoryId`, (property.categoryId || 0).toString());
                    formData.append(`productVariants[${variantIndex}].variantProperties[${propertyIndex}].propertyId`, (property.propertyId || 0).toString());
                    formData.append(`productVariants[${variantIndex}].variantProperties[${propertyIndex}].value`, property.value || '');
                });
            }
            
            // Varyant fotoğrafları
            if (variant.variantImages && variant.variantImages.length > 0) {
                console.log(`📸 Varyant ${variantIndex} için ${variant.variantImages.length} fotoğraf işleniyor`);
                
                variant.variantImages.forEach((image, imageIndex) => {
                    console.log(`📷 Fotoğraf ${imageIndex}:`, image);
                    if (image) {
                        formData.append(`productVariants[${variantIndex}].variantImages`, image);
                    }
                });
            }
        });
    } else {
        console.log('⚠️ Varyant ürünleri bulunamadı!');
    }
    
    console.log('📋 MultipleProduct FormData içeriği:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    console.log('🌐 API çağrısı yapılıyor: /productservice/product/create/multipleProduct');
    
    try {
        const response = await axios.post(`/productservice/product/create/multipleProduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        
        console.log('✅ API çağrısı başarılı:', response);
        return response;
    } catch (error) {
        console.error('❌ API çağrısı hatası:', error);
        console.error('❌ Hata detayı:', error.response?.data);
        console.error('❌ Hata status:', error.response?.status);
        console.error('❌ Hata headers:', error.response?.headers);
        console.error('❌ Request config:', error.config);
        console.error('❌ FormData içeriği:');
        for (let [key, value] of formData.entries()) {
            console.error(`  ${key}:`, value);
        }
        throw error;
    }
}

export const addVariantProduct = async (formData, onProgress) => {
    console.log('🚀 addVariantProduct fonksiyonu çağrıldı');
    console.log('📦 Gelen formData:', formData);
    
    console.log('VariantProduct FormData içeriği:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    try {
        const response = await axios.post(`/productservice/product/create/variantProduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            }
        });
        
        console.log('✅ VariantProduct API çağrısı başarılı:', response);
        return response;
    } catch (error) {
        console.error('❌ VariantProduct API çağrısı hatası:', error);
        console.error('❌ Hata detayı:', error.response?.data);
        console.error('❌ Hata status:', error.response?.status);
        console.error('❌ Hata headers:', error.response?.headers);
        console.error('❌ Request config:', error.config);
        console.error('❌ FormData içeriği:');
        for (let [key, value] of formData.entries()) {
            console.error(`  ${key}:`, value);
        }
        throw error;
    }
}