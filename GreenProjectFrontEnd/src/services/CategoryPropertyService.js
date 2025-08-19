import axios from "../lib/axios.js";

// Kategoriye property ekle
export const addPropertyToCategory = async (categoryId, propertyId) => {
    return await axios.post(`/productservice/category-property/add?categoryId=${categoryId}&propertyId=${propertyId}`);
};

// Kategori-property güncelle (isActive, propertyId, categoryId)
export const updateCategoryProperty = async (id, { propertyId, categoryId, isActive }) => {
    return await axios.put(`/productservice/category-property/update/${id}`,
        null,
        { params: { propertyId, categoryId, isActive } }
    );
};

// Kategori-property sil (deactivate)
export const deactivateCategoryProperty = async (id) => {
    return await axios.post(`/productservice/category-property/deactivate/${id}`);
}; 

// Kategori-property toggle status
export const toggleCategoryPropertyStatus = async (propertyId) => {
    return await axios.post(`/productservice/category-property/toggle-status/${propertyId}`);
};

// Property name ile kategoriye property ekle
export const addPropertyToCategoryByName = async (categoryId, propertyName) => {
    return await axios.post(`/productservice/category-property/add-by-name?categoryId=${categoryId}&propertyName=${propertyName}`);
};

// Property name güncelle
export const updatePropertyName = async (propertyId, newName) => {
    return await axios.put(`/productservice/category-property/update-property-name?propertyId=${propertyId}&newName=${newName}`);
};

// Property toggle deleted
export const toggleCategoryPropertyDeleted = async (propertyId) => {
    return await axios.post(`/productservice/category-property/toggle-deleted/${propertyId}`);
}; 

export const getAllCategoryProperty = async (categoryId) => {
    return await axios.get(`/productservice/category/getAllCategoryProperty?categoryId=${categoryId}`, {
        withCredentials: true
    });
}; 

// Kategori ID'si ile özellikleri çek
export const getCategoryPropertiesById = async (categoryId) => {
    console.log(`🔄 Kategori ${categoryId} için özellikler çekiliyor...`);
    console.log(`🌐 API URL: /productservice/category/${categoryId}/properties`);
    
    try {
        console.log(`📡 API çağrısı başlatılıyor...`);
        console.log(`🔗 Tam URL: http://localhost:8072/ael/productservice/category/${categoryId}/properties`);
        
        const response = await axios.get(`/productservice/category/${categoryId}/properties`);
        
        console.log(`✅ API yanıtı alındı:`, response);
        console.log(`📊 Response status:`, response.status);
        console.log(`📋 Response data:`, response.data);
        console.log(`🔍 Data type:`, typeof response.data);
        console.log(`📏 Data length:`, Array.isArray(response.data) ? response.data.length : 'Not an array');
        
        // Property isimlerini yazdır
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log('🏷️ KATEGORİ ÖZELLİK İSİMLERİ:');
            response.data.forEach((property, index) => {
                console.log(`  ${index + 1}. Property ID: ${property.propertyId}`);
                console.log(`     📝 propertyValue: "${property.propertyValue}"`);
                console.log(`     🏷️ propertyName: "${property.propertyName}"`);
                console.log(`     🔑 Tüm alanlar:`, Object.keys(property));
                console.log(`     📊 Tam obje:`, property);
                console.log('     ---');
            });
        } else {
            console.log('⚠️ Bu kategori için özellik bulunamadı');
            console.log('🔍 Response.data detayları:', {
                exists: !!response.data,
                isArray: Array.isArray(response.data),
                length: response.data ? response.data.length : 'undefined',
                type: typeof response.data
            });
        }
        
        return response;
    } catch (error) {
        console.error(`❌ Kategori ${categoryId} özellikleri çekilemedi:`, error);
        console.error(`🚨 Error details:`, {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: error.config,
            url: error.config?.url
        });
        throw error;
    }
};
