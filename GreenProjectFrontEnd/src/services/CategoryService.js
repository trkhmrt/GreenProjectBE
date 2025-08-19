import axios from "../lib/axios.js";
const gatewayServiceUrl = "/productservice"

export const getHierarchicalNestedCategories = async () => {
    return await axios.get(`${gatewayServiceUrl}/category/hierarchical-nested`);
}

export const getAllCategories = async () => {
    return await axios.get(`${gatewayServiceUrl}/category/getAllCategories`);
}

export const getAllCategoryProperty = async (categoryId) => {
    return await axios.get(`${gatewayServiceUrl}/category/getAllCategories?categoryId=${categoryId}`);
}

export const createCategory = async (categoryName) => {
    // POST /createCategory, body: { categoryName }
    return await axios.post(`${gatewayServiceUrl}/category/createCategory`, { categoryName });
}

export const deleteCategory = async (id) => {
    // DELETE /deleteCategory/{id}
    return await axios.delete(`${gatewayServiceUrl}/category/deleteCategory/${id}`);
}

export const createSubCategory = async ({ categoryId, subCategoryName }) => {
    // POST /createSubCategory, body: { categoryId, subCategoryName }
    return await axios.post(`${gatewayServiceUrl}/subCategory/createSubCategory`, { categoryId, subCategoryName });
}

export const updateCategoryName = async (id, name) => {
    // PUT /updateCategoryName?id=...&name=...
    return await axios.put(`${gatewayServiceUrl}/category/updateCategoryName`, null, { params: { id, name } });
}

export const deleteSubCategory = async (id) => {
    // DELETE /deleteSubCategory/{id}
    return await axios.delete(`${gatewayServiceUrl}/subCategory/deleteSubCategory/${id}`);
}

export const updateSubCategoryName = async (id, name) => {
    // PUT /updateSubCategoryName?id=...&name=...
    return await axios.put(`${gatewayServiceUrl}/subCategory/updateSubCategoryName`, null, { params: { id, name } });
}

// Kategori aktif/pasif toggle
export const toggleCategoryActive = async (categoryId) => {
    return await axios.post(`${gatewayServiceUrl}/category/toggle-active/${categoryId}`);
}



