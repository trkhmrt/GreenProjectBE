import axios from "../lib/axios.js";
//const gatewayServiceUrl = "http://localhost:8072/ael/productservice/product"

export const getAllProducts = async () => {
    const response = await axios.get(`/productservice/product/getAllProducts`,{ withCredentials: true });
    return response.data;
}

export const getProductById = async (productId) => {
    const response = await axios.get(`/productservice/product/getProductById/${productId}`, { withCredentials: true });
    return response.data;
}

export const addProduct = async (productData, images = []) => {
    const formData = new FormData();
    
    // Ürün bilgilerini ekle
    formData.append('productName', productData.productName);
    formData.append('productDescription', productData.productDescription);
    formData.append('productPrice', productData.productPrice.toString());
    formData.append('productQuantity', productData.productQuantity.toString());
    formData.append('subCategoryId', productData.subCategoryId.toString());
    
    // Fotoğrafları ekle
    if (images && images.length > 0) {
        images.forEach((file, index) => {
            formData.append('images', file);
        });
    }
    
    return await axios.post(`/productservice/product/createProduct`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
    });
}