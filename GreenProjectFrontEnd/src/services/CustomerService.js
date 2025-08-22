import axios from "../lib/axios.js";
// Müşteri profilini getir
export const getCustomerProfile = async (customerId) => {
    try {
        const response = await axios.get(`/customerservice/customer/getCustomerProfile/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Customer profile fetch error:', error);
        throw error;
    }
};

// Müşteri e-postasını güncelle
export const updateCustomerEmail = async (emailData) => {
    try {
        const response = await axios.put(`/customerservice/customer/updateEmail`, emailData);
        return response.data;
    } catch (error) {
        console.error('Customer email update error:', error);
        throw error;
    }
};

// Müşteri telefonunu güncelle
export const updateCustomerPhone = async (phoneData) => {
    try {
        const response = await axios.put(`/customerservice/customer/updatePhone`, phoneData);
        return response.data;
    } catch (error) {
        console.error('Customer phone update error:', error);
        throw error;
    }
};

// Müşteri profilini güncelle
export const updateCustomerProfile = async (customerId, profileData) => {
    try {
        const response = await axios.put(`/customerservice/customer/updateProfile/${customerId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Customer profile update error:', error);
        throw error;
    }
};

// Müşteri şifresini değiştir
export const changeCustomerPassword = async (customerId, passwordData) => {
    try {
        const response = await axios.put(`/customerservice/customer/changePassword/${customerId}`, passwordData);
        return response.data;
    } catch (error) {
        console.error('Customer password change error:', error);
        throw error;
    }
};

// Müşteri adreslerini getir
export const getCustomerAddresses = async (customerId) => {
    try {
        const response = await axios.get(`/customerservice/customer/getAddresses/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Customer addresses fetch error:', error);
        throw error;
    }
};

// Müşteri adresi ekle
export const addCustomerAddress = async (addressData) => {
    try {
        const response = await axios.post(`/customerservice/customer/addAddress`, addressData);
        return response.data;
    } catch (error) {
        console.error('Customer address add error:', error);
        throw error;
    }
};

// Müşteri adresini güncelle
export const updateCustomerAddress = async (addressId, addressData) => {
    try {
        const response = await axios.put(`/customerservice/customer/updateAddress/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error('Customer address update error:', error);
        throw error;
    }
};

// Müşteri adresini sil
export const deleteCustomerAddress = async (addressId) => {
    try {
        const response = await axios.delete(`/customerservice/customer/deleteAddress/${addressId}`);
        return response.data;
    } catch (error) {
        console.error('Customer address delete error:', error);
        throw error;
    }
};






