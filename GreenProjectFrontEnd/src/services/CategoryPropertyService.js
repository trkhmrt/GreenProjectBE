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