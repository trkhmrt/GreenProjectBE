import axios from 'axios';

const API_BASE_URL = 'http://localhost:8072/ael/customerservice';

export const getCustomerProfile = async (customerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/customer/getCustomerProfile/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Customer profile fetch error:', error);
        throw error;
    }
};

export const updateCustomerProfile = async (customerId, profileData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/customer/updateCustomerProfile/${customerId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Customer profile update error:', error);
        throw error;
    }
};
